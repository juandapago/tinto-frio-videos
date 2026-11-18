/* ===================== DÍA 5: "Yo cargo" ===================== */
function camilo(x, fy, s, t, o = {}) {
  const talk = o.talk, SK = '#d9a07a', HD = '#2f7fa6';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  sh(0, 4, 120);
  box(-56, -300, 48, 300, 22, '#3a3f55'); box(8, -300, 48, 300, 22, '#3a3f55'); box(-66, -24, 62, 28, 12, '#fff'); box(4, -24, 62, 28, 12, '#fff');
  box(-120, -600, 240, 330, 80, HD); box(-76, -420, 152, 70, 20, '#2a6c8f'); line(-18, -596, -18, -520, 6, '#fff'); line(18, -596, 18, -520, 6, '#fff');
  box(-166, -570, 52, 220, 26, HD); ell(-140, -340, 27, 27, SK); box(114, -570, 52, 220, 26, HD); ell(140, -340, 27, 27, SK);
  box(-20, -630, 40, 40, 12, '#c98f6c');
  const hy = -690;
  ell(0, hy - 8, 108, 112, HD);
  ell(0, hy, 84, 90, SK);
  ell(0, hy - 70, 92, 38, HD);
  face(0, hy + 10, 1, o.ex || 'neutral', talk, t, SK, {});
  ctx.strokeStyle = '#1c1c24'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, hy - 6, 98, Math.PI * 1.04, Math.PI * 1.96); ctx.stroke();
  ell(-98, hy + 6, 22, 34, '#e8524a'); ell(98, hy + 6, 22, 34, '#e8524a');
  ctx.restore();
}
function sofiAngry(x, fy, s, t, o = {}) {
  ctx.save(); ctx.translate(x, fy); ctx.scale(o.flip ? -s : s, s);
  sofi(0, 0, 1, t, { ex: o.ex || 'angry', talk: o.talk });
  box(-132, -478, 264, 66, 32, '#7a4fc0'); box(-132, -478, 264, 18, 10, '#8a5ad1');
  ell(-118, -444, 27, 27, '#b9784f'); ell(118, -444, 27, 27, '#b9784f');
  ctx.restore();
}
function trophy(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 5) * .06);
  ctx.strokeStyle = '#e0a41c'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(-70, -70, 38, Math.PI * .5, Math.PI * 1.5); ctx.stroke(); ctx.beginPath(); ctx.arc(70, -70, 38, -Math.PI * .5, Math.PI * .5); ctx.stroke();
  poly([[-70, -150], [70, -150], [52, -30], [-52, -30]], '#ffd23f'); ell(0, -150, 70, 16, '#ffe680'); box(-16, -34, 32, 56, 6, '#e0a41c'); box(-56, 18, 112, 34, 10, '#c98a14');
  ell(-22, -100, 10, 30, 'rgba(255,255,255,.55)', .1);
  ctx.restore();
}
function confetti(t, t0) {
  const r = mulberry(11), cols = [C.yellow, C.pink, C.blue, C.green, C.orange, '#fff'];
  for (let i = 0; i < 46; i++) { const sx = r() * 1080, sp = 380 + r() * 380, ph = r() * 6, d = t - t0 - r() * .6; if (d < 0) continue; const y = -60 + d * sp; if (y > H + 40) continue;
    ctx.save(); ctx.translate(sx + Math.sin(d * 3 + ph) * 50, y); ctx.rotate(d * 6 + ph); box(-12, -7, 24, 14, 3, cols[i % 6]); ctx.restore(); }
}
function bigScreen(x, y, w, h, t, small) {
  ctx.save(); ctx.translate(x, y);
  box(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28, 22, '#0f0b1c'); ctx.save(); rrect(-w / 2, -h / 2, w, h, 12); ctx.clip(); ctaArt(w, h, t);
  ctx.fillStyle = 'rgba(18,10,36,.35)'; ctx.fillRect(-w / 2, -h / 2, w, h);
  const k = 1 + .06 * Math.sin(t * 7); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.save(); ctx.scale(k, k); ctx.font = `700 ${small ? 110 : 150}px ${F}`; outlined('CTA VI', 0, small ? -10 : -14, C.yellow, 22); ctx.restore();
  ctx.font = `700 ${small ? 40 : 50}px ${F}`; outlined('TRÁILER', 0, small ? 70 : 90, C.cream, 12); ctx.restore();
  if (Math.sin(t * 5) > 0) ell(w / 2 - 22, -h / 2 + 22, 9, 9, C.red);
  ctx.restore();
}
function matchScreen(t, o) {
  ctx.fillStyle = '#120a24'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(540, 940); ctaArt(1080, 1920, t); ctx.restore(); ctx.fillStyle = 'rgba(18,10,36,.74)'; ctx.fillRect(0, 0, W, H);
  const car = (x, y, col, rot = 0, sc = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); box(-110, -40, 220, 80, 30, col); box(-60, -80, 120, 50, 20, col); box(-46, -70, 92, 30, 10, 'rgba(255,255,255,.35)'); ell(-70, 40, 26, 26, '#120a24'); ell(70, 40, 26, 26, '#120a24'); ell(-70, 40, 10, 10, '#8a86a0'); ell(70, 40, 10, 10, '#8a86a0'); box(90, -20, 24, 16, 6, '#ffe38a'); ctx.restore(); };
  const speed = (y) => { ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineCap = 'round'; for (let i = 0; i < 6; i++) { const r = mulberry(i * 5 + Math.floor(t * 12)); const x = r() * 1080, yy = y - 70 + r() * 140; line(x, yy, x + 90 + r() * 80, yy, 5); } };
  if (o.cars) {
    speed(890);
    const st = o.stunt;
    if (st !== undefined && st >= 0 && st < 1.2) { const q = st / 1.2, px = 540 + Math.sin(t * 1.9 + 1.3) * 200;
      car(px, 960, '#ff5ca8'); car(lerp(120, 960, eio(q)), 820 - Math.sin(q * Math.PI) * 190, '#ffd23f', q * Math.PI * 2);
      for (let i = 0; i < 7; i++) { const a = i * .9 + t * 9; sparkle(lerp(120, 960, eio(q)) - 60 + Math.cos(a) * 110, 820 - Math.sin(q * Math.PI) * 190 + Math.sin(a) * 90, 16 + 8 * Math.sin(t * 20 + i), '#fff6c9'); } }
    else { const bump = Math.sin(t * 17) * 8; car(540 + Math.sin(t * 2.3) * 300, 820 + bump, '#ffd23f', Math.sin(t * 17) * .03); car(540 + Math.sin(t * 1.9 + 1.3) * 300, 960 - bump, '#ff5ca8', -Math.sin(t * 15) * .03); }
  }
  if (o.duel !== undefined) { const q = o.duel, go = q > 0 ? eout(clamp(q / .5)) * 420 : 0, jit = Math.sin(t * 30) * 5;
    speed(1215); car(470 + jit + go, 1190, '#ffd23f', Math.sin(t * 22) * .04, .62); car(610 - jit - go * .2, 1262, '#ff5ca8', -Math.sin(t * 19) * .04 + (q > 0 ? clamp(q / .4) * .5 : 0), .62);
    if (q <= 0) for (let i = 0; i < 3; i++) sparkle(540 + Math.sin(t * 40 + i * 2) * 26, 1226 + Math.cos(t * 33 + i) * 22, 14, '#fff6c9'); }
  ctx.save(); box(120, 430, 840, 210, 30, 'rgba(0,0,0,.72)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `700 50px ${F}`; ctx.fillStyle = '#ffd23f'; ctx.fillText(o.nl || 'BRAYAN + KEVIN', 330, 480); ctx.fillStyle = '#ff8fc8'; ctx.fillText(o.nr || 'RIVALES', 750, 480);
  ctx.font = `700 120px ${F}`; ctx.fillStyle = '#fff'; ctx.fillText(`${o.sc[0]}  –  ${o.sc[1]}`, 540, 565);
  ctx.font = `700 34px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText(o.sub || '', 540, 618); ctx.restore();
}
function padHold(x, fy, s, t, skin, amp = 1) { const y = fy - 318 * s, r = Math.sin(t * 9) * .28 * amp; ctx.save(); ctx.translate(x, y); ctx.rotate(r); ell(-74 * s, 6, 27 * s, 27 * s, skin); ell(74 * s, 6, 27 * s, 27 * s, skin); gamepad(0, 0, .62 * s, 0); ctx.restore(); }
function lagrima(x, y, t) { ctx.save(); ctx.font = `90px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.translate(x, y - Math.abs(Math.sin(t * 6)) * 14); ctx.fillText('💢', 0, 0); ctx.restore(); }
function emo(txt, x, y, k, sz = 90, rot = 0) { if (k <= 0) return; ctx.save(); ctx.font = `${sz}px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(rot); ctx.fillText(txt, 0, 0); ctx.restore(); }
function hearts(t, x, y, n = 5) { for (let i = 0; i < n; i++) { const k = (t * .7 + i / n) % 1; ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI); ctx.font = `${50 + i * 6}px ${F}`; ctx.textAlign = 'center'; ctx.fillText('💖', x + Math.sin(k * 6 + i) * 60 + (i - n / 2) * 30, y - k * 300); ctx.restore(); } }
const SOFICHAT = { color: '#ff8fc8', icon: '💜', title: 'Sofi', sub: 'última vez hoy 4:07 pm', msgs: [
  { at: .4, mine: true, text: 'Sofi, perdón 🥺' },
  { at: 1.3, mine: true, text: '✓✓ Visto 4:07 pm' },
  { at: 4.2, text: '…' }] };
function salaBg(t) {
  ctx.drawImage(SHOP, -OX, 0); box(440, 280, 480, 290, 10, '#3a2a6a'); ctx.save(); rrect(440, 280, 480, 290, 10); ctx.clip(); ctx.translate(680, 425); ctaArt(480, 290); ctx.restore();
  banner(t);
  const pepeT = talks(t, 'DON PEPE'); donPepe(160, 1330, .85, t, { talk: pepeT }); micro(232, 800 + (pepeT ? Math.sin(t * 13) * 3 : 0)); counter();
  crowdHeads(t, 1240, 7, 4, false);
}

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), tk = talks(t, 'KEVIN'), ts = talks(t, 'SOFI');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  if (t < S.m1) {
    // --- sala del torneo: gancho, recap, Sofi ofendida ---
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); salaBg(t);
    const wk = eio(clamp((t - S.walk) / .9)), bx = lerp(310, 430, wk);
    const kHand = t < S.walk;
    kevin(660, 1900, .9, t, { ex: t < S.pepe ? 'happy' : 'happy', talk: tk });
    sofiAngry(850, 1900, .85, t, { flip: true, talk: ts }); camilo(1010, 1900, .72, t, { ex: 'neutral' });
    brayan(bx, 1990, .95, t, { bald: true, ex: t < S.walk ? 'shock' : 'sad', talk: tb, sweat: t, bob: true });
    ctx.restore();
    if (t > S.stress) lagrima(840, 1280, t);
    if (t < 3.1) { const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 5 SIN REDES', 0, 0, C.orange, 22); ctx.restore(); }
    if (t > .05 && t < 3.3) stamp('ME DEJÓ SOLA 😱', 720, 800, C.red, .05, t - .05);
    if (t >= cueT('r0') && t < S.pepe) label = ['ELIGIERON: KEVIN', cueT('r0')];
  } else if (t < S.chat) {
    // --- ronda 1 ---
    const d = t - S.m1, sc = d < .5 ? [0, 0] : d < 1.5 ? [1, 0] : d < 2.4 ? [1, 1] : d < 3.3 ? [2, 1] : [3, 1];
    matchScreen(t, { sc, cars: true, sub: 'PRIMERO A 3', stunt: d - 2.0 });
    const dist = d > 1.0 && d < 2.4;
    kevin(790, 1900, .95, t, { ex: dist ? 'angry' : 'happy', talk: tk });
    brayan(300, 1990, 1.0, t, { bald: true, ex: dist ? 'shock' : 'determined', talk: tb, sweat: dist ? t : 0, bob: true });
    padHold(790 + Math.sin(t * 9) * 5, 1900, .95, t, '#c88c63', d > 1.9 && d < 3.3 ? 2 : 1); padHold(300, 1990, 1.0, t, SKB, dist ? 0 : 1);
    if (d > 2.9 && t < S.win1) stamp('¡JUGADA ABSURDA!', 540, 700, C.orange, .04, d - 2.9);
    if (dist) { emo('💕', 330, 1240 - (d - 1) * 40, eback(clamp((d - 1.0) / .3)), 100); }
    if (d > 2.3 && d < 3.6) { for (let i = 0; i < 4; i++) sparkle(660 + i * 90, 1240 - ((d * 1.5 + i * .3) % 1) * 160, 18, '#fff'); }
    label = ['RONDA 1 ✅', S.m1 + .1];
    if (t > S.win1) stamp('¡GANAMOS!', 540, 700, C.green, -.05, t - S.win1);
  } else if (t < S.kcut) {
    // --- el chat: en visto ---
    rays(540, 1000, '#ff8fc8', '#f77fb8', t);
    const cfg = Object.assign({}, SOFICHAT, { sub: (t - S.chat > 2.5 ? 'escribiendo…' : 'en línea') });
    chatUI(t, S.chat, cfg);
    if (t > S.chat + 1.3) stamp('EN VISTO 😭', 540, 1520, C.red, -.04, t - S.chat - 1.3);
  } else if (t < S.semi) {
    // --- Kevin le apaga el celular ---
    rays(540, 1100, '#e2584a', '#d84a3c', t);
    kevin(540, 2080, 1.5, t, { ex: 'angry', talk: tk });
    const d = t - S.kcut, k = eout(clamp(d / .3)); ctx.save(); ctx.translate(860, lerp(1700, 1250, k)); ctx.rotate(.25); box(-50, -90, 100, 180, 18, '#1c1c24'); box(-40, -78, 80, 150, 8, '#05050a'); ctx.restore();
    label = ['CELULAR APAGADO 📵', S.kcut + .1];
  } else if (t < S.recov) {
    // --- semifinal: el tráiler de CTA VI ---
    const d = t - S.semi, sc = t < S.drop ? [1, 1] : [1, 2], lost = t >= S.drop;
    matchScreen(t, { sc, nl: 'SEMIFINAL', nr: 'RONDAS', sub: 'PRIMERO A 3' });
    bigScreen(540, 830, 600, 290, t);
    const gaze = t < S.drop + .1;
    kevin(790, 1900, .95, t, { ex: lost ? 'sad' : 'happy', talk: tk });
    brayan(300, 1990, 1.0, t, { bald: true, ex: gaze ? 'shock' : 'determined', talk: tb, sweat: lost ? t : 0, bob: true });
    padHold(790, 1900, .95, t, '#c88c63', lost ? 0 : 1); if (t < S.drop || t > cueT('b5')) padHold(300, 1990, 1.0, t, SKB, gaze ? 0 : 1);
    if (t >= S.drop && t < cueT('b5')) { const dd = t - S.drop, fy = Math.min(1672 + dd * dd * 1500, 1935); ctx.save(); gamepad(300 + Math.min(dd, .42) * 150, fy, .62, fy < 1935 ? dd * 7 : 2.9); ctx.restore(); }
    label = ['TRÁILER DE CTA VI 👀', S.semi + .1];
    if (t > S.drop + .05) stamp('¡SE LE CAYÓ!', 540, 925, C.red, -.06, t - S.drop - .05);
  } else if (t < S.fin) {
    // --- Kevin da el consejo y remontan ---
    const d = t - S.recov, sc = d < .7 ? [1, 2] : d < 1.8 ? [2, 2] : [3, 2];
    matchScreen(t, { sc, cars: true, nl: 'SEMIFINAL', nr: 'RONDAS', sub: 'PRIMERO A 3' });
    kevin(790, 1900, .95, t, { ex: 'happy', talk: tk });
    brayan(300, 1990, 1.0, t, { bald: true, ex: d < 1 ? 'sad' : 'determined', talk: tb, bob: true });
    padHold(790 + Math.sin(t * 9) * 5, 1900, .95, t, '#c88c63'); padHold(300 + Math.sin(t * 11) * 5, 1990, 1.0, t, SKB, 1.6);
    const kk = eback(clamp((d - .3) / .3)); circleCam(880, 700, 130, '#ff8fc8', () => sofiAngry(0, 600, .85, t, { ex: 'neutral', flip: true }), .6 + .3 * Math.sin(t * 8));
    if (d > 1.7) for (let i = 0; i < 4; i++) sparkle(360 + i * 130, 1230 - ((d * 1.5 + i * .3) % 1) * 160, 18, '#fff');
    if (t >= S.finalst) stamp('¡A LA FINAL!', 540, 925, C.green, -.05, t - S.finalst);
  } else if (t < S.win) {
    // --- final: Brayan vs Sofi, punto de oro ---
    const CU0 = cueT('s2') + 1.0, CU1 = cueT('b6') - .08;
    rays(540, 1000, '#3a2a6a', '#33255f', t);
    const showT = t > S.trail2 - .1;
    matchScreen(t, { sc: t >= S.gold ? [10, 9] : [9, 9], nl: 'BRAYAN', nr: 'SOFI', sub: 'FINAL · PUNTO DE ORO', duel: t - S.gold });
    circleCam(150, 780, 112, '#ffd23f', () => kevin(0, 545, .75, t, { ex: 'sad' }), 0);
    circleCam(930, 780, 112, '#9ad1ff', () => camilo(0, 525, .75, t, { ex: 'sad' }), 0);
    ctx.save(); ctx.globalAlpha = .8; for (const cx of [150, 930]) { line(cx - 70, 710, cx + 70, 850, 16, C.red); line(cx + 70, 710, cx - 70, 850, 16, C.red); } ctx.restore();
    ctx.save(); ctx.font = `700 34px ${F}`; ctx.textAlign = 'center'; outlined('ELIMINADO', 150, 868, C.red, 9); outlined('ELIMINADO', 930, 868, C.red, 9); ctx.restore();
    if (showT) bigScreen(540, 790, 440, 220, t, true);
    const tDist = t > cueT('s2') && t < cueT('s2') + EP.cues.find(c => c.k === 's2').d + .3, atk = t > cueT('b6') - .1;
    brayan(290, 1990, .98, t, { bald: true, ex: atk ? 'determined' : 'determined', talk: tb, sweat: t, bob: true });
    sofi(800, 1990, .98, t, { ex: tDist ? 'happy' : 'angry', talk: ts, wave: tDist });
    if (tDist) hearts(t, 800, 1220, 4);
    padHold(290, 1990, .98, t, SKB, atk ? 2 : 1); if (!tDist) padHold(800, 1990, .98, t, '#b9784f');
    label = ['PUNTO DE ORO ⭐', S.fin + .1];
    if (t >= CU0 && t < CU1) { // primer plano: no la mira
      rays(540, 1400, '#1f2a5c', '#1a2450', t * 2); bHead(540 + Math.sin(t * 40) * 3, 1440, 2.7, 'determined', false, t, { bald: true, sweat: t * 1.6 });
      for (let i = 0; i < 5; i++) { const q = ((t - CU0) * 1.5 + i / 5) % 1, hit = q > .5, y0 = 1250 + i * 85; let hx, hy, rot = 0; if (!hit) { hx = lerp(1180, 830, q / .5); hy = y0; } else { const u = (q - .5) / .5; hx = lerp(830, 960, u); hy = y0 + u * u * 520; rot = u * 3; } emo(hit ? '💔' : '💖', hx, hy, 1, 80, rot); }
      stamp('¡NO LA MIRA! 🚫', 540, 760, C.red, -.05, t - CU0 - .1); label = null;
    }
    if (t >= S.gold) stamp('¡PUNTO DE ORO!', 540, 925, '#e0a41c', -.05, t - S.gold);
  } else if (t < S.sofi) {
    // --- campeones ---
    rays(540, 1000, '#ffd34d', '#ffc21f', t);
    confetti(t, S.win);
    const jy = Math.abs(Math.sin(t * 7)) * 36;
    kevin(300, 1960 - jy, 1.0, t, { ex: 'happy', talk: tk });
    const bx = 740, bs = 1.0; brayan(bx, 1990 - jy * .7, bs, t, { bald: true, arm: 'up', ex: 'happy', talk: tb });
    trophy(bx + 227 * bs, 1990 - 621 * bs - 70 - jy * .7, 1.2, t);
    ctx.save(); ctx.translate(540, 760); ctx.rotate(Math.sin(t * 3) * .02); box(-370, -80, 740, 170, 22, 'rgba(0,0,0,.3)'); box(-380, -90, 740, 170, 22, '#1d1626'); ctx.lineWidth = 7; ctx.strokeStyle = C.coffee; rrect(-380, -90, 740, 170, 22); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 42px ${F}`; ctx.fillStyle = C.yellow; ctx.fillText('GANADORES · PREMIO', 0, -40); ctx.font = `700 96px ${F}`; ctx.fillStyle = '#5ad17a'; ctx.fillText('$1.000.000', 0, 26); ctx.restore();
    label = ['¡CAMPEONES! 🏆', S.win + .1];
    if (t > S.win + 1.0) { const k = eback(clamp((t - S.win - 1.0) / .3)); ctx.save(); ctx.translate(920, 600); ctx.scale(k, k); ctx.rotate(.06); ctx.fillStyle = '#fff'; ctx.font = `110px ${F}`; ctx.textAlign = 'center'; ctx.fillText('😳', 0, 0); ctx.restore(); }
  } else if (t < S.dil) {
    // --- Sofi se acerca ---
    rays(540, 1100, '#ffb3d9', '#ffa6d2', t);
    const k = eout(clamp((t - S.sofi) / .6)), sx = lerp(1250, 800, k);
    sofi(sx, 1990, 1.0, t, { ex: 'happy', talk: ts });
    brayan(300, 1990, 1.0, t, { bald: true, ex: 'shock', sweat: t, bob: true, talk: tb });
    trophy(300 + 120, 1990 - 400, .8, t);
    hearts(t, 800, 1280, 5);
    kevin(1010, 1700, .5, t, { ex: 'happy' }); const q = (t * 2) % 2; emo('🎵', 1000, 1330 - (q % 1) * 60, 1, 60);
  } else if (t < S.poll) {
    // --- el dilema: ¿la cita o CTA VI? ---
    rays(540, 1150, '#3a2a6a', '#33255f', t);
    const d = t - S.dil, gs = d < 1.5 ? 1 : d < 3.0 ? 0 : .6, gk = d < 1.5 ? 0 : d < 3.0 ? 1 : .6;
    circleCam(270, 650, 175, '#ff8fc8', () => sofi(0, 820, 1.1, t, { ex: 'happy' }), gs * (.6 + .4 * Math.sin(t * 8)));
    circleCam(810, 650, 175, '#ffd23f', () => { ctaArt(350, 350, t); ctx.fillStyle = 'rgba(18,10,36,.55)'; ctx.fillRect(-175, -175, 350, 350); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 100px ${F}`; outlined('CTA VI', 0, 0, C.yellow, 18); }, gk * (.6 + .4 * Math.sin(t * 8)));
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 54px ${F}`; outlined('LA CITA', 270, 870, '#ff8fc8', 12); outlined('CTA VI', 810, 870, C.yellow, 12); ctx.font = `700 110px ${F}`; outlined('¿?', 540, 650, C.cream, 16); ctx.restore();
    const kp = eback(clamp((d - .4) / .35)); if (kp > 0) { ctx.save(); ctx.translate(540, 990); ctx.scale(kp, kp); ctx.rotate(-.03); ctx.font = `700 52px ${F}`; const tw = ctx.measureText('PREVENTA $520.000').width + 56; box(-tw / 2, -44, tw, 88, 18, C.cream); ctx.lineWidth = 6; ctx.strokeStyle = C.red; rrect(-tw / 2, -44, tw, 88, 18); ctx.stroke(); ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('PREVENTA $520.000', 0, 4); ctx.restore(); }
    bHead(540, 1330, 1.9, d < 3.0 ? 'shock' : 'sad', tb, t, { bald: true, sweat: t, rot: d < 1.5 ? -.12 : d < 3.0 ? .12 : 0 });
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [cueT('s2') + 1.0, cueT('b6') - .08, S.m1, S.chat, S.kcut, S.semi, S.recov, S.fin, S.win, S.sofi, S.dil, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
