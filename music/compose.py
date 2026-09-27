"""Original score for the Adrisabel promo — "Once Upon a Tiny Time".

Writes one MIDI file per stem into music/midi/ (plus a combined reference
file). The form is locked to the animation's bar grid (see music/cues.json /
video/js/config.js): 104 BPM, 4/4, 54 bars + a ringing final chord.

    python3 music/compose.py

Musical plan (bar numbers follow SCENE_BARS in video/js/config.js)
  bars  0-3   Intro      piano arpeggios + celesta "once upon a time" motif   (D major)
  bars  4-5   Cover      harp glissando + timpani swell, strings bloom under the logo
  bars  6-7   Invite     gentle arps, snare-roll lift into the groove
  bars  8-12  Sunshine   groove enters; theme A on piano + glockenspiel
  bars 13-17  Wonderland theme A on flute, fuller strings and tambourine
  bars 18-21  Fairytale  pizzicato + celesta theme B (whimsical)
  bar  22     pivot      A → B7: lift a whole step
  bars 23-25  Pixie Dust magic intro in E major: harp + celesta, no drums
  bars 26-33  Pixie Dust full groove, theme A' (flute + glock)
  bars 34-38  Cake Smash bouncy theme C (glock + pizzicato)
  bars 39-42  Seaside    breezy flute over nylon guitar
  bars 43-45  Extras     light celesta figure
  bars 46-50  How        theme A returns in E, confident
  bar  51     breakdown  IV–V under "Your once upon a time starts here"
  bar  52     resolution I — lands with the website call to action
  bars 53-54  outro      celesta callback, final chord rings out
"""
import json
import random
from pathlib import Path

import mido

HERE = Path(__file__).resolve().parent
TIMING = json.loads((HERE / "cues.json").read_text())["timing"]
BPM = TIMING["BPM"]
TPB = 480
rng = random.Random(20260926)

NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6,
        "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11}
QUAL = {"": [0, 4, 7], "m": [0, 3, 7], "7": [0, 4, 7, 10], "maj7": [0, 4, 7, 11], "m7": [0, 3, 7, 10],
        "sus4": [0, 5, 7], "sus2": [0, 2, 7], "add9": [0, 4, 7, 14], "7sus4": [0, 5, 7, 10]}


def parse_chord(sym):
    sym = sym.strip()
    bass = None
    if "/" in sym:
        sym, b = sym.split("/")
        bass = NOTE[b]
    root = sym[:2] if len(sym) > 1 and sym[1] in "#b" else sym[:1]
    q = sym[len(root):]
    ivs = QUAL[q]
    r = NOTE[root]
    return {"root": r, "pcs": sorted({(r + i) % 12 for i in ivs}), "ivs": ivs, "bass": r if bass is None else bass, "sym": sym}


# ------------------------------------------------------------------ harmony
SB = TIMING["SCENE_BARS"]


def seq(start, chords):
    return {start + i: c for i, c in enumerate(chords)}


HARMONY = {}
for start, chords in [
    (SB["hook"], ["Dadd9", "A/C#", "Bm7", "Gmaj7|Asus4"]),
    (SB["cover"], ["D", "Gmaj7"]),
    (SB["invite"], ["Em7", "Asus4|A7"]),
    (SB["sunshine"], ["D", "A/C#", "Bm", "G", "Asus4|A"]),
    (SB["wonderland"], ["D", "A/C#", "Bm", "G", "Asus4|A"]),
    (SB["fairytale"], ["Bm", "G", "D", "A", "B7sus4|B7"]),          # A = pivot chord, B7 lifts to E
    (SB["pixie"], ["Eadd9", "C#m7", "Aadd9",                         # magic intro
                   "E", "B/D#", "C#m", "A", "E/G#", "F#m7", "A", "B7sus4|B"]),
    (SB["cake"], ["E", "A", "C#m", "B", "A|B"]),
    (SB["seaside"], ["A", "E/G#", "F#m7", "Bsus4|B"]),
    (SB["extras"], ["C#m7", "A", "Bsus4|B"]),
    (SB["how"], ["E", "B/D#", "C#m", "A", "Bsus4|B"]),
    (SB["closing"], ["Aadd9|B", "E", "A/E|E", "Eadd9"]),               # IV–V–I lands on the website
]:
    HARMONY.update(seq(start, chords))
