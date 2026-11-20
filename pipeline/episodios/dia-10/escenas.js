/* ===================== DÍA 10: "Me escapé con Sofi" ===================== */
function salaNight(t, tvOn) {
  salaHome(t);
  box(796, 236, 228, 298, 8, '#1b2350'); ell(960, 300, 34, 34, '#fff6c9'); ell(948, 294, 30, 30, '#1b2350');
  for (let i = 0; i < 6; i++) sparkle(820 + (i * 37) % 190, 260 + (i * 53) % 240, 5 + (i % 2) * 3, 'rgba(255,255,255,.8)');
  line(910, 236, 910, 534, 8, '#7a4c33'); line(796, 385, 1024, 385, 8, '#7a4c33');
  ctx.fillStyle = 'rgba(30,24,70,.22)'; ctx.fillRect(0, 0, W, H);
  // tele
  box(300, 470, 480, 290, 16, '#0b0b10'); box(316, 486, 448, 258, 8, tvOn ? '#2a1f4e' : '#14121c'); box(510, 760, 60, 60, 8, '#0b0b10');
  if (!tvOn) { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 50px ${F}`; ctx.fillStyle = `rgba(255,255,255,${.55 + .25 * Math.sin(t * 5)})`; ctx.fillText('SIN SEÑAL', 540, 600); ctx.font = `600 34px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillText('HDMI 1 · no detectado', 540, 660); }
}
function cableLoop(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = '#1c1c24'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 70 - i * 8, 46 - i * 5, i * .3, 0, Math.PI * 2); ctx.stroke(); }
  box(56, -12, 60, 26, 6, '#2a2a33'); box(110, -7, 26, 16, 3, '#c9c9d4'); box(-130, 20, 60, 26, 6, '#2a2a33'); box(-150, 25, 26, 16, 3, '#c9c9d4');
  ctx.restore();
}
function pizzaB(x, y, s, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  box(-150, -26, 300, 60, 8, 'rgba(0,0,0,.25)'); box(-150, -34, 300, 60, 8, '#e9c48c'); box(-150, -34, 300, 14, 6, '#d4a868');
  ctx.font = `700 34px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#c94a3e'; ctx.fillText('PIZZA 🍕', 0, 4);
  ctx.restore();
}
function smell(x, y, t) {
  ctx.save(); ctx.strokeStyle = 'rgba(255,240,200,.75)'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const ph = (t * .8 + i / 3) % 1; ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const yy = y - ph * 160 - k * 9, xx = x + (i - 1) * 60 + Math.sin(k * .6 + t * 4) * 18; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); }
  ctx.restore();
}
function updTV9(t, pct, eta, kev) {
  ctx.fillStyle = '#17122a'; ctx.fillRect(0, 0, W, H);
  const gl = ctx.createRadialGradient(540, 760, 80, 540, 760, 900); gl.addColorStop(0, 'rgba(120,140,255,.35)'); gl.addColorStop(1, 'rgba(120,140,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 760); box(-470, -280, 940, 560, 24, '#0b0b10'); ctx.save(); rrect(-450, -260, 900, 520, 12); ctx.clip(); const sg = ctx.createLinearGradient(0, -260, 0, 260); sg.addColorStop(0, '#3a1f6e'); sg.addColorStop(.6, '#c2457a'); sg.addColorStop(1, '#ff9a4a'); ctx.fillStyle = sg; ctx.fillRect(-450, -260, 900, 520); ell(0, 200, 170, 170, 'rgba(255,214,120,.55)'); ctx.fillStyle = 'rgba(10,8,24,.45)'; ctx.fillRect(-450, -260, 900, 520);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 120px ${F}`; outlined('CTA VI', 0, -120, C.yellow, 18);
  ctx.font = `600 46px ${F}`; ctx.fillStyle = '#fff'; ctx.fillText('Descargando actualización…', 0, 10);
  box(-360, 60, 720, 40, 20, 'rgba(255,255,255,.2)'); box(-360, 60, 720 * pct, 40, 20, '#5ad17a');
  ctx.font = `700 50px ${F}`; ctx.fillStyle = '#ff8f8f'; ctx.fillText(eta, 0, 160); ctx.restore(); ctx.restore();
  box(510, 1040, 60, 80, 10, '#0b0b10');
  ctx.save(); ctx.strokeStyle = '#2a2a33'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(540, 1110); ctx.bezierCurveTo(600, 1300, 720, 1380, 760, 1560); ctx.stroke(); ctx.restore();
  const b = Math.sin(t * 2) * 4;
  if (kev) { box(380, 1640, 320, 400, 120, '#ffd23f'); ell(540, 1560 + b, 120, 128, '#c88c63'); ell(540, 1500 + b, 128, 82, '#e2584a'); box(420, 1520 + b, 240, 30, 14, '#c94a3e'); pizzaB(840, 1700, 1, .1); gamepad(540, 1720, .7, Math.sin(t * 6) * .15); }
  else {
  box(200, 1640, 300, 400, 120, '#4f9e6a'); ell(350, 1560 + b, 118, 128, SKB); ell(230, 1570 + b, 22, 34, SKB); ell(470, 1570 + b, 22, 34, SKB); ell(320, 1500 + b, 40, 18, 'rgba(255,255,255,.45)', -.3);
  box(580, 1650, 280, 400, 110, '#7e57c2'); ell(720, 1560 - b, 112, 124, '#2b1d17'); ell(720, 1430 - b, 60, 50, '#2b1d17'); ell(780, 1470 - b, 40, 30, '#ff8fc8');
  }
}


