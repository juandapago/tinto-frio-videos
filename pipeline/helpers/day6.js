/* ===================== DÍA 6: "Ella viene sola" ===================== */
function emo(txt, x, y, k, sz = 90, rot = 0) { if (k <= 0) return; ctx.save(); ctx.font = `${sz}px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(rot); ctx.fillText(txt, 0, 0); ctx.restore(); }
function receipt(x, y, s, rot, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const w = 360, h = 520; ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-w / 2 + 10, -h / 2 + 10, w, h);
  ctx.fillStyle = '#fffdf6'; ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, -h / 2); ctx.lineTo(w / 2, h / 2); for (let i = 0; i < 12; i++) ctx.lineTo(w / 2 - (i + .5) * 30, h / 2 + (i % 2 ? 0 : 22)); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink; ctx.font = `700 78px ${F}`; ctx.fillText('CTA VI', 0, -190);
  ctx.font = `700 40px ${F}`; ctx.fillStyle = '#7a5a48'; ctx.fillText('PREVENTA', 0, -126);
  for (let i = 0; i < 2; i++) box(-140, -92 + i * 22, 280, 8, 4, '#d8d2c4');
  ctx.font = `700 64px ${F}`; ctx.fillStyle = '#2e9a55'; ctx.fillText('$520.000', 0, -8);
  ctx.font = `700 30px ${F}`; ctx.fillStyle = C.ink; ctx.fillText('ENTREGA:', 0, 66);
  ctx.save(); ctx.translate(0, 126); ctx.rotate(-.05); box(-160, -38, 320, 76, 10, 'rgba(255,77,77,.12)'); ctx.lineWidth = 6; ctx.strokeStyle = C.red; rrect(-160, -38, 320, 76, 10); ctx.stroke(); ctx.font = `700 46px ${F}`; ctx.fillStyle = C.red; ctx.fillText('ALGÚN DÍA', 0, 3); ctx.restore();
  if (!o.noFine) for (let i = 0; i < 3; i++) box(-150, 190 + i * 14, 300 - i * 50, 5, 2, '#b9b2a3');
  ctx.restore();
}
function cone(x, y, s, col, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * .05);
  poly([[-34, 0], [34, 0], [0, 120]], '#e0a85a'); line(-20, 22, 12, 60, 4, '#c98a3a'); line(20, 22, -12, 60, 4, '#c98a3a');
  ell(0, -22, 46, 42, col); ell(-14, -36, 12, 8, 'rgba(255,255,255,.5)', -.4);
  const k = (t * .6) % 1; ell(24, 6 + k * 60, 7, 10, col);
  ctx.restore();
}
function kevinBanner(t, t0, l1, l2, y = 440) {
  if (t < t0) return; const k = eback(clamp((t - t0) / .35)); const h = l2 ? 330 : 250;
  ctx.save(); ctx.translate(540 + (t - t0 < .6 ? Math.sin(t * 60) * 6 : 0), y - (1 - k) * 400); ctx.rotate(-.012);
  box(-470, -120, 960, h, 40, 'rgba(0,0,0,.35)'); box(-480, -130, 960, h, 40, '#fff'); ctx.lineWidth = 8; ctx.strokeStyle = C.coffee; rrect(-480, -130, 960, h, 40); ctx.stroke();
  ell(-400, -62, 46, 46, '#e2584a'); ctx.font = `54px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧢', -400, -58);
  ctx.textAlign = 'left'; ctx.fillStyle = '#e2584a'; ctx.font = `700 46px ${F}`; ctx.fillText('Primo Kevin', -336, -74); ctx.fillStyle = '#8a8698'; ctx.font = `600 32px ${F}`; ctx.fillText('ahora', 330, -74);
  ctx.fillStyle = C.ink; fitFont(l1, 700, 62, 900); ctx.fillText(l1, -444, 26); if (l2) { fitFont(l2, 700, 62, 900); ctx.fillText(l2, -444, 106); }
  ctx.restore();
}
const SOFI6 = { color: '#ff8fc8', icon: '💜', title: 'Sofi', sub: 'en línea', msgs: [
  { at: .4, text: 'Hola, campeón 👀' },
  { at: 1.5, text: '¿Helado? Yo invito 🍦' },
  { at: 2.7, text: '¿Brayan?' }] };