LAST_BAR = SB["end"] - 1
assert sorted(HARMONY) == list(range(LAST_BAR + 1)), "harmony must cover every bar"
FINAL_BEATS = 4 + TIMING["DURATION"] / (60 / BPM) - (LAST_BAR + 1) * 4  # last bar + tail, in beats


def chords_in_bar(b):
    parts = HARMONY[b].split("|")
    span = 4 / len(parts)
    return [(b * 4 + i * span, span, parse_chord(p)) for i, p in enumerate(parts)]


def all_chords():
    out = []
    for b in range(LAST_BAR + 1):
        out += chords_in_bar(b)
    return out


def section(b):
    for name, (a, z) in SECTIONS.items():
        if a <= b <= z:
            return name
    return None


SECTIONS = {
    "intro": (SB["hook"], SB["cover"] - 1), "cover": (SB["cover"], SB["invite"] - 1), "invite": (SB["invite"], SB["sunshine"] - 1),
    "sunshine": (SB["sunshine"], SB["wonderland"] - 1), "wonderland": (SB["wonderland"], SB["fairytale"] - 1),
    "fairytale": (SB["fairytale"], SB["pixie"] - 2), "pivot": (SB["pixie"] - 1, SB["pixie"] - 1),
    "pixieA": (SB["pixie"], SB["pixie"] + 2), "pixieB": (SB["pixie"] + 3, SB["cake"] - 1), "cake": (SB["cake"], SB["seaside"] - 1),
    "seaside": (SB["seaside"], SB["extras"] - 1), "extras": (SB["extras"], SB["how"] - 1), "how": (SB["how"], SB["closing"] - 1),
    "close": (SB["closing"], SB["closing"]), "finale": (SB["closing"] + 1, SB["closing"] + 1), "outro": (SB["closing"] + 2, LAST_BAR),
}


def key_tonic(b):
    return 74 if b < SB["pixie"] else 76  # D5 / E5 as degree 1 of the melodies


SCALE = [0, 2, 4, 5, 7, 9, 11]


def deg(n, tonic):
    o, i = divmod(n - 1, 7)
    return tonic + 12 * o + SCALE[i]


# ------------------------------------------------------------------ stems
class Stem:
    def __init__(self, name, program, channel, humanize=0.012):
        self.name, self.program, self.channel, self.hum = name, program, channel, humanize
        self.notes, self.ccs = [], []

    def n(self, beat, dur, pitch, vel, hum=True):
        if pitch is None:
            return
        j = rng.uniform(-self.hum, self.hum) if hum and beat > 0 else 0.0
        v = max(1, min(127, int(vel + (rng.uniform(-5, 5) if hum else 0))))
        self.notes.append((max(0.0, beat + j), max(0.05, dur), int(pitch), v))

    def cc(self, beat, num, val):
        self.ccs.append((beat, num, int(max(0, min(127, val)))))

    def ramp(self, b0, b1, num, v0, v1, steps=16):
        for i in range(steps + 1):
            self.cc(b0 + (b1 - b0) * i / steps, num, v0 + (v1 - v0) * i / steps)

    def to_track(self):
        tr = mido.MidiTrack()
        tr.append(mido.MetaMessage("track_name", name=self.name, time=0))
        tr.append(mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(BPM), time=0))
        tr.append(mido.Message("program_change", program=self.program, channel=self.channel, time=0))
        ev = []
        for beat, num, val in self.ccs:
            ev.append((round(beat * TPB), 0, mido.Message("control_change", control=num, value=val, channel=self.channel)))
        for beat, dur, p, v in self.notes:
            on = round(beat * TPB)
            off = round((beat + dur) * TPB)
            ev.append((on, 2, mido.Message("note_on", note=p, velocity=v, channel=self.channel)))
            ev.append((off, 1, mido.Message("note_off", note=p, velocity=0, channel=self.channel)))
        ev.sort(key=lambda e: (e[0], e[1]))
        last = 0
        for t, _, m in ev:
            tr.append(m.copy(time=t - last))
            last = t
        return tr


