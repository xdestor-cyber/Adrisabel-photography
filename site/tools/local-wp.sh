#!/usr/bin/env bash
#
# local-wp.sh - LOCAL WordPress replica of https://adrisabel.com, used to test the REST-API
# deploy script before it touches production. Everything it builds lives OUTSIDE this repo.
#
#   site/tools/local-wp.sh setup      download + install + configure (idempotent), then start
#   site/tools/local-wp.sh start      start the server; if the install is missing (e.g. the container
#                                     restarted and /tmp was wiped) it runs `setup` first
#   site/tools/local-wp.sh stop | restart | status
#   site/tools/local-wp.sh reset      wipe DB + uploads + credentials, rebuild from scratch
#   site/tools/local-wp.sh creds      print credentials.json
#   site/tools/local-wp.sh wp <args>  WP-CLI against the replica (e.g. `wp post list --post_type=page`)
#
# Environment overrides: LOCALWP_DIR, LOCALWP_PORT, WP_VERSION, KADENCE_VERSION,
# RANKMATH_VERSION, SQLITE_VERSION.
#
# Exactly what `setup` does:
#  1. Downloads into $LOCALWP_DIR/downloads (cached): wp-cli.phar (sha512-checked), WordPress core
#     (sha1-checked against downloads.wordpress.org), and from wordpress.org the SQLite Database
#     Integration plugin, the Kadence theme and Rank Math SEO. Versions are pinned below;
#     WordPress 7.1.2 + Kadence 1.5.2 are what the live site runs.
#  2. Unzips core into $DOCROOT and the plugins/theme into wp-content. Installs the SQLite drop-in
#     the same way the plugin does: db.copy -> wp-content/db.php with its placeholders
#     {SQLITE_IMPLEMENTATION_FOLDER_PATH} / {SQLITE_PLUGIN} filled in. Adds the must-use plugin
#     wp-content/mu-plugins/local-replica.php, which only removes the core/plugin/theme
#     update-check hooks. Outbound HTTP is blocked, so each check would just log a warning.
#  3. Writes wp-config.php (only if missing): DB_NAME (required by the SQLite 3.x driver), DB_DIR
#     outside the docroot, fresh salts, WP_ENVIRONMENT_TYPE=local (Application Passwords work over
#     plain http), WP_DEBUG + WP_DEBUG_LOG (wp-content/debug.log) + WP_DEBUG_DISPLAY=false.
#     It also turns off automatic updates and sets WP_HTTP_BLOCK_EXTERNAL=true, so WordPress makes
#     no outbound calls. That keeps the replica pinned and hermetic.
#  4. `wp core install` with title "Adrisabel Photography", user `admin` and a random password.
#     Deletes the default "Hello world!" post and "Sample Page".
#  5. Activates Kadence and the plugins SQLite Database Integration, Rank Math SEO and Akismet
#     (bundled with core; live has it). Rank Math's connect step and setup wizard are skipped by
#     setting these options: rank_math_registration_skip=1, rank_math_wizard_completed=1 and
#     rank_math_is_configured=1. The activation-redirect transient is deleted. Without
#     registration_skip (or a connected account) Rank Math treats the site as an "invalid
#     registration" and never loads its frontend: no <title>, description, robots or og: output.
#     Rank Math modules stay at the plugin defaults; its Redirections module is OFF by default.
#  6. Sets permalinks to /%postname%/ and blog_public=1. Creates the site's published pages
#     (see PAGES below) as user admin, so titles such as "Baby & Milestone Photography" are not
#     run through kses. Sets Settings > Reading to a static front page (page_on_front = "home").
#  7. Starts `php -S 0.0.0.0:$PORT -t $DOCROOT router.php` in the background. It uses
#     setsid+nohup, a pid file and PHP_CLI_SERVER_WORKERS=4 so loopback and cron requests don't
#     deadlock. Upload limits are raised to 128M. router.php emulates WordPress' .htaccess:
#     real files are served, everything else goes to /index.php.
#  8. Creates an Application Password "local-deploy" for admin and writes
#     $LOCALWP_DIR/credentials.json = {"url","user","appPassword","adminPassword"} (chmod 600).
#     Credentials are never written inside the repo.
#
set -euo pipefail

