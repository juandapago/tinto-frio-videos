"""Video vertical GTA VI: cifra oficial de ventas (Take-Two). Animación procedural original con Pillow."""
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
    if core in ("OFICIAL", "MÁS", "GRANDE"): return GRN
    if "GRATIS" in core: return GRN
    if any(c.isdigit() for c in core) or "$" in core: return YEL
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
    "gta": text_sprite("GTA VI", 230, WHITE, "Black", glow=PINK, glow_r=22),
    "x3": stamp_sprite("ESTIMACIÓN", RED, 92),
    "reservas": stamp_sprite("#1 DE LA HISTORIA", RED, 80),
    "plus": stamp_sprite("+1.490 M", GRN, 96),
    "pre": stamp_sprite("ANTES DE SALIR", (200, 40, 120), 64),
    "gtav": text_sprite("$2.300 M", 130, (200, 200, 220), "Black", glow=CYAN, glow_r=14),
    "est": stamp_sprite("ESTIMACIÓN", (200, 120, 0), 70),
}

def title(img, txt, t, t0, y=250, size=92, color=WHITE, glow=CYAN):
    key = ("title", txt, size, color)
    if key not in SP:
        SP[key] = text_sprite(txt, size, color, "Black", glow=glow, glow_r=14)
    s = pop(t, t0)
    paste_c(img, SP[key], 540, y, s)

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

def warn_icon(d, cx, cy, s=60, col=YEL):
    d.polygon([(cx, cy - s), (cx + s * 1.1, cy + s * 0.8), (cx - s * 1.1, cy + s * 0.8)], fill=col)
    d.rectangle((cx - 7, cy - s * 0.45, cx + 7, cy + s * 0.3), fill=(20, 10, 30))
    d.ellipse((cx - 8, cy + s * 0.45, cx + 8, cy + s * 0.61), fill=(20, 10, 30))

def check(d, cx, cy, s, col):
    d.line([(cx - s, cy), (cx - s * 0.3, cy + s * 0.7), (cx + s, cy - s * 0.8)], fill=col, width=12, joint="curve")

def cross(d, cx, cy, s, col):
    d.line([(cx - s, cy - s), (cx + s, cy + s)], fill=col, width=12)
    d.line([(cx - s, cy + s), (cx + s, cy - s)], fill=col, width=12)

# ---------- escenas ----------
T = {
    "promesa": S[1]["start"] - 0.05,
    "copias": S[2]["start"] - 0.05,
    "dinero": S[3]["start"] - 0.05,
    "comp": S[4]["start"] - 0.05,
    "res": S[5]["start"] - 0.05,
    "ojo": S[6]["start"] - 0.05,
    "cta": S[7]["start"] - 0.1,
}
STAMP1 = 2.2
KACHING = T["dinero"] + 1.3
STAMP_X3 = T["comp"] + 1.6
STAMP_RES = T["res"] + 1.2
EST_T = T["ojo"] + 0.6
BOX_T = [T["copias"] + 0.4 + i * 0.35 for i in range(10)]

def fmt(v): return f"{v:,}".replace(",", ".")

def scene_hook(img, t, base_t=0.0, loop=False):
    lt = t - base_t
    paste_c(img, SP["gta"], 540, 400, pop(lt, 0.02 if not loop else 0.0, 0.25))
    if not loop:
        c = pop(lt, 0.6, 0.25)
        if c > 0: chip(img, "AYER DIJIMOS", 540, 610, c, bg=(60, 40, 0), fg=YEL, border=YEL, size=50)
        v = pop(lt, 1.3, 0.25)
        if v > 0: paste_c(img, SP["gtav"], 540, 800, v * 0.8)
        s = pop(lt, STAMP1, 0.18)
        if s > 0:
            paste_c(img, SP["x3"], 540, 1000, s * (1.0 + 0.6 * max(0, 1 - prog(lt, STAMP1, 0.12))) * (1 + 0.04 * math.sin(lt * 9)), rot=-7)
    else:
        p = pop(lt, 0.4, 0.25)
        if p > 0: chip(img, "¿YA LO TIENES?", 540, 700, p, bg=(60, 40, 0), fg=YEL, border=YEL, size=52)
        p = pop(lt, 0.9, 0.25)
        if p > 0: chip(img, "SÍGUEME PARA MÁS", 540, 900, p * (1 + 0.04 * math.sin(lt * 8)), bg=(60, 10, 40), border=PINK, size=56)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "NOS QUEDAMOS", t, t0, y=260, size=96, glow=PINK)
    title(img, "CORTOS", t, t0 + 0.15, y=390, size=84, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    p = pop(t, t0 + 0.3, 0.3)
    if p > 0:
        dx = int(12 * math.sin(t * 40)) if t > t0 + 1.0 else 0
        cx, cy = 540 + dx, 800
        w_, h_ = 200 * p, 260 * p
        rrect(d, (cx - w_, cy - h_ / 1.3, cx + w_, cy + h_ / 1.3), 30, fill=(90, 60, 10), outline=YEL, width=8)
        f = F(int(260 * p) + 1, "Black")
        tw, th, b = tsize("?", f)
        d.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), "?", font=f, fill=YEL)

