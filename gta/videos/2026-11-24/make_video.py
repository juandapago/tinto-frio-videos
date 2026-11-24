"""Video vertical GTA VI: primer parche 1.002.002, 7 fallos arreglados. Animación procedural original con Pillow."""
import json, math, random, sys, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

import os
BASE = os.path.dirname(os.path.abspath(__file__))
MODELS = os.environ.get("KOKORO_DIR", "/home/claude/kokoro-models")
W, H, FPS = 1080, 1920, 30
SEG = json.load(open(f"{BASE}/segs.json"))
TOTAL = SEG["total"]
S = SEG["segs"]

FD = "/usr/share/fonts/opentype/inter/"
_fc = {}
def F(size, w="ExtraBold"):
    k = (size, w)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(f"{FD}Inter-{w}.otf", size)
    return _fc[k]

# ---------- paleta ----------
PINK = (255, 61, 140); CYAN = (60, 225, 255); YEL = (255, 216, 77)
RED = (255, 62, 72); GRN = (60, 230, 120); WHITE = (255, 255, 255)
PURP = (44, 14, 72); DARK = (12, 6, 26)

# ---------- easing ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def prog(t, t0, d): return clamp((t - t0) / d)
def ease_out(p): return 1 - (1 - p) ** 3
def ease_back(p):
    c1, c3 = 1.70158 * 1.4, 1.70158 * 1.4 + 1
    return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2
def pop(t, t0, d=0.22):
    p = prog(t, t0, d)
    return 0.0 if p <= 0 else ease_back(p)

def shake(t, events, amp=18, dur=0.3):
    dx = dy = 0
    for e in events:
        if 0 <= t - e < dur:
            k = 1 - (t - e) / dur
            r = random.Random(int(t * 1000))
            dx += r.uniform(-amp, amp) * k; dy += r.uniform(-amp, amp) * k
    return int(dx), int(dy)