piano = Stem("piano", 0, 0)
lead = Stem("lead_piano", 0, 1)
celesta = Stem("celesta", 8, 2)
glock = Stem("glockenspiel", 9, 3)
strings = Stem("strings", 48, 4, 0.02)
pizz = Stem("pizzicato", 45, 5)
harp = Stem("harp", 46, 6, 0.004)
bass = Stem("bass", 32, 7, 0.008)
flute = Stem("flute", 73, 8, 0.015)
guitar = Stem("guitar", 24, 10, 0.008)
timp = Stem("timpani", 47, 11, 0.0)
drums = Stem("drums", 0, 9, 0.006)
perc = Stem("perc", 0, 9, 0.008)
STEMS = [piano, lead, celesta, glock, strings, pizz, harp, bass, flute, guitar, timp, drums, perc]


# ------------------------------------------------------------------ voicing helpers
def voicing(ch, lo, hi, prev, size):
    """Choose `size` chord tones in [lo, hi] closest to the previous voicing."""
    pcs = ch["pcs"]
    pool = [p for p in range(lo, hi + 1) if p % 12 in pcs]
    best, bestcost = None, 1e9
    from itertools import combinations
    for combo in combinations(pool, size):
        if max(combo) - min(combo) > 16:
            continue
        cover = {p % 12 for p in combo}
        need = {ch["root"] % 12, (ch["root"] + ch["ivs"][1]) % 12}
        if not need <= cover:
            continue
        cost = sum(abs(a - b) for a, b in zip(combo, prev)) if prev else abs(sum(combo) / size - (lo + hi) / 2) * size
        cost += 0.3 * (max(combo) - min(combo))
        if cost < bestcost:
            best, bestcost = list(combo), cost
    return best or sorted(pool[:size])


def bass_note(ch, lo=33, hi=45):
    p = ch["bass"]
    while p < lo:
        p += 12
    while p >= hi:
        p -= 12
    return p


# ------------------------------------------------------------------ melodies (beat offset, dur, degree)
TH = [(0, 1, 3), (1, .5, 5), (1.5, 1.5, 8), (3, .5, 7), (3.5, .5, 6),
      (4, 1.5, 5), (5.5, .5, 2), (6, 1, 5), (7, 1, 7),
      (8, 1, 6), (9, .5, 5), (9.5, 1.5, 3), (11, .5, 5), (11.5, .5, 6),
      (12, 1, 8), (13, 1, 6), (14, 2, 5)]
TA = [(0, .5, 3), (.5, .5, 5), (1, 1, 5), (2, .5, 3), (2.5, .5, 2), (3, 1, 1),
      (4, 1, 2), (5, .5, 0), (5.5, .5, 2), (6, 1.5, 5), (7.5, .5, 4),
      (8, .5, 3), (8.5, .5, 5), (9, 1, 6), (10, .5, 5), (10.5, .5, 3), (11, 1, 1),
      (12, .5, 2), (12.5, .5, 3), (13, 1, 4), (14, .5, 3), (14.5, .5, 2), (15, 1, 1),
      (16, 1.5, 1), (17.5, .5, 2), (18, 1, 0), (19, 1, 2)]
