# Adrisabel — "Once Upon a Tiny Time"

A 2-minute vertical promotional video for **Adrisabel · Newborn, Baby & Family Photography**. It's an illustrated storybook in which each package is a chapter of a baby's first year, set to an original score and ending on a website-first call to action: **Visit adrisabel.com**.

| | |
|---|---|
| **Video** | [`output/Adrisabel_Promo_1080x1920.mp4`](output/Adrisabel_Promo_1080x1920.mp4) · 1080×1920 (9:16) · 30 fps · 128.8 s · H.264 + AAC 256 kbps, 48 kHz · −14.5 LUFS |
| **Soundtrack** | [`output/audio/adrisabel_soundtrack.m4a`](output/audio/adrisabel_soundtrack.m4a) (original composition) · MIDI score in [`music/`](music/) |
| **Key frames** | [`output/stills/`](output/stills/) · contact sheet [`output/storyboard.jpg`](output/storyboard.jpg) · suggested cover image [`output/thumbnail.jpg`](output/thumbnail.jpg) |
| **Docs** | [Creative treatment](docs/CREATIVE_TREATMENT.md) · [Script & timing](docs/SCRIPT_AND_TIMING.md) · [Accuracy checklist](docs/ACCURACY_CHECKLIST.md) · [Readability audit](docs/readability_audit.md) |

## The story in one breath

*Once upon a tiny time…* ten little toes, one sleepy yawn, a love that changed everything. The storybook opens: *Every baby is a story. Which chapter will you treasure forever?*

- **I · Sunshine** ($230): baby-only newborn session
- **II · Wonderland** ($300): newborn, baby & family session
- **III · Fairytale** ($230): babies 2–11 months
- **IV · Pixie Dust** ($1,000 total): five milestone sessions across the first year, with two schedules drawn as waxing moons
- **V · Cake Smash** ($280): cake included
- **VI · Seaside Beach** ($370): family session at South Padre Island

Then twins and extra photos, how booking works, and the book closes: *Your once upon a time starts here.* **Visit adrisabel.com**, with Instagram @Adrisabelx and phone (409) 354-3075 below it.

## Posting tips

- Upload the MP4 directly (Reels / TikTok / Shorts / Stories). All essential text sits inside a safe area clear of platform UI: the top 240 px and the bottom ~440 px hold only decoration.
- The story and every offer are carried by on-screen text, so the video works muted. The music makes it much warmer with sound on.
- Suggested caption: *Every baby is a story. Which chapter will you treasure forever? ✨ Visit adrisabel.com*

## Preview & edit

The video is a deterministic web animation (HTML/SVG + [GSAP](https://gsap.com)) rendered frame by frame to MP4.

```bash
npm install                       # Playwright (uses the preinstalled Chromium if present)
npx http-server -p 8080 .         # then open http://localhost:8080/video/index.html?preview
```

The preview has play/pause and a scrubber, and plays the soundtrack in sync.

| To change… | Edit |
|---|---|
| Any on-screen copy, prices, inclusions, contact details | `video/js/scenes.js` (`COPY`, `CHAPTERS`, `PIXIE`, `EXTRAS`, `HOW`, `CLOSING`) |
| Scene order / length (in musical bars) | `video/js/config.js` → `SCENE_BARS` (the score follows automatically) |
| Choreography | `video/js/timeline.js` |
| Colors, type, layout | `video/css/styles.css` |
| Illustrations | `video/js/art.js` |
| Music (chords, melodies, arrangement) | `music/compose.py` · mix & sound design `music/mix.py` |

## Rebuild the MP4

Requirements: Node 18+, Python 3 with `numpy scipy mido soundfile pillow`, `ffmpeg`, `fluidsynth` and the FluidR3_GM soundfont (Ubuntu: `apt install ffmpeg fluidsynth fluid-soundfont-gm`).

```bash
npm install
./build.sh            # ~4 minutes on 4 cores
```

The pipeline:

1. `tools/export_cues.mjs`: reads timing and sound-design cues from the animation.
2. `music/compose.py`: writes MIDI stems on the same bar grid.
3. `music/render_stems.sh`: renders the stems with FluidSynth.
4. `music/mix.py`: mixes, adds reverb and synthesized SFX, then compresses and limits. The ffmpeg `loudnorm` pass (two-pass, linear) takes it to −14.5 LUFS.
5. `tools/render_frames.mjs`: renders 30 fps frames in parallel headless Chromium.
6. `ffmpeg`: encodes the H.264/AAC MP4.

Other helpers: `node tools/stills.mjs 12.5 60 120` renders single frames, and `node tools/audit.mjs` re-runs the readability/safe-zone audit.

## Project layout

```
video/            the animation (open index.html?preview)
  js/config.js    tempo + scene grid (single source of truth)
  js/scenes.js    all copy & package data
  js/art.js       original SVG illustrations + icons
  js/timeline.js  GSAP choreography · js/fx.js particles · js/main.js boot/preview
  assets/         fonts (OFL) + procedurally generated textures
music/            compose.py, mix.py, render_stems.sh, midi/, cues.json
tools/            frame renderer, stills, audit, texture generator, montage
output/           final MP4, soundtrack, stills
docs/             treatment, script & timing, accuracy checklist, audit
```

## Assets & licensing

- **Illustrations, textures, animation:** original work made for this project (hand-authored SVG and noise-generated watercolor, paper and linen textures). There are no photographs, and nothing is presented as Adrisabel's client work.
- **Music:** original composition (`music/compose.py`) rendered with the FluidR3_GM soundfont (MIT license). Sound effects are synthesized in `music/mix.py`.
- **Fonts:** Great Vibes, Cormorant Garamond, Jost (SIL Open Font License 1.1, via Google Fonts).
- **GSAP 3.15** (vendored in `video/vendor/`), free under the GSAP Standard License.

## Notes for the client

- The **"Adrisabel" wordmark** is a typographic treatment in Great Vibes, not an official logo. If there's a logo file, it can replace the wordmark on the cover and final frame.
- The cover line **"15+ years · hundreds of babies photographed"** comes from the project request. Please confirm you'd like it shown, or delete `COPY.cover.proof`.
- The score is rendered with a General MIDI soundfont, which sounds warm and clean but not like a live orchestra. The full MIDI is included (`music/adrisabel_theme_full.mid` and per-instrument stems), so a composer or producer can re-voice it with premium sample libraries without changing the timing.
- The soundtrack was checked by analysis (harmony/consonance check, loudness, spectrogram, and A/V sync within ±5 ms of every scene downbeat), not by ear. Please give it a listen before publishing.
