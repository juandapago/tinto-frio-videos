/* ===================== DÍA 8 (v2): "Te estoy avisando" ===================== */
function gameCase(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  box(-66, -90, 140, 190, 12, 'rgba(0,0,0,.25)'); box(-70, -95, 140, 190, 12, '#1d4fa3'); box(-58, -60, 116, 140, 6, '#2a1a4a');
  ctx.save(); rrect(-58, -60, 116, 140, 6); ctx.clip(); const cg = ctx.createLinearGradient(0, -60, 0, 80); cg.addColorStop(0, '#3a1f6e'); cg.addColorStop(.6, '#c2457a'); cg.addColorStop(1, '#ff9a4a'); ctx.fillStyle = cg; ctx.fillRect(-58, -60, 116, 140); ell(0, 60, 40, 40, 'rgba(255,214,120,.7)'); line(-40, 80, -34, 0, 6, '#1d1030'); for (let i = 0; i < 4; i++) { ctx.save(); ctx.translate(-34, 0); ctx.rotate(-1.3 + i * .8); ell(16, 0, 18, 5, '#1d1030'); ctx.restore(); } ctx.font = `700 60px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('VI', 14, 4, '#ff5ca8', 10); ctx.restore();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 34px ${F}`; outlined('CTA VI', 0, -76, C.yellow, 8);
  ctx.restore();
}
function consola(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  box(-62, -96, 132, 200, 26, 'rgba(0,0,0,.25)'); box(-66, -100, 132, 200, 26, '#f4f4f8'); box(-12, -100, 24, 200, 6, '#14141c'); box(-56, 70, 30, 8, 4, '#3d8bff');
  ctx.restore();
}
function notifCard(t, t0) {
  const k = eback(clamp((t - t0) / .35)); if (k <= 0) return;
  ctx.save(); ctx.translate(540 + (t - t0 < .5 ? Math.sin(t * 60) * 6 : 0), 640 - (1 - k) * 300); ctx.rotate(-.012);
  box(-450, -120, 900, 240, 40, 'rgba(0,0,0,.35)'); box(-460, -130, 920, 240, 40, '#fff'); ctx.lineWidth = 8; ctx.strokeStyle = C.coffee; rrect(-460, -130, 920, 240, 40); ctx.stroke();
  ell(-370, -10, 58, 58, '#ffd23f'); ctx.font = `66px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('📦', -370, -4);
  ctx.textAlign = 'left'; ctx.fillStyle = '#e2584a'; ctx.font = `700 40px ${F}`; ctx.fillText('Tienda de juegos · ahora', -290, -70);
  ctx.fillStyle = C.ink; ctx.font = `700 60px ${F}`; ctx.fillText('¡CTA VI YA SALIÓ! 🎉', -290, -4); ctx.font = `600 40px ${F}`; ctx.fillStyle = '#5a5668'; ctx.fillText('Tu pedido fue entregado ✅', -290, 58);
  ctx.restore();
}
function backHeads(t) {
  // Brayan, Sofi y Kevin de espaldas frente a la tele
  const b = Math.sin(t * 2) * 4;
  box(70, 1640, 300, 400, 120, '#4f9e6a'); ell(220, 1560 + b, 118, 128, SKB); ell(100, 1570 + b, 22, 34, SKB); ell(340, 1570 + b, 22, 34, SKB); ell(190, 1500 + b, 40, 18, 'rgba(255,255,255,.45)', -.3);
  box(400, 1650, 280, 400, 110, '#7e57c2'); ell(540, 1560 - b, 112, 124, '#2b1d17'); ell(540, 1430 - b, 60, 50, '#2b1d17'); ell(600, 1470 - b, 40, 30, '#ff8fc8');
  box(730, 1640, 300, 400, 120, '#ffd23f'); ell(880, 1560 + b, 116, 124, '#c88c63'); ell(880, 1500 + b, 124, 80, '#e2584a'); box(770, 1520 + b, 220, 30, 14, '#c94a3e');
}
function updateTV(t) {
  ctx.fillStyle = '#17122a'; ctx.fillRect(0, 0, W, H);
  const gl = ctx.createRadialGradient(540, 760, 80, 540, 760, 900); gl.addColorStop(0, 'rgba(120,140,255,.35)'); gl.addColorStop(1, 'rgba(120,140,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 760); box(-470, -280, 940, 560, 24, '#0b0b10'); ctx.save(); rrect(-450, -260, 900, 520, 12); ctx.clip(); const sg = ctx.createLinearGradient(0, -260, 0, 260); sg.addColorStop(0, '#3a1f6e'); sg.addColorStop(.6, '#c2457a'); sg.addColorStop(1, '#ff9a4a'); ctx.fillStyle = sg; ctx.fillRect(-450, -260, 900, 520); ell(0, 200, 170, 170, 'rgba(255,214,120,.55)'); for (const px of [-360, 330]) { line(px, 260, px + 20, 60, 14, '#1d1030'); for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(px + 20, 60); ctx.rotate(-1.4 + i * .7); ell(46, 0, 50, 12, '#1d1030'); ctx.restore(); } } ctx.fillStyle = 'rgba(10,8,24,.45)'; ctx.fillRect(-450, -260, 900, 520);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 120px ${F}`; outlined('CTA VI', 0, -120, C.yellow, 18);
  ctx.font = `600 46px ${F}`; ctx.fillStyle = '#fff'; ctx.fillText('Descargando actualización…', 0, 10);
  box(-360, 60, 720, 40, 20, 'rgba(255,255,255,.2)'); box(-360, 60, 720 * (.01 + .002 * Math.sin(t)), 40, 20, '#5ad17a');
  ctx.font = `700 50px ${F}`; ctx.fillStyle = '#ff8f8f'; ctx.fillText('1%  ·  6 h 12 min', 0, 160); ctx.restore(); ctx.restore();
  box(510, 1040, 60, 80, 10, '#0b0b10');
}

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), ts = talks(t, 'SOFI'), tk = talks(t, 'KEVIN');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  const BX = 320, BFY = 1990, BS = .95, HY = BFY - 590 * BS;
  if (t < S.inv) {
    // --- plano medio: modo duro y la notificación ---
    const rec = t >= S.recap, nt = t >= S.notif;
    if (!rec) heladeria(t, false); else rays(540, 1200, '#ff9f5a', '#ff9150', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: nt ? 'shock' : rec ? 'determined' : 'determined', talk: tb, sweat: nt ? t : 0 });
    const dy = !rec ? lerp(-150, 0, eout(clamp((t - .2) / .8))) : nt ? lerp(0, -95, eout(clamp((t - S.notif) / .3))) : 0;
    if (t > .2) shades(540, 2350 - 590 * 1.85, 1.85, { dy });
    if (!rec) { meltCone(830, 1560, 1.5, t, 1); ell(830, 1720, 60, 34, SKB); }
    if (!rec) { const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 8 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
      if (t > 1.0) stamp('MODO DURO 😎', 540, 880, '#14141c', -.05, t - 1.0); }
    else if (!nt) label = ['ELIGIERON: MODO DURO 😎', S.recap + .05];
    if (nt) notifCard(t, S.notif);
  } else if (t < S.chat) {
    // --- la invitación ---
    heladeria(t, false);
    const acc = t >= S.acc;
    brayan(BX, BFY, BS, t, { bald: true, ex: 'determined', talk: tb });
    shades(BX, HY, BS, { dy: 0 });
    meltCone(BX + 160, BFY - 380 * BS, .8, t, 1);
    sofi(790, 1990, .95, t, { ex: acc ? 'happy' : 'neutral', talk: ts });
    const c1 = cueT('b1'), g = eback(clamp((t - c1 - .5) / .3)), cn = eback(clamp((t - c1 - 1.5) / .3)), hs = eback(clamp((t - c1 - 2.6) / .3));
    if (!acc) { if (g > 0) gameCase(250, 700, 1.4 * g, -.08); if (cn > 0) consola(830, 700, 1.35 * cn, .08); if (hs > 0) { ctx.save(); ctx.translate(540, 600); ctx.scale(hs, hs); ctx.font = `700 120px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('+', 0, 0, C.yellow, 16); ctx.restore(); emo('🏠', 540, 760, hs, 150); } }
    if (t > S.acc + 1.2) stamp('¡ACEPTÓ! 🎮', 540, 860, '#2e9a55', -.04, t - S.acc - 1.2);
    if (acc) hearts(t, 790, 1250, 4);
  } else if (t < S.shower) {
    // --- chat familiar ---
    rays(540, 1000, '#3fa39a', '#37958c', t);
    chatUI(t, S.chat, { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
      { at: .4, name: 'Mamá', nc: '#e8618c', text: 'Mijo, llegó una caja que dice CTA VI 📦' },
      { at: 1.6, name: 'Mamá', nc: '#e8618c', text: '¿Y quién viene esta noche? 👀' },
      { at: 2.9, name: 'Primo Kevin', nc: '#e2584a', text: 'Una novia 😏 Yo también voy' },
      { at: 4.1, mine: true, text: 'NADIE MÁS VIENE 😤' }] });
    if (t > S.chat + 3.1) stamp('KEVIN SE INVITÓ 😬', 540, 1590, '#e2584a', -.04, t - S.chat - 3.1);
  } else if (t < S.door) {
    // --- la ducha ---
    bathroom(t);
    if (t > cueT('n1') + 1.6) stamp('¡SE BAÑÓ! 🧼', 540, 1250, '#3d8bff', .04, t - cueT('n1') - 1.6);
  } else if (t < S.upd) {
    // --- 8:00 PM: Kevin ya estaba ---
    salaHome(t);
    box(300, 470, 480, 290, 16, '#0b0b10'); box(316, 486, 448, 258, 8, '#1d1a2e');
    kevin(560, 1790, .8, t, { ex: 'happy', talk: tk });
    gamepad(560, 1500, .55, Math.sin(t * 4) * .1);
    ctx.save(); ctx.strokeStyle = '#1c1c24'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(640, 1500); ctx.bezierCurveTo(760, 1480, 700, 1200, 540, 760); ctx.stroke(); ctx.restore();
    sofaFront();
    brayan(190, 1990, .9, t, { bald: true, ex: t >= cueT('k0') ? 'shock' : 'happy', talk: tb });
    for (let i = 0; i < 4; i++) sparkle(110 + i * 55, 1300 - ((t * 1.2 + i * .25) % 1) * 140, 16, '#fff');
    const sk = eout(clamp((t - S.sofiin) / .6)), sx = lerp(1260, 900, sk);
    sofi(sx, 1990, .9, t, { ex: t >= cueT('k0') ? 'shock' : 'happy', talk: ts });
    consola(sx - 80, 1990 - 400 * .9, .85, .1);
    label = ['8:00 PM 🕗', S.door + .05];
    if (t > cueT('k0') + 1.2) stamp('¡KEVIN YA ESTABA! 😱', 540, 880, C.red, -.04, t - cueT('k0') - 1.2);
  } else if (t < S.last) {
    // --- la actualización ---
    updateTV(t);
    ctx.save(); ctx.strokeStyle = '#2a2a33'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(540, 1110); ctx.bezierCurveTo(620, 1300, 760, 1350, 820, 1560); ctx.stroke(); ctx.restore();
    backHeads(t);
    if (t > S.cable) stamp('EL CABLE ES DE KEVIN 🔌', 540, 1220, '#e2584a', -.04, t - S.cable);
    else if (t > cueT('s2')) stamp('¿6 HORAS? 😱', 540, 1220, C.red, .04, t - cueT('s2'));
  } else if (t < S.poll) {
    // --- cierre: esto no fue a propósito ---
    rays(540, 1200, '#2b3a6a', '#26345f', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: 'sad', talk: tb, sweat: t });
    shades(540, 2350 - 590 * 1.85, 1.85, { dy: -95 });
    label = ['MODO DURO: ❌', S.last + .05];
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.recap, S.inv, S.chat, S.shower, S.door, S.upd, S.last, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
