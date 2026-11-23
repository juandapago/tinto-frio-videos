"""Video vertical GTA VI: el colegio que mandó un bus por los que faltaron. Animación procedural original con Pillow."""
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

def vinyl(d, cx, cy, r, ang, lab=PINK):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(14, 10, 20), outline=(90, 80, 110), width=4)
    for k in range(3, 9):
        rr = r * k / 10
        d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), outline=(45, 40, 60), width=2)
    # brillo que gira
    for da in (0, math.pi):
        a = ang + da
        d.line([(cx + r * 0.35 * math.cos(a), cy + r * 0.35 * math.sin(a)), (cx + r * 0.92 * math.cos(a), cy + r * 0.92 * math.sin(a))], fill=(130, 120, 160), width=5)
    rl = r * 0.3
    d.ellipse((cx - rl, cy - rl, cx + rl, cy + rl), fill=lab)
    d.ellipse((cx - 8, cy - 8, cx + 8, cy + 8), fill=(14, 10, 20))

def notes(img, d, t, t0, n=6, y0=1150, y1=480):
    r = random.Random(9)
    for i in range(n):
        x = r.randrange(170, 910); sp = r.uniform(140, 220); ph = r.uniform(0, 4)
        y = y0 - ((t - t0 + ph) * sp) % (y0 - y1)
        s = r.uniform(0.6, 1.0)
        col = (CYAN, PINK, YEL)[i % 3]
        d.ellipse((x - 22 * s, y - 16 * s, x + 22 * s, y + 16 * s), fill=col)
        d.line([(x + 20 * s, y), (x + 20 * s, y - 80 * s)], fill=col, width=int(8 * s))
        d.line([(x + 20 * s, y - 80 * s), (x + 46 * s, y - 60 * s)], fill=col, width=int(8 * s))

KEYS = ["hook", "promesa", "bus", "premios", "examenes", "multa", "mayor", "cta"]
T = {k: S[i]["start"] - 0.05 for i, k in enumerate(KEYS)}
T["cta"] -= 0.05
STAMP1 = T["hook"] + 3.0
STAMP_ANT = T["multa"] + 1.4      # golpe £80
STAMP_TOT = T["mayor"] + 1.6      # sello 18+
EST_T = T["bus"] + 2.8
BOX_T = [T["premios"] + 0.4 + i * 0.35 for i in range(4)]
KACHING = T["premios"] + 2.2

SP["n18"] = text_sprite("18+", 300, RED, "Black", glow=(140, 0, 20), glow_r=24)
SP["p80"] = text_sprite("£80", 260, YEL, "Black", glow=(150, 100, 0), glow_r=22)
SP["q"] = text_sprite("?", 300, PINK, "Black", glow=(150, 20, 80), glow_r=26)

def bus(img, cx, cy, s=1.0, t=0.0):
    w_, h_ = 640 * s, 300 * s
    b = Image.new("RGBA", (int(w_) + 40, int(h_) + 120), (0, 0, 0, 0)); d = ImageDraw.Draw(b)
    rrect(d, (10, 10, w_ + 10, h_), 40 * s, fill=(255, 200, 40), outline=WHITE, width=6)
    for k in range(4):
        x0 = 40 * s + k * 140 * s
        rrect(d, (x0, 45 * s, x0 + 110 * s, 140 * s), 14, fill=(60, 180, 230))
    rrect(d, (w_ - 100 * s, 45 * s, w_ - 20 * s, h_ - 40 * s), 12, fill=(60, 180, 230))
    d.rectangle((10, 175 * s, w_ + 10, 200 * s), fill=(30, 20, 40))
    for wx in (140 * s, w_ - 140 * s):
        r = 55 * s; cyw = h_ + 5
        d.ellipse((wx - r, cyw - r, wx + r, cyw + r), fill=(25, 20, 30), outline=(150, 150, 160), width=6)
        a = t * 10
        d.line([(wx + r * 0.6 * math.cos(a), cyw + r * 0.6 * math.sin(a)), (wx - r * 0.6 * math.cos(a), cyw - r * 0.6 * math.sin(a))], fill=(150, 150, 160), width=6)
    d.ellipse((w_ - 10, h_ - 80 * s, w_ + 20, h_ - 50 * s), fill=(255, 250, 200))
    paste_c(img, b, cx, cy + 4 * math.sin(t * 14))

