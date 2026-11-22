"""Video vertical GTA VI: crítica 99 vs jugadores 4,9 (review bombing en Metacritic). Animación procedural original con Pillow."""
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
    if core in ("ZELDA",): return RED
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
    "gta": text_sprite("GTA VI", 170, WHITE, "Black", glow=PINK, glow_r=22),
    "n99": text_sprite("99", 260, GRN, "Black", glow=(0, 120, 50), glow_r=22),
    "n49": text_sprite("4,9", 260, RED, "Black", glow=(140, 0, 20), glow_r=22),
    "zero": text_sprite("0", 150, RED, "Black", glow=(140, 0, 20), glow_r=14),
    "rumor": stamp_sprite("SE DICE", (200, 110, 0), 84),
    "fps": text_sprite("30 FPS", 200, RED, "Black", glow=(140, 0, 20), glow_r=20),
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

KEYS = ["hook", "promesa", "critica", "quejas", "red", "zelda", "guerra", "cta"]
T = {k: S[i]["start"] - 0.05 for i, k in enumerate(KEYS)}
T["cta"] -= 0.05
STAMP1 = T["hook"] + 2.9          # aparece el 4,9 con golpe ("los jugadores")
STAMP_ANT = T["quejas"] + 2.0     # golpe 30 FPS
STAMP_TOT = T["zelda"] + 1.2      # sello SE DICE
EST_T = T["guerra"] + 0.4
BOX_T = [T["critica"] + 0.6 + i * 0.25 for i in range(6)]
KACHING = T["critica"] + 2.6

def score_card(img, d, cx, cy, who, spr, col, s, lt):
    if s <= 0: return
    w_, h_ = 195 * s, 240 * s
    rrect(d, (cx - w_, cy - h_, cx + w_, cy + h_), 34, fill=(24, 10, 44, 235), outline=col, width=8)
    label(d, who, cx, cy - 165 * s, int(46 * s) + 1, WHITE)
    paste_c(img, spr, cx, cy + 40 * s, s * 0.7 * (1 + 0.03 * math.sin(lt * 6)))

def scene_hook(img, t, base_t=0.0, loop=False):
    lt = t - base_t
    d = ImageDraw.Draw(img)
    paste_c(img, SP["gta"], 540, 360)
    # tarjetas: ambas visibles desde el fotograma 0 (gancho completo)
    score_card(img, d, 310, 760, "CRÍTICA", SP["n99"], GRN, 1.0, lt)
    score_card(img, d, 770, 760, "JUGADORES", SP["n49"], RED, 1.0, lt)
    label(d, "VS", 540, 760, 60, YEL)
    if not loop:
        s = pop(lt, STAMP1, 0.18)
        if s > 0: chip(img, "¿QUIÉN TIENE LA RAZÓN?", 540, 1200, s, bg=(60, 40, 0), fg=YEL, border=YEL, size=52)
    else:
        p = pop(lt, 0.4, 0.25)
        if p > 0: chip(img, "¿TÚ QUÉ NOTA LE DAS?", 540, 1180, p, bg=(60, 40, 0), fg=YEL, border=YEL, size=52)
        p = pop(lt, 0.9, 0.25)
        if p > 0: chip(img, "SÍGUEME PARA MÁS", 540, 1290, p * (1 + 0.04 * math.sin(lt * 8)), bg=(60, 10, 40), border=PINK, size=52)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "¿QUIÉN TIENE RAZÓN?", t, t0, size=86, glow=PINK)
    d = ImageDraw.Draw(img)
    # balanza que se mueve
    ang = math.sin((t - t0) * 2.4) * 0.25
    cx, cy = 540, 760
    d.line([(cx, cy), (cx, cy + 300)], fill=WHITE, width=14)
    d.rectangle((cx - 120, cy + 300, cx + 120, cy + 320), fill=WHITE)
    lx, ly = cx - 320 * math.cos(ang), cy - 320 * math.sin(ang)
    rx, ry = cx + 320 * math.cos(ang), cy + 320 * math.sin(ang)
    d.line([(lx, ly), (rx, ry)], fill=WHITE, width=12)
    for x, y, txt, col in ((lx, ly, "99", GRN), (rx, ry, "4,9", RED)):
        d.line([(x, y), (x - 70, y + 120)], fill=WHITE, width=5); d.line([(x, y), (x + 70, y + 120)], fill=WHITE, width=5)
        d.chord((x - 100, y + 60, x + 100, y + 180), 0, 180, fill=col)
        label(d, txt, x, y + 70, 64, WHITE)
    c = pop(t, t0 + 1.2, 0.25)
    if c > 0: chip(img, "ESPERA LA ÚLTIMA RAZÓN", 540, 1200, c * (1 + 0.04 * math.sin(t * 8)), bg=(60, 10, 40), border=PINK, size=48)