LOCALWP_DIR="${LOCALWP_DIR:-/tmp/claude-0/-home-user-Adrisabel-photography/f56bd939-814f-5de2-b849-2e2977adb370/scratchpad/localwp}"
PORT="${LOCALWP_PORT:-8881}"
URL="http://localhost:${PORT}"

WP_VERSION="${WP_VERSION:-7.1.2}"
KADENCE_VERSION="${KADENCE_VERSION:-1.5.2}"
RANKMATH_VERSION="${RANKMATH_VERSION:-1.0.279}"
SQLITE_VERSION="${SQLITE_VERSION:-3.0.2}"

SITE_TITLE="Adrisabel Photography"
ADMIN_USER="admin"
ADMIN_EMAIL="admin@example.com"
APP_PASSWORD_NAME="local-deploy"

DL="$LOCALWP_DIR/downloads"
DOCROOT="$LOCALWP_DIR/wordpress"
DATA_DIR="$LOCALWP_DIR/data"
LOG_DIR="$LOCALWP_DIR/logs"
ROUTER="$LOCALWP_DIR/router.php"
PIDFILE="$LOCALWP_DIR/server.pid"
CREDS="$LOCALWP_DIR/credentials.json"
WPCLI="$DL/wp-cli.phar"

# slug|title of every page on the live site (all published).
PAGES=(
  "home|Home"
  "about|About"
  "portfolio|Portfolio"
  "newborn-photography|Newborn Photography"
  "baby-milestone-photography|Baby & Milestone Photography"
  "maternity-photography|Maternity Photography"
  "cake-smash-photography|Cake Smash Photography"
  "pricing|Pricing"
  "reviews|Reviews"
  "faq|FAQ"
  "contact|Contact"
  "newborn-photographer-mcallen-tx|Newborn Photographer McAllen TX"
  "newborn-photographer-edinburg-tx|Newborn Photographer Edinburg TX"
  "newborn-photographer-mission-tx|Newborn Photographer Mission TX"
  "newborn-photographer-pharr-tx|Newborn Photographer Pharr TX"
  "newborn-photographer-weslaco-tx|Newborn Photographer Weslaco TX"
  "newborn-photographer-harlingen-tx|Newborn Photographer Harlingen TX"
  "newborn-photographer-brownsville-tx|Newborn Photographer Brownsville TX"
  "baby-photographer-mcallen-tx|Baby Photographer McAllen TX"
  "baby-photographer-edinburg-tx|Baby Photographer Edinburg TX"
  "baby-photographer-mission-tx|Baby Photographer Mission TX"
  "baby-photographer-pharr-tx|Baby Photographer Pharr TX"
  "baby-photographer-weslaco-tx|Baby Photographer Weslaco TX"
  "baby-photographer-harlingen-tx|Baby Photographer Harlingen TX"
  "baby-photographer-brownsville-tx|Baby Photographer Brownsville TX"
  "baby-photography-book|Book you Baby Photography Session"
  "fast-online-booking|Fast Online Booking"
  "baby-photography-sessions|Newborn and Baby Photography Sessions in the RGV area"
)