function callPhone(t, hung) {
  const j = hung ? 0 : Math.sin(t * 70) * 7;
  ctx.save(); ctx.translate(540 + j, 900); ctx.rotate(hung ? 0 : Math.sin(t * 35) * .012);
  box(-300, -540, 640, 1120, 70, 'rgba(0,0,0,.4)'); box(-320, -560, 640, 1120, 70, '#0e0e12');
  ctx.save(); rrect(-296, -536, 592, 1072, 50); ctx.clip();
  const g = ctx.createLinearGradient(0, -536, 0, 536); if (hung) { g.addColorStop(0, '#f4f1ec'); g.addColorStop(1, '#e9e4dc'); } else { g.addColorStop(0, '#ff8fc8'); g.addColorStop(1, '#7e57c2'); } ctx.fillStyle = g; ctx.fillRect(-296, -536, 592, 1072);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (!hung) {
    const p = 1 + .08 * Math.sin(t * 9); ell(0, -250, 130 * p, 130 * p, 'rgba(255,255,255,.25)'); ell(0, -250, 104, 104, '#fff'); ctx.font = `110px ${F}`; ctx.fillText('🍦', 0, -244);
    ctx.fillStyle = '#fff'; ctx.font = `700 110px ${F}`; ctx.fillText('SOFI', 0, -40); ctx.font = `600 50px ${F}`; ctx.fillText('llamando' + '.'.repeat(1 + Math.floor(t * 3) % 3), 0, 50);
    ell(-150, 360, 78, 78, '#ff4d4d'); ell(150, 360, 78, 78, '#5ad17a'); ctx.font = `70px ${F}`; ctx.fillText('📞', 150, 364); ctx.save(); ctx.translate(-150, 364); ctx.rotate(2.35); ctx.fillText('📞', 0, 0); ctx.restore();
  } else {
    ctx.fillStyle = C.ink; ctx.font = `700 56px ${F}`; ctx.fillText('Llamadas perdidas', 0, -420);
    for (let i = 0; i < 3; i++) { const k = eback(clamp((t - hung - .15 - i * .22) / .3)); if (k <= 0) continue; ctx.save(); ctx.translate(0, -250 + i * 190); ctx.scale(k, k); box(-250, -70, 500, 150, 30, '#fff'); ell(-180, 4, 46, 46, '#ff8fc8'); ctx.font = `50px ${F}`; ctx.fillText('🍦', -180, 8); ctx.textAlign = 'left'; ctx.fillStyle = C.red; ctx.font = `700 54px ${F}`; ctx.fillText('Sofi', -110, -14); ctx.fillStyle = '#8a8698'; ctx.font = `600 32px ${F}`; ctx.fillText('perdida · hace ' + (i + 1) + ' min', -110, 36); ctx.textAlign = 'center'; ctx.restore(); }
  }
  ctx.restore(); ctx.restore();
}

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), tm = talks(t, 'MAMÁ'), ts = talks(t, 'SOFI');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  if (t < S.fine) {
    // --- gancho y recap: el recibo ---
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); roomCleanLive(t, { door: 0 }); roomCleanFront(t, { door: 0 });
    if (t < S.cape) {
      brayan(540, 1990, 1.0, t, { bald: true, ex: 'sad', talk: tb, bob: true, tear: t });
      receipt(540, 1660 + Math.sin(t * 2.4) * 3, .78, -.04 + Math.sin(t * 2) * .02);
      ell(390, 1640, 30, 30, SKB); ell(690, 1640, 30, 30, SKB);
    } else {
      receipt(540, 1560, 1.05, Math.sin(t * 3) * .05, { noFine: true });
      brayan(540, 1990, 1.0, t, { bald: true, ex: 'determined', talk: tb, bob: true });
    }
    ctx.restore();
    if (t < S.cape) { const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 6 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
      if (t > .05) stamp('ENTREGA: ALGÚN DÍA 😭', 540, 800, C.red, .04, t - .05); }
    else { label = ['ELIGIERON: CTA VI 😈', S.cape + .05]; if (t > cueT('r0') + 1.9) stamp('¿FUNCIONA IGNORARLA?', 540, 800, '#7e57c2', -.04, t - cueT('r0') - 1.9); }
  } else if (t < S.chat) {
    // --- la letra pequeña ---
    rays(540, 900, '#3a2a6a', '#33255f', t);
    receipt(540, 900, 1.75, -.03);
    const d = t - S.fine, k = eback(clamp((d - .7) / .4)), mx = 590 + Math.sin(t * 1.5) * 14, my = 1150;
    if (k > 0) { ctx.save(); ctx.translate(mx, my); ctx.scale(k, k); line(170, 170, 300, 300, 46, '#5a3a22'); ell(0, 0, 250, 250, '#2a1a14'); ell(0, 0, 228, 228, '#fffdf6');
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.ink; ctx.font = `700 44px ${F}`; ctx.fillText('* REQUIERE', 0, -96); ctx.fillText('CONSOLA NUEVA', 0, -40);
      const pk = t > cueT('b1') + 2.0 ? 1 + .08 * Math.sin(t * 12) : 1; ctx.save(); ctx.translate(0, 52); ctx.scale(pk, pk); ctx.font = `700 76px ${F}`; ctx.fillStyle = C.red; ctx.fillText('$2.800.000', 0, 0); ctx.restore();
      ell(-90, -150, 60, 22, 'rgba(255,255,255,.6)', -.5); ctx.restore(); }
    bHead(250, 1740, 1.35, d > 1.2 ? 'shock' : 'neutral', tb, t, { bald: true, sweat: d > 1.2 ? t : 0 });
    if (t > cueT('n1')) stamp('REQUIERE CONSOLA 💀', 690, 1660, C.red, -.05, t - cueT('n1'));
  } else if (t < S.sweat) {
    // --- chat: ahora él deja en visto ---
    rays(540, 1000, '#ff8fc8', '#f77fb8', t);
    const d = t - S.chat, full = 'siiii';
    let typed = null; if (d > 3.4 && d < 4.3) typed = full.slice(0, Math.min(5, Math.floor((d - 3.4) * 7) + 1)); else if (d >= 4.3 && d < 5.1) typed = full; else if (d >= 5.1 && d < 5.9) typed = full.slice(0, Math.max(0, 5 - Math.floor((d - 5.1) * 7) - 1));
    const cfg = Object.assign({}, SOFI6, typed !== null ? { typing: [0, 99, typed] } : {});
    ctx.save(); ctx.translate(540, 300); ctx.scale(1.3, 1.3); ctx.translate(-540, -300); chatUI(t, S.chat, cfg); ctx.restore();
    kevinBanner(t, S.chat + 4.3, 'NO CONTESTE.', 'Ella viene sola.', 1130);
  } else if (t < S.mom) {
    // --- le sudan las manos ---
    rays(540, 1200, '#2f8f8a', '#2a827d', t);
    brayan(540, 2060, 1.25, t, { bald: true, arm: 'phone', ex: 'shock', talk: tb, sweat: t * 1.5 });
    for (let i = 0; i < 6; i++) { const k = (t * 1.3 + i / 6) % 1; ell(330 + i * 90 + Math.sin(i * 3) * 20, 1500 + k * 260, 9, 14, `rgba(140,215,255,${1 - k})`); }
    label = ['AHORA ÉL DEJA EN VISTO', S.sweat + .1];
  } else if (t < S.call) {
    // --- la mamá y el recibo ---
    const od = clamp((t - S.mom - .1) / .35) * .9, bz = t >= S.buzz;
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); roomCleanLive(t, { door: od });
    if (od > .3) { mom(750, 1262, .76, t, { talk: tm, ex: 'angry' }); receipt(905, 1010, .34, .12 + Math.sin(t * 5) * .04, { noFine: true }); }
    roomCleanFront(t, { door: od });
    if (bz) phoneBuzz(150, 1010, t);
    const pj = bz ? Math.abs(Math.sin(t * 40)) * 10 : 0; ell(150, 1040 - pj, 120, 46, '#fff'); ell(150, 1032 - pj, 104, 34, '#f1f4fa');
    brayan(250, 1900, .85, t, { bald: true, ex: bz ? 'shock' : (t > cueT('b3') - .1 ? 'happy' : 'sad'), talk: tb, sweat: bz ? t : 0, bob: true });
    ctx.restore();
    if (t > cueT('b3') + .5 && !bz) stamp('"ES UNA INVERSIÓN"', 430, 760, '#2e9a55', -.05, t - cueT('b3') - .5);
    if (bz) { for (let i = 0; i < 3; i++) { const k = (t * 2 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - k; ctx.font = `700 ${60 + k * 30}px ${F}`; ctx.textAlign = 'center'; outlined('BZZZ', 300 + i * 40, 930 - k * 120 - i * 50, C.yellow, 12); ctx.restore(); } }
  } else if (t < S.bell) {
    // --- SOFI llamando ---
    rays(540, 900, '#5a3a9a', '#4f3390', t);
    const hung = t >= S.hang ? S.hang : 0;
    callPhone(t, hung);
    if (t >= S.hang - .25 && t < cueT('n2') - .05) { const k = eout(clamp((t - S.hang + .25) / .25)); const hx = lerp(-300, 250, k); bHead(hx, 1500, 1.5, 'shock', false, t, { bald: true, sweat: t, rot: .25 }); if (t < S.hang + .5) { line(hx + 120, 1440, 390, 1262, 60, '#4f9e6a'); ell(390, 1260, 44, 44, SKB); } }
    label = hung ? ['¡COLGÓ! 📵', S.hang + .05] : ['¿¿SOFI 🍦??', S.call + .1];
  } else if (t < S.spy) {
    // --- suena el timbre ---
    const d = t - S.bell, open = eout(clamp((d - .8) / .4));
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); houseFront(t, open);
    if (open > .2) { ctx.save(); rrect(270, 400, 540, 1080, 12); ctx.clip(); mom(470, 1480, .92, t, { talk: tm, ex: t > cueT('s0') ? 'happy' : 'shock' }); ctx.restore(); }
    const sx = 860, sfy = 1900, ss = .9;
    sofi(sx, sfy, ss, t, { ex: 'happy', talk: ts });
    cone(sx - 123 * ss, sfy - 400 * ss, .8, '#ff9ec4', t); cone(sx + 150 * ss, sfy - 400 * ss, .8, '#a8e6a1', t + 1);
    ctx.restore();
    if (d < .9) { for (let i = 0; i < 2; i++) { const k = clamp((d - i * .35) / .4); if (k > 0 && k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.font = `700 ${110 + k * 40}px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined(i ? 'DONG' : 'DING', 360 + i * 300, 760 - k * 60, C.yellow, 20); ctx.restore(); } } }
    if (t > S.vino) stamp('¡VINO SOLA! 🍦', 540, 330, '#7e57c2', -.04, t - S.vino);
  } else if (t < S.poll) {
    // --- Brayan espía desde la puerta ---
    const d = t - S.spy, withRec = t >= S.rec;
    let g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f2c98f'); g.addColorStop(1, '#e0a06c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let y = 80; y < H; y += 150) { ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(0, y, W, 60); }
    const gl = ctx.createRadialGradient(1080, 1100, 40, 1080, 1100, 700); gl.addColorStop(0, 'rgba(255,240,170,.75)'); gl.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
    const peek = eout(clamp(d / .4)), hx = lerp(430, 640, peek) + Math.sin(t * 3) * 6;
    if (withRec) receipt(hx + 250, 1470 + Math.sin(t * 6) * 6, .5, .15);
    bHead(hx, 1190, 2.0, withRec ? 'sad' : 'shock', tb, t, { bald: true, sweat: t, rot: .08 });
    for (let i = 0; i < 4; i++) ell(hx - 150 + i * 4, 1280 + i * 44, 30, 26, SKB);
    box(-40, 0, 520, H, 0, '#8f5a36'); box(-40, 0, 480, H, 0, '#b5764a'); box(60, 240, 300, 620, 16, '#a2683f'); box(60, 960, 300, 760, 16, '#a2683f'); ell(400, 1120, 30, 30, C.yellow); ell(392, 1112, 10, 10, 'rgba(255,255,255,.6)');
    if (t >= S.kmsg) kevinBanner(t, S.kmsg, 'Si sale ya, ella gana.', 'Aguante un día más.', 470);
    if (d > .2 && t < S.kmsg) { ctx.save(); ctx.font = `700 44px ${F}`; ctx.textAlign = 'center'; outlined('(desde la sala)', 780, 420, C.cream, 10); ctx.restore(); }
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.cape, S.fine, S.chat, S.sweat, S.mom, S.call, S.hang, S.bell, S.spy, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
