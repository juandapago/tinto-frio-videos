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
    ("Ge te a seis vendió en un solo día casi tres veces más que Ge te a cinco.",
     "GTA VI vendió en UN día casi 3 veces más que GTA V", 0.30),
    ("Pero el último dato es el que más sorprende.",
     "Pero el último dato es el que más sorprende…", 0.45),
    ("Según la firma Sénsor Táuer, en su primer día vendió más de veinticuatro millones de copias.",
     "Según Sensor Tower: más de 24 millones de copias el primer día", 0.20),
    ("Eso son unos dos mil trescientos millones de dólares.",
     "Unos 2.300 millones de dólares", 0.45),
    ("Ge te a cinco, en dos mil trece, hizo unos ochocientos millones en su primer día.",
     "GTA V en 2013: unos 800 millones el primer día", 0.45),
    ("Y lo loco: diecinueve millones de esas copias eran reservas. Gente que pagó antes de ver una sola reseña.",
     "Lo loco: 19 millones eran RESERVAS… pagadas antes de ver una sola reseña", 0.45),
    ("Ojo: son estimaciones. Teik Tu todavía no da cifras oficiales.",
     "Ojo: son estimaciones. Take-Two aún no da cifras oficiales", 0.40),
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
