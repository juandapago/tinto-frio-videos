/* ===================== DÍA 9: "Eché a Kevin" ===================== */
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
function updTV9(t, pct, eta) {
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
  box(200, 1640, 300, 400, 120, '#4f9e6a'); ell(350, 1560 + b, 118, 128, SKB); ell(230, 1570 + b, 22, 34, SKB); ell(470, 1570 + b, 22, 34, SKB); ell(320, 1500 + b, 40, 18, 'rgba(255,255,255,.45)', -.3);
  box(580, 1650, 280, 400, 110, '#7e57c2'); ell(720, 1560 - b, 112, 124, '#2b1d17'); ell(720, 1430 - b, 60, 50, '#2b1d17'); ell(780, 1470 - b, 40, 30, '#ff8fc8');
}

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), ts = talks(t, 'SOFI'), tk = talks(t, 'KEVIN');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  if (t < S.recap) {
    // --- gancho: tele sin señal, Sofi aburrida ---
    salaNight(t, false);
    sofaFront();
    sofi(800, 1990, .9, t, { ex: 'tired', talk: ts });
    consola(690, 1620, .6, .1);
    brayan(300, 1990, .95, t, { bald: true, ex: 'sad', talk: tb, sweat: t });
    const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 9 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
    if (t > 1.3) stamp('SIN CABLE 🔌', 540, 900, C.red, -.05, t - 1.3);
  } else if (t < S.door) {
    // --- recap ---
    rays(540, 1200, '#ff9f5a', '#ff9150', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: 'determined', talk: tb });
    label = ['ELIGIERON: ECHAR A KEVIN 👋', S.recap + .05];
    const q = eback(clamp((t - cueT('r0') - 1.6) / .3)); if (q > 0) { emo('❓', 860, 760, q, 150, .15); cableLoop(220, 780, .9 * q, -.2); }
  } else if (t < S.chat) {
    if (t < S.slam) {
      // --- hace 5 minutos: Kevin se va con el cable ---
      salaNight(t, true);
      const out = clamp((t - S.yank) / 1.2), kx = lerp(700, 1000, eout(out));
      kevin(kx, 1790, .8, t, { ex: 'happy', talk: tk });
      cableLoop(kx + 60, 1330, .8, .2 + Math.sin(t * 3) * .05);
      if (t < S.yank) { ctx.save(); ctx.strokeStyle = '#1c1c24'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(kx + 120, 1340); ctx.bezierCurveTo(820, 1200, 700, 1000, 540, 760); ctx.stroke(); ctx.restore(); }
      sofaFront();
      brayan(250, 1990, .95, t, { bald: true, ex: t > cueT('b1') ? 'angry' : 'shock', talk: tb });
      label = ['HACE 5 MINUTOS ⏪', S.door + .05];
      if (t > S.yank) stamp('¡SE LLEVÓ EL CABLE! 🔌', 540, 900, '#e2584a', .04, t - S.yank);
    } else {
      // --- pantalla negra ---
      ctx.fillStyle = '#0d0b14'; ctx.fillRect(0, 0, W, H);
      const sh = t - S.slam < .4 ? Math.sin(t * 80) * 10 : 0;
      ctx.save(); ctx.translate(sh, 0); box(90, 520, 900, 560, 26, '#000'); box(110, 540, 860, 520, 12, '#14121c');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 110px ${F}`; ctx.fillStyle = `rgba(255,255,255,${.6 + .3 * Math.sin(t * 6)})`; ctx.fillText('SIN SEÑAL', 540, 760);
      ctx.font = `600 50px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillText('HDMI 1 · no detectado', 540, 880); ctx.restore();
      const z = (t - S.slam) * 1.4; ell(540, 1460, 60 + z * 10, 60 + z * 10, 'rgba(0,0,0,0)');
      emo('💔', 540, 1270, eback(clamp((t - cueT('n0') - 1.5) / .3)), 150);
      stamp('¡FUERA! 👋', 540, 330, C.red, -.04, t - S.slam);
    }
  } else if (t < S.sala) {
    // --- chat familiar ---
    rays(540, 1000, '#3fa39a', '#37958c', t);
    chatUI(t, S.chat, { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
      { at: .3, mine: true, text: '¿Alguien tiene cable HDMI? 🙏' },
      { at: 1.4, name: 'Mamá', nc: '#e8618c', text: '¿El de la plancha sirve? 🔌' },
      { at: 2.6, name: 'Tía Gladys', nc: '#8a6fd8', text: 'Yo tengo uno… en Cali 🚌' },
      { at: 3.8, name: 'Primo Kevin', nc: '#e2584a', text: 'Se lo alquilo: 20 mil 😎' }] });
    if (t > S.chat + 4.4) stamp('KEVIN COBRA 💸', 540, 1640, '#e2584a', -.04, t - S.chat - 4.4);
  } else if (t < S.upd) {
    // --- la consola traía cable ---
    salaNight(t, false);
    sofaFront();
    const rv = t >= S.reveal;
    sofi(790, 1990, .9, t, { ex: rv ? 'happy' : 'tired', talk: ts });
    consola(680, 1620, .6, .1);
    brayan(300, 1990, .95, t, { bald: true, ex: t >= cueT('b4') ? 'sad' : rv ? 'shock' : 'tired', talk: tb, sweat: t >= cueT('b4') ? t : 0 });
    if (rv) { const k = eback(clamp((t - S.reveal) / .35)); cableLoop(790, 1200, 1.2 * k, Math.sin(t * 3) * .1); for (let i = 0; i < 4; i++) sparkle(700 + i * 60, 1120 - ((t * 1.3 + i * .25) % 1) * 120, 16, '#fff'); }
    if (t > S.reveal + .3) stamp('¡TRAÍA CABLE! 🤦', 540, 900, '#3d8bff', .04, t - S.reveal - .3);
  } else if (t < S.knock) {
    if (t < S.talk) { updTV9(t, .02 + .002 * Math.sin(t), '2%  ·  5 h 58 min'); if (t > cueT('b5')) stamp('¿SIN PANTALLA? 😨', 540, 1240, C.red, -.04, t - cueT('b5')); }
    else {
      // --- conversan ---
      salaNight(t, true);
      box(316, 486, 448 * .05, 20, 4, '#5ad17a');
      sofaFront();
      brayan(330, 1990, .95, t, { bald: true, ex: 'happy', talk: Math.sin(t * 3) > .2 });
      sofi(760, 1990, .9, t, { ex: 'happy', talk: Math.sin(t * 3) <= .2 });
      hearts(t, 540, 1250, 5);
      label = ['CONVERSANDO 💬', S.talk + .05];
    }
  } else if (t < S.last) {
    // --- Kevin en la ventana con pizza ---
    salaNight(t, true);
    ctx.save(); rrect(796, 236, 228, 298, 8); ctx.clip(); const kk = eout(clamp((t - S.knock) / .4)); kevin(910, 900 + (1 - kk) * 300, .75, t, { ex: 'happy', talk: tk }); ctx.restore();
    line(910, 236, 910, 534, 8, '#7a4c33'); line(796, 385, 1024, 385, 8, '#7a4c33');
    pizzaB(910, 560, .8, -.05); smell(910, 520, t);
    if (t - S.knock < .9) { const s = Math.sin((t - S.knock) * 40) * 8; ctx.font = `700 70px ${F}`; ctx.textAlign = 'center'; outlined('TOC TOC', 560 + s, 330, C.cream, 12); }
    sofaFront();
    brayan(330, 1990, .95, t, { bald: true, ex: 'shock', talk: tb });
    sofi(760, 1990, .9, t, { ex: 'shock', talk: ts });
    if (t > cueT('k1') + .8) stamp('¡VOLVIÓ CON PIZZA! 🍕', 540, 880, C.red, -.04, t - cueT('k1') - .8);
  } else if (t < S.poll) {
    // --- cierre ---
    rays(540, 1200, '#c2603a', '#b65634', t);
    brayan(540, 2350, 1.85, t, { bald: true, ex: 'tired', talk: tb });
    smell(540, 1000, t); pizzaB(830, 820, 1.1, .1);
    label = ['LO PEOR: 🍕', S.last + .05];
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.recap, S.door, S.slam, S.chat, S.sala, S.upd, S.talk, S.knock, S.last, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
