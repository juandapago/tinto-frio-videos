"""Video vertical GTA VI: récord de espectadores en vivo (Streams Charts). Animación procedural original con Pillow."""
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
    if core in ("MISMO", "TIEMPO", "TOTAL"): return GRN
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
    "gta": text_sprite("GTA VI", 200, WHITE, "Black", glow=PINK, glow_r=22),
    "big": text_sprite("3,3 M", 240, YEL, "Black", glow=(200, 120, 0), glow_r=20),
    "rec": stamp_sprite("RÉCORD", RED, 96),
    "total": text_sprite("7,9 M", 280, YEL, "Black", glow=(200, 120, 0), glow_r=24),
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


T = {k: S[i]["start"] - 0.05 for i, k in enumerate(["hook", "promesa", "ant", "yt", "kick", "total", "bog", "cta"])}
T["cta"] -= 0.05
STAMP1 = 2.4
STAMP_ANT = T["ant"] + 3.0
STAMP_TOT = T["total"] + 1.4
EST_T = T["bog"] + 0.3
BOX_T = [T["yt"] + 0.5, T["kick"] + 0.4]
KACHING = T["total"] + 0.5

def live_dot(d, cx, cy, t):
    a = 0.5 + 0.5 * math.sin(t * 7)
    rrect(d, (cx - 140, cy - 38, cx + 140, cy + 38), 38, fill=(150, 20, 30), outline=WHITE, width=4)
    r = 14 + 4 * a
    d.ellipse((cx - 100 - r, cy - r, cx - 100 + r, cy + r), fill=(255, int(80 + 150 * a), int(80 + 150 * a)))
    f = F(44, "Black"); tw, th, b = tsize("EN VIVO", f)
    d.text((cx - 70 - b[0], cy - th / 2 - b[1]), "EN VIVO", font=f, fill=WHITE)

