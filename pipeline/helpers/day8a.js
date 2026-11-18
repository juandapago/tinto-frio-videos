/* ===================== DÍA 8: "Modo duro" ===================== */
function shades(x, y, s, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0); const dy = 6 + (o.dy || 0);
  line(-56, dy - 6, -92, dy - 16, 7, '#1c1c24'); line(56, dy - 6, 92, dy - 16, 7, '#1c1c24');
  for (const sx of [-1, 1]) { box(sx * 30 - 28, dy - 17, 56, 36, 12, '#14141c'); ell(sx * 30 - 10, dy - 7, 11, 5, 'rgba(255,255,255,.4)', -.3); }
  line(-6, dy - 4, 6, dy - 4, 7, '#14141c');
  if (o.crack) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(14, dy - 15); ctx.lineTo(30, dy - 2); ctx.lineTo(22, dy + 10); ctx.moveTo(30, dy - 2); ctx.lineTo(52, dy + 4); ctx.moveTo(30, dy - 2); ctx.lineTo(44, dy - 15); ctx.stroke(); }
  ctx.restore();
}
function stain(x, y, s) { ell(x, y, 34 * s, 24 * s, '#ff9ec4', .3); ell(x + 22 * s, y + 26 * s, 10 * s, 14 * s, '#ff9ec4'); ell(x - 18 * s, y + 18 * s, 8 * s, 9 * s, '#ff9ec4'); }
function meltCone(x, y, s, t, k) {
  cone(x, y, s, '#ff9ec4', t);
  for (let i = 0; i < 3; i++) { const q = (t * .8 + i / 3) % 1; ell(x - 20 * s + i * 20 * s, y + 10 * s + q * 140 * s * k, 7 * s, 11 * s, '#ff9ec4'); }
}
function lockPhone(t, flip) {
  ctx.save(); ctx.translate(540, 900);
  const k = flip <= 0 ? 1 : flip < .25 ? 1 - flip / .25 : (flip - .25) / .25; const back = flip >= .25;
  ctx.scale(Math.max(.02, Math.min(1, k)), 1);
  box(-300, -540, 640, 1120, 70, 'rgba(0,0,0,.4)'); box(-320, -560, 640, 1120, 70, back ? '#7e57c2' : '#0e0e12');
  if (back) { ell(-180, -400, 70, 70, '#2a1a3a'); ell(-180, -400, 40, 40, '#111'); ctx.font = `150px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('💜', 60, 120); ctx.restore(); return; }
  ctx.save(); rrect(-296, -536, 592, 1072, 50); ctx.clip();
  const g = ctx.createLinearGradient(0, -536, 0, 536); g.addColorStop(0, '#2d2a5a'); g.addColorStop(1, '#ff8fc8'); ctx.fillStyle = g; ctx.fillRect(-296, -536, 592, 1072);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#fff'; ctx.font = `700 150px ${F}`; ctx.fillText('4:31', 0, -330); ctx.font = `600 40px ${F}`; ctx.fillText('sábado 15', 0, -230);
  const nk = eback(clamp((t - S.notif - .3) / .35)); if (nk > 0) { ctx.save(); ctx.translate(0, -60); ctx.scale(nk, nk); box(-260, -90, 520, 190, 34, 'rgba(255,255,255,.94)'); ell(-190, -30, 36, 36, '#5aa9ff'); ctx.font = `42px ${F}`; ctx.fillText('🎧', -190, -26);
    ctx.textAlign = 'left'; ctx.fillStyle = C.ink; ctx.font = `700 40px ${F}`; ctx.fillText('Primo Camilo', -136, -40); ctx.fillStyle = '#8a8698'; ctx.font = `600 28px ${F}`; ctx.fillText('ahora', 150, -40);
    ctx.fillStyle = C.ink; ctx.font = `600 44px ${F}`; ctx.fillText('Prima, ¿ya cayó? 😎', -230, 40); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
function tableBg(t) { ctx.fillStyle = '#c98a5a'; ctx.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 46) { ctx.fillStyle = `rgba(90,50,25,${.06 + .05 * Math.sin(y * .13)})`; ctx.fillRect(0, y, W, 20); } ell(880, 1560, 120, 60, 'rgba(0,0,0,.12)'); coneEmpty(880, 1480, 1.2, t); }
function duelCard(t, k) {
  if (k <= 0) return; ctx.save(); ctx.translate(540, 690); ctx.scale(k, k); ctx.rotate(-.02);
  box(-420, -120, 860, 250, 30, 'rgba(0,0,0,.3)'); box(-430, -130, 860, 250, 30, '#1d1626'); ctx.lineWidth = 8; ctx.strokeStyle = C.yellow; rrect(-430, -130, 860, 250, 30); ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 42px ${F}`; ctx.fillStyle = C.cream; ctx.fillText('SÁBADO · EN SU CASA', 0, -78);
  ctx.font = `700 92px ${F}`; outlined('DUELO DE CTA V', 0, 6, C.yellow, 16); ctx.font = `64px ${F}`; ctx.fillText('🎮', -370, 6); ctx.fillText('🎮', 370, 6);
  ctx.font = `700 36px ${F}`; ctx.fillStyle = '#5ad17a'; ctx.fillText('GANA: CITA ❤️', -200, 82); ctx.fillStyle = C.red; ctx.fillText('PIERDE: HISTORIA 📱', 190, 82);
  ctx.restore();
}
const KEV8 = { color: '#e2584a', icon: '🧢', title: 'Primo Kevin', sub: 'en línea', msgs: [
  { at: .4, mine: true, text: 'Me retó a CTA V. Si pierdo, subo historia y pierdo el reto 😭' },
  { at: 1.9, text: 'Primo, usted juega horrible.' },
  { at: 3.2, text: 'Tranquilo. Yo cargo 😎' }] };

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), ts = talks(t, 'SOFI');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  const BX = 320, BFY = 1990, BS = .95, HX = BX, HY = BFY - 590 * BS;
  if (t < S.sil) {
    // --- plano medio: gafas de sol ---
    const rec = t >= S.recap;
    if (!rec) heladeria(t, false); else rays(540, 1200, '#ff9f5a', '#ff9150', t);
    const tw = t >= S.twitch && t < S.sil ? Math.sin(t * 60) * 4 : 0;
    brayan(540 + tw, 2350, 1.85, t, { bald: true, ex: rec ? 'shock' : 'determined', talk: tb, sweat: rec ? t : 0 });
    const dy = !rec ? lerp(-150, 0, eout(clamp((t - .2) / .8))) : 24;
    if (t > .2) shades(540 + tw, 2350 - 590 * 1.85, 1.85, { dy });
    if (!rec) { meltCone(830, 1560, 1.5, t, 1); ell(830, 1720, 60, 34, SKB); }
    if (t >= S.twitch && t < S.sil) { ctx.save(); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { const a = -.6 + i * .5; ctx.beginPath(); ctx.moveTo(540 + 120 + Math.cos(a) * 40, 1260 + Math.sin(a) * 40); ctx.lineTo(540 + 120 + Math.cos(a) * 70, 1260 + Math.sin(a) * 70); ctx.stroke(); } ctx.restore(); }
    if (!rec) { const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 8 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
      if (t > 1.0) stamp('MODO DURO 😎', 540, 880, '#14141c', -.05, t - 1.0); }
    else label = ['ELIGIERON: HACERSE EL DURO', S.recap + .05];
    if (t >= cueT('n0')) stamp('POR DENTRO: 😭', 540, 880, C.red, .04, t - cueT('n0'));
  } else if (t < S.notif) {
    // --- plano doble: silencio y revelación ---
    heladeria(t, false);
    const revd = t >= S.rev, fell = t >= S.fall, fd = t - S.fall;
    brayan(BX, BFY, BS, t, { bald: true, ex: revd ? 'shock' : 'determined', talk: tb, sweat: revd ? t : 0 });
    if (!fell) shades(HX, HY, BS, { dy: 0 });
    else { const y = Math.min(HY + fd * fd * 2600, 1860), done = y >= 1860; shades(HX + Math.min(fd, .4) * 120, y, BS, { dy: 0, rot: done ? .3 : fd * 8, crack: done }); }
    if (t >= S.higiene - .2) stain(BX + 40, BFY - 430 * BS, BS);
    const ck = S.drip; if (t < S.higiene) { meltCone(BX + 160, BFY - 380 * BS, .8, t, 1); if (t > ck) { const q = clamp((t - ck) / .45); ell(BX + 140 - q * 90, BFY - 330 * BS + q * 30, 9, 13, '#ff9ec4'); } } else coneEmpty(BX + 160, BFY - 380 * BS, .8, t);
    sofi(790, 1990, .95, t, { ex: revd ? 'happy' : 'neutral', talk: ts });
    if (!revd && t > cueT('b1') + .9) { const h = Math.abs(Math.sin(t * 7)) * 50; emo('🦗', 560, 1900 - h, 1, 90); }
    if (!revd && t > cueT('b1') + .9) stamp('SILENCIO INCÓMODO 🦗', 540, 880, '#5b8c3a', -.04, t - cueT('b1') - .9);
    if (revd && t > S.rev + 1.2) stamp('¡ELLA TAMBIÉN! 😱', 540, 800, C.red, .04, t - S.rev - 1.2);
  } else if (t < S.duel) {
    // --- la notificación de Camilo ---
    tableBg(t);
    lockPhone(t, t >= S.flip ? t - S.flip : 0);
    if (t >= cueT('n1')) stamp('LOS DOS TENÍAN UN KEVIN', 540, 1500, '#7e57c2', -.04, t - cueT('n1'));
  } else if (t < S.chat) {
    // --- el duelo ---
    heladeria(t, false);
    brayan(BX, BFY, BS, t, { bald: true, ex: t >= cueT('b3') ? 'sad' : 'shock', talk: tb, sweat: t * 1.4 });
    stain(BX + 40, BFY - 430 * BS, BS); coneEmpty(BX + 160, BFY - 380 * BS, .8, t);
    shades(BX + 114, 1860, BS, { dy: 0, rot: .3, crack: true });
    sofiAngry(790, 1990, .95, t, { ex: 'happy', talk: ts });
    duelCard(t, eback(clamp((t - S.duel - .3) / .35)));
    if (t >= cueT('s2')) stamp('SI PIERDE: ¡SUBE HISTORIA! 📱', 540, 920, C.red, -.04, t - cueT('s2'));
  } else if (t < S.last) {
    // --- chat con Kevin ---
    rays(540, 1000, '#e2584a', '#d84a3c', t);
    chatUI(t, S.chat, KEV8);
    if (t > S.chat + 3.4) stamp('“YO CARGO” (OTRA VEZ) 🧢', 540, 1590, '#e2584a', -.04, t - S.chat - 3.4);
  } else if (t < S.poll) {
    // --- cierre: ahora le toca serlo ---
    rays(540, 1200, '#2b3a6a', '#26345f', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: 'determined', talk: tb, sweat: t });
    stain(540 + 70, 2350 - 430 * 1.85, 1.85);
    shades(540, 2350 - 590 * 1.85, 1.85, { dy: 0, crack: true });
    label = ['AHORA SÍ: MODO DURO', S.last + .05];
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.recap, S.sil, S.rev, S.notif, S.duel, S.chat, S.last, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