def gift(d, cx, cy, s, col):
    if s <= 0.1: return
    w_ = 110 * s
    rrect(d, (cx - w_, cy - w_ * 0.8, cx + w_, cy + w_), 12, fill=col, outline=WHITE, width=4)
    d.rectangle((cx - 14 * s, cy - w_ * 0.8, cx + 14 * s, cy + w_), fill=WHITE)
    d.rectangle((cx - w_, cy - w_ * 0.8 - 30 * s, cx + w_, cy - w_ * 0.8 + 10 * s), fill=col, outline=WHITE, width=4)
    d.ellipse((cx - 60 * s, cy - w_ - 50 * s, cx, cy - w_ - 5 * s), outline=WHITE, width=int(10 * s) + 1)
    d.ellipse((cx, cy - w_ - 50 * s, cx + 60 * s, cy - w_ - 5 * s), outline=WHITE, width=int(10 * s) + 1)

def scene_hook(img, t, base_t=0.0, loop=False):
    lt = t - base_t
    paste_c(img, SP["gta"], 540, 360)
    paste_c(img, text_sprite("VS. EL COLEGIO", 92, YEL, "Black", glow=(150, 100, 0), glow_r=14) if "vs" not in SP else SP["vs"], 540, 500)
    x = 540 + (60 * math.sin(lt * 1.5) if not loop else 0)
    bus(img, x, 830, 1.0, lt)
    if not loop:
        chip(img, "INGLATERRA · 19 NOV", 540, 1075, 1.0, bg=(30, 12, 52), fg=WHITE, border=CYAN, size=50)
        s = pop(lt, STAMP1, 0.18)
        if s > 0: chip(img, "A BUSCAR AL QUE FALTÓ", 540, 1180, s, bg=(60, 10, 20), fg=RED, border=RED, size=48)
    else:
        p = pop(lt, 0.4, 0.25)
        if p > 0: chip(img, "¿TU COLEGIO LO HARÍA?", 540, 1200, p, bg=(60, 40, 0), fg=YEL, border=YEL, size=50)
        p = pop(lt, 0.9, 0.25)
        if p > 0: chip(img, "SÍGUEME PARA MÁS", 540, 1090, p * (1 + 0.04 * math.sin(lt * 8)), bg=(60, 10, 40), border=PINK, size=52)
SP["vs"] = text_sprite("VS. EL COLEGIO", 92, YEL, "Black", glow=(150, 100, 0), glow_r=14)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "EL ÚLTIMO DATO", t, t0, size=90, glow=PINK)
    paste_c(img, SP["q"], 540 + 20 * math.sin((t - t0) * 4), 780, pop(t, t0 + 0.1, 0.3) * (1 + 0.06 * math.sin((t - t0) * 7)), rot=8 * math.sin((t - t0) * 3))
    c = pop(t, t0 + 1.0, 0.25)
    if c > 0: chip(img, "ALUMNOS EN PROBLEMAS", 540, 1150, c * (1 + 0.04 * math.sin(t * 8)), bg=(60, 10, 40), border=PINK, size=50)

def scene_bus(img, t):
    t0 = T["bus"]; lt = t - t0
    title(img, "BIRMINGHAM", t, t0, color=CYAN, glow=(0, 90, 140))
    d = ImageDraw.Draw(img)
    # casas genéricas
    for k in range(4):
        hx = 170 + k * 250
        d.rectangle((hx - 80, 960, hx + 80, 1100), fill=(70, 30, 100), outline=(150, 90, 200), width=4)
        d.polygon([(hx - 100, 960), (hx, 880), (hx + 100, 960)], fill=(110, 40, 140))
        d.rectangle((hx - 25, 1030, hx + 25, 1100), fill=(255, 200, 80) if (int(lt * 2) + k) % 3 == 0 else (40, 20, 60))
    bx = -350 + ((lt * 260) % 1780)
    bus(img, bx, 760, 0.8, lt)
    c = pop(t, t0 + 0.4, 0.25)
    if c > 0: chip(img, "DÍA DEL LANZAMIENTO", 540, 520, c, bg=(30, 12, 52), fg=WHITE, border=CYAN, size=48)
    c = pop(t, EST_T, 0.22)
    if c > 0: chip(img, "MINIBÚS DEL COLEGIO", 540, 1210, c, bg=(60, 40, 0), fg=YEL, border=YEL, size=50)

