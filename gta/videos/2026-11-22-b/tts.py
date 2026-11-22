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
    ("Ge te a seis no solo trae un juego: trae un disco con treinta y cuatro canciones originales.",
     "GTA VI no solo trae un juego: trae un disco con 34 canciones originales", 0.30),
    ("Y el último nombre del disco nadie se lo esperaba.",
     "Y el último nombre del disco nadie se lo esperaba", 0.40),
    ("Salió el diecinueve de noviembre, el mismo día que el juego.",
     "Salió el 19 de noviembre, el mismo día que el juego", 0.30),
    ("Ya hay seis sencillos, con Travis Scot, Fiúcher y Morgan Uálen.",
     "Ya hay 6 sencillos, con Travis Scott, Future y Morgan Wallen", 0.30),
    ("También están Rau Alejandro, Catriel y Paco Amoroso.",
     "También están Rauw Alejandro, CA7RIEL y Paco Amoroso", 0.30),
    ("Y hasta Kiz Richards tiene su propia canción.",
     "Y hasta Keith Richards tiene su propia canción", 0.40),
    ("Pero lo más loco: la canción de Travis Scot la produjo un integrante de Daft Pank.",
     "Pero lo más loco: la canción de Travis Scott la produjo un integrante de DAFT PUNK", 0.45),
    ("¿Ya la escuchaste? Sígueme para más.",
     "¿Ya la escuchaste? Sígueme para más", 0.50),
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