log() { printf '\033[1;34m[local-wp]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[local-wp] ERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# WP-CLI bound to the replica. We run as root in the container, hence --allow-root.
wp() {
  WP_CLI_CACHE_DIR="$LOCALWP_DIR/.wp-cli-cache" WP_CLI_DISABLE_AUTO_CHECK_UPDATE=1 \
    php -d memory_limit=512M "$WPCLI" --allow-root --path="$DOCROOT" --url="$URL" "$@"
}

genpass() { php -r 'echo rtrim(strtr(base64_encode(random_bytes(18)), "+/", "-_"), "=");'; }

# credentials.json helpers (values passed via argv, JSON built by PHP so quoting is always safe).
cred_get() {
  [[ -f "$CREDS" ]] || return 0
  php -r '$d = json_decode((string) file_get_contents($argv[1]), true); echo is_array($d) ? ($d[$argv[2]] ?? "") : "";' "$CREDS" "$1"
}
cred_write() { # adminPassword appPassword
  php -r '$d = ["url" => $argv[2], "user" => $argv[3], "appPassword" => $argv[5], "adminPassword" => $argv[4]];
          file_put_contents($argv[1], json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
          chmod($argv[1], 0600);' "$CREDS" "$URL" "$ADMIN_USER" "$1" "$2"
}

fetch() { # url dest
  local url="$1" dest="$2"
  [[ -s "$dest" ]] && return 0
  log "downloading $url"
  curl -fsSL --retry 3 -o "$dest.part" "$url"
  mv "$dest.part" "$dest"
}

download_all() {
  mkdir -p "$DL"
  if [[ ! -s "$WPCLI" ]]; then
    fetch https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar "$WPCLI"
    local want; want="$(curl -fsSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar.sha512 | cut -d' ' -f1)"
    [[ "$(sha512sum "$WPCLI" | cut -d' ' -f1)" == "$want" ]] || { rm -f "$WPCLI"; die "wp-cli.phar checksum mismatch"; }
  fi
  local core="$DL/wordpress-$WP_VERSION.zip"
  if [[ ! -s "$core" ]]; then
    fetch "https://downloads.wordpress.org/release/wordpress-$WP_VERSION.zip" "$core"
    local want; want="$(curl -fsSL "https://downloads.wordpress.org/release/wordpress-$WP_VERSION.zip.sha1")"
    [[ "$(sha1sum "$core" | cut -d' ' -f1)" == "$want" ]] || { rm -f "$core"; die "WordPress zip sha1 mismatch"; }
  fi
  fetch "https://downloads.wordpress.org/plugin/sqlite-database-integration.$SQLITE_VERSION.zip" "$DL/sqlite-database-integration.$SQLITE_VERSION.zip"
  fetch "https://downloads.wordpress.org/theme/kadence.$KADENCE_VERSION.zip" "$DL/kadence.$KADENCE_VERSION.zip"
  fetch "https://downloads.wordpress.org/plugin/seo-by-rank-math.$RANKMATH_VERSION.zip" "$DL/seo-by-rank-math.$RANKMATH_VERSION.zip"
}

install_files() {
  if [[ ! -f "$DOCROOT/wp-includes/version.php" ]]; then
    log "unpacking WordPress $WP_VERSION -> $DOCROOT"
    unzip -q "$DL/wordpress-$WP_VERSION.zip" -d "$LOCALWP_DIR"   # the zip contains wordpress/
  fi
  grep -q "wp_version = '$WP_VERSION'" "$DOCROOT/wp-includes/version.php" \
    || log "WARNING: $DOCROOT is not WordPress $WP_VERSION (delete $DOCROOT to reinstall core)"
  local plugins="$DOCROOT/wp-content/plugins" themes="$DOCROOT/wp-content/themes"
  [[ -d "$plugins/sqlite-database-integration" ]] || unzip -q "$DL/sqlite-database-integration.$SQLITE_VERSION.zip" -d "$plugins"
  [[ -d "$plugins/seo-by-rank-math" ]] || unzip -q "$DL/seo-by-rank-math.$RANKMATH_VERSION.zip" -d "$plugins"
  [[ -d "$themes/kadence" ]] || unzip -q "$DL/kadence.$KADENCE_VERSION.zip" -d "$themes"

  # SQLite drop-in: what sqlite_plugin_copy_db_file() does on activation, done by hand.
  sed -e "s#{SQLITE_IMPLEMENTATION_FOLDER_PATH}#$plugins/sqlite-database-integration#" \
      -e "s#{SQLITE_PLUGIN}#sqlite-database-integration/load.php#" \
      "$plugins/sqlite-database-integration/db.copy" > "$DOCROOT/wp-content/db.php"
  mkdir -p "$DATA_DIR" "$LOG_DIR"

  # Outbound HTTP is blocked, so every core/plugin/theme update check would only log an
  # "An unexpected error occurred..." warning. Skip those checks to keep debug.log meaningful.
  mkdir -p "$DOCROOT/wp-content/mu-plugins"
  cat > "$DOCROOT/wp-content/mu-plugins/local-replica.php" <<'PHP'
<?php
/**
 * Plugin Name: Local replica: no update checks
 * Description: Generated by site/tools/local-wp.sh. WP_HTTP_BLOCK_EXTERNAL is on, so skip update checks.
 */
remove_action( 'init', 'wp_schedule_update_checks' );
foreach ( array( 'wp_version_check', 'wp_update_plugins', 'wp_update_themes' ) as $lwp_hook ) {
	remove_action( $lwp_hook, $lwp_hook );
	remove_action( 'load-plugins.php', $lwp_hook );
	remove_action( 'load-themes.php', $lwp_hook );
	remove_action( 'load-update.php', $lwp_hook );
	remove_action( 'load-update-core.php', $lwp_hook );
}
remove_action( 'admin_init', '_maybe_update_core' );
remove_action( 'admin_init', '_maybe_update_plugins' );
remove_action( 'admin_init', '_maybe_update_themes' );
unset( $lwp_hook );
PHP
}

write_wp_config() {
  [[ -f "$DOCROOT/wp-config.php" ]] && return 0
  log "writing wp-config.php"
  local k keys=""
  for k in AUTH_KEY SECURE_AUTH_KEY LOGGED_IN_KEY NONCE_KEY AUTH_SALT SECURE_AUTH_SALT LOGGED_IN_SALT NONCE_SALT; do
    keys+="define( '$k', '$(php -r 'echo rtrim(strtr(base64_encode(random_bytes(48)), "+/", "-_"), "=");')' );"$'\n'
  done
  cat > "$DOCROOT/wp-config.php" <<PHP
<?php
/**
 * LOCAL replica of adrisabel.com. Generated by site/tools/local-wp.sh. Not for production.
 */

// Database: SQLite via the "SQLite Database Integration" drop-in (wp-content/db.php).
// DB_NAME is required by its 3.x driver (emulated MySQL schema name); user/password/host are unused.
define( 'DB_NAME', 'wordpress' );
define( 'DB_USER', 'unused' );
define( 'DB_PASSWORD', 'unused' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );
define( 'DB_DIR', '$DATA_DIR/' );   // outside the docroot
define( 'DB_FILE', '.ht.sqlite' );

$keys
\$table_prefix = 'wp_';

// Local environment: Application Passwords are allowed over plain http only when this is 'local'.
define( 'WP_ENVIRONMENT_TYPE', 'local' );

define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );       // -> wp-content/debug.log
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', '0' );

// Keep the replica pinned to the mirrored versions and hermetic (no outbound HTTP from WordPress;
// requests to localhost / the site itself are still allowed).
define( 'AUTOMATIC_UPDATER_DISABLED', true );
define( 'WP_AUTO_UPDATE_CORE', false );
define( 'WP_HTTP_BLOCK_EXTERNAL', true );
define( 'FS_METHOD', 'direct' );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
PHP
}

write_router() {
  cat > "$ROUTER" <<'PHP'
<?php
/**
 * Router for `php -S` that emulates WordPress' Apache rewrite rules (.htaccess):
 *   existing file      -> served as-is (.php entry points are executed by the built-in server)
 *   existing directory -> trailing-slash redirect, then its index.php
 *   anything else      -> /index.php (pretty permalinks, /wp-json/, sitemaps, ...)
 * Generated by site/tools/local-wp.sh.
 */
$lwp_root = rtrim( $_SERVER['DOCUMENT_ROOT'], '/' );
$lwp_path = rawurldecode( (string) parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) );

// Never serve .ht* files (Apache denies them by default).
if ( preg_match( '#/\.ht#i', $lwp_path ) ) {
	http_response_code( 403 );
	return true;
}

$lwp_file = $lwp_root . $lwp_path;
if ( is_dir( $lwp_file ) ) {
	if ( '/' !== substr( $lwp_path, -1 ) ) {
		$lwp_query = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_QUERY );
		header( 'Location: ' . $lwp_path . '/' . ( $lwp_query ? '?' . $lwp_query : '' ), true, 301 );
		return true;
	}
	if ( is_file( $lwp_file . 'index.php' ) || is_file( $lwp_file . 'index.html' ) ) {
		return false;
	}
} elseif ( is_file( $lwp_file ) ) {
	return false;
}