TA_PIXIE = TA[:23] + [(16, 1, 5), (17, .5, 6), (17.5, .5, 5), (18, 2, 3),   # I/3
                      (20, 1, 6), (21, .5, 5), (21.5, .5, 4), (22, 2, 2),   # ii7
                      (24, 1, 4), (25, .5, 6), (25.5, .5, 5), (26, 2, 4),   # IV
                      (28, 1.5, 1), (29.5, .5, 2), (30, 1, 0), (31, 1, 2)]  # V7sus4 → V
TB = [(0, .75, 6), (.75, .25, 5), (1, .5, 3), (1.5, .5, 5), (2, 1, 6), (3, .5, 8), (3.5, .5, 6),
      (4, .75, 6), (4.75, .25, 5), (5, .5, 4), (5.5, .5, 5), (6, 1, 6), (7, 1, 5),
      (8, .75, 3), (8.75, .25, 2), (9, .5, 1), (9.5, .5, 3), (10, 1, 5), (11, .5, 6), (11.5, .5, 5),
      (12, 1, 2), (13, 1, 0), (14, 1, 2), (15, 1, 5)]
TC = [(0, .5, 5), (.5, .5, 5), (1, .5, 6), (1.5, .5, 5), (2, .5, 3), (2.5, .5, 5), (3, 1, 8),
      (4, .5, 6), (4.5, .5, 6), (5, .5, 8), (5.5, .5, 6), (6, .5, 4), (6.5, .5, 6), (7, 1, 8),
      (8, .5, 6), (8.5, .5, 5), (9, .5, 3), (9.5, .5, 5), (10, 1, 6), (11, .5, 5), (11.5, .5, 3),
      (12, .5, 5), (12.5, .5, 7), (13, 1, 9), (14, 1, 7), (15, 1, 5),
      (16, 1, 6), (17, 1, 4), (18, 1, 5), (19, 1, 7)]
TS = [(0, 2, 6), (2, 1, 5), (3, 1, 4), (4, 2, 3), (6, 1, 5), (7, 1, 8),
      (8, 2, 6), (10, 1, 4), (11, 1, 2), (12, 2, 1), (14, 1, 2), (15, 1, 0)]
TE = [(0, .5, 3), (.5, .5, 5), (1, 1, 6), (2, .5, 8), (2.5, .5, 6), (3, 1, 5),
      (4, .5, 4), (4.5, .5, 6), (5, 1, 8), (6, 1, 6), (7, 1, 4),
      (8, 1, 1), (9, 1, 2), (10, 1, 5), (11, 1, 7)]


