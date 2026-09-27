"""Mix the rendered stems + synthesized sound design into the final soundtrack.

    python3 music/mix.py            # expects build/audio/stems/*.wav (see build.sh)

Sound design is generated here from the animation's own cue list
(music/cues.json), so every page turn, sparkle and confetti pop lands on the
frame it belongs to. Output: build/audio/mix_raw.wav (then loudness-normalised
to -14 LUFS by build.sh into output/audio/adrisabel_soundtrack.wav).
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.ndimage import maximum_filter1d, minimum_filter1d, uniform_filter1d
from scipy.signal import butter, fftconvolve, sosfilt, lfilter

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
DATA = json.loads((ROOT / "music" / "cues.json").read_text())
T = DATA["timing"]
DUR = T["DURATION"]
N = int(round(DUR * SR))
rng = np.random.default_rng(1234)


def db(x):
    return 10 ** (x / 20)


def hp(x, f):
    sos = butter(2, f, "highpass", fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def lp(x, f):
    sos = butter(2, f, "lowpass", fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def bp(x, lo, hi):
    sos = butter(2, [lo, hi], "bandpass", fs=SR, output="sos")
    return sosfilt(sos, x, axis=0)


def fit(x):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    out = np.zeros((N, 2))
    n = min(N, len(x))
    out[:n] = x[:n]
    return out


# ------------------------------------------------------------------ stems
STEMS = {  # gain dB, highpass Hz, reverb send
    "piano": (0.0, 70, 0.26), "lead_piano": (2.5, 90, 0.26), "celesta": (1.5, 200, 0.45),
    "glockenspiel": (3.0, 300, 0.40), "strings": (-1.5, 100, 0.40), "pizzicato": (-1.0, 90, 0.30),
    "harp": (-1.5, 120, 0.45), "bass": (-3.0, 0, 0.04), "flute": (-1.0, 200, 0.34),
    "guitar": (-0.5, 100, 0.22), "timpani": (0.0, 0, 0.25), "drums": (-2.0, 0, 0.10), "perc": (1.0, 300, 0.14),
}
dry = np.zeros((N, 2))
send = np.zeros((N, 2))
for name, (g, h, s) in STEMS.items():
    x, sr = sf.read(ROOT / "build" / "audio" / "stems" / f"{name}.wav", always_2d=True)
    assert sr == SR
    x = fit(x) * db(g)
    if h:
        x = hp(x, h)
    dry += x
    send += x * s

# ------------------------------------------------------------------ sound design
S = T["S"]
KEY_D = [62, 64, 66, 69, 71]   # D major pentatonic (pitch classes via midi)
KEY_E = [64, 66, 68, 71, 73]


def mtof(m):
    return 440 * 2 ** ((m - 69) / 12)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bell(freq, dur=1.6, ratio=3.5, index=2.2, tau=0.55):
    n = int(dur * SR)
    t = np.arange(n) / SR
    I = index * np.exp(-t / 0.25)
    y = np.sin(2 * np.pi * freq * t + I * np.sin(2 * np.pi * freq * ratio * t))
    y += 0.3 * np.sin(2 * np.pi * freq * 2.01 * t) * np.exp(-t / 0.2)
    att = np.minimum(1, t / 0.003)
    return y * np.exp(-t / tau) * att


def place(buf, x, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    if i >= N or i + len(x) <= 0:
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * l, x * r], 1) * np.sqrt(2)
    a, b = max(0, i), min(N, i + len(x))
    buf[a:b] += x[a - i:b - i] * gain


def pent(t):
    return KEY_D if t < S["pixie"] - 0.8 else KEY_E


def sfx_twinkle(t, g, n=6, gap=0.055, oct_=2):
    notes = pent(t)
    for k in range(n):
        m = notes[k % 5] + 12 * (oct_ + k // 5)
        place(sfx, bell(mtof(m), 1.4, ratio=4.0, index=1.2, tau=0.45), t + k * gap, g * 0.16, pan=-0.6 + 1.2 * k / max(1, n - 1))


def sfx_chime(t, g):
    root = pent(t)[0] + 24
    place(sfx, bell(mtof(root), 2.0, ratio=3.5, index=1.8, tau=0.7), t, g * 0.20, -0.1)
    place(sfx, bell(mtof(root + 7), 2.0, ratio=3.5, index=1.4, tau=0.6), t + 0.03, g * 0.12, 0.2)


def sfx_bigchime(t, g):
    root = pent(t)[0] + 24
    for k, iv in enumerate([0, 4, 7, 12, 16]):
        place(sfx, bell(mtof(root + iv), 3.0, ratio=3.5, index=1.6, tau=1.0), t + k * 0.04, g * 0.14, -0.5 + k * 0.25)
    sfx_twinkle(t + 0.15, g * 0.8, n=10, gap=0.045, oct_=2)


def noise(n):
    return rng.standard_normal(n)


def sfx_pageturn(t, g):
    n = int(0.62 * SR)
    tt = np.arange(n) / n
    x = noise(n)
    # sweep a band from low-mid to presence
    lo = bp(x, 500, 1800) * (1 - tt) + bp(x, 1500, 5200) * tt
    e = np.sin(np.pi * np.clip(tt * 1.15, 0, 1)) ** 1.6
    y = lo * e * 0.9
    for k in range(4):  # paper flutter
        i = int((0.18 + 0.09 * k) * SR)
        m = int(0.018 * SR)
        y[i:i + m] += hp(noise(m), 2000) * np.hanning(m) * 0.8
    place(sfx, y, t, g * 0.10, pan=0.25)


def sfx_pop(t, g):
    n = int(0.09 * SR)
    tt = np.arange(n) / SR
    f = 780 - 380 * (tt / tt[-1])
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / 0.025)
    place(sfx, y, t, g * 0.07, pan=rng.uniform(-0.3, 0.3))


def sfx_tick(t, g):
    m = pent(t)[rng.integers(0, 5)] + 36
    place(sfx, bell(mtof(m), 0.4, ratio=2.0, index=0.6, tau=0.08), t, g * 0.09, pan=rng.uniform(-0.4, 0.4))


def sfx_swell(t, g, dur=0.62):
    n = int(dur * SR)
    tt = np.arange(n) / n
    y = hp(noise(n), 2500) * tt ** 2.2
    place(sfx, y, t, g * 0.06, 0)


def sfx_magic(t, g):
    sfx_swell(t, g * 1.2, dur=1.0)
    notes = KEY_E
    for k in range(14):
        m = notes[k % 5] + 12 * (1 + k // 5)
        place(sfx, bell(mtof(m), 1.2, ratio=4.0, index=1.0, tau=0.4), t + k * 0.07, g * 0.10, pan=-0.7 + 1.4 * k / 13)


def sfx_confetti(t, g):
    n = int(0.03 * SR)
    place(sfx, lp(noise(n), 3500) * np.hanning(n) * 1.2, t, g * 0.22, 0)
    th = np.sin(2 * np.pi * 95 * np.arange(int(0.08 * SR)) / SR) * env_exp(int(0.08 * SR), 0.02)
    place(sfx, th, t, g * 0.25, 0)
    for k in range(46):
        dt = 0.05 + (k / 46) ** 1.6 * 1.0
        m = int(0.004 * SR)
        place(sfx, hp(noise(m), 3000) * np.hanning(m), t + dt, g * 0.05 * (1 - k / 50), pan=rng.uniform(-0.8, 0.8))
    sfx_twinkle(t + 0.1, g * 0.7, n=6, gap=0.05)


def sfx_wave(t, g):
    n = int(2.0 * SR)
    tt = np.arange(n) / SR
    x = np.stack([lp(noise(n), 1400), lp(noise(n), 1400)], 1)
    e = np.where(tt < 0.75, (tt / 0.75) ** 1.5, np.exp(-(tt - 0.75) / 0.45))
    place(sfx, x * e[:, None] * 0.8, t, g * 0.13)
    place(sfx, hp(noise(n), 3500) * e * 0.5, t + 0.05, g * 0.05)


sfx = np.zeros((N, 2))
HANDLERS = {"twinkle": sfx_twinkle, "sparkle": lambda t, g: sfx_twinkle(t, g, n=9, gap=0.045), "chime": sfx_chime,
            "bigchime": sfx_bigchime, "pageturn": sfx_pageturn, "pop": sfx_pop, "tick": sfx_tick,
            "swell": sfx_swell, "magic": sfx_magic, "confetti": sfx_confetti, "wave": sfx_wave}
# per-type trims (dB), set so accents sit under the music rather than on top of it
TYPE_DB = {"twinkle": -22, "sparkle": -21, "chime": -18.5, "bigchime": -13.5, "magic": -13, "confetti": -11,
           "pageturn": -6, "tick": -11.5, "pop": 1.5, "swell": -7, "wave": 8}
for c in DATA["cues"]:
    HANDLERS[c["name"]](c["t"], c["gain"] * db(TYPE_DB[c["name"]]))
SFX_GAIN = db(-1.0)
dry += sfx * SFX_GAIN
send += sfx * SFX_GAIN * 0.45

# ------------------------------------------------------------------ reverb (synthetic stereo hall)
def make_ir(dur=2.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        x = rng.standard_normal(n)
        lo = lp(x, 900) * np.exp(-t / 0.62)
        mid = bp(x, 900, 4000) * np.exp(-t / 0.42)
        hi = hp(x, 4000) * np.exp(-t / 0.22)
        tail = lo * 1.0 + mid * 0.8 + hi * 0.5
        tail *= np.minimum(1, t / 0.012)
        pre = int(0.018 * SR)
        ir[pre:, ch] = tail[:-pre]
        for k in range(8):  # early reflections
            d = int(rng.uniform(0.006, 0.06) * SR)
            ir[d, ch] += rng.uniform(0.2, 0.5) * (1 if rng.random() > 0.5 else -1)
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


ir = make_ir()
wet = np.stack([fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], 1)
wet = hp(wet, 180)
mix = dry + wet * db(-11)

# ------------------------------------------------------------------ bus processing
def compress(x, thresh_db=-20, ratio=2.0, tc=0.08):
    mono = np.mean(x ** 2, axis=1)
    a = np.exp(-1 / (tc * SR))
    env = lfilter([1 - a], [1, -a], mono)
    lvl = 10 * np.log10(env + 1e-12)
    over = np.maximum(0, lvl - thresh_db)
    gain_db = -over * (1 - 1 / ratio)
    return x * db(gain_db)[:, None]


def limit(x, ceiling_db=-1.5, look=0.004, rel=0.06):
    ceil = db(ceiling_db)
    peak = maximum_filter1d(np.max(np.abs(x), axis=1), size=int(look * SR) * 2 + 1)
    g = np.minimum(1.0, ceil / np.maximum(peak, 1e-9))
    w = int(look * SR) * 2 + 1
    g = minimum_filter1d(g, size=w)
    g = uniform_filter1d(g, size=w)
    a = np.exp(-1 / (rel * SR))
    # smooth recovery (release) while keeping instant attack
    g_rel = lfilter([1 - a], [1, -a], g)
    g = np.minimum(g, g_rel + (1 - g_rel) * 0)  # never exceed the attack gain
    g = np.minimum(g, 1.0)
    return x * g[:, None]


mix = hp(mix, 30)
mix = compress(mix, -26, 2.0, 0.09)
mix *= db(11.6)
# gentle tail fade over the last 1.4 s so the final chord rings out cleanly
fade = int(1.4 * SR)
mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 1.5
mix[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]
mix = limit(mix, -2.3)

out = ROOT / "build" / "audio" / "mix_raw.wav"
sf.write(out, mix.astype(np.float32), SR, subtype="FLOAT")
pk = 20 * np.log10(np.abs(mix).max())
print(f"wrote {out} ({len(mix) / SR:.3f}s, peak {pk:.1f} dBFS)")
