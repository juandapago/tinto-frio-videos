# Robos Imposibles (3D)
Desde la carpeta del episodio (ej. `ep01-valledupar/`):
1. `cd .. && npm install && cd ep01-valledupar` (instala three@0.160.0)
2. `python3 voces.py` → `n_*.wav` y `ndur.json` (Kokoro `am_adam`, voces en `../../pipeline/assets/voices5.npz`)
3. `python3 ep.py` → `ep.json` · `python3 mix.py` → `soundtrack.wav` → normalizar a `st_norm.wav` (ver skill critico-robos)
4. `python3 ../build.py` → `robos.html` · revisar con `node ../frames.js chk '[0,5,10]'`
5. `node ../render.js /home/claude/robos-<nombre>.mp4`
