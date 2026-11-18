/* ===================== DÍA 7: "El álbum" ===================== */
function salaHome(t) {
  const g = ctx.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#f6d7b0'); g.addColorStop(1, '#eec08a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 1500);
  for (let x = 0; x < W; x += 90) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x, 0, 36, 1500); }
  box(-20, 1480, 1120, 440, 0, '#b07a4f'); for (let y = 1500; y < H; y += 70) box(-20, y, 1120, 6, 0, 'rgba(0,0,0,.08)');
  box(780, 220, 260, 330, 12, '#7a4c33'); box(796, 236, 228, 298, 8, '#bfe6ff'); ell(930, 300, 50, 50, '#fff6c9'); line(910, 236, 910, 534, 8, '#7a4c33'); line(796, 385, 1024, 385, 8, '#7a4c33');
  box(60, 1010, 26, 470, 8, '#5a3a22'); poly([[0, 1010], [146, 1010], [110, 900], [36, 900]], '#ffd27a'); ctx.save(); ctx.globalAlpha = .18 + .05 * Math.sin(t * 2); ell(73, 1060, 150, 90, '#fff3b0'); ctx.restore();
}
function sofaFront() {
  box(20, 1660, 1040, 300, 60, '#3a8f87'); box(60, 1620, 960, 120, 50, '#47a79e'); box(0, 1600, 110, 340, 50, '#2f7a73'); box(970, 1600, 110, 340, 50, '#2f7a73');
  for (let i = 0; i < 3; i++) box(130 + i * 280, 1640, 260, 70, 30, 'rgba(255,255,255,.08)');
}
function babyHead(x, y, s, ex, t, o = {}) { const w = EP.wreck; EP.wreck = o.beard ? 1 : 0; bHead(x, y, s, ex, false, t, Object.assign({ bald: false }, o)); EP.wreck = w; }
function photoPollito(t) {
  ctx.fillStyle = '#bfe3ff'; ctx.fillRect(-340, -220, 680, 440);
  [['#ff8fc8', -250, -120], ['#ffd23f', 260, -140], ['#7fd18a', 200, 60]].forEach(([c, x, y]) => { ell(x, y + Math.sin(t * 2 + x) * 6, 44, 54, c); line(x, y + 54, x - 10, y + 160, 3, 'rgba(0,0,0,.3)'); });
  ell(0, 170, 170, 130, '#ffd23f'); ell(-150, 140, 50, 80, '#ffc21f', .5); ell(150, 140, 50, 80, '#ffc21f', -.5);
  ell(0, -36, 118, 118, '#ffd23f');
  babyHead(0, -20, .82, 'happy', t);
  poly([[-30, -112], [30, -112], [0, -78]], '#ff9a3c');
  poly([[-10, -150], [-40, -200], [-70, -150]], '#ff6fa3'); poly([[10, -150], [40, -200], [70, -150]], '#ff6fa3'); ell(0, -152, 18, 18, '#ff4d8d');
}
function photoPelo(t) {
  ctx.fillStyle = '#ffe1ec'; ctx.fillRect(-340, -220, 680, 440);
  ell(0, 170, 150, 110, '#8fd0ff');
  ell(0, -60, 150, 120, '#2e211b'); ell(-110, -20, 60, 70, '#2e211b'); ell(110, -20, 60, 70, '#2e211b');
  babyHead(0, -10, .95, 'happy', t);
  for (let i = 0; i < 9; i++) { const a = -2.6 + i * .27; ell(Math.cos(a) * 92, -18 + Math.sin(a) * 96, 34, 26, '#2e211b', a); }
  ell(0, -118, 70, 40, '#2e211b');
}
function photoLlora(t) {
  ctx.fillStyle = '#d9d4ff'; ctx.fillRect(-340, -220, 680, 440);
  box(-150, 90, 300, 220, 60, '#5fb07a');
  babyHead(0, -20, .9, 'sad', t, { beard: true, tear: t });
  gamepad(0, 150, .7, 0); ell(-82, 150, 22, 22, '#e3ad8a'); ell(82, 150, 22, 22, '#e3ad8a');
}
function album(t, ph, k) {
  ctx.save(); ctx.translate(540, 640); ctx.scale(k * .86, .86);
  box(-450, -290, 900, 580, 30, '#6b3f2a'); box(-430, -270, 860, 540, 22, '#fff6e2'); line(0, -270, 0, 270, 6, 'rgba(0,0,0,.12)');
  ctx.save(); ctx.rotate(-.025); box(-360, -240, 720, 470, 10, '#fff'); ctx.save(); rrect(-340, -222, 680, 380, 6); ctx.clip(); ctx.save(); ctx.translate(0, -32); ctx.scale(1, .86); ph.fn(t); ctx.restore(); ctx.restore();
  ctx.font = `700 40px ${F}`; ctx.fillStyle = '#5a3a2a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ph.cap, 0, 196); ctx.restore();
  ctx.restore();
}
function pocketHand(t, k) {
  if (k <= 0) return; ctx.save(); ctx.translate(540, 830); ctx.scale(k, k); ctx.rotate(Math.sin(t * 2) * .03);
  ell(0, 40, 230, 170, 'rgba(0,0,0,.2)'); ell(0, 20, 220, 160, SKB); for (let i = 0; i < 4; i++) ell(-150 + i * 100, -140, 42, 70, SKB); ell(220, 60, 50, 90, SKB, -.7);
  ctx.strokeStyle = '#9a96a8'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i < 18; i++) { const a = i * .9; ctx.lineTo(-70 + Math.cos(a) * (20 + i * 1.6), 20 + Math.sin(a) * (16 + i * 1.2)); } ctx.stroke();
  ell(90, 30, 52, 52, '#c9a24a'); ell(90, 30, 42, 42, '#e0bd5c'); ctx.font = `700 36px ${F}`; ctx.fillStyle = '#7a5a1a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('200', 90, 32);
  ctx.restore();
}
function heladeria(t, tv) {
  ctx.fillStyle = '#ffd6e5'; ctx.fillRect(0, 0, W, H); for (let x = 0; x < W; x += 120) { ctx.fillStyle = '#c9f0e0'; ctx.fillRect(x, 0, 60, 1500); }
  box(-20, 1500, 1120, 420, 0, '#e9a6b8'); for (let x = 0; x < W; x += 80) box(x, 1500, 40, 420, 0, 'rgba(255,255,255,.18)');
  if (!tv) {
    ctx.save(); ctx.translate(540, 700); ctx.rotate(-.01); box(-370, -150, 740, 300, 26, '#2d2a4a'); ctx.lineWidth = 8; ctx.strokeStyle = '#ffd23f'; rrect(-370, -150, 740, 300, 26); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 54px ${F}`; ctx.fillStyle = '#ffd23f'; ctx.fillText('HELADOS 🍦', 0, -96);
    ctx.font = `600 44px ${F}`; ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; [['Sencillo', '$5.000'], ['Doble', '$9.000'], ['Sundae', '$12.000']].forEach(([a, b], i) => { ctx.fillText(a, -320, -24 + i * 58); ctx.textAlign = 'right'; ctx.fillText(b, 320, -24 + i * 58); ctx.textAlign = 'left'; });
    ctx.restore();
  } else bigScreen(540, 690, 620, 290, t);
  box(760, 1250, 300, 260, 20, '#fff'); box(760, 1250, 300, 50, 16, '#ff8fc8'); for (let i = 0; i < 3; i++) ell(820 + i * 90, 1360, 34, 30, ['#ffb3d1', '#a8e6a1', '#fff2a8'][i]);
}
function coneEmpty(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * .06); poly([[-34, 0], [34, 0], [0, 120]], '#e0a85a'); line(-20, 22, 12, 60, 4, '#c98a3a'); line(20, 22, -12, 60, 4, '#c98a3a'); ctx.restore(); }
function shotSofiChat(t) {
  ctx.fillStyle = '#f4f1ec'; ctx.fillRect(0, 0, 1100, 640); ctx.fillStyle = '#ff8fc8'; ctx.fillRect(0, 0, 1100, 130);
  ell(80, 65, 46, 46, '#fff'); ctx.font = `60px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('💜', 80, 70);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 64px ${F}`; ctx.fillText('Sofi', 150, 66);
  box(160, 210, 900, 250, 40, '#ffd9c2'); ctx.fillStyle = C.ink; ctx.font = `600 64px ${F}`; ctx.fillText('Siga ignorándola un poquito,', 200, 280); ctx.fillText('es estrategia 😎', 200, 360);
  ctx.font = `600 44px ${F}`; ctx.fillStyle = '#3d8bff'; ctx.textAlign = 'right'; ctx.fillText('✓✓ visto', 1030, 420);
  ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = C.red; ctx.beginPath(); ctx.ellipse(610, 335, 500, 175, -.02, 0, 7); ctx.stroke(); ctx.restore();
}
const KEV7 = { color: '#e2584a', icon: '🧢', title: 'Primo Kevin', sub: 'en línea', msgs: [
  { at: .4, name: 'Primo Kevin', nc: '#e2584a', text: '¿¿SALIÓ?? Le dije que aguantara 😤' },
  { at: 1.8, name: 'Primo Kevin', nc: '#e2584a', photo: shotSofiChat, text: 'Uy primo… 👆' },
  { at: 3.5, name: 'Primo Kevin', nc: '#e2584a', text: 'eso era para usted 💀' }] };

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), tm = talks(t, 'MAMÁ'), ts = talks(t, 'SOFI');
  const cueT = k => EP.cues.find(c => c.k === k).t;
  let label = null;
  const PH = [{ fn: photoPollito, cap: 'Mi pollito 🐥 (2 añitos)' }, { fn: photoPelo, cap: 'Mi bebé peludo 💕' }, { fn: photoLlora, cap: 'Perdió en el jueguito (19) 😭' }];
  if (t < S.recap || (t >= S.ph && t < S.shop)) {
    // --- la sala y el álbum ---
    salaHome(t);
    const pi = t < S.ph ? 0 : t < S.ph2 ? 1 : 2, tf = pi === 1 ? S.ph : pi === 2 ? S.ph2 : -9, fk = t - tf < .3 ? Math.abs(Math.cos((t - tf) / .3 * Math.PI)) * .9 + .1 : 1;
    const laugh = (pi >= 1 && t > cueT('s0')) || (pi === 0 && t > S.run);
    mom(310, 1790, .78, t, { talk: tm, ex: 'happy' });
    sofi(780, 1790, .78, t, { ex: laugh ? 'happy' : 'neutral', talk: ts });
    sofaFront();
    album(t, PH[pi], fk);
    if (t < S.recap) {
      if (t >= S.run) { const k = eout(clamp((t - S.run) / .45)); brayan(lerp(-260, 190, k), 1990, .9, t, { bald: true, ex: 'shock', talk: tb, sweat: t }); for (let i = 0; i < 3; i++) line(lerp(-260, 190, k) - 180 - i * 40, 1300 + i * 120, lerp(-260, 190, k) - 300 - i * 40, 1300 + i * 120, 8, 'rgba(255,255,255,.7)'); }
      const k = eback(clamp(t / .35)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 118px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 7 SIN REDES', 0, 0, C.orange, 22); ctx.restore();
      if (t > .9) stamp('EL PO-LLI-TO 🐥', 760, 850, '#e0a41c', .05, t - .9);
    } else {
      brayan(170, 1990, .9, t, { bald: true, ex: 'sad', talk: tb, arm: pi === 1 ? 'up' : undefined, sweat: t });
      if (pi === 1 && t > cueT('s0') + .4) stamp('MÁS PELO DE BEBÉ', 700, 850, '#7e57c2', -.04, t - cueT('s0') - .4);
      if (pi === 2 && t > cueT('m1') + 2.2) stamp('¡A LOS 19! 😭', 640, 850, C.red, .04, t - cueT('m1') - 2.2);
    }
  } else if (t < S.ph) {
    // --- recap a cámara ---
    rays(540, 1100, '#ff9f5a', '#ff9150', t);
    brayan(540, 2080, 1.3, t, { bald: true, ex: t < cueT('n0') ? 'shock' : 'sad', talk: tb, sweat: t });
    label = ['ELIGIERON: EL HELADO 🍦', S.recap + .05];
    if (t > cueT('n0') + .3) stamp('YA ESTABA SALIENDO MAL', 540, 820, C.red, -.04, t - cueT('n0') - .3);
  } else if (t < S.tv) {
    // --- heladería: cero pesos ---
    heladeria(t, false);
    brayan(320, 1990, .95, t, { bald: true, ex: t < S.pocket ? 'happy' : 'sad', talk: tb, sweat: t > S.pocket ? t : 0 });
    sofi(790, 1990, .95, t, { ex: 'happy', talk: ts });
    if (t >= S.pay) { const k = eback(clamp((t - S.pay) / .3)); ctx.save(); ctx.translate(640, 1420); ctx.scale(k, k); ctx.rotate(-.2); box(-80, -50, 160, 100, 14, '#3d6bff'); box(-80, -24, 160, 20, 0, '#1c1c24'); box(-60, 16, 50, 20, 4, '#ffd23f'); ctx.restore(); }
    const ph = t >= S.pocket && t < S.pay ? eback(clamp((t - S.pocket) / .35)) : 0; pocketHand(t, ph);
    if (t > cueT('n1')) stamp('DIGNIDAD: $0 🫠', 540, 880, C.red, -.05, t - cueT('n1'));
  } else if (t < S.chat) {
    // --- la vitrina con CTA VI y la consola de Sofi ---
    heladeria(t, true);
    const fell = t >= S.drop, dd = t - S.drop;
    brayan(320, 1990, .95, t, { bald: true, ex: fell ? 'shock' : 'tired', talk: tb, sweat: t });
    if (!fell) emo('😣', 430, 1340, 1, 80);
    sofi(790, 1990, .95, t, { ex: 'happy', talk: ts });
    cone(790 + 150 * .95, 1990 - 400 * .95, .8, '#a8e6a1', t + 1);
    if (!fell) cone(320 + 160, 1990 - 400 * .95, .8, '#ff9ec4', t);
    else { const y = Math.min(1990 - 380 + dd * dd * 2200, 1960); if (y < 1960) cone(480, y, .8, '#ff9ec4', t); else { ell(470, 1965, 110, 26, '#ff9ec4'); coneEmpty(470, 1880, .8, 0); } hearts(t, 320, 1490, 5); }
    if (fell && dd > .15) stamp('¡TIENE LA CONSOLA! 🎮', 540, 900, '#2e9a55', -.04, dd - .15);
    label = ['NO MIRA EL COMERCIAL 😤', S.tv + .1];
  } else if (t < S.read) {
    // --- chat: el pantallazo ---
    rays(540, 1000, '#e2584a', '#d84a3c', t);
    chatPhotoUI(t, S.chat, KEV7);
    if (t > S.chat + 3.7) stamp('CHAT EQUIVOCADO 💀', 540, 1590, C.red, -.04, t - S.chat - 3.7);
  } else if (t < S.last) {
    // --- Sofi lee el mensaje ---
    heladeria(t, false);
    const rd = t >= cueT('s2') - .2;
    brayan(320, 1990, .95, t, { bald: true, ex: 'shock', talk: tb, sweat: t * 1.5 });
    sofi(790, 1990, .95, t, { ex: rd ? 'sad' : 'happy', talk: ts });
    phoneBuzz(790 - 140 * .95, 1990 - 420 * .95, t);
    const cx = 790 + 150 * .95, cy = 1990 - 400 * .95; cone(cx, cy, .8, '#a8e6a1', t + 1);
    for (let i = 0; i < 4; i++) { const k = ((t - S.read) * .9 + i / 4) % 1; ell(cx + 10, cy + 30 + k * 420, 8, 12, '#a8e6a1'); }
    if (t > S.estres2 - .2) ell(cx + 10, 1975, 40 + Math.min((t - S.estres2) * 30, 60), 12, '#a8e6a1');
    if (t > cueT('s2') + .3) stamp('¿A PROPÓSITO? 😐', 540, 880, '#7e57c2', -.04, t - cueT('s2') - .3);
  } else if (t < S.poll) {
    // --- cierre: peor que el pollito ---
    rays(540, 1200, '#2b3a6a', '#26345f', t);
    bHead(540, 1250, 2.2, 'sad', tb, t, { bald: true, sweat: t * 1.5 });
    coneEmpty(820, 1430, 1.4, t);
  } else { pollAB(t); }
  barPops(t);
  if (label) sceneLabel(t, label[1], label[0]);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.recap, S.ph, S.shop, S.tv, S.chat, S.read, S.last, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
