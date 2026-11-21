"""Voz en off con Kokoro: una frase por archivo, tiempos en segs.json."""
import json
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

import os
BASE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.environ.get("KOKORO_DIR", "/home/claude/kokoro-models")
k = Kokoro(f"{MODELS}/kokoro-v1.0.int8.onnx", f"{MODELS}/voices-v1.0.bin")

# (texto para la voz, subtítulo en pantalla, pausa después en s)
LINES = [
    ("Ayer te dijimos que Ge te a seis vendió unos dos mil trescientos millones de dólares en su primer día.",
     "Ayer dijimos: GTA VI hizo unos 2.300 millones en su primer día", 0.30),
    ("Nos quedamos cortos. Y el último dato es todavía más loco.",
     "Nos quedamos cortos… y el último dato es todavía más loco", 0.45),
    ("Teik Tu ya dio la cifra oficial: treinta y dos millones y medio de copias vendidas antes de salir.",
     "Cifra OFICIAL de Take-Two: 32,5 millones de copias antes de salir", 0.20),
    ("Y en su primer día: tres mil setecientos noventa millones de dólares.",
     "Primer día: 3.790 millones de dólares", 0.45),
    ("Casi mil quinientos millones más de lo que se estimaba.",
     "Casi 1.500 millones más de lo estimado", 0.45),
    ("Según Teik Tu, es el lanzamiento de entretenimiento más grande de la historia. Ni el cine ha hecho algo así.",
     "Según Take-Two: el lanzamiento MÁS GRANDE del entretenimiento en la historia", 0.45),
    ("Y lo más loco: noventa y nueve en Metacrític. El juego mejor calificado de todos los tiempos.",
     "Lo más loco: 99 en Metacritic… el juego mejor calificado de la historia", 0.40),
    ("¿Tú ya lo tienes? Sígueme para más.",
     "¿Tú ya lo tienes? Sígueme para más", 0.50),
]

SR = 24000
lead = 0.15
chunks = [np.zeros(int(lead * SR), dtype=np.float32)]
t = lead
segs = []
for i, (voice, sub, pause) in enumerate(LINES):
    samples, sr = k.create(voice, voice="em_alex", speed=1.12, lang="es")
    assert sr == SR
    samples = samples.astype(np.float32)
    # recortar silencio inicial/final
    idx = np.where(np.abs(samples) > 0.01)[0]
    if len(idx):
        samples = samples[max(0, idx[0] - 240): idx[-1] + 480]
    dur = len(samples) / SR
    segs.append({"i": i, "start": round(t, 3), "end": round(t + dur, 3), "sub": sub, "voice": voice})
    chunks.append(samples)
    chunks.append(np.zeros(int(pause * SR), dtype=np.float32))
    t += dur + pause

audio = np.concatenate(chunks)
sf.write(f"{BASE}/voz.wav", audio, SR)
json.dump({"total": round(t, 3), "segs": segs}, open(f"{BASE}/segs.json", "w"), ensure_ascii=False, indent=1)
for s in segs:
    print(f"{s['start']:6.2f}-{s['end']:6.2f}  {s['sub']}")
print("TOTAL", round(t, 2))