// Front controller, like `RewriteRule . /index.php [L]`.
$_SERVER['SCRIPT_FILENAME'] = $lwp_root . '/index.php';
$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['PHP_SELF']        = '/index.php';
unset( $lwp_root, $lwp_path, $lwp_file, $lwp_query );
chdir( $_SERVER['DOCUMENT_ROOT'] );
require $_SERVER['DOCUMENT_ROOT'] . '/index.php';
PHP
}

is_installed() {
  [[ -f "$DOCROOT/wp-config.php" && -f "$DOCROOT/wp-content/db.php" && -f "$DATA_DIR/.ht.sqlite" && -s "$WPCLI" ]] \
    && wp core is-installed >/dev/null 2>&1
}

install_wordpress() {
  if wp core is-installed >/dev/null 2>&1; then
    return 0
  fi
  local admin_pass; admin_pass="$(genpass)"
  log "installing WordPress (admin user '$ADMIN_USER')"
  wp core install --url="$URL" --title="$SITE_TITLE" --admin_user="$ADMIN_USER" \
    --admin_password="$admin_pass" --admin_email="$ADMIN_EMAIL" --skip-email
  cred_write "$admin_pass" ""
  # Default sample content of a fresh install.
  wp eval '
    foreach ( array( array( "post", "hello-world" ), array( "page", "sample-page" ) ) as $d ) {
      $p = get_page_by_path( $d[1], OBJECT, $d[0] );
      if ( $p ) { wp_delete_post( $p->ID, true ); }
    }'
}