def play_melody(stem, mel, start_bar, vel, octave=0, legato=0.92, accent=True, tonic=None):
    base = start_bar * 4
    for off, dur, d in mel:
        b = start_bar + int(off // 4)
        t = tonic if tonic is not None else key_tonic(b)
        v = vel + (8 if accent and off % 1 == 0 else 0) - (6 if off % 1 == 0.5 else 0)
        stem.n(base + off, dur * legato, deg(d, t) + 12 * octave, v)


# ------------------------------------------------------------------ arrangement
prev_rh, prev_str = None, None
for (beat, span, ch) in all_chords():
    b = int(beat // 4)
    sec = section(b)
    final = b == LAST_BAR
    span_eff = FINAL_BEATS if final else span
    bn = bass_note(ch)
    rh = voicing(ch, 60, 77, prev_rh, 3)
    prev_rh = rh
    st = voicing(ch, 55, 79, prev_str, 4)
    prev_str = st

    # ---------------- piano
    lh = bn + 12 if bn + 12 < 50 else bn
    if sec in ("intro", "invite", "seaside", "outro", "pixieA"):
        v = {"intro": 50, "invite": 58, "seaside": 50, "outro": 44, "pixieA": 50}[sec]
        steps = int(span * 2)
        tones = [lh, lh + 7, rh[0] + 12 if rh[0] < 62 else rh[0], rh[1], rh[2], rh[1] + 12 if rh[1] + 12 < 84 else rh[1]]
        pat = [0, 1, 2, 3, 4, 5, 4, 3]
        if final:
            for i, p in enumerate([lh, lh + 7, rh[0], rh[1], rh[2], rh[0] + 12, rh[1] + 12]):
                piano.n(beat + i * 0.25, span_eff - i * 0.25, p, v - 4 + i)
        else:
            for i in range(steps):
                p = tones[pat[i % 8]]
                piano.n(beat + i * 0.5, 0.9 if i == 0 else 0.5, p, v + (6 if i % 4 == 0 else 0))
            piano.n(beat, span, lh - 12 if lh - 12 >= 36 else lh, v - 6)
    elif sec in ("cover", "close", "finale"):
        v = {"cover": 62, "close": 58, "finale": 70}[sec]
        piano.n(beat, span, bn if bn >= 36 else bn + 12, v)
        for i, p in enumerate(rh):
            piano.n(beat + i * 0.06, span, p, v - 4)
        piano.n(beat + 2, span - 2 if span > 2 else span, rh[-1] + 12, v - 10)
    elif sec in ("sunshine", "wonderland", "pixieB", "how"):
        v = {"sunshine": 54, "wonderland": 52, "pixieB": 54, "how": 56}[sec]
        for k in range(int(span * 2)):
            accent = 8 if k in (0, 3, 6) else 0
            for p in rh:
                piano.n(beat + k * 0.5, 0.42, p, v + accent - 8)
        piano.n(beat, span, lh, v)
    elif sec in ("fairytale", "extras"):
        v = 48
        for k in range(int(span)):
            for p in rh:
                piano.n(beat + k + 0.5, 0.22, p + 12, v)
        piano.n(beat, 1, lh, v + 4)
        if span >= 4:
            piano.n(beat + 2, 1, lh + 7, v)
    elif sec == "cake":
        v = 56
        for k in range(int(span)):
            piano.n(beat + k, 0.3, lh if k % 2 == 0 else lh + 7, v + 4)
            for p in rh:
                piano.n(beat + k + 0.5, 0.25, p + 12, v - 2)
    elif sec == "pivot":
        for i, p in enumerate(rh):
            piano.n(beat + i * 0.08, span, p, 56)
        piano.n(beat, span, lh, 58)

    # ---------------- strings pad (enters bar 2)
    if b >= 2 and sec not in ("cake", "extras") or sec == "finale" or final:
        v = {"intro": 46, "cover": 74, "invite": 66, "sunshine": 50, "wonderland": 62, "fairytale": 44, "pivot": 66,
             "pixieA": 72, "pixieB": 64, "seaside": 56, "how": 60, "close": 72, "finale": 84, "outro": 56}.get(sec, 50)
        for p in st:
            strings.n(beat, span_eff + 0.05, p, v, hum=False)
        if sec in ("cover", "wonderland", "pixieB", "finale", "close", "how"):
            strings.n(beat, span_eff + 0.05, bn + 12 if bn + 12 < 55 else bn, v - 8, hum=False)
    if sec in ("cake", "extras"):
        for p in st[1:]:
            strings.n(beat, span, p, 40, hum=False)

    # ---------------- bass
    if sec in ("sunshine", "wonderland", "pixieB", "how"):
        v = 76
        root, fifth = bn, bn + 7 if bn + 7 < 50 else bn - 5
        if span == 4:
            for off, dur, p in [(0, 1.4, root), (1.5, .45, root), (2, .9, fifth), (3, .45, root + 12), (3.5, .45, root)]:
                bass.n(beat + off, dur, p, v + (6 if off == 0 else 0))
        else:
            bass.n(beat, span * 0.9, root, v)
    elif sec == "cake":
        root = bn
        for k in range(int(span * 2)):
            p = root if k % 4 in (0, 1) else (root + 7 if root + 7 < 50 else root - 5)
            bass.n(beat + k * 0.5, 0.35, p, 74 if k % 2 == 0 else 62)
    elif sec in ("seaside", "extras", "pivot", "fairytale"):
        v = 66 if sec != "fairytale" else 58
        bass.n(beat, span * (0.95 if sec != "fairytale" else 0.45), bn, v)
        if sec == "fairytale" and span == 4:
            bass.n(beat + 2, 0.45, bn + 7 if bn + 7 < 50 else bn - 5, v - 4)
        if sec == "seaside" and span == 4:
            bass.n(beat + 2.5, 1.4, bn + 7 if bn + 7 < 50 else bn - 5, v - 6)
    elif sec in ("cover", "close", "finale", "pixieA") or final:
        bass.n(beat, span_eff * 0.98, bn, 64 if sec != "finale" else 74)

    # ---------------- pizzicato
    if sec == "fairytale":
        for k, off in enumerate([0, 1, 1.5, 2, 3, 3.5][: 6 if span == 4 else 3]):
            pizz.n(beat + off, 0.3, (st[k % 4]) , 64)
    if sec == "cake":
        for k in range(int(span * 2)):
            pizz.n(beat + k * 0.5, 0.25, st[(k * 2 + 1) % 4] + 12 if k % 2 else st[k % 4], 58 if k % 2 else 66)

    # ---------------- guitar (seaside)
    if sec == "seaside":
        gv = voicing(ch, 52, 71, None, 5)
        for off, down, vel in [(0, 1, 64), (1, 1, 52), (1.5, 0, 46), (2.5, 0, 50), (3, 1, 58), (3.5, 0, 46)]:
            if off >= span:
                continue
            order = gv if down else list(reversed(gv))
            for i, p in enumerate(order):
                guitar.n(beat + off + i * 0.018, 0.45, p, vel - i * 2, hum=False)

    # ---------------- harp arpeggios (magic sections)
    if sec in ("pixieA", "seaside", "outro"):
        pool = sorted({p for p in range(55, 91) if p % 12 in ch["pcs"]})
        seq = pool[::1][:10]
        n16 = int(span * 4) if not final else 12
        for i in range(n16):
            idx = i % (2 * len(seq) - 2) if len(seq) > 1 else 0
            if idx >= len(seq):
                idx = 2 * len(seq) - 2 - idx
            harp.n(beat + i * 0.25, 0.6, seq[idx], {"pixieA": 58, "seaside": 50}.get(sec, 42))


# glissandi into structural downbeats
def gliss(stem, end_beat, length, tonic, lo=60, hi=96, up=True, vel=58):
    pcs = {(tonic + s) % 12 for s in SCALE}
    notes = [p for p in range(lo, hi) if p % 12 in pcs]
    if not up:
        notes = notes[::-1]
    step = length / len(notes)
    for i, p in enumerate(notes):
        stem.n(end_beat - length + i * step, 0.8, p, vel - 10 + int(18 * i / len(notes)), hum=False)


gliss(harp, SB["cover"] * 4, 1.5, 2, vel=62)                 # into the cover
gliss(harp, SB["sunshine"] * 4, 1.0, 2, 62, 90, vel=52)       # into the groove
gliss(harp, SB["pixie"] * 4, 1.8, 4, 60, 100, vel=64)         # key change / night falls
gliss(harp, SB["cake"] * 4, 1.0, 4, 64, 96, vel=54)           # confetti
gliss(harp, (SB["closing"] + 1) * 4, 1.6, 4, 60, 100, vel=66) # website lands


# ---------------- melodies
play_melody(celesta, TH, 0, 62, octave=0)
play_melody(celesta, [(0, 1, 5), (1, 1, 8), (2, 1, 9), (3, 1, 12)], SB["invite"] + 1, 54)                   # invite lift
play_melody(lead, TA, SB["sunshine"], 70, octave=-1, legato=0.9)
play_melody(glock, TA, SB["sunshine"], 46, octave=0, legato=0.6)
play_melody(flute, TA, SB["wonderland"], 74, octave=0, legato=0.97)
play_melody(glock, [(o, d, g + 2) for o, d, g in TA if o % 2 == 0], SB["wonderland"], 36, octave=0, legato=0.5)
play_melody(celesta, TB, SB["fairytale"], 64, octave=0, legato=0.8)
play_melody(pizz, TB, SB["fairytale"], 60, octave=-1, legato=0.4)
for off, p in [(0, 76), (1, 78), (2, 81), (3, 83)]:                                              # pivot run
    celesta.n((SB["pixie"] - 1) * 4 + off, 0.9, p, 62)
    flute.n((SB["pixie"] - 1) * 4 + off, 0.95, p - 12, 60)
play_melody(celesta, TH[:13], SB["pixie"], 58, octave=0)                                                   # magic intro
play_melody(flute, TA_PIXIE, SB["pixie"] + 3, 76, octave=0, legato=0.97)
play_melody(glock, TA_PIXIE, SB["pixie"] + 3, 44, octave=0, legato=0.55)
play_melody(glock, TC, SB["cake"], 56, octave=0, legato=0.5)
play_melody(lead, TC, SB["cake"], 62, octave=-1, legato=0.55)
play_melody(flute, TS, SB["seaside"], 72, octave=0, legato=0.98)
play_melody(celesta, TE, SB["extras"], 62, octave=0, legato=0.7)
play_melody(glock, TE, SB["extras"], 34, octave=0, legato=0.5)
play_melody(lead, TA, SB["how"], 68, octave=-1, legato=0.9)
play_melody(flute, TA, SB["how"], 62, octave=0, legato=0.97)
# breakdown + resolution
for off, dur, d in [(0, 2, 6), (2, 1, 5), (3, 1, 7)]:
    strings.n(SB["closing"] * 4 + off, dur, deg(d, 76) - 12, 76, hum=False)
    flute.n(SB["closing"] * 4 + off, dur * 0.97, deg(d, 76), 66)
for stem, p, v in [(flute, 88, 80), (glock, 88, 52), (celesta, 88, 60), (strings, 76, 82), (lead, 64, 66)]:
    stem.n((SB["closing"] + 1) * 4, 4, p, v, hum=False)
for off, dur, d in [(0, 1, 6), (1, 1, 5), (2, 1, 3), (3, 1, 5), (4, FINAL_BEATS - 0.2, 8)]:     # outro callback
    celesta.n((SB["closing"] + 2) * 4 + off, dur, deg(d, 76), 56 if off < 4 else 50)

# ---------------- expression & pedal
strings.cc(0, 11, 70)
strings.ramp((SB["cover"] - 1) * 4, SB["cover"] * 4, 11, 70, 118)         # swell into the cover
strings.ramp(SB["cover"] * 4, SB["invite"] * 4, 11, 118, 88)
strings.ramp((SB["pixie"] - 1) * 4, SB["pixie"] * 4, 11, 80, 120)         # swell into key change
strings.ramp(SB["pixie"] * 4, (SB["pixie"] + 2) * 4, 11, 120, 96)
strings.ramp((SB["closing"] - 1) * 4, (SB["closing"] + 1) * 4, 11, 90, 124)  # build to the website
strings.ramp((SB["closing"] + 2) * 4, LAST_BAR * 4 + FINAL_BEATS, 11, 110, 60)
flute.cc(0, 11, 108)
for s in (piano, lead):
    for b in range(LAST_BAR + 1):
        for (beat, span, ch) in chords_in_bar(b):
            s.cc(max(0, beat - 0.02), 64, 0)
            s.cc(beat + 0.04, 64, 100)
    s.cc(LAST_BAR * 4 + FINAL_BEATS, 64, 0)
for s, pan in [(piano, 60), (lead, 66), (celesta, 76), (glock, 44), (strings, 64), (pizz, 50), (harp, 40), (flute, 70), (guitar, 52)]:
    s.cc(0, 10, pan)

# ---------------- drums & percussion
KICK, SNARE, CLAP, HAT, OHAT, CRASH, TAMB, SHAKER, TRI, RIDEBELL = 36, 38, 39, 42, 46, 49, 54, 70, 81, 53
groove = {"sunshine": 1, "wonderland": 2, "pixieB": 2, "how": 2, "cake": 3, "seaside": 1, "extras": 1, "fairytale": 0}
for b in range(LAST_BAR + 1):
    sec = section(b)
    lvl = groove.get(sec)
    B = b * 4
    if lvl is None:
        continue
    if lvl == 0:  # fairytale: shaker + soft kick
        drums.n(B, 0.2, KICK, 58)
        for k in range(8):
            perc.n(B + k * 0.5, 0.1, SHAKER, 44 if k % 2 else 34)
        continue
    for off in ([0, 1.5, 2] if lvl >= 2 else [0, 2]):
        drums.n(B + off, 0.2, KICK, 92 if off == 0 else 80)
    if sec == "cake":
        drums.n(B + 3.5, 0.2, KICK, 72)
    for off in (1, 3):
        drums.n(B + off, 0.2, CLAP, 70 if lvl >= 2 else 60)
        if lvl >= 2:
            drums.n(B + off, 0.2, SNARE, 44)
    for k in range(16 if lvl >= 2 else 8):
        step = 0.25 if lvl >= 2 else 0.5
        perc.n(B + k * step, 0.1, SHAKER, (52 if (k * step) % 1 == 0.5 else 40) + (4 if lvl == 3 else 0))
    if lvl >= 2 or sec == "seaside":
        for off in (0.5, 1.5, 2.5, 3.5):
            perc.n(B + off, 0.1, TAMB, 40 if sec != "seaside" else 34)

for b in (SB["sunshine"], SB["pixie"] + 3, SB["cake"], SB["how"]):
    drums.n(b * 4, 2, CRASH, 76)
drums.n((SB["closing"] + 1) * 4, 3, CRASH, 84)
for b, start, vmax in [(SB["sunshine"] - 1, 2.0, 76), (SB["pixie"] - 1, 3.0, 70), (SB["cake"] - 1, 3.0, 72), (SB["closing"] - 1, 2.0, 82)]:  # snare lifts
    k = 0
    beat = b * 4 + start
    while beat < b * 4 + 4 - 0.01:
        drums.n(beat, 0.1, SNARE, int(34 + (vmax - 34) * k / ((4 - start) * 4)))
        beat += 0.25
        k += 1
for b in (SB["cover"], SB["pixie"], SB["closing"] + 1):
    perc.n(b * 4, 2, TRI, 58)
# timpani rolls
for end, length, vmax, note in [(SB["cover"] * 4, 2.0, 76, 38), ((SB["closing"] + 1) * 4, 2.0, 80, 40)]:
    t, k = end - length, 0
    n = int(length / 0.125)
    while t < end - 0.01:
        timp.n(t, 0.2, note, int(26 + (vmax - 26) * k / n), hum=False)
        t += 0.125
        k += 1
    timp.n(end, 2.5, note, 86, hum=False)


# ------------------------------------------------------------------ write
def write(stems, path):
    mf = mido.MidiFile(ticks_per_beat=TPB, type=1)
    for s in stems:
        mf.tracks.append(s.to_track())
    mf.save(path)


out = HERE / "midi"
out.mkdir(exist_ok=True)
for s in STEMS:
    write([s], out / f"{s.name}.mid")
write(STEMS, HERE / "adrisabel_theme_full.mid")
print("notes per stem:", {s.name: len(s.notes) for s in STEMS})
print("final chord beats:", round(FINAL_BEATS, 2))
