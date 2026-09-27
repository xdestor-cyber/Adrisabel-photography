/* Adrisabel — "Once Upon a Tiny Time"
 * Single source of truth for timing. The music generator (music/compose.py)
 * reads the same numbers from timeline.json, so picture and score stay locked.
 */
const W = 1080, H = 1920, FPS = 30;
const BPM = 104;
const BEAT = 60 / BPM;          // 0.5769 s
const BAR = BEAT * 4;           // 2.3077 s
const bar = (b, beats = 0) => b * BAR + beats * BEAT;

// Scene start positions in bars (4/4 at 104 BPM).
const SCENE_BARS = {
  hook: 0,        // "Once upon a tiny time…"
  cover: 4,       // brand reveal on the storybook cover
  invite: 6,      // "Every baby is a story" + contents page
  sunshine: 8,    // Chapter One
  wonderland: 13, // Chapter Two
  fairytale: 18,  // Chapter Three
  pixie: 23,      // Chapter Four — the milestone package (key change)
  cake: 34,       // Chapter Five
  seaside: 39,    // Chapter Six
  extras: 43,     // twins + additional images
  how: 46,        // booking & delivery details
  closing: 51,    // back cover: website-first call to action
  end: 55,
};
const S = Object.fromEntries(Object.entries(SCENE_BARS).map(([k, v]) => [k, bar(v)]));
const TAIL = 1.9;               // let the final chord ring on the end card
const DURATION = S.end + TAIL;  // ≈ 128.8 s

const COL = {
  cream: '#FBF5EE', paper: '#FFFBF5', ink: '#3B2630', ink2: '#6A5260',
  gold: '#B8883C', goldd: '#87602A', goldl: '#EBCB8B', rose: '#7A4452',
  roseDeep: '#5E2F3C', midnight: '#1B1F44',
  blush: '#F4C9C0', peach: '#F9D6B8', butter: '#F7E1A0', lav: '#DCCFF0',
  sky: '#C6DFEE', sage: '#CBDABD', aqua: '#B3E0D8', straw: '#F6BCC6',
  sand: '#F0DDBD', skin: '#FCE6D6', cloud: '#FFFDF9',
};

if (typeof module !== 'undefined') module.exports = { W, H, FPS, BPM, BEAT, BAR, SCENE_BARS, S, TAIL, DURATION };