# ---------- fondo synthwave (original, genérico) ----------
HOR = 1150
def build_sky():
    img = Image.new("RGB", (W, H), DARK)
    a = np.zeros((H, W, 3), np.float32)
    top, mid, hor = np.array([9, 4, 24]), np.array([40, 11, 70]), np.array([150, 35, 110])
    for y in range(HOR):
        if y < 750:
            c = top + (mid - top) * (y / 750)
        else:
            c = mid + (hor - mid) * ((y - 750) / (HOR - 750))
        a[y, :] = c
    a[HOR:, :] = np.array([16, 6, 34])
    img = Image.fromarray(a.astype(np.uint8))
    d = ImageDraw.Draw(img)
    # estrellas
    r = random.Random(3)
    for _ in range(120):
        x, y = r.randrange(W), r.randrange(0, 900)
        b = r.randrange(90, 220)
        d.point((x, y), fill=(b, b, b + 20 if b < 235 else 255))
    # sol con franjas
    sun = Image.new("RGBA", (640, 640), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sun)
    for yy in range(640):
        p = yy / 640
        col = (255, int(215 - 150 * p), int(80 + 60 * p), 255)
        sd.line([(0, yy), (640, yy)], fill=col)
    mask = Image.new("L", (640, 640), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse((0, 0, 639, 639), fill=255)
    for i in range(7):
        yy = 340 + i * 38
        md.rectangle((0, yy, 640, yy + 6 + i * 3), fill=0)
    sun.putalpha(mask)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((540 - 420, HOR - 400 - 320, 540 + 420, HOR - 400 + 520), fill=(255, 70, 140, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img = img.convert("RGBA")
    img.alpha_composite(glow)
    img.paste(sun, (540 - 320, HOR - 520), sun)
    # palmeras genéricas (siluetas)
    d = ImageDraw.Draw(img)
    def palm(x0, y0, h, lean):
        pts = []
        for i in range(21):
            p = i / 20
            pts.append((x0 + lean * p * p, y0 - h * p))
        d.line(pts, fill=(18, 5, 30), width=22)
        tx, ty = pts[-1]
        for ang in (-160, -130, -100, -70, -40, -15, 15):
            rad = math.radians(ang)
            fr = []
            for i in range(16):
                p = i / 15
                L = 190 * p
                fr.append((tx + L * math.cos(rad), ty + L * math.sin(rad) + 60 * p * p))
            d.line(fr, fill=(18, 5, 30), width=16)
    palm(70, HOR + 10, 560, 60)
    palm(1010, HOR + 10, 480, -70)
    d.rectangle((0, HOR, W, H), fill=(16, 6, 34))
    return img

SKY = build_sky()

def background(t):
    img = SKY.copy()
    d = ImageDraw.Draw(img)
    vx, vy = 540, HOR
    # líneas verticales que convergen
    for i in range(-14, 15):
        xb = 540 + i * 150
        d.line([(vx + (xb - vx) * 0.02, vy), (xb, H)], fill=(190, 40, 160), width=3)
    # líneas horizontales en perspectiva que avanzan
    off = (t * 0.9) % 1.0
    for i in range(14):
        z = (i + off)
        y = vy + (H - vy) * ((z / 14) ** 2.2)
        wdt = 2 + int(3 * z / 14)
        d.line([(0, y), (W, y)], fill=(210, 50, 170), width=wdt)
    d.line([(0, vy), (W, vy)], fill=(255, 120, 200), width=3)
    return img

def dim(img, a):
    if a <= 0: return img
    ov = Image.new("RGBA", (W, H), (8, 3, 18, int(255 * a)))
    img.alpha_composite(ov)
    return img

# ---------- texto ----------
def tsize(txt, f):
    b = f.getbbox(txt)
    return b[2] - b[0], b[3] - b[1], b

def text_sprite(txt, size, fill=WHITE, w="Black", stroke=0, stroke_fill=(0, 0, 0), glow=None, glow_r=18, pad=60):
    f = F(size, w)
    tw, th, b = tsize(txt, f)
    im = Image.new("RGBA", (tw + pad * 2, th + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pos = (pad - b[0], pad - b[1])
    if glow:
        g = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(g).text(pos, txt, font=f, fill=glow + (255,), stroke_width=stroke + 6, stroke_fill=glow + (255,))
        g = g.filter(ImageFilter.GaussianBlur(glow_r))
        im.alpha_composite(g); im.alpha_composite(g)
    d.text(pos, txt, font=f, fill=fill + (255,) if len(fill) == 3 else fill, stroke_width=stroke, stroke_fill=stroke_fill)
    return im

def paste_c(img, spr, cx, cy, scale=1.0, rot=0.0, alpha=1.0):
    if scale <= 0.01 or alpha <= 0.01: return
    s = spr
    if rot: s = s.rotate(rot, resample=Image.BICUBIC, expand=True)
    if abs(scale - 1) > 0.01:
        s = s.resize((max(1, int(s.width * scale)), max(1, int(s.height * scale))), Image.BICUBIC)
    if alpha < 1:
        a = s.getchannel("A").point(lambda v: int(v * alpha))
        s = s.copy(); s.putalpha(a)
    img.alpha_composite(s, (0, 0)) if False else img.paste(s, (int(cx - s.width / 2), int(cy - s.height / 2)), s)

def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, r, fill=fill, outline=outline, width=width)

def stamp_sprite(txt, color, size=96):
    f = F(size, "Black")
    tw, th, b = tsize(txt, f)
    pw, ph = tw + 80, th + 56
    im = Image.new("RGBA", (pw + 40, ph + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rrect(d, (20, 20, 20 + pw, 20 + ph), 22, fill=color + (255,), outline=WHITE + (255,), width=8)
    d.text((20 + 40 - b[0], 20 + 28 - b[1]), txt, font=f, fill=WHITE)
    return im

# ---------- subtítulos ----------
def wrap(txt, f, maxw):
    words, lines, cur = txt.split(), [], ""
    for w_ in words:
        test = (cur + " " + w_).strip()
        if f.getlength(test) <= maxw: cur = test
        else: lines.append(cur); cur = w_
    if cur: lines.append(cur)
    return lines

def word_color(w_):
    core = w_.strip("….,:?¿!¡")
    if core in ("18",): return RED
    if "GRATIS" in core: return GRN
    if any(c.isdigit() for c in core) or "$" in core or "£" in core: return YEL
    if core in ("GTA", "VI", "PC", "Xbox"): return YEL
    return WHITE

_cap_cache = {}
def caption(img, txt):
    if txt not in _cap_cache:
        f = F(56, "ExtraBold")
        lines = wrap(txt, f, 830)
        lh = 70
        bw = max(f.getlength(l) for l in lines) + 64
        bh = lh * len(lines) + 40
        im = Image.new("RGBA", (int(bw), int(bh)), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        rrect(d, (0, 0, bw - 1, bh - 1), 26, fill=(0, 0, 0, 185))
        y = 20
        for l in lines:
            x = (bw - f.getlength(l)) / 2
            for i, w_ in enumerate(l.split()):
                d.text((x, y), w_, font=f, fill=word_color(w_), stroke_width=2, stroke_fill=(0, 0, 0))
                x += f.getlength(w_ + " ")
            y += lh
        _cap_cache[txt] = im
    im = _cap_cache[txt]
    img.paste(im, (int(540 - im.width / 2), int(1440 - im.height / 2)), im)

def current_sub(t):
    for i, s in enumerate(S):
        nxt = S[i + 1]["start"] if i + 1 < len(S) else TOTAL + 1
        if s["start"] - 0.1 <= t < nxt - 0.05:
            return s["sub"]
    return S[0]["sub"] if t < S[0]["start"] else None

# ---------- sprites cacheados ----------
SP = {
    "gta": text_sprite("GTA VI", 150, WHITE, "Black", glow=PINK, glow_r=22),
    "n34": text_sprite("34", 300, YEL, "Black", glow=(150, 100, 0), glow_r=24),
    "n6": text_sprite("6", 240, YEL, "Black", glow=(150, 100, 0), glow_r=22),
    "q": text_sprite("?", 360, PINK, "Black", glow=(150, 20, 80), glow_r=26),
    "daft": stamp_sprite("DAFT PUNK", (200, 30, 90), 96),
    "keith": text_sprite("KEITH RICHARDS", 104, WHITE, "Black", glow=CYAN, glow_r=16),
}

def title(img, txt, t, t0, y=360, size=92, color=WHITE, glow=CYAN):
    key = ("title", txt, size, color)
    if key not in SP:
        SP[key] = text_sprite(txt, size, color, "Black", glow=glow, glow_r=14)
    paste_c(img, SP[key], 540, y, pop(t, t0))

def chip(img, txt, cx, cy, scale, bg=(30, 12, 52), fg=WHITE, size=50, border=CYAN):
    key = ("chip", txt, size, bg, fg, border)
    if key not in SP:
        f = F(size, "ExtraBold")
        tw, th, b = tsize(txt, f)
        im = Image.new("RGBA", (tw + 72, th + 44), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        rrect(d, (0, 0, im.width - 1, im.height - 1), im.height // 2, fill=bg + (240,), outline=border + (255,), width=5)
        d.text((36 - b[0], 22 - b[1]), txt, font=f, fill=fg)
        SP[key] = im
    paste_c(img, SP[key], cx, cy, scale)

def label(d, txt, cx, cy, size, col):
    f = F(size, "Black"); tw, th, b = tsize(txt, f)
    d.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), txt, font=f, fill=col, stroke_width=3, stroke_fill=(0, 0, 0))


KEYS = ["hook", "promesa", "uno", "dos", "tres", "gym", "cta"]
T = {k: S[i]["start"] - 0.05 for i, k in enumerate(KEYS)}
T["cta"] -= 0.05
STAMP1 = T["hook"] + 2.2           # sello 7 FALLOS
EST_T = T["promesa"] + 0.4
STAMP_ANT = T["uno"] + 0.3
STAMP_TOT = T["gym"] + 1.6
BOX_T = [T["dos"] + 0.4, T["dos"] + 3.2, T["tres"] + 0.4]
KACHING = T["promesa"] + 0.3

SP["n7"] = text_sprite("7", 330, YEL, "Black", stroke=6, glow=(150, 100, 0), glow_r=24)
SP["parche"] = text_sprite("PRIMER PARCHE", 110, WHITE, "Black", glow=CYAN, glow_r=16)
SP["fallos"] = stamp_sprite("FALLOS ARREGLADOS", (30, 140, 70), 70)
SP["mb"] = text_sprite("600 MB", 220, YEL, "Black", stroke=6, glow=(150, 100, 0), glow_r=24)
SP["q"] = text_sprite("?", 260, PINK, "Black", glow=(150, 20, 80), glow_r=26)
SP["raro"] = stamp_sprite("EL MÁS RARO", (200, 30, 90), 80)

def scene_hook(img, t, base_t=0.0, loop=False):
    lt = t - base_t
    paste_c(img, SP["gta"], 540, 360, pop(lt, -1.0) * 0.85)
    paste_c(img, SP["parche"], 540, 520, pop(lt, -1.0))
    paste_c(img, SP["n7"], 540, 790, pop(lt, -1.0) * (1 + 0.04 * math.sin(t * 6)))
    d = ImageDraw.Draw(img)
    # llave inglesa girando junto al 7
    wrench(d, 800, 800, 0.9, t * 2.0)
    st = 0.8 if loop else 1.0
    s = pop(lt, st, 0.25)
    paste_c(img, SP["fallos"], 540, 1080, max(s, 1.0 if not loop else s), rot=-4)

def wrench(d, cx, cy, s, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    def R(x, y): return (cx + (x * ca - y * sa) * s, cy + (x * sa + y * ca) * s)
    d.polygon([R(-90, -16), R(70, -16), R(70, 16), R(-90, 16)], fill=(200, 200, 215))
    d.ellipse([R(60, -42)[0] - 0, 0, 0, 0] if False else (R(80, 0)[0] - 40 * s, R(80, 0)[1] - 40 * s, R(80, 0)[0] + 40 * s, R(80, 0)[1] + 40 * s), fill=(200, 200, 215))
    d.ellipse((R(95, 0)[0] - 18 * s, R(95, 0)[1] - 18 * s, R(95, 0)[0] + 18 * s, R(95, 0)[1] + 18 * s), fill=(20, 8, 36))
    d.ellipse((R(-90, 0)[0] - 26 * s, R(-90, 0)[1] - 26 * s, R(-90, 0)[0] + 26 * s, R(-90, 0)[1] + 26 * s), fill=(200, 200, 215))

def bar_dl(d, cx, cy, p):
    # barra de descarga
    rrect(d, (cx - 380, cy - 40, cx + 380, cy + 40), 40, fill=(20, 10, 36), outline=WHITE, width=6)
    w = 748 * ease_out(p)
    if w > 40: rrect(d, (cx - 374, cy - 34, cx - 374 + w, cy + 34), 34, fill=CYAN)
    label(d, f"{int(100 * ease_out(p))} %", cx, cy + 90, 56, WHITE)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "LA DESCARGA", t, t0, color=CYAN, glow=(0, 90, 140))
    paste_c(img, SP["mb"], 540, 580, pop(t, t0 + 0.2) * (1 + 0.03 * math.sin(t * 6)))
    c = pop(t, EST_T, 0.22)
    if c > 0: chip(img, "EN PS5 · NOTAS OFICIALES", 540, 760, c, size=46)
    d = ImageDraw.Draw(img)
    bar_dl(d, 540, 900, prog(t, t0 + 0.3, 2.4))
    c = pop(t, t0 + 2.6, 0.22)
    if c > 0:
        chip(img, "ESPERA EL ÚLTIMO ARREGLO", 540, 1130, c, bg=(60, 10, 20), fg=WHITE, border=RED, size=48)

def num_badge(img, n, t, t0):
    key = ("badge", n)
    if key not in SP: SP[key] = stamp_sprite(n, (30, 140, 70), 90)
    paste_c(img, SP[key], 115, 360, pop(t, t0) * 0.75, rot=-6)

def scene_uno(img, t):
    t0 = T["uno"]
    num_badge(img, "1", t, t0)
    title(img, "CIERRES", t, t0, size=110, color=RED, glow=(140, 0, 20))
    d = ImageDraw.Draw(img)
    # pantalla que se apaga y luego queda arreglada
    rrect(d, (240, 560, 840, 940), 30, fill=(20, 10, 36), outline=WHITE, width=8)
    p = prog(t, t0 + 0.4, 1.4)
    if p < 1:
        h = 170 * (1 - ease_out(p)) + 4
        d.rectangle((260, 750 - h, 820, 750 + h), fill=CYAN)
    else:
        label(d, "ERROR", 540, 750, 110, RED)
    c = pop(t, t0 + 2.0, 0.22)
    if c > 0: chip(img, "✓ ARREGLADO", 540, 1100, c, bg=(0, 60, 30), fg=GRN, border=GRN, size=54)

def phone(d, cx, cy, ring):
    rrect(d, (cx - 120, cy - 220, cx + 120, cy + 220), 36, fill=(20, 10, 36), outline=WHITE, width=8)
    rrect(d, (cx - 95, cy - 180, cx + 95, cy + 170), 16, fill=(40, 20, 70))
    label(d, "...", cx, cy - 20, 90, WHITE)
    for k in range(3):
        r = 140 + k * 40 + 20 * math.sin(ring * 8 + k)
        d.arc((cx - r, cy - r, cx + r, cy + r), -40, 40, fill=PINK, width=8)

def cloud(d, cx, cy, s):
    for dx, dy, r in ((-60, 10, 60), (10, -25, 75), (80, 15, 55)):
        d.ellipse((cx + (dx - r) * s, cy + (dy - r) * s, cx + (dx + r) * s, cy + (dy + r) * s), fill=(200, 200, 220))
    d.rectangle((cx - 110 * s, cy + 10 * s, cx + 130 * s, cy + 70 * s), fill=(200, 200, 220))

def scene_dos(img, t):
    t0 = T["dos"]
    num_badge(img, "2", t, t0)
    title(img, "LLAMADAS", t, t0, size=110, color=PINK, glow=(150, 20, 80))
    d = ImageDraw.Draw(img)
    clima_t = t0 + 3.0
    if t < clima_t:
        phone(d, 540, 790, t)
        c = pop(t, t0 + 1.2, 0.22)
        if c > 0: chip(img, "MISIONES TRABADAS", 540, 1110, c, bg=(60, 10, 20), fg=WHITE, border=RED, size=50)
    else:
        p = pop(t, clima_t, 0.3)
        cloud(d, 540 + 30 * math.sin(t * 2), 760, 1.3 * p)
        c = pop(t, clima_t + 0.3, 0.22)
        if c > 0: chip(img, "+ CLIMA PEGADO", 540, 1060, c, bg=(0, 50, 70), fg=CYAN, border=CYAN, size=54)

def star(d, cx, cy, r, col):
    pts = []
    for k in range(10):
        a = -math.pi / 2 + k * math.pi / 5
        rr = r if k % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=col, outline=WHITE)

def scene_tres(img, t):
    t0 = T["tres"]
    num_badge(img, "3", t, t0)
    title(img, "BÚSQUEDA", t, t0, size=110, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    for k in range(5):
        on = prog(t, t0 + 0.3 + k * 0.25, 0.2)
        col = YEL if on > 0.5 else (70, 50, 90)
        blink = (math.sin(t * 12) > 0) and on > 0.5
        star(d, 220 + k * 160, 760, 70 if not blink else 76, col)
    c = pop(t, t0 + 1.8, 0.22)
    if c > 0: chip(img, "NO SE QUITABA", 540, 1000, c, bg=(60, 10, 20), fg=WHITE, border=RED, size=54)

def scene_gym(img, t):
    t0 = T["gym"]
    s = pop(t, t0, 0.25)
    paste_c(img, SP["raro"], 540, 370, s, rot=-4)
    d = ImageDraw.Draw(img)
    # barra de peso muerto que tiembla y no sube
    y = 860 - 18 * abs(math.sin(t * 9)) * (t > t0 + 0.6)
    d.rectangle((150, y - 12, 930, y + 12), fill=(210, 210, 225))
    for x in (200, 250, 830, 880):
        rrect(d, (x - 22, y - 130, x + 22, y + 130), 10, fill=(30, 30, 40) if x in (200, 880) else RED, outline=WHITE, width=4)
    d.rectangle((120, 1000, 960, 1015), fill=(90, 60, 120))
    c = pop(t, t0 + 1.0, 0.22)
    if c > 0: chip(img, "GIMNASIO", 540, 610, c, size=54)
    c = pop(t, STAMP_TOT, 0.25)
    if c > 0: chip(img, "BARRA INUSABLE", 540, 1130, c, bg=(60, 10, 20), fg=WHITE, border=RED, size=56)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T[k] for k in KEYS[1:]]
STAMP_X3 = STAMP_ANT; STAMP_RES = STAMP_TOT
SCENES = [scene_hook, scene_promesa, scene_uno, scene_dos, scene_tres, scene_gym]

def render(t):
    img = background(t)
    if t < T["promesa"]: dv = 0.4
    elif t < T["cta"]: dv = 0.4 + 0.25 * ease_out(prog(t, T["promesa"], 0.3))
    else: dv = 0.65 - 0.25 * ease_out(prog(t, T["cta"], 0.4))
    dim(img, dv)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t >= T["cta"]: scene_hook(layer, t, base_t=T["cta"], loop=True)
    else:
        idx = max(i for i, k in enumerate(KEYS[:-1]) if i == 0 or t >= T[k])
        SCENES[idx](layer, t)
    dx, dy = shake(t, [STAMP_ANT, STAMP_TOT])
    img.paste(layer, (dx, dy), layer)
    sub = current_sub(t)
    if sub: caption(img, sub)
    fa = flash_alpha(t, [STAMP_TOT])
    if fa > 0:
        img.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(100 * fa))))
    return img.convert("RGB")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "render"
    if mode == "preview":
        times = [float(x) for x in sys.argv[2].split(",")]
        thumbs = []
        for tt in times:
            im = render(tt)
            th_ = im.resize((360, 640))
            ImageDraw.Draw(th_).text((10, 10), f"{tt:.1f}s", font=F(30), fill=YEL, stroke_width=3, stroke_fill=(0, 0, 0))
            thumbs.append(th_)
        cols = 3
        rows = math.ceil(len(thumbs) / cols)
        sheet = Image.new("RGB", (360 * cols, 640 * rows), (0, 0, 0))
        for i, th_ in enumerate(thumbs):
            sheet.paste(th_, ((i % cols) * 360, (i // cols) * 640))
        sheet.save(f"{BASE}/{sys.argv[3] if len(sys.argv) > 3 else 'sheet.png'}")
        print("ok")
    else:
        n = int(math.ceil(TOTAL * FPS))
        p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                              "-i", f"{BASE}/mix.wav", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
                              "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", f"{BASE}/video.mp4"], stdin=subprocess.PIPE)
        for i in range(n):
            p.stdin.write(render(i / FPS).tobytes())
        p.stdin.close(); p.wait()
        print("render ok", n, "frames")
