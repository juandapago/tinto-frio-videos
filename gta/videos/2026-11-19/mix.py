"""Mezcla: voz Kokoro (24k→44.1k) + beat + efectos en los eventos del video."""
import numpy as np
import soundfile as sf
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import make_video as mv

SR = 44100
N = int((mv.TOTAL + 0.3) * SR)
out = np.zeros(N, np.float32)
rng = np.random.default_rng(7)

def add(sig, t, vol):
    i = int(t * SR)
    if i >= N: return
    j = min(N, i + len(sig))
    out[i:j] += sig[: j - i] * vol

def env(n, a=0.005, r=None):
    e = np.ones(n, np.float32)
    na = max(1, int(a * SR)); e[:na] = np.linspace(0, 1, na)
    if r: e *= np.exp(-np.arange(n) / (r * SR))
    return e

def kick():
    n = int(0.25 * SR); tt = np.arange(n) / SR
    f = 120 * np.exp(-tt * 18) + 45
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.08)).astype(np.float32)

def hat():
    n = int(0.05 * SR)
    x = rng.standard_normal(n).astype(np.float32)
    x = np.diff(x, prepend=0)
    return x * env(n, 0.001, 0.012)

def whoosh(d=0.35):
    n = int(d * SR)
    x = rng.standard_normal(n).astype(np.float32)
    k = np.ones(60) / 60
    x = np.convolve(x, k, "same")
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    return x * e * 3

def pum():
    n = int(0.45 * SR); tt = np.arange(n) / SR
    f = 90 * np.exp(-tt * 8) + 38
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.18)
    s += rng.standard_normal(n) * env(n, 0.001, 0.03) * 0.4
    return s.astype(np.float32)

def tone(freqs, d, r):
    n = int(d * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * tt) for f in freqs) / len(freqs)
    return (s * env(n, 0.003, r)).astype(np.float32)

def buzz():
    n = int(0.5 * SR); tt = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 140 * tt)) * 0.5
    s *= (np.sin(2 * np.pi * 8 * tt) > 0)
    return (s * env(n, 0.005, 0.4)).astype(np.float32)

def kaching():
    a = tone([1568, 2093], 0.5, 0.25)
    b = tone([2637, 3136], 0.6, 0.3)
    s = np.zeros(int(0.7 * SR), np.float32)
    s[: len(a)] += a; s[int(0.08 * SR): int(0.08 * SR) + len(b)] += b
    return s

def chime():
    s = np.zeros(int(1.2 * SR), np.float32)
    for k, f in enumerate([1047, 1319, 1568, 2093]):
        tn = tone([f], 0.9, 0.35); i = int(k * 0.07 * SR)
        s[i: i + len(tn)] += tn
    return s

def popfx():
    n = int(0.08 * SR); tt = np.arange(n) / SR
    f = 600 + 1400 * tt / tt[-1]
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.03)).astype(np.float32)

# beat de fondo
K, Hh = kick(), hat()
t = 0.0
while t < mv.TOTAL:
    add(K, t, 0.22)
    add(Hh, t + 0.25, 0.10)
    t += 0.5

T = mv.T
for e in mv.SCENE_CHANGES: add(whoosh(), e - 0.12, 0.16)
add(pum(), mv.STAMP1, 0.5)
add(pum(), mv.STAMP_PC, 0.5)
for i in range(3): add(popfx(), T["promesa"] + 0.35 + i * 0.25, 0.18)
add(popfx(), T["promesa"] + 1.75, 0.2)
add(buzz(), mv.OVERFLOW, 0.12)
for tt in mv.TILE_T: add(whoosh(0.25), tt, 0.14)
add(tone([1760], 0.35, 0.12), mv.LISTO_T, 0.2)
add(kaching(), mv.KACHING, 0.2)
add(chime(), mv.GIFT_OPEN, 0.2)
add(popfx(), mv.MAP_OUT, 0.2); add(popfx(), mv.POSTER_OUT, 0.2); add(popfx(), mv.ZERO_BADGE, 0.2)

# voz
v, vsr = sf.read(f"{mv.BASE}/voz.wav", dtype="float32")
x_old = np.arange(len(v)) / vsr
x_new = np.arange(int(len(v) * SR / vsr)) / SR
v44 = np.interp(x_new, x_old, v).astype(np.float32)
v44 /= max(1e-6, np.abs(v44).max())
add(v44, 0.0, 0.95)

out /= max(1.0, np.abs(out).max())
out = np.clip(out * 0.98, -1, 1)
sf.write(f"{mv.BASE}/mix.wav", out, SR)
print("mix ok", round(len(out) / SR, 2), "s")
