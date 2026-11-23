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
    ("Ge te a seis ya habría vendido cuarenta y cuatro coma nueve millones de copias. En solo cuatro días.",
     "GTA VI ya habría vendido 44,9 millones de copias. En solo 4 días", 0.30),
    ("Es una estimación de Alinea Analytics. Y el último dato es el más loco.",
     "Es una estimación de Alinea Analytics. Y el último dato es el más loco", 0.40),
    ("Treinta y tres coma siete millones serían de PlayStation cinco. Once coma dos millones, de Equis box.",
     "33,7 millones serían de PS5. 11,2 millones, de Xbox", 0.35),
    ("Y solo el domingo, casi cuarenta y un millones de personas entraron a jugar.",
     "Y solo el domingo, casi 41 millones de personas entraron a jugar", 0.40),
    ("Pero lo más loco: casi nueve millones ya le metieron más de veinte horas. En cuatro días.",
     "Pero lo más loco: casi 9 millones ya le metieron más de 20 horas. En 4 días", 0.45),
    ("¿Tú cuántas horas llevas? Sígueme para más.",
     "¿Tú cuántas horas llevas? Sígueme para más", 0.50),
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
