# Robos Imposibles (3D)
Desde la carpeta del episodio (ej. `ep01-valledupar/`):
1. `cd .. && npm install && cd ep01-valledupar` (instala three@0.160.0)
2. `python3 voces.py` → `n_*.wav` y `ndur.json` (Kokoro `am_adam`, voces en `../../pipeline/assets/voices5.npz`)
3. `python3 ep.py` → `ep.json` · `python3 mix.py` → `soundtrack.wav` → normalizar a `st_norm.wav` (ver skill critico-robos)
4. `python3 ../build.py` → `robos.html` · revisar con `node ../frames.js chk '[0,5,10]'`
5. `node ../render.js /home/claude/robos-<nombre>.mp4`

## Revisión del video (antes de entregar)
- Volumen: -15 a -13 LUFS integrados y pico verdadero ≤ -1 dB (`ffmpeg -i v.mp4 -af ebur128=peak=true -f null -`).
- **Movimiento por segundo** (Juanda se quejó de escenas "pegadas"): ningún segundo con diferencia < 3 fuera de cortes, y nunca 2 s seguidos < 3.
  ```bash
  ffmpeg -loglevel error -y -i v.mp4 -vf "fps=4,scale=108:192,format=gray" -f rawvideo g.raw && python3 -c "
  import numpy as np;a=np.fromfile('g.raw',dtype=np.uint8).reshape(-1,192,108).astype(float);m=np.ones((192,108),bool);m[125:162]=False
  d=[np.abs(a[i+1]-a[i])[m].mean() for i in range(len(a)-1)];[print(s,round(float(np.mean(d[s*4:s*4+4])),2)) for s in range(len(d)//4)]"
  ```
- Aprendizajes del Ep. 1:
  - Los planos que se quedan quietos son los finales de cada movimiento con `eio`. Usar cámaras lineales o `k*(2-k)` y que los personajes sigan haciendo algo (caminar, linterna, billetes cayendo) hasta el corte.
  - La encuesta no puede ser una tarjeta fija: fondo con billetes cayendo, tarjetas A/B que laten y "COMENTA A o B" que rebota.
  - Subtítulos con `maxW 760` centrados en x=510, para que no pasen de x≈930 (botones de la derecha).
  - Un plano de más de ~6 s necesita un segundo ángulo (ej. el camión: plano general → lateral de la gente empujando).