def eye_people(d, t, y, n, col, t0):
    # filas de personitas que aparecen
    for i in range(n):
        p = pop(t, t0 + i * 0.04, 0.2)
        if p <= 0: continue
        x = 170 + (i % 10) * 82; yy = y + (i // 10) * 110
        d.ellipse((x - 18 * p, yy - 50 * p, x + 18 * p, yy - 14 * p), fill=col)
        d.rounded_rectangle((x - 28 * p, yy - 8 * p, x + 28 * p, yy + 40 * p), int(14 * p) + 1, fill=col)

def scene_hook(img, t, base_t=0.0, loop=False):
    lt = t - base_t
    d = ImageDraw.Draw(img)
    # todo visible desde el fotograma 0
    paste_c(img, SP["gta"], 540, 360)
    live_dot(d, 540, 560, t)
    paste_c(img, SP["big"], 540, 760, 1 + 0.03 * math.sin(lt * 6))
    if not loop:
        chip(img, "VIÉNDOLO A LA VEZ EN TWITCH", 540, 960, 1.0, bg=(60, 40, 0), fg=YEL, border=YEL, size=46)
        s = pop(lt, STAMP1, 0.18)
        if s > 0:
            paste_c(img, SP["rec"], 540, 1130, s * (1.0 + 0.6 * max(0, 1 - prog(lt, STAMP1, 0.12))), rot=-7)
    else:
        p = pop(lt, 0.4, 0.25)
        if p > 0: chip(img, "¿LO VISTE EN VIVO?", 540, 960, p, bg=(60, 40, 0), fg=YEL, border=YEL, size=52)
        p = pop(lt, 0.9, 0.25)
        if p > 0: chip(img, "SÍGUEME PARA MÁS", 540, 1120, p * (1 + 0.04 * math.sin(lt * 8)), bg=(60, 10, 40), border=PINK, size=56)

def scene_promesa(img, t):
    t0 = T["promesa"]
    title(img, "SOLO TWITCH…", t, t0, y=360, size=100, glow=PINK)
    d = ImageDraw.Draw(img)
    p = pop(t, t0 + 0.3, 0.3)
    if p > 0:
        dx = int(12 * math.sin(t * 40)) if t > t0 + 1.0 else 0
        cx, cy = 540 + dx, 800
        w_, h_ = 200 * p, 260 * p
        rrect(d, (cx - w_, cy - h_ / 1.3, cx + w_, cy + h_ / 1.3), 30, fill=(90, 60, 10), outline=YEL, width=8)
        f = F(int(260 * p) + 1, "Black"); tw, th, b = tsize("?", f)
        d.text((cx - tw / 2 - b[0], cy - th / 2 - b[1]), "?", font=f, fill=YEL)

def hbar(d, y, frac, col, label, val, p):
    x0, x1 = 140, 940
    rrect(d, (x0, y, x1, y + 110), 20, fill=(30, 12, 52), outline=(90, 60, 130), width=4)
    w_ = (x1 - x0 - 12) * frac * ease_out(p)
    if w_ > 30: rrect(d, (x0 + 6, y + 6, x0 + 6 + w_, y + 104), 16, fill=col)
    f = F(44, "Black")
    d.text((x0 + 26, y - 62), label, font=f, fill=WHITE, stroke_width=2, stroke_fill=(0, 0, 0))
    if p > 0.3:
        fv = F(60, "Black"); tw, th, b = tsize(val, fv)
        d.text((x1 - tw - 30 - b[0], y + 55 - th / 2 - b[1]), val, font=fv, fill=WHITE, stroke_width=3, stroke_fill=(0, 0, 0))

def scene_ant(img, t):
    t0 = T["ant"]
    title(img, "RÉCORD ANTERIOR", t, t0, y=340, size=86, glow=CYAN)
    d = ImageDraw.Draw(img)
    hbar(d, 600, 3.11 / 3.31, (120, 120, 160), "League of Legends · 2022", "3,11 M", prog(t, t0 + 0.4, 1.0))
    hbar(d, 880, 1.0, PINK, "GTA VI · 2026", "3,31 M", prog(t, t0 + 1.8, 1.0))
    s = pop(t, STAMP_ANT, 0.18)
    if s > 0: paste_c(img, SP["rec"], 760, 1110, s * 0.8, rot=-6)

def stack(img, t, n_show, t0s):
    d = ImageDraw.Draw(img)
    data = [("Twitch", 3.31, (150, 70, 255)), ("YouTube", 3.21, RED), ("Kick", 1.50, GRN)]
    x0, x1, y0, y1 = 140, 940, 620, 760
    tot = 8.0
    x = x0
    rrect(d, (x0 - 6, y0 - 6, x1 + 6, y1 + 6), 22, fill=(30, 12, 52), outline=(90, 60, 130), width=4)
    for i, (n, v, c) in enumerate(data[:n_show]):
        p = ease_out(prog(t, t0s[i], 0.6))
        w_ = (x1 - x0) * v / tot * p
        if w_ > 4: d.rectangle((x, y0, x + w_, y1), fill=c)
        fl = F(42, "Black")
        ly = 820 + i * 110
        if p > 0:
            d.rounded_rectangle((150, ly, 200, ly + 50), 10, fill=c)
            d.text((230, ly - 2), n, font=fl, fill=WHITE)
            vs = f"{v:.2f}".replace(".", ",") + " M"
            tw, th, b = tsize(vs, fl); d.text((930 - tw, ly - 2), vs, font=fl, fill=YEL)
        x += w_

def scene_yt(img, t):
    title(img, "Y NO SOLO TWITCH", t, T["yt"], y=360, size=84, glow=PINK)
    stack(img, t, 2, [T["yt"] - 10, BOX_T[0]])

def scene_kick(img, t):
    title(img, "Y NO SOLO TWITCH", t, T["yt"] - 10, y=360, size=84, glow=PINK)
    stack(img, t, 3, [T["yt"] - 10, T["yt"] - 10, BOX_T[1]])

def scene_total(img, t):
    t0 = T["total"]
    title(img, "TOTAL A LA VEZ", t, t0, y=340, size=90, glow=CYAN)
    p = pop(t, t0 + 0.2, 0.3)
    paste_c(img, SP["total"], 540, 640, p * (1 + 0.03 * math.sin(t * 6)))
    d = ImageDraw.Draw(img)
    eye_people(d, t, 900, 20, (230, 200, 255), t0 + 0.6)
    s = pop(t, STAMP_TOT, 0.18)
    if s > 0: paste_c(img, SP["rec"], 540, 1180, s * (1 + 0.5 * max(0, 1 - prog(t, STAMP_TOT, 0.1))), rot=-6)

def scene_bog(img, t):
    t0 = T["bog"]
    title(img, "≈ TODO BOGOTÁ", t, t0, y=360, size=100, color=YEL, glow=(150, 100, 0))
    d = ImageDraw.Draw(img)
    r = random.Random(5)
    for i in range(14):
        p = ease_out(prog(t, EST_T + i * 0.05, 0.4))
        w_ = r.randint(50, 70); h_ = r.randint(180, 460) * p
        x = 130 + i * 60
        if h_ > 2:
            d.rectangle((x, 1150 - h_, x + w_, 1150), fill=(40, 20, 80), outline=CYAN, width=3)
            for wy in range(int(1150 - h_) + 20, 1140, 40):
                d.rectangle((x + 12, wy, x + 22, wy + 14), fill=YEL if (wy + i) % 3 else (90, 70, 30))
    c = pop(t, t0 + 1.3, 0.25)
    if c > 0: chip(img, "7,9 M DE PERSONAS", 540, 620, c, bg=(10, 60, 30), fg=GRN, border=GRN, size=50)

def flash_alpha(t, events, dur=0.22):
    a = 0
    for e in events:
        if 0 <= t - e < dur: a = max(a, 1 - (t - e) / dur)
    return a

SCENE_CHANGES = [T["promesa"], T["ant"], T["yt"], T["total"], T["bog"], T["cta"]]
STAMP_X3 = STAMP_ANT; STAMP_RES = STAMP_TOT

def render(t):
    img = background(t)
    if t < T["promesa"]: dv = 0.35
    elif t < T["cta"]: dv = 0.35 + 0.3 * ease_out(prog(t, T["promesa"], 0.3))
    else: dv = 0.65 - 0.3 * ease_out(prog(t, T["cta"], 0.4))
    dim(img, dv)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if t < T["promesa"]: scene_hook(layer, t)
    elif t < T["ant"]: scene_promesa(layer, t)
    elif t < T["yt"]: scene_ant(layer, t)
    elif t < T["kick"]: scene_yt(layer, t)
    elif t < T["total"]: scene_kick(layer, t)
    elif t < T["bog"]: scene_total(layer, t)
    elif t < T["cta"]: scene_bog(layer, t)
    else: scene_hook(layer, t, base_t=T["cta"], loop=True)
    dx, dy = shake(t, [STAMP1, STAMP_ANT, STAMP_TOT])
    img.paste(layer, (dx, dy), layer)
    sub = current_sub(t)
    if sub: caption(img, sub)
    fa = flash_alpha(t, [STAMP1, STAMP_TOT] + SCENE_CHANGES)
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
