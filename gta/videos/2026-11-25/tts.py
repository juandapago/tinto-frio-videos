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
    ("En un solo día, los videos de Ge te a seis sumaron más de tres mil quinientos millones de vistas en YouTube.",
     "En un solo día, los videos de GTA VI sumaron más de 3.500 millones de vistas en YouTube", 0.30),
    ("Lo confirmó YouTube. Y el último número es todavía más loco.",
     "Lo confirmó YouTube. Y el último número es todavía más loco", 0.40),
    ("Fue el diecinueve de noviembre, el día del lanzamiento, contando los videos con Ge te a seis en el título.",
     "Fue el 19 de noviembre, el día del lanzamiento, contando los videos con GTA VI en el título", 0.30),
    ("Antes de salir, los videos del juego ya pasaban los cuarenta mil millones de vistas.",
     "Antes de salir, los videos del juego ya pasaban los 40.000 millones de vistas", 0.40),
    ("Pero toda la saga de Ge te a en YouTube supera los novecientos mil millones de vistas.",
     "Pero toda la saga de GTA en YouTube supera los 900.000 millones de vistas", 0.45),
    ("¿Cuántos videos de Ge te a seis has visto tú? Sígueme para más.",
     "¿Cuántos videos de GTA VI has visto tú? Sígueme para más", 0.50),
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
