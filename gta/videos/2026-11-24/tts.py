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
    ("Ge te a seis ya tiene su primer parche. Y arregla siete fallos.",
     "GTA VI ya tiene su primer parche. Y arregla 7 fallos", 0.30),
    ("Pesa unos seiscientos megas en PlayStation cinco. Y el último arreglo es el más raro.",
     "Pesa unos 600 MB en PS5. Y el último arreglo es el más raro", 0.40),
    ("Uno: varios cierres. El juego se te podía cerrar solo.",
     "1: varios cierres. El juego se te podía cerrar solo", 0.30),
    ("Dos: llamadas que no entraban y te trababan misiones de la historia. Y un clima que no cambiaba en mucho rato.",
     "2: llamadas que no entraban y trababan misiones de la historia. Y un clima que no cambiaba", 0.30),
    ("Tres: a veces no te podías quitar el nivel de búsqueda.",
     "3: a veces no te podías quitar el nivel de búsqueda", 0.40),
    ("Y el más raro: en el gimnasio, no se podía usar la barra de peso muerto.",
     "Y el más raro: en el gimnasio no se podía usar la barra de peso muerto", 0.45),
    ("¿Cuál te tocó a ti? Sígueme para más.",
     "¿Cuál te tocó a ti? Sígueme para más", 0.50),
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
