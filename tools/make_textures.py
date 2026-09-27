"""Procedurally generates the original textures used in the Adrisabel promo.

Everything here is synthesized from noise, so the video contains no stock
imagery. Outputs go to video/assets/textures/.

    python3 tools/make_textures.py
"""
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "video" / "assets" / "textures"
OUT.mkdir(parents=True, exist_ok=True)


def value_noise(h, w, cell, rng):
    gh, gw = max(2, h // cell + 2), max(2, w // cell + 2)
    grid = (rng.random((gh, gw)) * 255).astype(np.uint8)
    img = Image.fromarray(grid).resize((w + 2 * cell, h + 2 * cell), Image.BICUBIC)
    arr = np.asarray(img, dtype=np.float32)[cell:cell + h, cell:cell + w] / 255.0
    return arr


def fbm(h, w, rng, octaves):
    acc = np.zeros((h, w), np.float32)
    tot = 0.0
    for cell, amp in octaves:
        acc += value_noise(h, w, cell, rng) * amp
        tot += amp
    return acc / tot


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def watercolor(name, color, seed, size=900, opacity=0.9, stretch=(1.0, 1.0)):
    rng = np.random.default_rng(seed)
    h = w = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    base = 0.36 if stretch == (1.0, 1.0) else 0.33
    dx = (xx - w / 2) / (w * base * stretch[0])
    dy = (yy - h / 2) / (h * base * stretch[1])
    r = np.sqrt(dx * dx + dy * dy)
    ang = np.arctan2(dy, dx)
    pert = np.zeros_like(r)
    for k, a in [(2, 0.07), (3, 0.06), (5, 0.045), (8, 0.025), (13, 0.015)]:
        pert += a * np.sin(k * ang + rng.uniform(0, 2 * np.pi))
    n1 = fbm(h, w, rng, [(220, 0.5), (90, 0.3), (35, 0.2)])
    field = r - pert - (n1 - 0.5) * 0.35
    inside = smoothstep(1.0, 0.94, field)
    # pigment pools at the drying edge
    edge = np.exp(-((1.0 - field) / 0.045) ** 2) * inside
    # soft cauliflower blooms inside the wash
    n2 = fbm(h, w, rng, [(160, 0.6), (60, 0.4)])
    bloom = smoothstep(0.45, 0.75, n2)
    gran = value_noise(h, w, 3, rng)
    alpha = inside * (0.50 + 0.22 * bloom - 0.12 * (1 - r).clip(0, 1)) + edge * 0.38
    alpha *= 0.86 + 0.28 * (gran - 0.5)
    # guarantee a soft falloff before the canvas border
    border = np.maximum(np.abs(xx - w / 2), np.abs(yy - h / 2)) / w
    alpha *= smoothstep(0.5, 0.45, border)
    alpha = np.clip(alpha * opacity, 0, 1)
    rgb = np.array(hex_rgb(color), np.float32)
    # slightly deeper pigment at the rim
    shade = 1.0 - 0.10 * edge[..., None]
    img = np.concatenate([np.clip(rgb * shade, 0, 255), alpha[..., None] * 255], axis=-1)
    Image.fromarray(img.astype(np.uint8), "RGBA").save(OUT / f"wash-{name}.png", optimize=True)


def paper_grain():
    rng = np.random.default_rng(7)
    h, w = 1920, 1080
    fine = rng.random((h, w)).astype(np.float32)
    mid = fbm(h, w, rng, [(6, 0.5), (18, 0.3), (60, 0.2)])
    fibers = value_noise(h, w * 1, 2, rng)
    a = 0.022 * fine + 0.026 * mid + 0.010 * fibers
    a = np.clip(a, 0, 1)
    rgb = np.zeros((h, w, 3), np.float32)
    rgb[...] = hex_rgb("#6b4a3a")
    img = np.concatenate([rgb, a[..., None] * 255], axis=-1)
    Image.fromarray(img.astype(np.uint8), "RGBA").save(OUT / "paper-grain.png", optimize=True)


def linen():
    rng = np.random.default_rng(11)
    h, w = 1920, 1080
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    jitter = fbm(h, w, rng, [(40, 0.6), (9, 0.4)])
    warp = np.sin(xx * 2.1 + jitter * 6) * 0.5 + 0.5
    weft = np.sin(yy * 2.1 + jitter * 6) * 0.5 + 0.5
    slub = fbm(h, w, rng, [(3, 0.5), (120, 0.5)])
    v = 0.5 * warp + 0.5 * weft
    a = 0.06 * v + 0.05 * slub
    rgb = np.zeros((h, w, 3), np.float32)
    rgb[...] = hex_rgb("#2a1219")
    img = np.concatenate([rgb, np.clip(a, 0, 1)[..., None] * 255], axis=-1)
    Image.fromarray(img.astype(np.uint8), "RGBA").save(OUT / "linen.png", optimize=True)


if __name__ == "__main__":
    washes = {
        "blush": "#F2C4BA",
        "peach": "#F8CFA4",
        "butter": "#F6DD8E",
        "lavender": "#D6C8EC",
        "sky": "#BCD9EA",
        "sage": "#C6D6B4",
        "aqua": "#AEDFD8",
        "strawberry": "#F4B3BE",
        "sand": "#EFD9B5",
        "gold": "#E8C98A",
    }
    for i, (name, col) in enumerate(washes.items()):
        watercolor(name, col, seed=100 + i)
        watercolor(name + "-b", col, seed=200 + i, stretch=(1.18, 0.78))
    paper_grain()
    linen()
    print("textures ->", OUT)