function street(t) {
  const g = ctx.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#141a3d'); g.addColorStop(1, '#3a2a5e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 1500);
  ell(860, 300, 70, 70, '#fff6c9'); for (let i = 0; i < 14; i++) sparkle((i * 173) % 1080, 120 + (i * 97) % 600, 5 + (i % 3) * 2, 'rgba(255,255,255,.8)');
  const off = (t * 220) % 1400;
  for (let i = -1; i < 4; i++) { const x = i * 420 - off % 420; box(x, 900, 360, 620, 10, i % 2 ? '#2c2448' : '#352a55'); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) box(x + 50 + c * 160, 980 + r * 160, 100, 100, 8, (r + c + i) % 3 ? '#ffd27a' : '#4a3d70'); }
  box(-20, 1500, 1120, 420, 0, '#4a4458'); for (let i = 0; i < 6; i++) box(i * 260 - (t * 600) % 260, 1700, 140, 20, 6, '#e8e2c8');
  const lx = 900 - (t * 220) % 1400 + 400; box(lx, 900, 20, 620, 6, '#222'); ell(lx + 10, 900, 40, 22, '#ffe9a8'); ctx.save(); ctx.globalAlpha = .18; poly([[lx - 10, 910], [lx + 30, 910], [lx + 200, 1500], [lx - 180, 1500]], '#fff3b0'); ctx.restore();
}
function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), ts = talks(t, 'SOFI'), tk = talks(t, 'KEVIN');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  if (t < S.recap) {
    // --- gancho: corriendo de noche, bolsillos vacíos ---
    street(t);
    const hop = Math.abs(Math.sin(t * 9)) * 30;
    sofi(720, 1990 - hop, .95, t, { ex: 'happy', talk: ts });
    brayan(340, 1990 - Math.abs(Math.cos(t * 9)) * 30, 1.0, t, { bald: true, ex: t > 1.6 ? 'shock' : 'happy', talk: tb, sweat: t > 1.6 ? t : 0 });
    const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 112px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 10 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
    if (t > 1.0) stamp('¡NOS ESCAPAMOS! 🏃', 540, 520, '#2e9a55', -.05, t - 1.0);
    if (t > 2.2) stamp('BOLSILLO: $0 😬', 540, 1060, C.red, .04, t - 2.2);
  } else if (t < S.door) {
    rays(540, 1200, '#ff9f5a', '#ff9150', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: 'determined', talk: tb });
    label = ['ELIGIERON: ESCAPARSE 🏃', S.recap + .05];
    const q = eback(clamp((t - cueT('r0') - 2.2) / .3)); if (q > 0) { emo('❓', 860, 760, q, 150, .15); emo('💸', 220, 780, q, 130, -.15); }
  } else if (t < S.run) {
    // --- Kevin se queda con la consola ---
    salaNight(t, true);
    kevin(420, 1790, .8, t, { ex: 'happy', talk: tk }); pizzaB(420, 1380, .7, -.05); gamepad(290, 1500, .5, Math.sin(t * 4) * .1);
    sofaFront();
    const go = clamp((t - cueT('s0') - .6) / 1.0);
    brayan(lerp(760, 1320, eout(go)), 1990, .9, t, { bald: true, ex: 'happy', talk: tb });
    sofi(lerp(960, 1450, eout(go)), 1990, .9, t, { ex: t > cueT('s0') ? 'tired' : 'happy', talk: ts });
    label = ['KEVIN SE QUEDA 🎮', S.door + .05];
    if (t > cueT('s0') + .4) stamp('PRIMO CANSÓN 🙄', 540, 880, '#e2584a', -.04, t - cueT('s0') - .4);
  } else if (t < S.chat) {
    street(t);
    const hop = Math.abs(Math.sin(t * 9)) * 30;
    sofi(720, 1990 - hop, .95, t, { ex: 'happy' }); brayan(340, 1990 - Math.abs(Math.cos(t * 9)) * 30, 1.0, t, { bald: true, ex: 'happy' });
    hearts(t, 540, 1150, 4);
  } else if (t < S.shop) {
    rays(540, 1000, '#3fa39a', '#37958c', t);
    chatUI(t, S.chat, { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
      { at: .3, name: 'Mamá', nc: '#e8618c', text: 'Mijo, ¿y por qué Kevin está solo en la sala? 👀' },
      { at: 1.5, name: 'Primo Kevin', nc: '#e2584a', text: 'Tranquila tía, ya va en 40% 😎' },
      { at: 2.7, name: 'Tía Gladys', nc: '#8a6fd8', text: '¿Y a dónde llevaste a la muchacha? 💐' },
      { at: 3.9, mine: true, text: 'A comer helado… creo 🙃' }] });
    if (t > S.chat + 4.6) stamp('¿Y LA PLATA? 💸', 540, 1640, C.red, -.04, t - S.chat - 4.6);
  } else if (t < S.meanw) {
    heladeria(t, false);
    const pk = t >= S.pocket, paid = t >= cueT('s1');
    brayan(320, 1990, .95, t, { bald: true, ex: t >= cueT('b3') ? 'sad' : pk ? 'shock' : 'happy', talk: tb, sweat: pk ? t : 0 });
    sofi(790, 1990, .95, t, { ex: paid ? 'happy' : pk ? 'shock' : 'happy', talk: ts });
    if (pk && !paid) { emo('🕸️', 200, 1500, eback(clamp((t - S.pocket) / .3)), 110); emo('🪙', 440, 1500, 0, 1); }
    if (paid) { cone(450, 1450, .9, '#ff8fc8', t); cone(640, 1450, .9, '#7ad1ff', t); }
    if (t > S.pocket + .3 && !paid) stamp('BILLETERA: EN CASA 🤦', 540, 880, C.red, -.04, t - S.pocket - .3);
    if (paid) stamp('PAGA SOFI… OTRA VEZ 💳', 540, 880, '#7e57c2', .04, t - cueT('s1'));
  } else if (t < S.last) {
    const p = t < S.done ? .4 + (t - S.meanw) * .2 : 1;
    updTV9(t, p, t < S.done ? Math.round(p * 100) + '%  ·  bajando…' : '¡LISTO! 100% ✅', true);
    label = ['MIENTRAS TANTO… 🏠', S.meanw + .05];
    if (t > S.pelon) { const k = eback(clamp((t - S.pelon) / .35)); ctx.save(); ctx.translate(540, 1000); ctx.scale(k, k); box(-330, -60, 660, 120, 24, '#14141c'); ctx.font = `700 54px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.yellow; ctx.fillText('JUGADOR: BRAYAN PELÓN', 0, 4); ctx.restore(); }
  } else if (t < S.poll) {
    if (t < cueT('b4')) {
      heladeria(t, false);
      brayan(320, 1990, .95, t, { bald: true, ex: 'happy', talk: tb });
      sofi(790, 1990, .95, t, { ex: 'happy', talk: ts }); cone(860, 1500, .8, '#7ad1ff', t);
      hearts(t, 560, 1200, 3);
    } else {
      rays(540, 1200, '#2b3a6a', '#26345f', t);
      brayan(540, 2350, 1.85, t, { bald: true, ex: 'tired', talk: tb, sweat: t });
      label = ['MISIÓN: CONSEGUIR PLATA 💰', cueT('b4') + .05];
    }
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.recap, S.door, S.run, S.chat, S.shop, S.meanw, S.last, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
