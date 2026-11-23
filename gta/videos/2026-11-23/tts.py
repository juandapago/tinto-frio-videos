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
    ("Un colegio en Inglaterra mandó un bus a buscar a los alumnos que faltaron por jugar Ge te a seis.",
     "Un colegio en Inglaterra mandó un bus a buscar a los alumnos que faltaron por jugar GTA VI", 0.30),
    ("Y el último dato deja a esos alumnos en problemas.",
     "Y el último dato deja a esos alumnos en problemas", 0.40),
    ("Pasó en Birmingham, el día del lanzamiento: el colegio salió en su minibús a recoger a los que no llegaron.",
     "Pasó en Birmingham, el día del lanzamiento: el colegio salió en su minibús a recoger a los que no llegaron", 0.30),
    ("Además, rifó premios entre los que fueran a todas sus clases de la semana.",
     "Además, rifó premios entre los que fueran a todas sus clases de la semana", 0.30),
    ("Y hasta movió sus exámenes de práctica para que nadie faltara.",
     "Y hasta movió sus exámenes de práctica para que nadie faltara", 0.30),
    ("En Inglaterra, faltar sin permiso se multa: desde ochenta libras por niño.",
     "En Inglaterra, faltar sin permiso se multa: desde £80 por niño", 0.40),
    ("Pero lo más loco: Ge te a seis es para mayores de dieciocho. La mayoría de esos alumnos ni siquiera deberían jugarlo.",
     "Pero lo más loco: GTA VI es para mayores de 18. La mayoría de esos alumnos ni siquiera deberían jugarlo", 0.45),
    ("¿Tu colegio haría lo mismo? Sígueme para más.",
     "¿Tu colegio haría lo mismo? Sígueme para más", 0.50),
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
