#!/usr/bin/env bash
# Full pipeline: textures → cues → score → stems → mix → master → frames → MP4.
# Requirements: node 18+, python3 (numpy scipy mido soundfile pillow), ffmpeg,
# fluidsynth + FluidR3_GM.sf2, Chromium via Playwright (npm install).
set -euo pipefail
cd "$(dirname "$0")"
WORKERS="${WORKERS:-4}"
OUT="output/Adrisabel_Promo_1080x1920.mp4"

[ -f video/assets/textures/paper-grain.png ] || python3 tools/make_textures.py

echo "== 1/6 export timing + sound-design cues from the animation"
node tools/export_cues.mjs

echo "== 2/6 compose the score (MIDI stems)"
python3 music/compose.py

echo "== 3/6 render stems with FluidSynth"
music/render_stems.sh

echo "== 4/6 mix + master (-14.5 LUFS integrated, -1 dBTP)"
python3 music/mix.py
mkdir -p output/audio
M=$(ffmpeg -hide_banner -nostats -i build/audio/mix_raw.wav -af loudnorm=I=-14.5:TP=-1.0:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$M" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -loglevel error -y -i build/audio/mix_raw.wav \
  -af "loudnorm=I=-14.5:TP=-1.0:LRA=11:linear=true:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset),aresample=48000" \
  -c:a pcm_s24le build/audio/adrisabel_soundtrack.wav
ffmpeg -hide_banner -loglevel error -y -i build/audio/adrisabel_soundtrack.wav -c:a aac -b:a 256k output/audio/adrisabel_soundtrack.m4a

echo "== 5/6 render frames ($WORKERS workers)"
rm -rf build/frames
node tools/render_frames.mjs --workers "$WORKERS" --out build/frames

echo "== 6/6 encode MP4"
DUR=$(python3 -c "import json;print(json.load(open('music/cues.json'))['timing']['DURATION'])")
ffmpeg -hide_banner -loglevel error -y -framerate 30 -i build/frames/f_%05d.jpg -i build/audio/adrisabel_soundtrack.wav \
  -map 0:v -map 1:a -t "$DUR" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.2 \
  -x264-params "keyint=60:min-keyint=30" -r 30 -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart \
  -metadata title="Adrisabel — Once Upon a Tiny Time" -metadata comment="adrisabel.com" \
  "$OUT"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
python3 tools/export_stills.py
echo "done -> $OUT"
