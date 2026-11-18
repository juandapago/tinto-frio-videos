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
    ("Ge te a seis ya salió. Y si lo vas a jugar hoy, revisa esto primero.",
     "GTA VI ya salió… y si lo vas a jugar hoy, revisa esto primero", 0.30),
    ("El tercer dato casi nadie lo sabe, y es gratis.",
     "El tercer dato casi nadie lo sabe… y es GRATIS", 0.45),
    ("Uno: pesa hasta doscientos doce gigas.",
     "1. Pesa hasta 212 GB", 0.15),
    ("Si tu consola está llena, toca borrar juegos.",
     "Si tu consola está llena, toca borrar juegos", 0.45),
    ("Dos: en la tienda de Equis box Colombia, cuesta casi trescientos cuarenta mil pesos.",
     "2. En la tienda de Xbox Colombia: $339.900", 0.20),
    ("Y si juegas en pe ce, toca esperar: todavía no tiene fecha.",
     "¿Y en PC? Todavía sin fecha", 0.45),
    ("Tres: desde hoy, en la página oficial, puedes bajar gratis el mapa de Leonida y un póster para imprimir.",
     "3. Mapa de Leonida + póster GRATIS para imprimir en la página oficial", 0.60),
    ("Sígueme para más.",
     "Sígueme para más", 0.50),
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
