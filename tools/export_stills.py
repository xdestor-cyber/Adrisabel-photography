"""Copy key frames from build/frames into output/stills + a storyboard contact sheet.

    python3 tools/export_stills.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FRAMES, OUT = ROOT / "build" / "frames", ROOT / "output"
KEY = [  # (seconds, name)
    (8.3, "01_hook"), (12.9, "02_cover"), (17.8, "03_contents"), (28.5, "04_sunshine"),
    (40.0, "05_wonderland"), (51.5, "06_fairytale"), (58.5, "07_pixie_dust"), (65.5, "08_pixie_included"),
    (76.5, "09_pixie_options"), (87.5, "10_cake_smash"), (98.0, "11_seaside_beach"), (105.0, "12_extras"),
    (116.5, "13_how_it_works"), (127.5, "14_final_frame"),
]
(OUT / "stills").mkdir(parents=True, exist_ok=True)
for old in (OUT / "stills").glob("*.jpg"):
    old.unlink()
thumbs = []
for t, name in KEY:
    im = Image.open(FRAMES / f"f_{round(t * 30):05d}.jpg").convert("RGB")
    im.save(OUT / "stills" / f"{name}.jpg", quality=90)
    thumbs.append((name, im))
Image.open(FRAMES / f"f_{round(12.9 * 30):05d}.jpg").convert("RGB").save(OUT / "thumbnail.jpg", quality=92)

w, h, cols = 270, 480, 7
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (w + 12) + 12, rows * (h + 40) + 12), "#2a1a20")
d = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("DejaVuSans.ttf", 16)
except OSError:
    font = ImageFont.load_default()
for k, (name, im) in enumerate(thumbs):
    x, y = 12 + (k % cols) * (w + 12), 12 + (k // cols) * (h + 40)
    sheet.paste(im.resize((w, h), Image.LANCZOS), (x, y + 28))
    d.text((x + 2, y + 4), f"{KEY[k][0]:5.1f}s  {name[3:].replace('_', ' ')}", fill="#EBCB8B", font=font)
sheet.save(OUT / "storyboard.jpg", quality=88)
print(f"stills: {len(thumbs)} -> {OUT / 'stills'}; storyboard.jpg; thumbnail.jpg")
