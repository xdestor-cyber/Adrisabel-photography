#!/usr/bin/env bash
# Render each MIDI stem with FluidSynth (FluidR3_GM, MIT-licensed soundfont).
set -euo pipefail
cd "$(dirname "$0")/.."
SF2="${SF2:-/usr/share/sounds/sf2/FluidR3_GM.sf2}"
mkdir -p build/audio/stems
for f in music/midi/*.mid; do
  n=$(basename "$f" .mid)
  fluidsynth -ni -q -g 0.5 -r 48000 -R 0 -C 0 -F "build/audio/stems/$n.wav" "$SF2" "$f" >/dev/null 2>&1 &
done
wait
echo "stems rendered -> build/audio/stems"
