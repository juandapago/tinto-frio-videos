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
    ("La crítica le dio a Ge te a seis un noventa y nueve. Los jugadores lo hundieron hasta un cuatro coma nueve.",
     "La crítica le dio a GTA VI un 99… los jugadores lo hundieron a 4,9", 0.30),
    ("¿Quién tiene la razón? La última razón no tiene nada que ver con el juego.",
     "¿Quién tiene la razón? La última no tiene nada que ver con el juego", 0.40),
    ("El noventa y nueve sale de ciento cincuenta y dos reseñas de la crítica.",
     "El 99 sale de 152 reseñas de la crítica", 0.30),
    ("Pero miles de jugadores lo bajaron por los treinta cuadros por segundo y el ritmo lento.",
     "Pero miles de jugadores lo bajaron por los 30 FPS y el ritmo lento", 0.30),
    ("Otros dicen que se siente más como Red Ded que como Ge te a.",
     "Otros dicen que se siente más como Red Dead que como GTA", 0.40),
    ("Y lo más loco: se dice que muchos ceros vienen de fans de Zelda, para cuidar su récord.",
     "Y lo más loco: se dice que muchos ceros vienen de fans de ZELDA, para cuidar su récord", 0.35),
    ("Y los fans de Ge te a respondieron con ceros al remake de Zelda.",
     "Y los fans de GTA respondieron con ceros al remake de Zelda", 0.45),
    ("¿Tú qué nota le das? Sígueme para más.",
     "¿Tú qué nota le das? Sígueme para más", 0.50),
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
