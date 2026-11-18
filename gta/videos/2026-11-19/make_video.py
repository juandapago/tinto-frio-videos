"""Video vertical GTA VI: 3 cosas antes de jugar. Animación procedural original con Pillow."""
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
    "yasalio": stamp_sprite("YA SALIÓ", RED, 104),
    "sinfecha": stamp_sprite("SIN FECHA", RED, 92),
    "gratis": text_sprite("GRATIS", 190, GRN, "Black", glow=(20, 160, 80), glow_r=24),
    "listo": stamp_sprite("LISTO", (30, 170, 90), 80),
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
    "uno": S[2]["start"] - 0.05,
    "borrar": S[3]["start"],
    "dos": S[4]["start"] - 0.05,
    "pc": S[5]["start"] - 0.05,
    "tres": S[6]["start"] - 0.05,
    "cta": S[7]["start"] - 0.1,
}
STAMP1 = 0.75
STAMP_PC = T["pc"] + 0.8
GIFT_OPEN = T["tres"] + 2.9
MAP_OUT = GIFT_OPEN + 0.15
POSTER_OUT = T["tres"] + 4.2
ZERO_BADGE = T["tres"] + 4.9
OVERFLOW = T["uno"] + 1.6
TILE_T = [T["borrar"] + 0.25, T["borrar"] + 0.85, T["borrar"] + 1.45]
LISTO_T = T["borrar"] + 2.0
KACHING = T["dos"] + 1.4