def box_icon(d, cx, cy, s, col):
    rrect(d, (cx - s, cy - s * 1.3, cx + s, cy + s * 1.3), 10, fill=col, outline=WHITE, width=4)
    d.rectangle((cx - s + 10, cy - s * 1.3 + 10, cx + s - 10, cy - s * 0.5), fill=(255, 255, 255))
    d.ellipse((cx - s * 0.4, cy - s * 0.1, cx + s * 0.4, cy + s * 0.7), outline=WHITE, width=5)

def scene_copias(img, t):
    t0 = T["copias"]
    title(img, "CIFRA OFICIAL", t, t0, y=240, size=92, glow=CYAN)
    d = ImageDraw.Draw(img)
    for i, bt in enumerate(BOX_T):
        p = ease_out(prog(t, bt, 0.3))
        if p <= 0: continue
        col = [(70, 140, 255), (255, 61, 140), (170, 90, 255)][i % 3]
        x = 200 + (i % 5) * 170; y = 1130 - (i // 5) * 190 - (1 - p) * 600
        box_icon(d, x, y, 55, col)
    v = int(32500000 * ease_out(prog(t, t0 + 0.3, 2.6)))
    txt = fmt(v)
    f = F(118, "Black")
    tw, th, b = tsize(txt, f)
    d.text((540 - tw / 2 - b[0], 450 - b[1]), txt, font=f, fill=YEL, stroke_width=4, stroke_fill=(0, 0, 0))
    e = pop(t, t0 + 1.2, 0.25)
    if e > 0: paste_c(img, SP["pre"], 540, 680, e, rot=-4)
    c = pop(t, t0 + 1.6, 0.25)
    if c > 0: chip(img, "COPIAS · Fuente: Take-Two", 540, 820, c, size=42)

COINS = [(random.Random(i).randrange(120, 960), random.Random(i + 99).uniform(0, 1), random.Random(i + 7).uniform(0.8, 1.3)) for i in range(14)]

def scene_dinero(img, t):
    t0 = T["dinero"]
    d = ImageDraw.Draw(img)
    for x, ph, sp in COINS:
        y = ((t - t0) * 520 * sp + ph * 1600) % 1700 - 100
        r = 34
        d.ellipse((x - r, y - r, x + r, y + r), fill=(245, 190, 40), outline=(255, 235, 140), width=5)
        d.text((x - 12, y - 25), "$", font=F(40, "Black"), fill=(150, 100, 0))
    dim(img, 0.4)
    title(img, "PRIMER DÍA", t, t0, y=260, size=100, color=GRN, glow=(20, 140, 70))
    d = ImageDraw.Draw(img)
    v = int(3790 * ease_out(prog(t, t0 + 0.2, 1.1)))
    txt = "$" + fmt(v)
    f = F(210, "Black")
    tw, th, b = tsize(txt, f)
    s = 1 + 0.06 * max(0, 1 - prog(t, KACHING, 0.25))
    d.text((540 - tw / 2 - b[0], 600 - th / 2 - b[1]), txt, font=f, fill=YEL, stroke_width=5, stroke_fill=(0, 0, 0))
    c = pop(t, t0 + 0.5, 0.25)
    if c > 0: chip(img, "MILLONES DE DÓLARES", 540, 830, c * s, bg=(10, 60, 30), fg=GRN, border=GRN, size=52)

def scene_comp(img, t):
    t0 = T["comp"]
    title(img, "ESTIMADO vs REAL", t, t0, y=240, size=96, glow=PINK)
    d = ImageDraw.Draw(img)
    base = 1150; maxh = 680
    for i, (lbl, yr, val, col, td) in enumerate([("ESTIMADO", "analistas", 2300, (120, 130, 170), 0.1), ("OFICIAL", "Take-Two", 3790, GRN, 0.7)]):
        p = ease_out(prog(t, t0 + td, 1.0))
        if p <= 0: continue
        cx = 330 + i * 420
        h_ = maxh * val / 3790 * p
        rrect(d, (cx - 120, base - h_, cx + 120, base), 16, fill=col, outline=WHITE, width=5)
        f = F(64, "Black")
        txt = f"${fmt(int(val * p))}M"
        tw, th, b = tsize(txt, f)
        d.text((cx - tw / 2 - b[0], base - h_ - 90 - b[1]), txt, font=f, fill=YEL, stroke_width=3, stroke_fill=(0, 0, 0))
        for k, s_ in enumerate((lbl, yr)):
            fn = F(52 if k == 0 else 40, "Black" if k == 0 else "ExtraBold")
            tw, th, b = tsize(s_, fn)
            d.text((cx - tw / 2 - b[0], base + 20 + k * 62 - b[1]), s_, font=fn, fill=WHITE)
    s = pop(t, STAMP_X3, 0.18)
    if s > 0: paste_c(img, SP["plus"], 330, 520, s * 0.8 * (1 + 0.5 * max(0, 1 - prog(t, STAMP_X3, 0.1))), rot=-8)

def scene_res(img, t):
    t0 = T["res"]
    title(img, "RÉCORD", t, t0, y=240, size=150, color=YEL, glow=(160, 110, 0))
    s_ = pop(t, STAMP_RES, 0.18)
    if s_ > 0: paste_c(img, SP["reservas"], 540, 430, s_ * (1 + 0.5 * max(0, 1 - prog(t, STAMP_RES, 0.1))), rot=-6)
    d = ImageDraw.Draw(img)
    p = pop(t, t0 + 0.4, 0.35)
    if p > 0:
        cx, cy = 540, 820 + int(10 * math.sin(t * 4))
        k = p
        d.ellipse((cx - 150 * k, cy - 170 * k, cx + 150 * k, cy + 90 * k), fill=YEL, outline=WHITE, width=6)
        d.rectangle((cx - 170 * k, cy - 170 * k, cx + 170 * k, cy - 80 * k), fill=YEL)
        d.rectangle((cx - 25 * k, cy + 80 * k, cx + 25 * k, cy + 170 * k), fill=YEL)
        rrect(d, (cx - 120 * k, cy + 160 * k, cx + 120 * k, cy + 220 * k), 10, fill=(200, 150, 30), outline=WHITE, width=4)
        f = F(max(1, int(120 * k)), "Black"); tw, th, b = tsize("1", f)
        d.text((cx - tw / 2 - b[0], cy - 100 * k - b[1]), "1", font=f, fill=(150, 90, 0))
    c = pop(t, t0 + 2.6, 0.25)
    if c > 0: chip(img, "MÁS QUE CUALQUIER ESTRENO", 540, 1150, c * (1 + 0.03 * math.sin(t * 8)), bg=(10, 60, 30), fg=GRN, border=GRN, size=44)

def scene_ojo(img, t):
    t0 = T["ojo"]
    title(img, "METACRITIC", t, t0, y=250, size=110, glow=CYAN)
    d = ImageDraw.Draw(img)
    p = pop(t, EST_T, 0.25)
    if p > 0:
        cx, cy = 540, 640
        w_ = 210 * p
        rrect(d, (cx - w_, cy - w_, cx + w_, cy + w_), 40, fill=(30, 170, 80), outline=WHITE, width=8)
        f = F(max(1, int(260 * p)), "Black"); tw, th, b = tsize("99", f)
        d.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), "99", font=f, fill=WHITE, stroke_width=4, stroke_fill=(0, 60, 20))
    for k in range(5):
        q = pop(t, EST_T + 0.6 + k * 0.15, 0.2)
        if q <= 0: continue
        sx = 300 + k * 120; sy = 960
        pts = [(sx + 46 * q * math.cos(math.radians(-90 + 36 * j)) * (1 if j % 2 == 0 else 0.45), sy + 46 * q * math.sin(math.radians(-90 + 36 * j)) * (1 if j % 2 == 0 else 0.45)) for j in range(10)]
        d.polygon(pts, fill=YEL)
    c = pop(t, t0 + 2.6, 0.25)
    if c > 0: chip(img, "MEJOR CALIFICADO DE LA HISTORIA", 540, 1130, c, bg=(10, 60, 30), fg=GRN, border=GRN, size=40)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T["promesa"], T["copias"], T["dinero"], T["comp"], T["res"], T["ojo"], T["cta"]]

def render(t):
    img = background(t)
    if t < T["promesa"]:
        dv = 0.15
    elif t < T["cta"]:
        dv = 0.15 + 0.5 * ease_out(prog(t, T["promesa"], 0.3))
    else:
        dv = 0.65 - 0.5 * ease_out(prog(t, T["cta"], 0.4))
    dim(img, dv)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t < T["promesa"]: scene_hook(layer, t)
    elif t < T["copias"]: scene_promesa(layer, t)
    elif t < T["dinero"]: scene_copias(layer, t)
    elif t < T["comp"]: scene_dinero(layer, t)
    elif t < T["res"]: scene_comp(layer, t)
    elif t < T["ojo"]: scene_res(layer, t)
    elif t < T["cta"]: scene_ojo(layer, t)
    else: scene_hook(layer, t, base_t=T["cta"], loop=True)
    dx, dy = shake(t, [STAMP1, STAMP_X3, STAMP_RES, KACHING])
    img.paste(layer, (dx, dy), layer)
    sub = current_sub(t)
    if sub: caption(img, sub)
    fa = flash_alpha(t, [STAMP1, STAMP_X3] + SCENE_CHANGES)
    if fa > 0:
        img.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(110 * fa))))
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
