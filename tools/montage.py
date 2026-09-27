"""Tile stills into one review sheet: python3 tools/montage.py out.jpg a.jpg b.jpg ... [--w 432]"""
import sys
from PIL import Image, ImageDraw
args = sys.argv[1:]
w = 432
if '--w' in args:
    i = args.index('--w'); w = int(args[i + 1]); del args[i:i + 2]
out, files = args[0], args[1:]
h = int(w * 1920 / 1080)
cols = min(5, len(files)); rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (w + 8) + 8, rows * (h + 34) + 8), '#222')
d = ImageDraw.Draw(sheet)
for k, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS)
    x, y = 8 + (k % cols) * (w + 8), 8 + (k // cols) * (h + 34)
    sheet.paste(im, (x, y + 26))
    d.text((x + 4, y + 4), f.split('/')[-1], fill='#fff')
sheet.save(out, quality=88)