def scene_hook(img, t, base_t=0.0, loop=False):
    d = ImageDraw.Draw(img)
    lt = t - base_t
    paste_c(img, SP["gta"], 540, 430, pop(lt, 0.02 if not loop else 0.0, 0.25))
    s = pop(lt, STAMP1 if not loop else 0.35, 0.18)
    if s > 0:
        paste_c(img, SP["yasalio"], 540, 680, s * (1.0 + 0.6 * max(0, 1 - prog(lt, STAMP1 if not loop else 0.35, 0.12))), rot=-7)
    if not loop:
        p = ease_out(prog(lt, 1.2, 0.35))
        if p > 0:
            chip(img, "JUEVES 19 DE NOVIEMBRE", 540 + (1 - p) * 700, 860, 1.0, size=46)
        p2 = pop(lt, 2.3, 0.25)
        if p2 > 0:
            pul = 1 + 0.05 * math.sin(lt * 9)
            chip(img, "ANTES DE JUGAR, REVISA ESTO", 540, 1030, p2 * pul, bg=(60, 40, 0), fg=YEL, border=YEL, size=46)
    else:
        p = pop(lt, 0.7, 0.25)
        if p > 0:
            chip(img, "SÍGUEME PARA MÁS", 540, 900, p * (1 + 0.04 * math.sin(lt * 8)), bg=(60, 10, 40), border=PINK, size=52)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "3 COSAS", t, t0, y=240, size=130, glow=PINK)
    title(img, "ANTES DE JUGAR", t, t0 + 0.12, y=380, size=78, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    for i, cx in enumerate((240, 540, 840)):
        p = ease_back(prog(t, t0 + 0.35 + i * 0.25, 0.3)) if t > t0 + 0.35 + i * 0.25 else 0
        if p <= 0: continue
        cy = 760 + (1 - p) * 500
        dx = 0
        if i == 2 and t > t0 + 1.6:
            dx = int(10 * math.sin(t * 40) * max(0, 1 - (t - t0 - 1.6) / 0.6))
        box = (cx - 115 + dx, cy - 160, cx + 115 + dx, cy + 160)
        col = (60, 22, 96) if i < 2 else (90, 60, 10)
        rrect(d, box, 26, fill=col, outline=CYAN if i < 2 else YEL, width=7)
        f = F(170, "Black")
        txt = str(i + 1) if i < 2 else "?"
        tw, th, b = tsize(txt, f)
        d.text((cx - tw / 2 - b[0] + dx, cy - th / 2 - b[1] - 10), txt, font=f, fill=WHITE if i < 2 else YEL)
    g = pop(t, t0 + 1.75, 0.25)
    if g > 0:
        chip(img, "GRATIS", 840, 1010, g * (1 + 0.06 * math.sin(t * 10)), bg=(10, 70, 35), fg=GRN, border=GRN, size=54)

GAMES = [((70, 140, 255), "JUEGO A"), ((255, 160, 50), "JUEGO B"), ((170, 90, 255), "JUEGO C")]

def scene_uno(img, t):
    t0 = T["uno"]
    title(img, "1 · PESA 212 GB", t, t0, y=250, size=104, color=YEL, glow=(160, 110, 0))
    d = ImageDraw.Draw(img)
    pp = ease_out(prog(t, t0 + 0.15, 0.3))
    oy = int((1 - pp) * 80)
    rrect(d, (130, 470 + oy, 950, 900 + oy), 30, fill=(22, 10, 40), outline=(120, 90, 170), width=5)
    d.text((170, 500 + oy), "ALMACENAMIENTO DE LA CONSOLA", font=F(36, "ExtraBold"), fill=(200, 190, 230))
    bx0, bx1, by0, by1 = 170, 910, 580 + oy, 680 + oy
    rrect(d, (bx0, by0, bx1, by1), 20, fill=(45, 35, 70))
    bw = bx1 - bx0
    # segmentos de juegos que se borran
    seg_w = 0.2
    x = bx0
    for gi, (col, name) in enumerate(GAMES):
        k = 1.0 - ease_out(prog(t, TILE_T[gi], 0.35))
        w_ = int(bw * seg_w * k)
        if w_ > 2:
            d.rectangle((x, by0 + 8, x + w_, by1 - 8), fill=col)
            x += w_
    used = x
    # GTA VI llenando
    g = ease_out(prog(t, t0 + 0.4, 1.2))
    free = bx1 - used
    need = bw * 0.55
    gw = int(min(need * g, max(free, 0) + (need * g - free) * 0 if g < 1 else need))
    over = (need * g) > free
    gcol = RED if (over and t < LISTO_T) else PINK
    gx1 = min(used + int(need * g), bx1)
    if gx1 > used:
        d.rectangle((used, by0 + 8, gx1, by1 - 8), fill=gcol)
        if gx1 - used > 160:
            d.text((used + 16, by0 + 26), "GTA VI", font=F(44, "Black"), fill=WHITE)
    # contador
    gb = int(212 * ease_out(prog(t, t0 + 0.4, 1.2)))
    txt = f"{gb} GB"
    f = F(110, "Black")
    tw, th, b = tsize(txt, f)
    d.text((540 - tw / 2 - b[0], 730 + oy - b[1]), txt, font=f, fill=WHITE, stroke_width=3, stroke_fill=(0, 0, 0))
    if over and t >= OVERFLOW and t < LISTO_T:
        if int(t * 6) % 2 == 0:
            chip(img, "ESPACIO INSUFICIENTE", 540, 980, 1.0, bg=(80, 10, 20), fg=WHITE, border=RED, size=46)
    # fichas de juegos que salen volando a la caneca
    if t >= T["borrar"] - 0.2:
        ap = ease_out(prog(t, T["borrar"] - 0.2, 0.3))
        canx, cany = 870, 1150
        # caneca
        d.polygon([(canx - 60, cany - 50), (canx + 60, cany - 50), (canx + 46, cany + 80), (canx - 46, cany + 80)], fill=(90, 90, 110))
        rrect(d, (canx - 72, cany - 70, canx + 72, cany - 48), 8, fill=(130, 130, 150))
        for k in (-25, 0, 25):
            d.line([(canx + k, cany - 30), (canx + k * 0.8, cany + 62)], fill=(60, 60, 80), width=6)
        for gi, (col, name) in enumerate(GAMES):
            fp = ease_out(prog(t, TILE_T[gi], 0.4))
            sx, sy = 200 + gi * 200, 1150
            x_ = sx + (canx - sx) * fp
            y_ = sy - math.sin(fp * math.pi) * 220 + (cany - sy) * fp
            sc = 1 - 0.7 * fp
            if fp < 0.98:
                tw_ = int(170 * sc); th_ = int(110 * sc)
                yy = y_ + (1 - ap) * 300
                rrect(d, (x_ - tw_ / 2, yy - th_ / 2, x_ + tw_ / 2, yy + th_ / 2), 16, fill=col, outline=WHITE, width=4)
                if sc > 0.6:
                    fn = F(int(30 * sc), "Black")
                    tw2, th2, b2 = tsize(name, fn)
                    d.text((x_ - tw2 / 2 - b2[0], yy - th2 / 2 - b2[1]), name, font=fn, fill=WHITE)
    l = pop(t, LISTO_T, 0.2)
    if l > 0:
        paste_c(img, SP["listo"], 540, 990, l, rot=-5)

def price_tag(img, t, cx, cy, txt, swing):
    w_, h_ = 600, 240
    im = Image.new("RGBA", (w_ + 140, h_ + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.polygon([(70, 20 + h_ / 2), (150, 20), (w_ + 120, 20), (w_ + 120, h_ + 20), (150, h_ + 20)], fill=YEL, outline=WHITE)
    d.ellipse((118, 20 + h_ / 2 - 20, 158, 20 + h_ / 2 + 20), fill=DARK)
    size = 118
    while F(size, "Black").getlength("$339.900") > w_ - 90: size -= 4
    f = F(size, "Black")
    tw, th, b = tsize(txt, f)
    d.text((160 + (w_ - 40 - tw) / 2 - b[0], 20 + (h_ - th) / 2 - b[1]), txt, font=f, fill=(25, 12, 40))
    paste_c(img, im, cx, cy, 1.0, rot=swing)

COINS = [(random.Random(i).randrange(120, 960), random.Random(i + 99).uniform(0, 1), random.Random(i + 7).uniform(0.8, 1.3)) for i in range(14)]

def scene_dos(img, t):
    t0 = T["dos"]
    d = ImageDraw.Draw(img)
    # monedas cayendo
    for x, ph, sp in COINS:
        y = ((t - t0) * 520 * sp + ph * 1600) % 1700 - 100
        r = 34
        d.ellipse((x - r, y - r, x + r, y + r), fill=(245, 190, 40), outline=(255, 235, 140), width=5)
        fn = F(40, "Black")
        d.text((x - 12, y - 25), "$", font=fn, fill=(150, 100, 0))
    dim(img, 0.35)
    title(img, "2 · PRECIO", t, t0, y=230, size=118, color=YEL, glow=(160, 110, 0))
    title(img, "EN COLOMBIA", t, t0 + 0.1, y=360, size=72)
    p = pop(t, t0 + 0.2, 0.3)
    if p > 0:
        v = int(339900 * ease_out(prog(t, t0 + 0.25, 1.15)))
        txt = "$" + f"{v:,}".replace(",", ".")
        price_tag(img, t, 540, 690 + (1 - p) * 400, txt, 4 * math.sin((t - t0) * 3.2))
    c = pop(t, t0 + 0.6, 0.25)
    if c > 0:
        chip(img, "Edición estándar · tienda de Xbox", 540, 900, c, size=40)
    u = pop(t, t0 + 2.4, 0.25)
    if u > 0:
        chip(img, "Ultimate: $424.900", 540, 1040, u, bg=(60, 20, 70), fg=YEL, border=PINK, size=48)

def scene_pc(img, t):
    t0 = T["pc"]
    title(img, "¿Y EN PC?", t, t0, y=250, size=130, glow=PINK)
    d = ImageDraw.Draw(img)
    p = ease_out(prog(t, t0 + 0.1, 0.3))
    oy = int((1 - p) * 500)
    cx, cy = 540, 640 + oy
    rrect(d, (cx - 280, cy - 190, cx + 280, cy + 170), 24, fill=(30, 30, 46), outline=(180, 180, 210), width=10)
    rrect(d, (cx - 250, cy - 160, cx + 250, cy + 140), 12, fill=(10, 14, 30))
    d.rectangle((cx - 30, cy + 170, cx + 30, cy + 240), fill=(120, 120, 140))
    rrect(d, (cx - 130, cy + 235, cx + 130, cy + 260), 10, fill=(150, 150, 170))
    # spinner de carga
    a0 = (t * 360 * 1.3) % 360
    d.arc((cx - 80, cy - 90, cx + 80, cy + 70), a0, a0 + 270, fill=CYAN, width=16)
    fn = F(52, "Black")
    tw, th, b = tsize("PC", fn)
    d.text((cx - tw / 2 - b[0], cy - 10 - th / 2 - b[1]), "PC", font=fn, fill=WHITE)
    s = pop(t, STAMP_PC, 0.16)
    if s > 0:
        paste_c(img, SP["sinfecha"], cx, cy - 10, s * (1 + 0.5 * max(0, 1 - prog(t, STAMP_PC, 0.1))), rot=-10)
    # filas plataformas
    r1 = pop(t, t0 + 1.6, 0.25)
    if r1 > 0:
        chip(img, "PS5 y Xbox Series: SÍ", 540, 1000, r1, bg=(10, 60, 30), fg=GRN, border=GRN, size=50)
    r2 = pop(t, t0 + 2.2, 0.25)
    if r2 > 0:
        chip(img, "PC: TODAVÍA NO", 540, 1120, r2, bg=(70, 10, 20), fg=WHITE, border=RED, size=50)

def map_sprite():
    w_, h_ = 360, 440
    im = Image.new("RGBA", (w_ + 40, h_ + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rrect(d, (20, 20, 20 + w_, 20 + h_), 14, fill=(70, 170, 210), outline=WHITE, width=8)
    # península genérica
    pts = [(120, 60), (300, 60), (300, 150), (270, 230), (285, 320), (250, 420), (215, 440), (195, 380), (170, 300), (120, 230), (80, 170), (70, 90)]
    d.polygon(pts, fill=(240, 220, 150), outline=(140, 110, 60))
    d.polygon([(170, 120), (230, 110), (250, 170), (200, 200), (165, 170)], fill=(120, 190, 100))
    route = [(110, 110), (160, 160), (210, 230), (230, 300), (225, 380)]
    for i in range(len(route) - 1):
        x0, y0 = route[i]; x1, y1 = route[i + 1]
        for k in range(0, 10, 2):
            a, b_ = k / 10, (k + 1) / 10
            d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b_, y0 + (y1 - y0) * b_)], fill=RED, width=6)
    px, py = 225, 380
    d.ellipse((px - 18, py - 50, px + 18, py - 14), fill=RED)
    d.polygon([(px - 14, py - 26), (px + 14, py - 26), (px, py)], fill=RED)
    return im

def poster_sprite():
    w_, h_ = 320, 440
    im = Image.new("RGBA", (w_ + 40, h_ + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rrect(d, (20, 20, 20 + w_, 20 + h_), 14, fill=(40, 12, 70), outline=WHITE, width=8)
    for yy in range(40, 300):
        p = (yy - 40) / 260
        d.line([(34, yy), (w_ + 6, yy)], fill=(int(40 + 200 * p), int(20 + 40 * p), int(90 + 40 * p)))
    d.ellipse((110, 150, 250, 290), fill=(255, 190, 80))
    d.rectangle((34, 240, w_ + 6, 300), fill=(30, 10, 50))
    for k in range(4):
        d.line([(34, 255 + k * 12), (w_ + 6, 255 + k * 12)], fill=(220, 60, 170), width=3)
    fn = F(54, "Black")
    tw, th, b = tsize("PÓSTER", fn)
    d.text((20 + (w_ - tw) / 2 - b[0], 340 - b[1]), "PÓSTER", font=fn, fill=WHITE)
    return im

SP["map"] = map_sprite()
SP["poster"] = poster_sprite()

SPARK = [(random.Random(i).uniform(0, 2 * math.pi), random.Random(i + 50).uniform(250, 520), random.Random(i + 9).choice([YEL, PINK, CYAN, GRN])) for i in range(26)]

def scene_tres(img, t):
    t0 = T["tres"]
    paste_c(img, SP["gratis"], 540, 260, pop(t, t0, 0.25))
    chip(img, "3 · EN LA PÁGINA OFICIAL", 540, 420, pop(t, t0 + 0.2, 0.25), size=44)
    d = ImageDraw.Draw(img)
    cx, cy = 540, 820
    if t < GIFT_OPEN + 0.25:
        sh = 0
        if t > t0 + 0.5:
            sh = 14 * math.sin(t * 38) * min(1, (t - t0 - 0.5) / 1.5)
        gp = pop(t, t0 + 0.3, 0.3)
        if gp > 0:
            bw_, bh_ = int(330 * gp), int(260 * gp)
            x0 = cx - bw_ / 2 + sh
            d.rectangle((x0, cy - bh_ / 2 + 40, x0 + bw_, cy + bh_ / 2 + 40), fill=(220, 40, 90))
            d.rectangle((x0 + bw_ / 2 - 26 * gp, cy - bh_ / 2 + 40, x0 + bw_ / 2 + 26 * gp, cy + bh_ / 2 + 40), fill=YEL)
            lid_up = ease_out(prog(t, GIFT_OPEN, 0.25)) * 600
            ly = cy - bh_ / 2 - 20 - lid_up
            d.rectangle((x0 - 20 * gp, ly, x0 + bw_ + 20 * gp, ly + 70 * gp), fill=(250, 70, 120))
            d.rectangle((x0 + bw_ / 2 - 26 * gp, ly, x0 + bw_ / 2 + 26 * gp, ly + 70 * gp), fill=YEL)
            if t < GIFT_OPEN:
                # flecha de descarga rebotando
                ay = cy - 250 + 20 * math.sin(t * 8)
                d.polygon([(cx - 60, ay), (cx + 60, ay), (cx, ay + 70)], fill=CYAN)
                d.rectangle((cx - 22, ay - 70, cx + 22, ay), fill=CYAN)
    # destellos
    if t >= GIFT_OPEN:
        sp = prog(t, GIFT_OPEN, 0.8)
        if sp < 1:
            for ang, dist, col in SPARK:
                r = dist * ease_out(sp)
                x, y = cx + r * math.cos(ang), cy + r * math.sin(ang)
                s_ = 14 * (1 - sp)
                d.ellipse((x - s_, y - s_, x + s_, y + s_), fill=col)
    m = pop(t, MAP_OUT, 0.3)
    if m > 0:
        fy = cy + (1 - m) * 120
        paste_c(img, SP["map"], 330 + (1 - m) * 210, fy, m, rot=6)
        chip(img, "MAPA DE LEONIDA", 330, fy + 280, m, size=38, border=CYAN)
    p = pop(t, POSTER_OUT, 0.3)
    if p > 0:
        fy = cy + (1 - p) * 120
        paste_c(img, SP["poster"], 760 - (1 - p) * 220, fy, p, rot=-6)
        chip(img, "PARA IMPRIMIR", 760, fy + 280, p, size=38, border=PINK)
    z = pop(t, ZERO_BADGE, 0.2)
    if z > 0:
        bcy = 1212
        d.ellipse((540 - 70 * z, bcy - 70 * z, 540 + 70 * z, bcy + 70 * z), fill=(20, 150, 70), outline=WHITE, width=7)
        fn = F(int(66 * z) + 1, "Black")
        tw, th, b = tsize("$0", fn)
        d.text((540 - tw / 2 - b[0], bcy - th / 2 - b[1]), "$0", font=fn, fill=WHITE)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T["promesa"], T["uno"], T["dos"], T["pc"], T["tres"], T["cta"]]

def render(t):
    img = background(t)
    # nivel de oscurecido: hook claro, contenido oscuro, cierre claro
    if t < T["promesa"]:
        dv = 0.15
    elif t < T["cta"]:
        dv = 0.15 + 0.5 * ease_out(prog(t, T["promesa"], 0.3))
    else:
        dv = 0.65 - 0.5 * ease_out(prog(t, T["cta"], 0.4))
    dim(img, dv)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t < T["promesa"]:
        scene_hook(layer, t)
    elif t < T["uno"]:
        scene_promesa(layer, t)
    elif t < T["dos"]:
        scene_uno(layer, t)
    elif t < T["pc"]:
        scene_dos(layer, t)
    elif t < T["tres"]:
        scene_pc(layer, t)
    elif t < T["cta"]:
        scene_tres(layer, t)
    else:
        scene_hook(layer, t, base_t=T["cta"], loop=True)
    dx, dy = shake(t, [STAMP1, STAMP_PC, OVERFLOW, GIFT_OPEN] + SCENE_CHANGES[:1])
    img.paste(layer, (dx, dy), layer)
    sub = current_sub(t)
    if sub: caption(img, sub)
    fa = flash_alpha(t, [GIFT_OPEN, LISTO_T] + SCENE_CHANGES)
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