configure_site() {
  log "activating Kadence + plugins"
  wp theme activate kadence
  wp plugin activate sqlite-database-integration seo-by-rank-math akismet

  log "permalinks /%postname%/, Rank Math wizard skip, pages, static front page"
  wp rewrite structure '/%postname%/'

  local php_pages="" entry
  for entry in "${PAGES[@]}"; do
    php_pages+="$(php -r 'echo var_export($argv[1], true), " => ", var_export($argv[2], true), ",\n";' "${entry%%|*}" "${entry#*|}")"
  done

  # Run as admin so kses (unfiltered_html) behaves like the live editor.
  wp --user="$ADMIN_USER" eval-file - <<PHP
<?php
update_option( 'blog_public', 1 );

// Rank Math: "Skip" on the connect step + wizard done (see header comment).
update_option( 'rank_math_registration_skip', 1 );
update_option( 'rank_math_wizard_completed', 1 );
update_option( 'rank_math_is_configured', 1, false );
delete_transient( '_rank_math_activation_redirect' );

\$pages = array(
$php_pages);
\$ids = array();
foreach ( \$pages as \$slug => \$title ) {
	\$found = get_posts( array( 'post_type' => 'page', 'name' => \$slug, 'post_status' => 'any', 'numberposts' => 1, 'fields' => 'ids' ) );
	if ( \$found ) {
		\$ids[ \$slug ] = (int) \$found[0];
		continue;
	}
	\$id = wp_insert_post( wp_slash( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => \$slug,
		'post_title'   => \$title,
		'post_author'  => get_current_user_id(),
		'post_content' => "<!-- wp:paragraph -->\n<p>" . esc_html( "Placeholder content for the \$title page (local replica of adrisabel.com)." ) . "</p>\n<!-- /wp:paragraph -->",
	) ), true );
	if ( is_wp_error( \$id ) ) {
		WP_CLI::error( \$id );
	}
	if ( get_post_field( 'post_name', \$id ) !== \$slug ) {
		WP_CLI::warning( "page slug for \$slug became " . get_post_field( 'post_name', \$id ) );
	}
	\$ids[ \$slug ] = \$id;
}
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', \$ids['home'] );
WP_CLI::log( sprintf( '%d pages present; page_on_front = %d (home)', count( \$ids ), \$ids['home'] ) );
PHP
}

# True only if the pid file points at OUR php -S process (a stale pid after a container restart
# may belong to something else).
server_running() {
  [[ -f "$PIDFILE" ]] || return 1
  local pid; pid="$(cat "$PIDFILE")"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null \
    && ps -p "$pid" -o args= 2>/dev/null | grep -q -- "-S 0.0.0.0:$PORT"
}

start_server() {
  write_router
  mkdir -p "$LOG_DIR"
  if server_running; then
    log "server already running (pid $(cat "$PIDFILE")) at $URL"
  else
    if curl -s -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/"; then
      die "port $PORT is already in use by another process (no pid file of ours)"
    fi
    log "starting php -S 0.0.0.0:$PORT (log: $LOG_DIR/server.log)"
    # setsid: own session/process group (survives the calling shell; `stop` kills the group).
    # bash -c writes its own pid and then execs php, so the pid file is php's pid.
    PIDFILE="$PIDFILE" DOCROOT="$DOCROOT" ROUTER="$ROUTER" PORT="$PORT" PHP_CLI_SERVER_WORKERS=4 \
      setsid nohup bash -c 'echo $$ > "$PIDFILE"; exec php \
        -d upload_max_filesize=128M -d post_max_size=128M -d memory_limit=512M \
        -d max_execution_time=300 -d opcache.enable_cli=1 \
        -S "0.0.0.0:$PORT" -t "$DOCROOT" "$ROUTER"' >>"$LOG_DIR/server.log" 2>&1 </dev/null &
  fi
  curl -fs -o /dev/null --retry 40 --retry-connrefused --retry-delay 1 --max-time 30 "$URL/wp-login.php" \
    || die "server did not come up, see $LOG_DIR/server.log"
  log "server up: $URL (pid $(cat "$PIDFILE"))"
}