def scene_critica(img, t):
    t0 = T["critica"]
    title(img, "LA CRÍTICA", t, t0, color=GRN, glow=(0, 120, 50))
    paste_c(img, SP["n99"], 540, 640, pop(t, t0 + 0.1, 0.3))
    d = ImageDraw.Draw(img)
    # reseñas que se apilan (hojitas)
    n = int(clamp((t - t0 - 0.5) / 2.2) * 152)
    for i in range(min(n, 152)):
        x = 160 + (i % 19) * 40; y = 860 + (i // 19) * 36
        rrect(d, (x, y, x + 30, y + 28), 5, fill=(220, 255, 230), outline=GRN, width=2)
    if n > 0: label(d, f"{n} RESEÑAS", 540, 1210, 64, YEL)

def scene_quejas(img, t):
    t0 = T["quejas"]
    title(img, "LOS JUGADORES", t, t0, color=RED, glow=(140, 0, 20))
    d = ImageDraw.Draw(img)
    s = pop(t, t0 + 0.3, 0.3)
    paste_c(img, SP["fps"], 540, 640, s * (1 + 0.5 * max(0, 1 - prog(t, STAMP_ANT, 0.12)) if t > STAMP_ANT else s))
    # tortuga genérica = ritmo lento, camina
    p = pop(t, t0 + 2.6, 0.3)
    if p > 0:
        x = 300 + ((t - t0 - 2.6) * 60) % 480; y = 960
        d.ellipse((x - 110 * p, y - 70 * p, x + 110 * p, y + 40 * p), fill=(60, 160, 80), outline=(20, 80, 30), width=6)
        d.ellipse((x + 90 * p, y - 40 * p, x + 160 * p, y + 10 * p), fill=(90, 190, 100))
        for k in (-70, 50):
            lg = 12 * math.sin(t * 8 + k)
            d.rectangle((x + k * p + lg, y + 30 * p, x + (k + 26) * p + lg, y + 70 * p), fill=(90, 190, 100))
        chip(img, "RITMO LENTO", 540, 1180, p, bg=(60, 10, 20), fg=RED, border=RED, size=50)

def scene_red(img, t):
    t0 = T["red"]
    title(img, "¿ESTO ES GTA?", t, t0, size=96, glow=PINK)
    d = ImageDraw.Draw(img)
    # dos etiquetas, la flecha oscila hacia "RED DEAD"
    for cx, txt, col, tt in ((300, "RED DEAD", (200, 60, 40), t0 + 0.4), (780, "GTA", PINK, t0 + 0.6)):
        s = pop(t, tt, 0.25)
        if s > 0:
            rrect(d, (cx - 200 * s, 640 - 90 * s, cx + 200 * s, 640 + 90 * s), 26, fill=col + (255,), outline=WHITE, width=6)
            label(d, txt, cx, 640, int(66 * s) + 1, WHITE)
    a = 0.6 + 0.3 * math.sin((t - t0) * 5)
    p = ease_out(prog(t, t0 + 1.0, 0.5))
    if p > 0:
        ang = math.pi / 2 + a * p
        ex, ey = 540 + 260 * math.cos(ang + math.pi / 2 * 0) * -1, 1000 - 260 * math.sin(ang) * 0.6
        d.line([(540, 1000), (540 - 240 * math.sin(a * p) * 1.0, 1000 - 220)], fill=YEL, width=16)
        d.ellipse((510, 970, 570, 1030), fill=YEL)
    c = pop(t, t0 + 1.8, 0.25)
    if c > 0: chip(img, "“SE SIENTE COMO RED DEAD”", 540, 1200, c, bg=(30, 12, 52), fg=CYAN, border=CYAN, size=44)

def scene_zelda(img, t):
    t0 = T["zelda"]
    title(img, "LLUVIA DE CEROS", t, t0, color=RED, glow=(140, 0, 20))
    d = ImageDraw.Draw(img)
    r = random.Random(5)
    for i in range(14):
        x = r.randrange(160, 920); sp = r.uniform(250, 420); ph = r.uniform(0, 3)
        y = 480 + ((t - t0 + ph) * sp) % 700
        sc = r.uniform(0.35, 0.7)
        paste_c(img, SP["zero"], x, y, sc * pop(t, t0 + 0.1 * i, 0.2))
    s = pop(t, STAMP_TOT, 0.18)
    if s > 0: paste_c(img, SP["rumor"], 540, 1000, s * (1 + 0.5 * max(0, 1 - prog(t, STAMP_TOT, 0.1))), rot=-7)
    c = pop(t, STAMP_TOT + 1.0, 0.25)
    if c > 0: chip(img, "¿FANS DE ZELDA?", 540, 1180, c * (1 + 0.04 * math.sin(t * 8)), bg=(60, 40, 0), fg=YEL, border=YEL, size=54)

def scene_guerra(img, t):
    t0 = T["guerra"]
    title(img, "GUERRA DE NOTAS", t, t0, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    for cx, txt, col in ((260, "GTA", PINK), (820, "ZELDA", GRN)):
        rrect(d, (cx - 170, 600, cx + 170, 760), 26, fill=col + (255,), outline=WHITE, width=6)
        label(d, txt, cx, 680, 64, WHITE)
    # el cero va y viene en arco
    ph = ((t - t0) * 0.9) % 2
    p = ph if ph < 1 else 2 - ph
    x = 260 + 560 * p; y = 880 - 220 * math.sin(math.pi * p)
    paste_c(img, SP["zero"], x, y, 0.8)
    c = pop(t, t0 + 1.0, 0.25)
    if c > 0: chip(img, "CEROS DE IDA Y VUELTA", 540, 1180, c, bg=(60, 10, 20), fg=RED, border=RED, size=48)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T[k] for k in KEYS[1:]]
STAMP_X3 = STAMP_ANT; STAMP_RES = STAMP_TOT
SCENES = [scene_hook, scene_promesa, scene_critica, scene_quejas, scene_red, scene_zelda, scene_guerra]

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
    fa = flash_alpha(t, [STAMP_ANT, STAMP_TOT, T["cta"]])
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
