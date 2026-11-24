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
    ("Sony lo confirmó: Ge te a seis es el lanzamiento más grande en la historia de PlayStation.",
     "Sony lo confirmó: GTA VI es el lanzamiento más grande en la historia de PlayStation", 0.30),
    ("Lo jugaron más de treinta y nueve millones de personas en PlayStation cinco. Y el último número es una locura.",
     "Lo jugaron más de 39 millones de personas en PS5. Y el último número es una locura", 0.40),
    ("Uno: rompió el récord de jugadores conectados al mismo tiempo en PlayStation.",
     "1: rompió el récord de jugadores conectados al mismo tiempo en PlayStation", 0.30),
    ("Dos: en siete de cada diez PlayStation cinco nuevas, fue el primer juego que pusieron.",
     "2: en 7 de cada 10 PS5 nuevas, fue el primer juego que pusieron", 0.30),
    ("Tres: en promedio, cada jugador ya le metió diecisiete coma cuatro horas.",
     "3: en promedio, cada jugador ya le metió 17,4 horas", 0.40),
    ("Y en total: seiscientos ochenta y tres millones de horas. Eso es casi setenta y ocho mil años jugando.",
     "Y en total: 683 millones de horas. Eso es casi 78.000 años jugando", 0.45),
    ("¿Cuántas horas le llevas tú? Sígueme para más.",
     "¿Cuántas horas le llevas tú? Sígueme para más", 0.50),
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