stop_server() {
  if server_running; then
    local pid; pid="$(cat "$PIDFILE")"
    kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    log "stopped server (pid $pid)"
  else
    log "server not running"
  fi
  rm -f "$PIDFILE"
}

app_password_ok() {
  local app; app="$(cred_get appPassword)"
  [[ -n "$app" ]] || return 1
  [[ "$(curl -s -o /dev/null -w '%{http_code}' -u "$ADMIN_USER:$app" "$URL/wp-json/wp/v2/users/me?context=edit")" == 200 ]]
}

ensure_credentials() {
  local admin_pass; admin_pass="$(cred_get adminPassword)"
  if [[ -z "$admin_pass" ]]; then
    admin_pass="$(genpass)"
    log "no stored admin password: setting a new one"
    wp user update "$ADMIN_USER" --user_pass="$admin_pass" --skip-email >/dev/null
    cred_write "$admin_pass" "$(cred_get appPassword)"
  fi
  if app_password_ok; then
    log "application password in credentials.json is valid"
    return 0
  fi
  log "creating application password '$APP_PASSWORD_NAME' for $ADMIN_USER"
  local uuid
  for uuid in $(wp user application-password list "$ADMIN_USER" --name="$APP_PASSWORD_NAME" --field=uuid 2>/dev/null); do
    wp user application-password delete "$ADMIN_USER" "$uuid" >/dev/null
  done
  cred_write "$admin_pass" "$(wp user application-password create "$ADMIN_USER" "$APP_PASSWORD_NAME" --porcelain)"
  app_password_ok || die "application password check failed (GET /wp-json/wp/v2/users/me)"
  log "credentials written to $CREDS"
}

cmd_setup() {
  command -v php >/dev/null || die "php not found"
  php -m | grep -qi '^pdo_sqlite$' || die "php pdo_sqlite extension missing"
  mkdir -p "$LOCALWP_DIR"
  download_all
  install_files
  write_wp_config
  install_wordpress
  configure_site
  start_server
  ensure_credentials
  cmd_status
}

cmd_start() {
  if ! is_installed; then
    log "install missing or incomplete: running setup"
    cmd_setup
    return
  fi
  start_server
  ensure_credentials
}

cmd_status() {
  if server_running; then
    log "server: running, pid $(cat "$PIDFILE"), $URL"
  else
    log "server: NOT running"
  fi
  if [[ -f "$DOCROOT/wp-config.php" ]]; then
    log "core $(wp core version 2>/dev/null || echo '?'); theme: $(wp theme list --status=active --field=name --skip-update-check 2>/dev/null | tr '\n' ' ')"
    log "active plugins: $(wp plugin list --status=active --fields=name,version --format=csv --skip-update-check 2>/dev/null | tail -n +2 | tr '\n' ' ')"
  fi
  if server_running; then
    log "GET / -> $(curl -s -o /dev/null -w '%{http_code}' "$URL/"); REST auth -> $(app_password_ok && echo OK || echo FAILED)"
  fi
  log "credentials: $CREDS"
}

cmd_reset() {
  stop_server
  log "wiping database, uploads and credentials"
  rm -rf "$DATA_DIR" "$DOCROOT/wp-content/uploads" "$CREDS" "$DOCROOT/wp-content/debug.log"
  cmd_setup
}

case "${1:-}" in
  setup)   cmd_setup ;;
  start)   cmd_start ;;
  stop)    stop_server ;;
  restart) stop_server; cmd_start ;;
  status)  cmd_status ;;
  reset)   cmd_reset ;;
  creds)   cat "$CREDS" ;;
  wp)      shift; wp "$@" ;;
  *)       sed -n '2,15p' "$0"; exit 1 ;;
esac
