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
    ("Ge te a seis rompió el récord de Twitch: tres coma tres millones de personas viéndolo al mismo tiempo.",
     "GTA VI rompió el récord de Twitch: 3,3 millones viéndolo AL MISMO TIEMPO", 0.30),
    ("Y eso que solo es Twitch. Espera al último número.",
     "Y eso que solo es Twitch… espera al último número", 0.40),
    ("El récord anterior era de Lig of Léyends: tres coma un millones, en la final del mundial de dos mil veintidós.",
     "Récord anterior: League of Legends, 3,1 millones (final mundial 2022)", 0.35),
    ("Pero no solo lo vieron en Twitch. En YouTube hubo otros tres coma dos millones.",
     "Pero en YouTube hubo otros 3,2 millones", 0.20),
    ("Y en Kik, uno coma cinco millones más.",
     "Y en Kick, 1,5 millones más", 0.40),
    ("En total: casi ocho millones de personas viendo el mismo juego al mismo tiempo, según Strims Charts.",
     "TOTAL: casi 8 millones al mismo tiempo (según Streams Charts)", 0.40),
    ("Es casi tanta gente como la que vive en Bogotá.",
     "Casi tanta gente como la que vive en Bogotá", 0.45),
    ("¿Tú lo viste en vivo? Sígueme para más.",
     "¿Tú lo viste en vivo? Sígueme para más", 0.50),
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