def scene_premios(img, t):
    t0 = T["premios"]
    title(img, "PREMIOS", t, t0, color=GRN, glow=(0, 110, 50))
    d = ImageDraw.Draw(img)
    cols = [PINK, CYAN, GRN, YEL]
    for i, bt in enumerate(BOX_T):
        gift(d, 240 + i * 200, 820 + 20 * math.sin(t * 5 + i), pop(t, bt, 0.25) * 0.9, cols[i])
    c = pop(t, T["premios"] + 1.0, 0.22)
    if c > 0: chip(img, "100% DE ASISTENCIA", 540, 560, c * (1 + 0.03 * math.sin(t * 7)), bg=(10, 60, 30), fg=GRN, border=GRN, size=54)
    c = pop(t, KACHING, 0.22)
    if c > 0: chip(img, "RIFA TODA LA SEMANA", 540, 1100, c, bg=(30, 12, 52), fg=WHITE, border=CYAN, size=48)

def scene_examenes(img, t):
    t0 = T["examenes"]; lt = t - t0
    title(img, "EXÁMENES", t, t0, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    # hoja de examen que se desliza a la derecha
    x = 540 + 160 * ease_out(prog(t, t0 + 1.0, 0.8))
    s = pop(t, t0 + 0.1, 0.3)
    if s > 0.1:
        rrect(d, (x - 220 * s, 600, x + 220 * s, 1100), 20, fill=(245, 240, 255), outline=WHITE, width=4)
        for k in range(7):
            yy = 680 + k * 55
            d.line([(x - 170 * s, yy), (x + 170 * s, yy)], fill=(150, 140, 180), width=6)
        label(d, "A+", x + 120 * s, 650, int(60 * s) + 1, RED)
    if lt > 1.0:
        d.line([(200, 1180), (200 + 680 * ease_out(prog(t, t0 + 1.0, 0.8)), 1180)], fill=YEL, width=14)
    c = pop(t, t0 + 1.8, 0.22)
    if c > 0: chip(img, "SE MOVIERON DE FECHA", 540, 1260 - 60, c, bg=(60, 40, 0), fg=YEL, border=YEL, size=48)

def scene_multa(img, t):
    t0 = T["multa"]
    title(img, "MULTA", t, t0, color=RED, glow=(140, 0, 20))
    d = ImageDraw.Draw(img)
    s = pop(t, STAMP_ANT, 0.25)
    if s > 0: paste_c(img, SP["p80"], 540, 800, s * (1 + 0.03 * math.sin(t * 6)))
    c = pop(t, t0 + 0.4, 0.22)
    if c > 0: chip(img, "FALTAR SIN PERMISO", 540, 560, c, bg=(60, 10, 20), fg=RED, border=RED, size=50)
    c = pop(t, STAMP_ANT + 0.8, 0.22)
    if c > 0: chip(img, "POR NIÑO · DESDE", 540, 1080, c, bg=(30, 12, 52), fg=WHITE, border=CYAN, size=50)

def scene_mayor(img, t):
    t0 = T["mayor"]
    title(img, "LO MÁS LOCO", t, t0, color=RED, glow=(140, 0, 20))
    d = ImageDraw.Draw(img)
    paste_c(img, SP["gta"], 540, 560, pop(t, t0 + 0.2, 0.25) * 0.8)
    s = pop(t, STAMP_TOT, 0.2)
    if s > 0:
        r = 230
        d.ellipse((540 - r, 860 - r, 540 + r, 860 + r), outline=RED, width=18)
        paste_c(img, SP["n18"], 540, 860, s * (1 + 0.04 * math.sin(t * 7)), rot=-6)
    c = pop(t, STAMP_TOT + 1.8, 0.22)
    if c > 0: chip(img, "Y SON ALUMNOS DE COLEGIO", 540, 1190, c, bg=(60, 10, 20), fg=WHITE, border=RED, size=44)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T[k] for k in KEYS[1:]]
STAMP_X3 = STAMP_ANT; STAMP_RES = STAMP_TOT
SCENES = [scene_hook, scene_promesa, scene_bus, scene_premios, scene_examenes, scene_multa, scene_mayor]

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
