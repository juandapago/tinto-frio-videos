/* ===================== DÍA 1 ===================== */
WHO['NIÑO'] = '#7fe0a0'; WHO['RECLUTADORA'] = '#ffc07a';
const DAY1 = true;
function recruiter(x, fy, s, t, o = {}) {
  const talk = o.talk, b = talk ? Math.sin(t * 14) * 3 : 0, SK = '#c98b6a';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  box(-130, -560 + b, 260, 360, 90, '#33406b'); poly([[-40, -560 + b], [40, -560 + b], [0, -440 + b]], '#f4f1ea'); poly([[-70, -560 + b], [-40, -560 + b], [0, -440 + b], [-30, -380 + b]], '#2a3459'); poly([[70, -560 + b], [40, -560 + b], [0, -440 + b], [30, -380 + b]], '#2a3459');
  ell(60, -470 + b, 10, 10, C.yellow);
  // brazos sobre el escritorio con lapicero
  box(-150, -480 + b, 52, 200, 26, '#2a3459'); box(98, -480 + b, 52, 200, 26, '#2a3459'); ell(-124, -280 + b, 26, 24, SK); ell(124, -280 + b, 26, 24, SK);
  ctx.save(); ctx.translate(124, -290 + b); ctx.rotate(o.write ? -.4 + Math.sin(t * 30) * .15 : -.4); box(-5, -60, 10, 70, 4, '#e8524a'); ctx.restore();
  box(-20, -590 + b, 40, 40, 12, '#b9795a');
  const hy = -670 + b;
  ell(0, hy - 98, 44, 40, '#2b1a14'); ell(-88, hy + 8, 13, 19, '#b9795a'); ell(88, hy + 8, 13, 19, '#b9795a'); ell(0, hy, 86, 92, SK);
  ctx.fillStyle = '#2b1a14'; ctx.beginPath(); ctx.moveTo(-92, hy + 10); ctx.quadraticCurveTo(-96, hy - 100, 0, hy - 96); ctx.quadraticCurveTo(96, hy - 100, 92, hy + 10); ctx.quadraticCurveTo(70, hy - 60, 0, hy - 64); ctx.quadraticCurveTo(-70, hy - 60, -92, hy + 10); ctx.fill();
  face(0, hy + 8, 1, o.ex || 'neutral', talk, t, SK, { lash: true, lip: '#a8304a', brow: '#2b1a14' });
  ctx.strokeStyle = C.ink; ctx.lineWidth = 6; rrect(-60, hy - 14, 50, 40, 10); ctx.stroke(); rrect(10, hy - 14, 50, 40, 10); ctx.stroke(); line(-10, hy + 2, 10, hy + 2, 6, C.ink);
  ell(-88, hy + 34, 7, 7, '#e0e4ee'); ell(88, hy + 34, 7, 7, '#e0e4ee');
  ctx.restore();
}
function kidFace(cx, cy, s, t, talk) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  box(-120, 40, 240, 120, 60, '#ff6b5a'); ell(0, 0, 90, 96, '#f0c09a');
  ctx.fillStyle = '#5a3a22'; ctx.beginPath(); ctx.moveTo(-94, -6); ctx.quadraticCurveTo(-90, -110, 0, -102); ctx.quadraticCurveTo(90, -110, 94, -6); ctx.quadraticCurveTo(40, -60, -94, -6); ctx.fill();
  // audífonos gamer
  ctx.strokeStyle = '#2a2b3f'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, -10, 104, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); box(-118, -30, 34, 70, 14, '#5ad17a'); box(84, -30, 34, 70, 14, '#5ad17a');
  const laugh = talk || Math.sin(t * 9) > 0;
  ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(-30, 2, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.beginPath(); ctx.arc(30, 2, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-34, 38); ctx.quadraticCurveTo(0, laugh ? 92 : 70, 34, 38); ctx.closePath(); ctx.fillStyle = '#7a2b3a'; ctx.fill(); box(-22, 38, 44, 10, 4, '#fff');
  ell(-50, 30, 14, 8, 'rgba(255,110,110,.45)'); ell(50, 30, 14, 8, 'rgba(255,110,110,.45)');
  ctx.restore();
}
/* ---------- barras emergentes ---------- */
const BARC = { 'ESTRÉS': '#ff4d4d', 'HIGIENE': '#5aa9ff', 'PLATA': '#5ad17a' };
const BARI = { 'ESTRÉS': '😤', 'HIGIENE': '🧼', 'PLATA': '💰' };
function barPanel(x, y, w, name, val, txt, a = 1, sc = 1, flash = 0) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(sc, sc);
  box(-w / 2 + 6, -40, w, 92, 26, 'rgba(0,0,0,.35)'); box(-w / 2, -46, w, 92, 26, '#1d1626'); ctx.lineWidth = 6; ctx.strokeStyle = C.coffee; rrect(-w / 2, -46, w, 92, 26); ctx.stroke();
  ctx.font = `700 40px ${F}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = C.cream; ctx.fillText(`${BARI[name]} ${name}`, -w / 2 + 24, 2);
  const bx = -w / 2 + 250, bw = w - 280;
  if (name === 'PLATA') { ctx.font = `700 46px ${F}`; ctx.fillStyle = BARC[name]; ctx.fillText(txt, bx, 4); }
  else { box(bx, -16, bw, 32, 16, '#3a3046'); const c = flash > 0 && Math.sin(flash * 40) > 0 ? '#fff' : BARC[name]; box(bx, -16, Math.max(32, bw * val), 32, 16, c); ell(bx + 18, -6, 10, 4, 'rgba(255,255,255,.4)'); }
  ctx.restore();
}
function barPops(t) {
  for (const [t0, name, from, to, txt] of EP.bars) {
    const d = t - t0; if (d < 0 || d > 2.6) continue;
    const inn = eout(clamp(d / .3)), out = clamp((d - 2.25) / .35), x = lerp(1400, 540, inn) + lerp(0, 900, out * out);
    const fill = lerp(from, to, eout(clamp((d - .4) / .6)));
    const sh = name === 'ESTRÉS' && d > .4 && d < 1.1 ? Math.sin(d * 70) * 8 : 0;
    barPanel(x + sh, 480, 760, name, fill, txt, 1, 1, name === 'ESTRÉS' && to > .9 ? d : 0);
    if (txt && name !== 'PLATA' && d > .5) { const k = clamp((d - .5) / .7); ctx.save(); ctx.globalAlpha = 1 - k; ctx.font = `700 64px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined(txt, x + 300, 410 - k * 60, BARC[name], 12); ctx.restore(); }
  }
}
/* ---------- montaña de mugre ---------- */
const JUNK = (() => { const r = mulberry(31), cols = [C.blue, C.yellow, '#f27a6b', '#8a6fd8', '#5ad1a0', '#ff7aa8', '#fff', C.ink, '#e3bf8c'], out = [];
  for (let i = 0; i < 46; i++) { const row = Math.floor(i / 8), sx = 630 + r() * 250, sy = 1240 - row * 44 - r() * 16;
    out.push({ sx, sy, ex: 120 + r() * 640, ey: 1330 + r() * 420, c: cols[i % cols.length], w: 34 + r() * 30, h: 18 + r() * 12, rot: (r() - .5) * .6, kind: i % 9 === 8 ? 'box' : i % 11 === 5 ? 'can' : 'cloth', delay: r() * .35 }); }
  return out; })();
function junk(t) {
  const d = t - S.aval;
  for (const j of JUNK) {
    const k = clamp((d - j.delay) / .6), e = eout(k), x = lerp(j.sx, j.ex, e), y = lerp(j.sy, j.ey, e) - Math.sin(Math.PI * k) * 260, rot = j.rot + (d > 0 ? k * 4 : 0);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    if (j.kind === 'box') { box(-80, -14, 160, 28, 6, '#e3bf8c'); ell(0, 0, 16, 7, '#e8524a'); }
    else if (j.kind === 'can') { box(-16, -26, 32, 52, 8, j.c); box(-16, -26, 32, 10, 4, '#d9dde5'); }
    else { ell(0, 0, j.w, j.h, j.c); ell(-j.w * .3, -j.h * .2, j.w * .3, j.h * .3, 'rgba(255,255,255,.15)'); }
    ctx.restore();
  }
}
/* ---------- bicicleta ---------- */
function bikeRider(x, y, t, speed) {
  const ang = t * speed * 6;
  const wheel = (cx) => { ell(cx, y, 92, 92, '#22222c'); ell(cx, y, 74, 74, '#9aa3b8'); ell(cx, y, 66, 66, '#e9edf5'); ctx.strokeStyle = '#9aa3b8'; for (let i = 0; i < 8; i++) line(cx, y, cx + Math.cos(ang + i * .785) * 64, y + Math.sin(ang + i * .785) * 64, 4); ell(cx, y, 12, 12, '#555'); };
  wheel(x - 170); wheel(x + 170);
  ctx.strokeStyle = '#e8524a'; line(x - 170, y, x - 20, y - 10, 16); line(x - 20, y - 10, x + 100, y - 150, 16); line(x - 20, y - 10, x - 70, y - 160, 16); line(x - 70, y - 160, x + 100, y - 150, 16); line(x + 100, y - 150, x + 170, y, 16); line(x + 100, y - 150, x + 120, y - 230, 12);
  box(x - 120, y - 180, 100, 24, 12, C.ink); line(x + 90, y - 240, x + 160, y - 236, 12, C.ink);
  // pedales y piernas
  const pa = ang * .6, px = x - 20 + Math.cos(pa) * 46, py = y - 10 + Math.sin(pa) * 46;
  ctx.strokeStyle = '#3d4c70'; line(x - 60, y - 200, px, py, 34); line(x - 60, y - 200, x - 20 - Math.cos(pa) * 46, y - 10 - Math.sin(pa) * 46, 34);
  // torso inclinado
  ctx.save(); ctx.translate(x - 60, y - 210); ctx.rotate(.35 + Math.sin(t * 8) * .02);
  box(-80, -290, 160, 300, 70, '#5fb07a'); box(-130, -260, 110, 130, 10, '#e3bf8c'); box(-130, -260, 110, 26, 6, '#c9a26c'); ctx.fillStyle = '#e8524a'; ctx.font = `700 34px ${F}`; ctx.textAlign = 'center'; ctx.fillText('PIZZA', -75, -170);
  ctx.save(); ctx.translate(60, -230); ctx.rotate(-.9); box(-22, 0, 44, 200, 22, '#4f9e6a'); ell(0, 204, 26, 26, SKB); ctx.restore();
  bHead(10, -370, .95, 'shock', false, t, { sweat: t });
  ctx.restore();
}
function streetScroll(t, sp) {
  const off = (t * sp) % 1500;
  for (let k = -1; k <= 1; k++) ctx.drawImage(STREET, -OX - off + k * 1500, 0);
}
function sign(x, y, txt, rot, col = '#3aa06a') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); box(-8, 0, 16, 420, 6, '#8b93a8'); poly([[-150, -60], [130, -60], [190, 0], [130, 60], [-150, 60]], col); ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = `700 50px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); }
function houseFront(t, open) {
  let g = ctx.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#f2c98f'); g.addColorStop(1, '#e8b376'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, 1500, 1500);
  for (let y = 60; y < 1480; y += 70) for (let x = -OX + ((y / 70) % 2) * 60; x < 1300; x += 120) box(x, y, 112, 62, 6, 'rgba(180,110,60,.18)');
  box(250, 380, 580, 1100, 20, '#5a3a8a'); box(270, 400, 540, 1080, 12, '#fff3d6');
  const dw = 540 * (1 - open * .82); box(270, 400, dw, 1080, 12, '#7a4c33'); if (open < .5) { box(310, 450, 460, 380, 14, '#6b4230'); box(310, 880, 460, 540, 14, '#6b4230'); ell(740, 940, 20, 20, C.yellow); }
  box(860, 600, 200, 60, 10, '#fff'); ctx.fillStyle = C.ink; ctx.font = `700 40px ${F}`; ctx.textAlign = 'center'; ctx.fillText('# 45-12', 960, 644);
  ctx.fillStyle = '#9aa3b8'; ctx.fillRect(-OX, 1480, 1500, 440); box(140, 1460, 800, 40, 10, '#c9cfdd');
  ell(1000, 1300, 90, 140, '#3aa06a'); box(985, 1400, 30, 90, 8, '#7a4c33'); ell(80, 1320, 80, 120, '#3aa06a'); box(66, 1410, 28, 80, 8, '#7a4c33');
}
function notif(t, t0) {
  const k = eback(clamp((t - t0) / .4)); if (k <= 0) return;
  ctx.save(); ctx.translate(540, 560); ctx.scale(k, k); ctx.rotate(-.015);
  box(-430, -150, 880, 330, 40, 'rgba(0,0,0,.35)'); box(-440, -160, 880, 330, 40, '#f7f5fb'); ctx.lineWidth = 7; ctx.strokeStyle = C.coffee; rrect(-440, -160, 880, 330, 40); ctx.stroke();
  ell(-350, -70, 54, 54, '#2d2a4a'); ctx.fillStyle = '#fff'; ctx.font = `700 70px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', -350, -64);
  ctx.textAlign = 'left'; ctx.fillStyle = C.ink; ctx.font = `700 46px ${F}`; ctx.fillText('Número desconocido', -270, -96); ctx.fillStyle = '#8a8698'; ctx.font = `600 32px ${F}`; ctx.fillText('ahora', -270, -46);
  const full = 'Hola Brayan 👀 Vi lo de tu reto. Tengo un trabajo para ti… ¿te interesa?', n = Math.floor(clamp((t - t0 - .5) / 1.8) * full.length);
  ctx.fillStyle = C.ink; ctx.font = `600 42px ${F}`; const words = full.slice(0, n).split(' '); let line1 = '', lines = [];
  words.forEach(w => { if (ctx.measureText(line1 + ' ' + w).width > 760 && line1) { lines.push(line1); line1 = w; } else line1 = line1 ? line1 + ' ' + w : w; }); lines.push(line1);
  lines.forEach((l, i) => ctx.fillText(l, -400, 30 + i * 56));
  ctx.restore();
}
function statsCard(t) {
  const k = eback(clamp((t - S.stats) / .4)); ctx.fillStyle = 'rgba(20,14,26,.7)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 820); ctx.scale(k, k);
  box(-440, -330, 880, 640, 40, '#2a1f33'); ctx.lineWidth = 8; ctx.strokeStyle = C.coffee; rrect(-440, -330, 880, 640, 40); ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 70px ${F}`; outlined('RESUMEN DEL DÍA 1', 0, -250, C.yellow, 12);
  const kk = eout(clamp((t - S.stats - .4) / .8));
  barPanel(0, -100, 780, 'ESTRÉS', .96 * kk, '', 1, 1, t - S.stats); barPanel(0, 40, 780, 'PLATA', 0, '$0', 1); barPanel(0, 180, 780, 'HIGIENE', .04 * kk + .001, '', 1);
  ctx.restore();
}
function poll2(t) {
  ctx.fillStyle = 'rgba(26,18,14,.66)'; ctx.fillRect(0, 0, W, 1300);
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const q = '¿QUÉ HAGO EN EL DÍA 2?'; fitFont(q, 700, 84, 960); outlined(q, 540, 330, C.cream, 14); ctx.restore();
  EP.options.forEach((op, i) => { const k = eback(clamp((t - S.poll - .3 - i * .25) / .35)); if (k <= 0) return;
    ctx.save(); ctx.translate(540, 510 + i * 196); ctx.scale(k, k); ctx.rotate([-.012, .01, -.008][i]);
    box(-430, -72, 880, 160, 28, 'rgba(0,0,0,.35)'); rrect(-440, -80, 880, 160, 28); ctx.fillStyle = C.cream; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = C.coffee; ctx.stroke();
    ctx.fillStyle = [C.orange, C.blue, C.green][i]; rrect(-420, -60, 120, 120, 22); ctx.fill(); ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = C.coffee; ctx.font = `700 86px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(op.k, -360, 5);
    ctx.textAlign = 'left'; fitFont(op.t, 700, 56, 470); ctx.fillText(op.t, -275, 5); heartLike(370, 0, .95 + .08 * Math.sin(t * 6 + i)); ctx.restore(); });
  const k = clamp((t - S.poll - 1.3) / .3);
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const y = 1150 + Math.sin(t * 6) * 6;
    ctx.font = `700 64px ${F}`; outlined('DALE LIKE AL COMENTARIO', 540, y - 40, C.yellow, 14); ctx.font = `700 56px ${F}`; outlined('CON TU OPCIÓN', 540, y + 30, C.cream, 12);
    heartLike(540, y + 130, 1.3 + .12 * Math.sin(t * 8)); ctx.restore(); }
}
function sceneLabel(t, t0, txt, rot = -.02) { const tk = eback(clamp((t - t0 - .1) / .3)); if (tk <= 0) return; ctx.save(); ctx.translate(540, 330); ctx.scale(tk, tk); ctx.rotate(rot); ctx.font = `700 58px ${F}`; const w = ctx.measureText(txt).width + 60; box(-w / 2, -50, w, 100, 22, C.cream); ctx.lineWidth = 7; ctx.strokeStyle = C.coffee; rrect(-w / 2, -50, w, 100, 22); ctx.stroke(); ctx.fillStyle = C.coffee; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); }

/* ===================== DÍA 1 (v2): "Nadie da un peso por mí" ===================== */
WHO['TÍA GLADYS'] = '#c9a2ff'; WHO['EXJEFE'] = '#9fb6d9';
const KITCHEN = layer(() => {
  let g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, '#ffe9b8'); g.addColorStop(1, '#ffd98f'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, 1500, 1300);
  // azulejos
  for (let y = 760; y < 1120; y += 60) for (let x = -OX; x < 1300; x += 60) box(x + 3, y + 3, 54, 54, 6, ((x + y) / 60) % 2 ? '#fff7e2' : '#ffe2a6');
  // ventana con cortina
  box(60, 300, 360, 380, 20, '#fff'); let s = ctx.createLinearGradient(0, 320, 0, 660); s.addColorStop(0, '#9fe0ff'); s.addColorStop(1, '#e6f7ff'); box(80, 320, 320, 340, 10, s); ell(330, 400, 36, 36, '#fff6c9'); ctx.fillStyle = '#fff'; ctx.fillRect(234, 320, 12, 340);
  for (let i = 0; i < 6; i++) { poly([[60 + i * 60, 290], [120 + i * 60, 290], [90 + i * 60, 370]], i % 2 ? '#ff8c66' : '#ffb199'); } box(50, 276, 380, 20, 8, '#c96a4a');
  // alacenas y cuadro
  box(500, 280, 520, 300, 16, '#3fa39a'); box(516, 296, 240, 268, 10, '#58bdb3'); box(764, 296, 240, 268, 10, '#58bdb3'); ell(740, 430, 9, 9, '#fff'); ell(780, 430, 9, 9, '#fff');
  // nevera con imanes
  box(1040, 420, 260, 880, 20, '#e9eef2'); box(1040, 720, 260, 10, 4, '#c9d2da'); box(1060, 560, 14, 120, 6, '#b5bec8'); box(1060, 780, 14, 160, 6, '#b5bec8'); [[1130, 520, C.red], [1180, 600, C.yellow], [1230, 500, C.blue]].forEach(([x, y, c]) => box(x, y, 34, 34, 8, c));
  // mesón, estufa con olla
  box(-OX, 1110, 1260, 40, 8, '#c9cfd6'); box(-OX, 1150, 1260, 160, 0, '#3fa39a'); for (let x = -180; x < 1040; x += 200) { box(x, 1170, 180, 120, 10, '#58bdb3'); ell(x + 90, 1196, 8, 8, '#fff'); }
  box(520, 1060, 260, 56, 10, '#2d2a4a'); box(570, 960, 160, 110, 16, '#c0392b'); box(550, 950, 200, 22, 10, '#e74c3c'); box(540, 990, 22, 16, 6, '#e74c3c'); box(738, 990, 22, 16, 6, '#e74c3c');
  // piso de baldosa
  for (let y = 1300, j = 0; y < 1920; y += 104, j++) for (let x = -OX, i = 0; x < 1300; x += 104, i++) { ctx.fillStyle = (i + j) % 2 ? '#f4ead9' : '#d9c7a8'; ctx.fillRect(x, y, 104, 104); }
  ctx.fillStyle = '#c9a96e'; ctx.fillRect(-OX, 1290, 1500, 16);
});
function kitchenTable() { // mesa al frente con mantel de cuadros
  sh(540, 1880, 520, 30); box(60, 1500, 960, 60, 24, '#c0392b'); for (let i = 0; i < 12; i++) box(70 + i * 80, 1500, 40, 60, 0, 'rgba(255,255,255,.35)'); box(60, 1552, 960, 160, 0, '#e8e2d6'); for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) box(60 + i * 80, 1552 + j * 80, 80, 80, 0, 'rgba(192,57,43,.55)');
  box(120, 1700, 40, 220, 8, '#8c5a3c'); box(920, 1700, 40, 220, 8, '#8c5a3c');
  ell(540, 1490, 150, 30, '#fff'); for (let i = 0; i < 4; i++) ell(470 + i * 46, 1474 - (i % 2) * 8, 44, 14, '#f3d9a0'); // arepas
  [[250, 1470], [830, 1470]].forEach(([x, y]) => { box(x - 34, y - 40, 68, 56, 14, '#fff'); ell(x, y - 40, 30, 9, '#5a2f1c'); ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(x + 40, y - 14, 18, -1.3, 1.3); ctx.stroke(); });
}
function steam(x, y, t) { ctx.lineCap = 'round'; for (let i = 0; i < 2; i++) { const k = (t * .5 + i / 2) % 1; ctx.globalAlpha = (1 - k) * .7; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; const by = y - k * 110; ctx.beginPath(); ctx.moveTo(x + i * 22, by); ctx.quadraticCurveTo(x + 16 + i * 22, by - 26, x + i * 22, by - 52); ctx.stroke(); } ctx.globalAlpha = 1; }
function tia(x, fy, s, t, o = {}) {
  const talk = o.talk, b = talk ? Math.sin(t * 15) * 4 : 0, SK = '#e7b08d';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  box(-140, -600 + b, 280, 420, 100, '#7e57c2'); for (let i = 0; i < 9; i++) { const fx = -90 + (i % 3) * 90, fyy = -520 + Math.floor(i / 3) * 110 + b; ell(fx, fyy, 16, 16, '#ffd54f'); ell(fx, fyy, 7, 7, '#ff7043'); }
  box(-170, -540 + b, 56, 210, 28, '#6a45ad'); ell(-142, -330 + b, 28, 26, SK);
  ctx.save(); ctx.translate(142, -520 + b); ctx.rotate(-.5 + (talk ? Math.sin(t * 9) * .12 : 0)); box(-28, 0, 56, 180, 28, '#6a45ad'); ell(0, 186, 28, 26, SK); box(-34, 150, 68, 56, 14, '#fff'); ell(0, 150, 30, 9, '#5a2f1c'); ctx.restore();
  box(-22, -636 + b, 44, 44, 12, '#cf9272');
  const hy = -720 + b;
  [[-80, -70], [-40, -104], [10, -112], [56, -96], [88, -60], [-98, -24], [100, -18], [-100, 26], [102, 30]].forEach(([a, c]) => ell(a, hy + c, 40, 38, '#bfb6c9'));
  ell(-92, hy + 10, 13, 20, '#cf9272'); ell(92, hy + 10, 13, 20, '#cf9272'); ell(0, hy, 88, 94, SK);
  [[-56, -78], [-16, -90], [28, -88], [62, -72]].forEach(([a, c]) => ell(a, hy + c, 30, 24, '#bfb6c9'));
  ell(-48, hy + 44, 18, 10, 'rgba(255,90,110,.4)'); ell(48, hy + 44, 18, 10, 'rgba(255,90,110,.4)');
  face(0, hy + 8, 1.02, o.ex || 'neutral', talk, t, SK, { lash: true, lip: '#d81b60', brow: '#8d8496' });
  ctx.strokeStyle = '#d81b60'; ctx.lineWidth = 6; rrect(-62, hy - 18, 52, 44, 16); ctx.stroke(); rrect(10, hy - 18, 52, 44, 16); ctx.stroke(); line(-10, hy, 10, hy, 6, '#d81b60');
  ctx.strokeStyle = '#ffd54f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-62, hy + 10); ctx.quadraticCurveTo(-110, hy + 110, -30, hy + 150); ctx.stroke(); ctx.beginPath(); ctx.moveTo(62, hy + 10); ctx.quadraticCurveTo(110, hy + 110, 30, hy + 150); ctx.stroke();
  ell(-94, hy + 46, 12, 12, '#ffd54f'); ell(94, hy + 46, 12, 12, '#ffd54f');
  ctx.restore();
}
/* ---------- chat genérico (grupo familiar y Doña Rosa) ---------- */
function chatUI(t, t0, cfg) {
  const k = eback(clamp((t - t0) / .4)); if (k <= 0) return;
  ctx.fillStyle = 'rgba(14,10,24,.78)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 900); ctx.scale(k, k);
  box(-440, -640, 920, 1300, 60, 'rgba(0,0,0,.4)'); box(-460, -660, 920, 1300, 60, '#0e0e12'); box(-436, -636, 872, 1252, 44, '#f4f1ec');
  ctx.save(); rrect(-436, -636, 872, 1252, 44); ctx.clip(); ctx.fillStyle = cfg.color; ctx.fillRect(-436, -636, 872, 180);
  ell(-340, -546, 58, 58, 'rgba(255,255,255,.9)'); ctx.font = `700 60px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = cfg.color; ctx.fillText(cfg.icon, -340, -542);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 54px ${F}`; ctx.fillText(cfg.title, -260, -570); ctx.font = `600 32px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillText(cfg.sub, -260, -516);
  let y = -420;
  for (const m of cfg.msgs) {
    const d = t - (t0 + m.at); if (d < 0) { if (d > -.7 && !m.mine) { box(-400, y, 150, 80, 30, '#fff'); for (let i = 0; i < 3; i++) ell(-360 + i * 36, y + 40 + Math.sin(t * 10 + i) * 6, 10, 10, '#b5b0a8'); } break; }
    const s = eback(clamp(d / .28)); ctx.font = `600 ${m.big ? 150 : 44}px ${F}`;
    const lines = ['']; m.text.split(' ').forEach(w => { const c = lines[lines.length - 1]; if (ctx.measureText(c + ' ' + w).width > 600 && c) lines.push(w); else lines[lines.length - 1] = c ? c + ' ' + w : w; });
    const lh = m.big ? 170 : 58, bw = Math.max(...lines.map(l => ctx.measureText(l).width), m.name ? 220 : 60) + 60, bh = lines.length * lh + (m.name ? 80 : 44), x = m.mine ? 400 - bw : -400;
    ctx.save(); ctx.translate(m.mine ? 400 : -400, y); ctx.scale(s, s); ctx.translate(m.mine ? -400 : 400, -y);
    box(x, y, bw, bh, 30, m.mine ? '#ffd9c2' : '#fff'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    if (m.name) { ctx.font = `700 34px ${F}`; ctx.fillStyle = m.nc; ctx.fillText(m.name, x + 30, y + 34); }
    ctx.font = `600 ${m.big ? 150 : 44}px ${F}`; ctx.fillStyle = C.ink; lines.forEach((l, i) => ctx.fillText(l, x + 30, y + (m.name ? 60 : 22) + lh / 2 + i * lh));
    ctx.restore(); y += bh + 22;
  }
  ctx.restore();
  box(-400, 500, 800, 90, 45, '#fff'); ctx.font = `600 38px ${F}`; ctx.textAlign = 'left'; ctx.fillStyle = '#b5b0a8';
  const tm = cfg.typing; ctx.fillText(tm && t > t0 + tm[0] && t < t0 + tm[1] ? tm[2].slice(0, Math.floor((t - t0 - tm[0]) * 14)) + '|' : 'Mensaje…', -360, 546);
  ctx.restore();
}
function cvPaper(t, t0) {
  const d = t - t0, k = eback(clamp(d / .35)), out = clamp((d - 1.5) / .3); if (d < 0 || out >= 1) return;
  ctx.save(); ctx.translate(540 + out * 900, 640); ctx.scale(k, k); ctx.rotate(-.04 + out * .4);
  box(-290, -330, 600, 680, 14, 'rgba(0,0,0,.3)'); box(-300, -340, 600, 680, 14, '#fffdf7'); box(-300, -340, 600, 110, 14, '#33406b');
  ctx.fillStyle = '#fff'; ctx.font = `700 60px ${F}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('HOJA DE VIDA', -270, -282);
  box(-270, -200, 170, 190, 10, '#e9edf5'); bHead(-185, -100, .75, 'happy', false, t, {});
  ctx.fillStyle = C.ink; ctx.font = `700 46px ${F}`; ctx.fillText('Brayan', -70, -160); ctx.font = `600 32px ${F}`; ctx.fillStyle = '#7a7f93'; ctx.fillText('24 años · disponible YA', -70, -110);
  ctx.fillStyle = C.ink; ctx.font = `700 38px ${F}`; ctx.fillText('EXPERIENCIA', -270, 50); ctx.font = `600 40px ${F}`; ctx.fillStyle = '#d81b60'; ctx.fillText('• CTA V — 312 horas', -270, 110);
  ctx.fillStyle = C.ink; ctx.font = `700 38px ${F}`; ctx.fillText('HABILIDADES', -270, 200); ctx.font = `600 36px ${F}`; ctx.fillStyle = '#4a4f63'; ctx.fillText('• Dormir en cualquier parte', -270, 256); ctx.fillText('• Combos con el control', -270, 304);
  ctx.restore();
}
function noFlash(t, t0, i) {
  const d = t - t0, shops = ['TIENDA DON PEPE', 'FERRETERÍA EL TORNILLO', 'PAPELERÍA LUCERO'], cols = [['#3fa39a', '#49b3a9'], ['#e2a03c', '#ebb053'], ['#7e57c2', '#8d68cf']][i];
  rays(540, 960, cols[0], cols[1], t); const p = lerp(1.2, 1, eout(clamp(d / .15)));
  ctx.save(); ctx.translate(540, 900); ctx.scale(p, p);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 66px ${F}`; outlined(shops[i], 0, -520, C.cream, 14);
  ctx.save(); ctx.rotate([-.15, .12, -.08][i] + d * .3); box(-170, -220, 340, 440, 10, '#fffdf7'); box(-170, -220, 340, 70, 10, '#33406b'); for (let j = 0; j < 5; j++) box(-140, -110 + j * 56, 280 - (j % 2) * 80, 16, 6, '#c9cfdd'); ctx.restore();
  ctx.font = `700 360px ${F}`; ctx.rotate(-.08); outlined('NO', 0, 20, C.red, 40); ctx.restore();
}
function vitrina(t) {
  ctx.fillStyle = '#1a1830'; ctx.fillRect(0, 0, W, H); for (let y = 0; y < H; y += 70) for (let x = ((y / 70) % 2) * 70; x < W; x += 140) box(x, y, 132, 62, 4, 'rgba(255,255,255,.035)');
  ctx.fillStyle = '#2a2740'; ctx.fillRect(0, 1560, W, 360); ctx.fillStyle = '#3a3658'; ctx.fillRect(0, 1560, W, 16);
  const fl = .85 + .15 * Math.sin(t * 6); const g = ctx.createRadialGradient(660, 900, 100, 660, 900, 900); g.addColorStop(0, `rgba(255,92,168,${.35 * fl})`); g.addColorStop(1, 'rgba(255,92,168,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  box(300, 380, 720, 1120, 20, '#0e0c1c'); ctx.save(); rrect(330, 410, 660, 1060, 10); ctx.clip(); ctx.translate(660, 860); ctaArt(660, 900); ctx.restore();
  box(330, 1300, 660, 170, 0, 'rgba(14,12,28,.85)'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 76px ${F}`; ctx.fillStyle = C.yellow; ctx.fillText('TORNEO ESTE SÁBADO', 660, 1352); ctx.font = `700 50px ${F}`; ctx.fillStyle = '#7cff9a'; ctx.fillText('PREMIO: $ 5.000.000', 660, 1424);
  ctx.save(); ctx.globalAlpha = .12; poly([[330, 410], [560, 410], [400, 1470], [330, 1470]], '#fff'); ctx.restore();
  box(300, 300, 720, 90, 16, '#ff5ca8'); ctx.font = `700 54px ${F}`; ctx.fillStyle = '#fff'; ctx.fillText('ZONA GAMER', 660, 348);
}
function pollAB(t) {
  rays(540, 900, '#2a1a14', '#3a241b', t * 1.5);
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 96px ${F}`; outlined('¿QUÉ HAGO MAÑANA?', 540, 350, C.cream, 18); ctx.restore();
  EP.options.forEach((op, i) => { const k = eback(clamp((t - S.poll - .3 - i * .3) / .35)); if (k <= 0) return;
    ctx.save(); ctx.translate(540, 640 + i * 330); ctx.scale(k, k); ctx.rotate([-.015, .012][i]);
    box(-430, -120, 880, 260, 34, 'rgba(0,0,0,.4)'); box(-440, -130, 880, 260, 34, C.cream); ctx.lineWidth = 9; ctx.strokeStyle = C.coffee; rrect(-440, -130, 880, 260, 34); ctx.stroke();
    box(-410, -100, 170, 200, 28, [C.orange, C.blue][i]); ctx.lineWidth = 7; rrect(-410, -100, 170, 200, 28); ctx.stroke();
    ctx.fillStyle = C.coffee; ctx.font = `700 140px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(op.k, -325, 8);
    ctx.textAlign = 'left'; fitFont(op.t, 700, 60, 500); ctx.fillText(op.t, -210, -34); ctx.font = `600 42px ${F}`; ctx.fillStyle = '#7a5a48'; ctx.fillText(op.s, -210, 40); heartLike(370, 70, .9 + .08 * Math.sin(t * 6 + i)); ctx.restore(); });
  const k = clamp((t - S.poll - 1.2) / .3);
  if (k > 0) { ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const y = 1260 + Math.sin(t * 6) * 6; ctx.font = `700 66px ${F}`; outlined('DALE LIKE AL COMENTARIO', 540, y - 40, C.yellow, 14); ctx.font = `700 58px ${F}`; outlined('DE TU OPCIÓN', 540, y + 34, C.cream, 12); heartLike(540, y + 140, 1.3 + .12 * Math.sin(t * 8)); ctx.restore(); }
  bHead(540, 1720, 1.5, Math.floor(t * 1.4) % 2 ? 'shock' : 'sad', talks(t, 'BRAYAN'), t, { sweat: t, bald: true });
}
const FAM = { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', typing: [3.7, 4.7, 'yo sí voy a cons'], msgs: [
  { at: .5, name: 'Tía Gladys', nc: '#7e57c2', text: 'Brayan salió dizque a buscar trabajo 🙏' },
  { at: 1.5, name: 'Primo Kevin', nc: '#e2584a', text: '🦥', big: true },
  { at: 2.3, name: 'Primo Kevin', nc: '#e2584a', text: 'jajaja el vago va a buscar trabajo 🤣' },
  { at: 3.2, name: 'Tía Gladys', nc: '#7e57c2', text: '😂😂😂' }] };
const ROSA = { color: '#e2a03c', icon: '🥖', title: 'Doña Rosa', sub: 'Panadería La Esquina', msgs: [
  { at: .5, text: 'Mijo, su mamá me habló de usted.' },
  { at: 1.5, text: 'Necesito a alguien mañana a las 5 a. m. en la panadería 🥖 ¿Se le mide?' }] };

/* ===================== DÍA 2: "Ni un peso" ===================== */
WHO['KEVIN'] = '#ffd23f'; WHO['EL TURBIOS'] = '#7fd8ff';
function kevin(x, fy, s, t, o = {}) {
  const talk = o.talk, b = talk ? Math.sin(t * 15) * 3 : 0, SK = '#c88c63';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  sh(0, 4, 130);
  box(-60, -300, 50, 300, 22, '#2b3550'); box(10, -300, 50, 300, 22, '#2b3550'); box(-70, -26, 66, 30, 12, '#fff'); box(4, -26, 66, 30, 12, '#fff'); box(-70, -10, 66, 10, 4, C.red); box(4, -10, 66, 10, 4, C.red);
  box(-120, -600 + b, 240, 330, 80, '#ffd23f'); box(-120, -480 + b, 240, 30, 0, '#2a62c9'); box(-120, -440 + b, 240, 16, 0, '#e8524a'); ctx.fillStyle = '#2a62c9'; ctx.font = `700 70px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('10', 0, -360 + b);
  ctx.strokeStyle = '#f1c94a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, -590 + b, 46, .3, Math.PI - .3); ctx.stroke();
  box(-160, -570 + b, 52, 220, 26, '#ffd23f'); ell(-134, -340 + b, 27, 27, SK);
  if (o.clipper) { ctx.save(); ctx.translate(130, -560 + b); ctx.rotate(-2.1); box(-25, 0, 50, 190, 25, '#ffd23f'); ell(0, 196, 27, 27, SK); ctx.translate(0, 220); ctx.rotate(Math.sin(t * 40) * .05); box(-30, -20, 60, 110, 20, '#2d2a4a'); box(-34, -40, 68, 30, 6, '#c9cfdd'); for (let i = 0; i < 6; i++) box(-30 + i * 11, -52, 6, 14, 2, '#c9cfdd'); ell(0, 40, 9, 9, '#5ad17a'); ctx.restore(); }
  else { box(108, -570 + b, 52, 220, 26, '#ffd23f'); ell(134, -340 + b, 27, 27, SK); }
  box(-20, -630 + b, 40, 40, 12, '#b07a54');
  const hy = -710 + b;
  ell(-86, hy + 8, 13, 20, '#b07a54'); ell(86, hy + 8, 13, 20, '#b07a54'); ell(0, hy, 84, 90, SK);
  // gorra al revés
  ell(0, hy - 56, 88, 50, '#e8524a'); box(-96, hy - 50, 192, 26, 12, '#c93a3c'); box(-30, hy - 112, 60, 24, 10, '#c93a3c');
  face(0, hy + 10, 1, o.ex || 'happy', talk, t, SK, {});
  if (o.shades !== false) { box(-70, hy - 10, 62, 34, 12, '#141420'); box(8, hy - 10, 62, 34, 12, '#141420'); line(-8, hy, 8, hy, 6, '#141420'); ell(-50, hy - 2, 12, 5, 'rgba(255,255,255,.35)', -.3); ell(28, hy - 2, 12, 5, 'rgba(255,255,255,.35)', -.3); }
  ctx.strokeStyle = '#3a2418'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-26, hy + 36); ctx.quadraticCurveTo(0, hy + 30, 26, hy + 36); ctx.stroke();
  ctx.restore();
}
function moto(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); sh(0, 110, 300, 26);
  const wheel = cx => { ell(cx, 40, 92, 92, '#1c1c24'); ell(cx, 40, 50, 50, '#9aa3b8'); ell(cx, 40, 18, 18, '#555'); };
  wheel(-210); wheel(220);
  poly([[-150, -40], [120, -60], [200, 10], [-60, 20]], '#e8524a'); box(-170, -90, 220, 50, 24, '#2d2a4a'); poly([[100, -60], [200, -160], [230, -150], [160, -40]], '#3a3d5c'); line(200, -160, 260, -180, 14, '#2d2a4a'); ell(250, -110, 34, 26, '#ffe38a');
  box(-80, 0, 150, 60, 20, '#8b93a8'); line(-220, 40, -80, 20, 12, '#8b93a8');
  ctx.restore();
}
function turbiosHead(cx, cy, s, t, talk) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  const SK = '#f2c4a2';
  // capucha con orejas de mapache
  ell(-86, -96, 34, 38, '#6d6f80'); ell(86, -96, 34, 38, '#6d6f80'); ell(-86, -96, 18, 20, '#3a3b48'); ell(86, -96, 18, 20, '#3a3b48');
  ell(0, 10, 120, 122, '#8a8d9f');
  ell(0, 6, 82, 88, SK);
  // pelo blanco con mechón azul
  ctx.fillStyle = '#f4f4f8'; ctx.beginPath(); ctx.moveTo(-84, -10); ctx.quadraticCurveTo(-80, -100, 0, -96); ctx.quadraticCurveTo(84, -100, 84, -10); ctx.lineTo(56, -48); ctx.lineTo(30, -30); ctx.lineTo(10, -60); ctx.lineTo(-20, -34); ctx.lineTo(-44, -56); ctx.closePath(); ctx.fill();
  poly([[10, -96], [40, -94], [24, -40], [8, -50]], '#3fa9f5');
  // antifaz de mapache
  ell(-28, 6, 30, 20, 'rgba(60,60,80,.35)'); ell(28, 6, 30, 20, 'rgba(60,60,80,.35)');
  face(0, 8, 1, 'happy', talk, t, SK, {});
  if (!talk) { box(-14, 52, 28, 26, 10, '#ff7a8a'); }
  // audífonos
  ctx.strokeStyle = '#ff2fa0'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0, 0, 108, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); box(-130, -30, 40, 80, 16, '#ff2fa0'); box(90, -30, 40, 80, 16, '#ff2fa0');
  ell(-50, 44, 14, 8, 'rgba(255,110,130,.4)'); ell(50, 44, 14, 8, 'rgba(255,110,130,.4)');
  ctx.restore();
}
function turbiosAd(x, y, w, h, t, small) { // panel publicitario
  ctx.save(); ctx.translate(x, y);
  let g = ctx.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#6a2bd9'); g.addColorStop(1, '#ff2fa0'); box(-w / 2, -h / 2, w, h, small ? 10 : 18, g);
  ctx.save(); rrect(-w / 2, -h / 2, w, h, small ? 10 : 18); ctx.clip();
  for (let i = 0; i < 10; i++) { ctx.save(); ctx.translate(-w / 2 + ((i * 137 + t * 40) % (w + 80)) - 40, -h / 2 + ((i * 89) % h)); heartPath(w * .025); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); ctx.restore(); }
  turbiosHead(-w * .26, h * .1, (h / 360) * .82, t, false);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 ${h * .13}px ${F}`; ctx.lineWidth = h * .025; ctx.strokeStyle = '#2a0f3f'; ctx.lineJoin = 'round';
  ctx.strokeText('EL TURBIOS', w * .2, -h * .28); ctx.fillStyle = '#fff'; ctx.fillText('EL TURBIOS', w * .2, -h * .28);
  box(w * .2 - h * .34, -h * .12, h * .68, h * .16, h * .08, '#e8524a'); ctx.fillStyle = '#fff'; ctx.font = `700 ${h * .1}px ${F}`; ctx.fillText('● EN VIVO HOY', w * .2, -h * .04);
  ctx.font = `700 ${h * .12}px ${F}`; ctx.strokeText('2,3 M viendo', w * .2, h * .16); ctx.fillStyle = '#ffe38a'; ctx.fillText('2,3 M viendo', w * .2, h * .16);
  ctx.font = `600 ${h * .08}px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillText('@elTurbiosLOL', w * .2, h * .34);
  ctx.restore(); ctx.lineWidth = small ? 6 : 12; ctx.strokeStyle = '#1c1c24'; rrect(-w / 2, -h / 2, w, h, small ? 10 : 18); ctx.stroke();
  ctx.restore();
}
function cityScene(t, camX) {
  // cielo, edificios con pancarta gigante, calle
  let g = ctx.createLinearGradient(0, 0, 0, 1500); g.addColorStop(0, '#8fb8ff'); g.addColorStop(1, '#ffd9b0'); ctx.fillStyle = g; ctx.fillRect(-800, 0, 2700, 1500);
  [[-500, 500, 300], [-180, 700, 260], [1080, 560, 320], [1400, 760, 260]].forEach(([x, y, w]) => { box(x, y, w, 1000, 8, '#7d88a8'); for (let i = 0; i < Math.floor(w / 80); i++) for (let j = 0; j < 8; j++) box(x + 24 + i * 80, y + 40 + j * 110, 44, 64, 4, (i + j) % 3 ? '#a9b6d6' : '#ffe08a'); });
  box(60, 160, 960, 1340, 10, '#59627e'); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) box(110 + i * 150, 1020 + j * 110, 90, 70, 6, (i * 2 + j) % 5 ? '#3f4763' : '#ffe08a');
  // pancarta
  line(120, 140, 120, 260, 10, '#3a3d5c'); line(960, 140, 960, 260, 10, '#3a3d5c');
  turbiosAd(540, 600, 900, 720, t, false);
  for (let i = 0; i < 4; i++) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(t * 8 + i); ell(100 + i * 290, 230, 26, 26, '#ffe38a'); ctx.restore(); }
  ctx.fillStyle = '#8b93a8'; ctx.fillRect(-800, 1500, 2700, 420); ctx.fillStyle = '#6a7186'; ctx.fillRect(-800, 1500, 2700, 14); for (let x = -800; x < 1900; x += 220) box(x, 1700, 120, 16, 6, '#e9edf5');
}
function bus(x, y, t) {
  ctx.save(); ctx.translate(x, y);
  box(-560, -360, 1120, 380, 50, '#f2f2f2'); box(-560, -60, 1120, 70, 0, '#e8524a'); for (let i = 0; i < 5; i++) box(-520 + i * 200, -330, 160, 110, 14, '#9fc7e8');
  turbiosAd(80, -150, 520, 170, t, true);
  ell(-360, 30, 70, 70, '#1c1c24'); ell(-360, 30, 30, 30, '#9aa3b8'); ell(360, 30, 70, 70, '#1c1c24'); ell(360, 30, 30, 30, '#9aa3b8');
  ell(540, -60, 24, 18, '#ffe38a');
  ctx.restore();
}
function dreamBubble(t, t0) {
  const k = eback(clamp((t - t0) / .5)); if (k <= 0) return;
  [[340, 1180, 26], [400, 1080, 40]].forEach(([x, y, r], i) => ell(x, y, r * clamp((t - t0) / (.2 + i * .1)), r * clamp((t - t0) / (.2 + i * .1)), '#fff'));
  ctx.save(); ctx.translate(560, 700); ctx.scale(k, k);
  for (let i = 0; i < 9; i++) ell(Math.cos(i * .7) * 360, Math.sin(i * .7) * 250, 140, 120, '#fff');
  ell(0, 0, 400, 290, '#fff');
  box(-320, -220, 640, 420, 26, '#2a1f4a'); ctx.save(); rrect(-320, -220, 640, 420, 26); ctx.clip();
  let g = ctx.createLinearGradient(0, -220, 0, 200); g.addColorStop(0, '#6a2bd9'); g.addColorStop(1, '#ff2fa0'); ctx.fillStyle = g; ctx.fillRect(-320, -220, 640, 420);
  box(-150, -40, 300, 260, 60, '#1c1c24'); box(-120, -20, 240, 220, 40, '#ff2fa0');
  bHead(0, -30, .95, 'happy', false, t, {});
  ctx.strokeStyle = '#ff2fa0'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, -36, 98, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ell(-80, -126, 30, 30, '#6d6f80'); ell(80, -126, 30, 30, '#6d6f80');
  box(-300, -200, 210, 52, 26, '#e8524a'); ctx.fillStyle = '#fff'; ctx.font = `700 34px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('● EN VIVO', -195, -172);
  box(110, -200, 190, 52, 26, 'rgba(0,0,0,.5)'); ctx.fillStyle = '#ffe38a'; ctx.fillText('👀 2,3 M', 205, -172);
  for (let i = 0; i < 6; i++) { const kk = (t * .8 + i / 6) % 1; ctx.save(); ctx.globalAlpha = 1 - kk; ctx.translate(240 + Math.sin(i * 3 + t) * 40, 180 - kk * 300); heartPath(14); ctx.fillStyle = '#ff5c8a'; ctx.fill(); ctx.restore(); }
  for (let i = 0; i < 5; i++) { const kk = (t * .6 + i / 5) % 1; ctx.save(); ctx.globalAlpha = 1 - kk; box(-280 + i * 40, 200 - kk * 340, 60, 30, 4, '#5ad17a'); ctx.fillStyle = '#1b5e33'; ctx.font = `700 22px ${F}`; ctx.fillText('$', -250 + i * 40, 215 - kk * 340); ctx.restore(); }
  ctx.restore(); ctx.restore();
}
const TORNEO = { color: '#7e57c2', icon: '🎮', title: 'Torneo CTA V – Barrio', sub: 'Admin, Kevin, Don Pepe y 48 más', msgs: [
  { at: .4, name: 'Admin 🏆', nc: '#7e57c2', text: 'Inscripción: $50.000. Cierra el viernes 🎮' },
  { at: 1.5, name: 'Kevin', nc: '#e2584a', text: 'jajaja ese Brayan no tiene ni pa\'l bus 🤣' },
  { at: 2.5, name: 'Don Pepe', nc: '#3fa39a', text: 'aquí en la tienda se juega la final 👀' }] };

/* ===================== DÍA 3: "Me jugué el pelo" ===================== */
WHO['DON PEPE'] = '#ffb86c'; WHO['SOFI'] = '#ff8fc8';
const SHOP = layer(() => {
  const r = mulberry(17);
  let g = ctx.createLinearGradient(0, 0, 0, 1300); g.addColorStop(0, '#9ad1c8'); g.addColorStop(1, '#b6e0d6'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, 1500, 1300);
  box(-OX, 0, 1500, 120, 0, '#e8524a'); for (let x = -OX; x < 1300; x += 120) poly([[x, 120], [x + 120, 120], [x + 60, 170]], '#e8524a'); ctx.fillStyle = '#fff'; ctx.font = `700 70px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TIENDA DON PEPE', 540, 64);
  // estanterías con productos
  for (let s = 0; s < 4; s++) { const y = 300 + s * 170; box(-OX, y, 560, 16, 4, '#8c5a3c'); for (let i = 0; i < 9; i++) { const x = -OX + 20 + i * 60, h = 70 + r() * 70, c = [C.red, C.yellow, C.blue, C.green, '#ff9f43', '#9b7bff', '#fff'][Math.floor(r() * 7)]; if (r() < .5) { box(x, y - h, 46, h, 6, c); box(x, y - h, 46, 16, 4, 'rgba(255,255,255,.4)'); } else { box(x + 10, y - h, 26, h, 10, c); box(x + 14, y - h - 16, 18, 18, 4, '#ddd'); } } }
  // nevera de gaseosas
  box(-OX, 1000, 300, 300, 10, '#e9eef2'); box(-OX + 16, 1016, 268, 268, 6, '#cfe8f5'); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) box(-OX + 30 + i * 64, 1030 + j * 86, 40, 70, 10, [C.red, C.green, C.yellow, C.blue][(i + j) % 4]);
  // TV en la pared y afiches
  box(420, 260, 520, 330, 18, '#1c1c24'); box(670, 590, 20, 60, 4, '#555');
  box(980, 240, 220, 300, 10, '#120a24'); ctx.save(); ctx.translate(1090, 390); rrect(-100, -140, 200, 280, 6); ctx.clip(); ctaArt(200, 280); ctx.restore(); box(980, 540, 220, 70, 8, '#ff5ca8'); ctx.fillStyle = '#fff'; ctx.font = `700 34px ${F}`; ctx.fillText('TORNEO SÁBADO', 1090, 576);
  // puerta con campanita
  box(1050, 700, 230, 600, 10, '#5a3a8a'); box(1066, 716, 198, 584, 6, '#cfe8f5'); ell(1080, 700, 18, 22, C.yellow);
  // mostrador
  box(-OX, 1180, 1500, 30, 6, '#b5764a');
  ctx.fillStyle = '#e8d4b0'; ctx.fillRect(-OX, 1300, 1500, 620); for (let y = 1300; y < 1920; y += 90) { ctx.fillStyle = 'rgba(150,110,60,.18)'; ctx.fillRect(-OX, y, 1500, 5); } for (let x = -OX; x < 1300; x += 90) { ctx.fillStyle = 'rgba(150,110,60,.18)'; ctx.fillRect(x, 1300, 5, 620); }
  ctx.fillStyle = '#c99a5e'; ctx.fillRect(-OX, 1290, 1500, 14);
});
function counter() { box(-60, 1150, 520, 160, 10, '#a86d43'); box(-60, 1130, 520, 30, 8, '#c9915e'); box(40, 1060, 110, 80, 10, '#3fa39a'); ctx.fillStyle = '#fff'; ctx.font = `700 26px ${F}`; ctx.textAlign = 'center'; ctx.fillText('$', 95, 1108); for (let i = 0; i < 4; i++) box(200 + i * 50, 1080, 36, 54, 10, [C.red, C.yellow, C.green, C.blue][i]); }
function donPepe(x, fy, s, t, o = {}) {
  const talk = o.talk, b = talk ? Math.sin(t * 13) * 3 : 0, SK = '#e2a882';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  box(-130, -580 + b, 260, 400, 90, '#f4f1ea'); box(-90, -540 + b, 180, 360, 30, '#3fa39a'); box(-150, -540 + b, 50, 200, 25, '#f4f1ea'); box(100, -540 + b, 50, 200, 25, '#f4f1ea'); ell(-125, -330 + b, 26, 26, SK); ell(125, -330 + b, 26, 26, SK);
  box(-20, -610 + b, 40, 36, 12, '#c98f6c'); const hy = -690 + b;
  ell(-88, hy + 8, 13, 20, '#c98f6c'); ell(88, hy + 8, 13, 20, '#c98f6c'); ell(0, hy, 86, 92, SK); ell(-80, hy - 6, 22, 40, '#eae6e0'); ell(80, hy - 6, 22, 40, '#eae6e0'); ell(-20, hy - 70, 34, 12, 'rgba(255,255,255,.4)', -.3);
  face(0, hy + 8, 1, o.ex || 'neutral', talk, t, SK, {});
  ell(-28, hy + 40, 34, 14, '#eae6e0', -.15); ell(28, hy + 40, 34, 14, '#eae6e0', .15);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-26, hy + 2, 20, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(26, hy + 2, 20, 0, 7); ctx.stroke(); line(-6, hy + 2, 6, hy + 2, 5, C.ink);
  ctx.restore();
}
function sofi(x, fy, s, t, o = {}) {
  const talk = o.talk, b = talk ? Math.sin(t * 13) * 3 : 0, SK = '#b9784f';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
  sh(0, 4, 120);
  box(-56, -300, 48, 300, 22, '#2d3a66'); box(8, -300, 48, 300, 22, '#2d3a66'); box(-66, -24, 62, 28, 12, '#fff'); box(4, -24, 62, 28, 12, '#fff');
  // cola de caballo detrás
  ell(70, -720 + b, 70, 110, '#2a1712', .4);
  box(-110, -580 + b, 220, 300, 70, '#8a5ad1'); ctx.fillStyle = '#fff'; ctx.font = `700 46px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('CTA V', 0, -470 + b); ctx.font = `600 28px ${F}`; ctx.fillText('TORNEO', 0, -420 + b);
  box(-146, -560 + b, 46, 200, 23, '#8a5ad1'); ell(-123, -350 + b, 24, 24, SK);
  ctx.save(); ctx.translate(120, -550 + b); ctx.rotate(o.wave ? -2.4 + Math.sin(t * 10) * .25 : -.15); box(-23, 0, 46, 200, 23, '#8a5ad1'); ell(0, 206, 24, 24, SK); ctx.restore();
  box(-18, -610 + b, 36, 40, 12, '#a3683f');
  const hy = -690 + b;
  ctx.strokeStyle = '#2d2a4a'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, hy + 90, 60, Math.PI * 1.1, Math.PI * 1.9, true); ctx.stroke(); box(-76, hy + 70, 30, 46, 12, '#ff5ca8'); box(46, hy + 70, 30, 46, 12, '#ff5ca8');
  ell(0, hy, 84, 90, SK);
  // pelo crespo
  const r = mulberry(3); for (let i = 0; i < 22; i++) { const a = Math.PI * (1.02 + r() * .96), d = 80 + r() * 18; ell(Math.cos(a) * d, hy + Math.sin(a) * d * .95, 26, 26, '#2a1712'); }
  ell(0, hy - 64, 74, 30, '#2a1712'); ell(-80, hy + 6, 22, 36, '#2a1712'); ell(80, hy + 6, 22, 36, '#2a1712');
  face(0, hy + 10, 1, o.ex || 'happy', talk, t, SK, { lash: true, lip: '#c0306a', brow: '#2a1712' });
  ell(-46, hy + 44, 16, 9, 'rgba(255,120,150,.45)'); ell(46, hy + 44, 16, 9, 'rgba(255,120,150,.45)'); ell(-82, hy + 40, 7, 7, C.yellow); ell(82, hy + 40, 7, 7, C.yellow);
  ctx.restore();
}
function crowdHeads(t, y, n, seed, cheer) { const r = mulberry(seed); for (let i = 0; i < n; i++) { const x = -150 + i * (1350 / n) + r() * 40, s = .8 + r() * .3, j = cheer ? Math.abs(Math.sin(t * 9 + i)) * 26 : Math.sin(t * 2 + i) * 4, c = ['#e2a882', '#b9784f', '#f0c4a2', '#8f5a3c'][i % 4];
  ctx.save(); ctx.translate(x, y - j); ctx.scale(s, s); box(-80, 40, 160, 220, 60, ['#5aa9ff', '#ff7aa8', '#ffd23f', '#5ad17a', '#9b7bff'][i % 5]); ell(0, 0, 60, 66, c); ell(0, -40, 62, 34, ['#2a1712', '#5a3a22', '#1c1c24'][i % 3]); ell(-20, 4, 7, 9, C.ink); ell(20, 4, 7, 9, C.ink); if (cheer) ell(0, 32, 16, 14, '#7a2b3a'); else line(-12, 32, 12, 32, 5, C.ink); ctx.restore(); } }
function gameScreen(t) {
  ctx.fillStyle = '#120a24'; ctx.fillRect(0, 0, W, H); ctx.save(); ctx.translate(540, 940); ctaArt(1080, 1920); ctx.restore(); ctx.fillStyle = 'rgba(18,10,36,.72)'; ctx.fillRect(0, 0, W, H);
  // dos carros corriendo
  const lane = (y, col, sp, off) => { const x = 540 + Math.sin(t * sp + off) * 260; box(x - 110, y - 40, 220, 80, 30, col); box(x - 60, y - 80, 120, 50, 20, col); ell(x - 70, y + 40, 26, 26, '#120a24'); ell(x + 70, y + 40, 26, 26, '#120a24'); box(x + 90, y - 20, 24, 16, 6, '#ffe38a'); };
  lane(1100, '#ff5ca8', 1.7, 0); lane(1300, '#ffd23f', 2.1, 1.3);
  const sc = scoreAt(t); ctx.save(); ctx.translate(0, 380); box(140, 260, 800, 190, 30, 'rgba(0,0,0,.7)');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 54px ${F}`; ctx.fillStyle = '#ffd23f'; ctx.fillText('KEVIN', 330, 310); ctx.fillStyle = '#ff5ca8'; ctx.fillText('BRAYAN', 750, 310);
  ctx.font = `700 110px ${F}`; ctx.fillStyle = '#fff'; ctx.fillText(`${sc[0]}  –  ${sc[1]}`, 540, 390);
  ctx.font = `700 40px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fillText('PRIMERO A 5', 540, 500); ctx.restore();
}
function scoreAt(t) { // marcador según el momento
  const g = S.game, c = S.comeback;
  if (t < g + .8) return [0, 0]; if (t < g + 1.6) return [1, 0]; if (t < g + 2.4) return [2, 0]; if (t < c) return [3, 0];
  if (t < c + 1.0) return [3, 1]; if (t < c + 2.0) return [3, 2]; if (t < c + 3.0) return [3, 3]; if (t < S.lose) return [4, 4]; return [5, 4];
}
function chatPhotoUI(t, t0, cfg) {
  // como chatUI pero con mensajes de foto/transferencia
  const k = eback(clamp((t - t0) / .4)); if (k <= 0) return;
  ctx.fillStyle = 'rgba(14,10,24,.78)'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(540, 900); ctx.scale(k, k);
  box(-460, -660, 920, 1300, 60, '#0e0e12'); box(-436, -636, 872, 1252, 44, '#f4f1ec');
  ctx.save(); rrect(-436, -636, 872, 1252, 44); ctx.clip(); ctx.fillStyle = cfg.color; ctx.fillRect(-436, -636, 872, 180);
  ell(-340, -546, 58, 58, 'rgba(255,255,255,.9)'); ctx.font = `700 60px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = cfg.color; ctx.fillText(cfg.icon, -340, -542);
  ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 54px ${F}`; ctx.fillText(cfg.title, -260, -570); ctx.font = `600 32px ${F}`; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillText(cfg.sub, -260, -516);
  let y = -420;
  for (const m of cfg.msgs) {
    const d = t - (t0 + m.at); if (d < 0) { if (d > -.6) { box(-400, y, 150, 80, 30, '#fff'); for (let i = 0; i < 3; i++) ell(-360 + i * 36, y + 40 + Math.sin(t * 10 + i) * 6, 10, 10, '#b5b0a8'); } break; }
    const s = eback(clamp(d / .28)); ctx.save(); ctx.translate(-400, y); ctx.scale(s, s); ctx.translate(400, -y);
    if (m.photo || m.money) {
      const bw = 560, bh = m.photo ? 430 : 300; box(-400, y, bw, bh, 30, '#fff'); ctx.font = `700 34px ${F}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = m.nc; ctx.fillText(m.name, -370, y + 34);
      if (m.photo) { ctx.save(); rrect(-380, y + 60, 520, 300, 18); ctx.clip(); ctx.translate(-380, y + 60); ctx.scale(.48, .48); if (typeof m.photo === 'function') m.photo(t); else { ctx.drawImage(SHOP, 0, 400, 1100, 640, 0, 0, 1100, 640); bHead(380, 360, 1, 'sad', false, t, {}); box(300, 440, 160, 200, 50, '#5fb07a'); kevin(700, 1240, .9, t, { clipper: true }); } ctx.restore(); ctx.font = `600 40px ${F}`; ctx.fillStyle = C.ink; ctx.fillText(m.text, -370, y + 395); }
      else { box(-380, y + 64, 520, 130, 20, '#16a34a'); ctx.fillStyle = '#fff'; ctx.font = `600 30px ${F}`; ctx.fillText('💸 Transferencia recibida', -350, y + 100); ctx.font = `700 64px ${F}`; ctx.fillText('$ 50.000', -350, y + 158); ctx.font = `600 38px ${F}`; ctx.fillStyle = C.ink; ctx.fillText(m.text, -370, y + 240); }
      ctx.restore(); y += bh + 22; continue;
    }
    ctx.font = `600 44px ${F}`; const lines = ['']; m.text.split(' ').forEach(w => { const c = lines[lines.length - 1]; if (ctx.measureText(c + ' ' + w).width > 600 && c) lines.push(w); else lines[lines.length - 1] = c ? c + ' ' + w : w; });
    const bw = Math.max(...lines.map(l => ctx.measureText(l).width), 220) + 60, bh = lines.length * 58 + 80;
    box(-400, y, bw, bh, 30, '#fff'); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = `700 34px ${F}`; ctx.fillStyle = m.nc; ctx.fillText(m.name, -370, y + 34); ctx.font = `600 44px ${F}`; ctx.fillStyle = C.ink; lines.forEach((l, i) => ctx.fillText(l, -370, y + 60 + 29 + i * 58));
    ctx.restore(); y += bh + 22;
  }
  ctx.restore(); ctx.restore();
}
const FAM3 = { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
  { at: .4, name: 'Primo Kevin', nc: '#e2584a', photo: true, text: 'en vivo desde la tienda 💈🤣' },
  { at: 2.0, name: 'Tía Gladys', nc: '#7e57c2', text: 'Ay Dios mío 😂😂' },
  { at: 3.1, name: 'Mamá', nc: '#e8618c', text: 'Que le quede bonito por lo menos 🙏' }] };
const GIFT = { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
  { at: .3, name: 'Tía Gladys', nc: '#7e57c2', text: 'Mijo, esa foto de pelado me partió el alma 😢' },
  { at: 1.5, name: 'Tía Gladys', nc: '#7e57c2', text: 'Ahí le mandé pa\'l torneo. Y NO vuelva a apostar 😤' },
  { at: 2.6, name: 'Tía Gladys', nc: '#7e57c2', money: true, text: 'Inscripción torneo CTA V ✅' }] };
function mirror(t, x, y) {
  ell(x, y, 230, 290, '#c9a24a'); ell(x, y, 205, 265, '#cfe8f5'); ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, 205, 265, 0, 0, 7); ctx.clip();
  ell(x, y + 40, 260, 300, '#bfe0f0'); bHead(x, y - 10, 1.25, 'happy', false, t, { bald: true }); box(x - 120, y + 110, 240, 200, 60, '#5fb07a');
  ctx.save(); ctx.globalAlpha = .4; poly([[x - 160, y - 240], [x - 90, y - 260], [x - 200, y + 120], [x - 220, y + 40]], '#fff'); ctx.restore(); ctx.restore();
  for (let i = 0; i < 4; i++) { const k = (t * .9 + i / 4) % 1; ctx.save(); ctx.globalAlpha = 1 - k; ctx.font = `700 ${50 + k * 20}px ${F}`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('✨', x - 180 + i * 120, y - 280 - k * 60); ctx.restore(); }
}

function crowdOverlay(t) { ctx.save(); ctx.globalAlpha = .9; const k = (t * 2) % 1; ctx.font = `700 ${90 + k * 20}px ${F}`; ctx.textAlign = 'center'; outlined('¡UUUUH!', 540, 1000 - k * 40, C.yellow, 14); ctx.restore(); }

/* ===================== DÍA 4: "Contra el reloj" ===================== */
WHO['MAMÁ'] = C.pink; WHO['NARRADOR'] = '#b8c4e0';
/* ---------- utilería ---------- */
function gamepad(x, y, s, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ell(-86, 44, 46, 50, '#2a2b3f'); ell(86, 44, 46, 50, '#2a2b3f'); box(-140, -64, 280, 128, 58, '#2a2b3f'); box(-120, -54, 240, 20, 10, 'rgba(255,255,255,.12)');
  box(-104, -14, 60, 18, 5, '#4a4c6a'); box(-83, -35, 18, 60, 5, '#4a4c6a');
  ell(74, -20, 13, 13, C.red); ell(100, 4, 13, 13, C.blue); ell(48, 4, 13, 13, C.green); ell(74, 28, 13, 13, C.yellow);
  ell(-34, 34, 18, 18, '#4a4c6a'); ell(34, 34, 18, 18, '#4a4c6a'); box(-18, -30, 36, 12, 6, '#ff5ca8'); ctx.restore(); }
function jeans(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot); box(-150, -120, 300, 90, 20, '#3a6ad1'); box(-150, -40, 140, 240, 22, '#3a6ad1'); box(10, -40, 140, 240, 22, '#3a6ad1'); box(-150, -120, 300, 26, 10, '#2c56b0'); line(0, -100, 0, -40, 4, '#ffd34d'); box(40, -96, 90, 60, 10, '#2c56b0'); ell(-90, 60, 30, 20, 'rgba(120,90,40,.35)'); ctx.restore(); }
function bigMsg(t, t0) {
  ctx.fillStyle = 'rgba(20,14,30,.66)'; ctx.fillRect(0, 0, W, H);
  const hk = eback(clamp((t - t0) / .3)); ctx.save(); ctx.translate(540, 560); ctx.scale(hk, hk); box(-360, -70, 720, 140, 70, '#e2584a'); ell(-280, 0, 50, 50, '#fff'); ctx.font = `60px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🧢', -280, 4); ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = `700 58px ${F}`; ctx.fillText('Primo Kevin', -210, -14); ctx.font = `500 34px ${F}`; ctx.fillText('en línea', -210, 34); ctx.restore();
  const k = eback(clamp((t - t0 - .3) / .3)); if (k <= 0) return;
  ctx.save(); ctx.translate(540, 980); ctx.scale(k, k); ctx.rotate(-.015);
  box(-450, -230, 920, 480, 56, 'rgba(0,0,0,.35)'); box(-460, -240, 920, 480, 56, '#fff'); poly([[-460, 120], [-520, 250], [-380, 220]], '#fff');
  ctx.textBaseline = 'middle'; ctx.font = `700 92px ${F}`; ctx.textAlign = 'center'; ctx.fillStyle = C.ink; ctx.fillText('¿Sí sabe que el', 0, -130);
  const a = 'torneo es ', b = 'HOY', wa = ctx.measureText(a).width, wb = ctx.measureText(b).width, x0 = -(wa + wb) / 2; ctx.textAlign = 'left'; ctx.fillText(a, x0, -20); ctx.fillStyle = C.red; ctx.fillText(b, x0 + wa, -20);
  ctx.textAlign = 'center'; ctx.fillStyle = C.ink; ctx.fillText('a las 4? 🤣', 0, 90); ctx.font = `500 36px ${F}`; ctx.fillStyle = '#8a8fa3'; ctx.textAlign = 'right'; ctx.fillText('1:00 p. m. ✓✓', 420, 196); ctx.restore();
}
function sparkle(x, y, r, col = '#fff') { poly([[x, y - r], [x + r * .25, y - r * .25], [x + r, y], [x + r * .25, y + r * .25], [x, y + r], [x - r * .25, y + r * .25], [x - r, y], [x - r * .25, y - r * .25]], col); }
function trashBag(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ell(0, 10, 70, 62, '#22232e'); ell(-20, -10, 22, 14, 'rgba(255,255,255,.18)', -.5); poly([[-14, -48], [14, -48], [26, -82], [0, -66], [-26, -82]], '#22232e'); box(-16, -54, 32, 12, 5, C.yellow); ctx.restore(); }
function broom(x1, y1, x2, y2) { line(x1, y1, x2, y2, 14, '#b5764a'); const a = Math.atan2(y2 - y1, x2 - x1); ctx.save(); ctx.translate(x2, y2); ctx.rotate(a - Math.PI / 2); box(-34, -6, 68, 22, 6, C.red); poly([[-40, 14], [40, 14], [60, 96], [-60, 96]], '#e8c26a'); ctx.strokeStyle = '#c9a24a'; for (let i = 0; i < 7; i++) line(-36 + i * 12, 20, -52 + i * 17, 92, 3); ctx.restore(); }
function mug(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(34, 0, 18, -1.4, 1.4); ctx.stroke(); box(-34, -34, 68, 72, 12, '#fff'); box(-34, -34, 68, 14, 6, '#6b3a1e'); box(-20, -6, 40, 22, 6, '#ffd23f'); ctx.restore(); }
function sockHat(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-.35); box(-70, -20, 120, 40, 18, '#f4f1ea'); box(30, -20, 26, 40, 8, '#e8524a'); ell(-70, 14, 32, 26, '#f4f1ea'); ell(-30, 0, 9, 6, 'rgba(140,110,40,.35)'); ctx.restore();
  ctx.strokeStyle = '#8fd45a'; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (let i = 0; i < 2; i++) { const k = ((performance.now ? 0 : 0) + i * .5) % 1; } }
function liveSock(x, y, s, t) { const st = Math.sin(t * 20);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); sh(0, 54, 70);
  line(-16, 10, -16 - st * 18, 50, 9, C.ink); line(16, 10, 16 + st * 18, 50, 9, C.ink); ell(-22 - st * 18, 54, 16, 8, C.ink); ell(22 + st * 18, 54, 16, 8, C.ink);
  ctx.rotate(Math.sin(t * 10) * .1);
  box(-42, -170, 84, 190, 34, '#f4f1ea'); ell(-30, 6, 60, 34, '#f4f1ea'); box(-42, -170, 84, 26, 12, '#e8524a'); box(-42, -134, 84, 12, 5, '#3a6ad1');
  ell(12, -40, 16, 10, 'rgba(140,110,40,.35)'); ell(-20, -100, 12, 8, 'rgba(140,110,40,.3)'); ell(-48, 10, 14, 10, 'rgba(140,110,40,.4)');
  ell(-16, -80, 15, 18, '#fff'); ell(18, -80, 15, 18, '#fff'); ell(-12, -77, 7, 8, C.ink); ell(22, -77, 7, 8, C.ink); line(-30, -104, -6, -98, 5, C.ink); line(32, -104, 8, -98, 5, C.ink);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(2, -46, 14, .25, Math.PI - .25); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = '#8fd45a'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const k = (t * .9 + i / 3) % 1, bx = x - 30 * s + i * 30 * s, by = y - 190 * s - k * 120; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 16, by - 24, bx, by - 48); ctx.quadraticCurveTo(bx - 16, by - 72, bx, by - 96); ctx.stroke(); }
  ctx.globalAlpha = 1;
}
function phoneBuzz(x, y, t) { const j = Math.sin(t * 80) * 6; ctx.save(); ctx.translate(x + j, y); ctx.rotate(.2); box(-34, -60, 68, 120, 12, '#1c1c24'); box(-27, -50, 54, 96, 6, '#9fd6ff'); ctx.restore(); ctx.strokeStyle = C.ink; ctx.lineWidth = 6; for (const d of [-1, 1]) { ctx.beginPath(); ctx.arc(x, y, 80, d > 0 ? -.5 : Math.PI - .5, d > 0 ? .5 : Math.PI + .5); ctx.stroke(); } }
function towel(x, fy, s) { ctx.save(); ctx.translate(x, fy); ctx.scale(s, s); ctx.strokeStyle = '#3fb8c9'; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-80, -300); ctx.quadraticCurveTo(-70, -480, 0, -470); ctx.quadraticCurveTo(70, -480, 80, -300); ctx.stroke(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-80, -320); ctx.lineTo(-80, -300); ctx.moveTo(80, -320); ctx.lineTo(80, -300); ctx.stroke(); ctx.restore(); }
/* ---------- cuarto limpio ---------- */
function roomCleanLive(t, o) {
  ctx.drawImage(ROOM_CLEAN, -OX, 0);
  ctx.save(); rrect(966, 802, 218, 144, 8); ctx.clip(); ctx.translate(1075, 874); ctaArt(218, 144); ctx.restore();
  if (o.door > 0) { box(620, 520, 260, 736, 10, '#fff1c9'); box(620, 520, 260, 60, 10, '#ffe1a0'); }
  // cama tendida
  box(-40, 1052, 550, 140, 30, '#5aa9ff'); box(-40, 1052, 550, 34, 16, '#7fc0ff'); for (let i = 0; i < 5; i++) box(10 + i * 100, 1110, 50, 50, 10, 'rgba(255,255,255,.25)');
  // luz del sol
  ctx.save(); ctx.globalAlpha = .18 + .04 * Math.sin(t * 2); poly([[74, 316], [376, 316], [980, 1920], [180, 1920]], '#fff3b0'); ctx.restore();
  for (let i = 0; i < 12; i++) { const k = (t * .05 + i * .083) % 1; ell(200 + i * 46 + Math.sin(t + i) * 20, 500 + k * 1200, 3, 3, 'rgba(255,250,220,.7)'); }
}
function roomCleanFront(t, o) { if (o.door > 0) { const dw = 260 * (1 - o.door * .86); box(620, 520, dw, 736, 10, '#b5764a'); box(620, 520, Math.min(14, dw), 736, 6, '#8f5a36'); } }
function bagsRow() { for (let i = 0; i < 4; i++) trashBag(930 + (i % 2) * 70, 1380 + i * 40, .9, (i - 1.5) * .15); }
function pizzaTower(x, by, n) { for (let i = 0; i < n; i++) pizzaBox(x + Math.sin(i * 1.7) * 10, by - i * 30, Math.sin(i * 2.3) * .05); }
/* ---------- baño ---------- */
function bathroom(t) {
  ctx.fillStyle = '#cfeef2'; ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 120) for (let x = (y / 120) % 2 * 60 - 60; x < W; x += 120) { box(x + 4, y + 4, 112, 112, 10, '#bfe5ea'); box(x + 14, y + 14, 40, 10, 5, 'rgba(255,255,255,.5)'); }
  // regadera
  box(760, 320, 24, 160, 8, '#9aa3b8'); box(700, 460, 150, 40, 18, '#c9cfdd'); ell(775, 500, 70, 20, '#9aa3b8');
  ctx.strokeStyle = 'rgba(80,170,230,.55)'; ctx.lineWidth = 6; for (let i = 0; i < 9; i++) { const k = (t * 3 + i / 9) % 1; line(720 + i * 14, 520 + k * 400, 714 + i * 15, 560 + k * 400, 6); }
  // cabeza con espuma
  const hx = 600, hy = 640 + Math.sin(t * 6) * 8;
  bHead(hx, hy, 1.15, 'happy', false, t, { bald: true });
  for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * .11); ell(hx + Math.cos(a) * 92, hy - 40 + Math.sin(a) * 70, 28 + (i % 3) * 6, 24 + (i % 2) * 6, '#fff'); }
  ell(hx - 20, hy - 120, 40, 28, '#fff'); ell(hx + 30, hy - 132, 30, 24, '#fff');
  // cortina
  line(80, 760, 1000, 760, 14, '#9aa3b8');
  ctx.beginPath(); ctx.moveTo(110, 770); for (let x = 110; x <= 990; x += 55) ctx.quadraticCurveTo(x + 27, 790, x + 55, 770); ctx.lineTo(990, 1700); for (let x = 990; x >= 110; x -= 55) ctx.quadraticCurveTo(x - 27, 1720 + Math.sin(t * 4 + x) * 8, x - 55, 1700); ctx.closePath(); ctx.fillStyle = '#ff8fc8'; ctx.fill();
  for (let x = 140; x < 980; x += 55) { ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(x, 790, 10, 900); }
  for (let i = 0; i < 26; i++) ell(170 + (i % 6) * 140 + (Math.floor(i / 6) % 2) * 70, 860 + Math.floor(i / 6) * 190, 22, 22, '#fff');
  for (let x = 110; x <= 990; x += 55) ell(x, 760, 12, 12, '#c9cfdd');
  // vapor y notas
  for (let i = 0; i < 6; i++) { const k = (t * .35 + i / 6) % 1; ctx.save(); ctx.globalAlpha = .55 * (1 - k); ell(200 + i * 140, 700 - k * 500, 90 + k * 60, 50 + k * 30, '#fff'); ctx.restore(); }
  ctx.save(); ctx.font = `700 70px ${F}`; ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const k = (t * .8 + i / 3) % 1; ctx.globalAlpha = 1 - k; outlined('♪', 380 - i * 40 + Math.sin(k * 6) * 20, 560 - k * 260, C.yellow, 8); } ctx.restore();
}
/* ---------- barrio ---------- */
const BARRIO = layer(() => {
  const r = mulberry(5);
  let g = ctx.createLinearGradient(0, 0, 0, 1100); g.addColorStop(0, '#7fcaf5'); g.addColorStop(1, '#ffe2b0'); ctx.fillStyle = g; ctx.fillRect(-OX, 0, 1500, 1500);
  ell(150, 300, 70, 70, '#fff6c9');
  poly([[-OX, 900], [80, 620], [300, 820], [520, 560], [760, 800], [980, 600], [1290, 860], [1290, 1000], [-OX, 1000]], '#6fb07a');
  poly([[-OX, 960], [200, 760], [420, 920], [700, 740], [1000, 920], [1290, 800], [1290, 1000], [-OX, 1000]], '#5a9e68');
  const cols = ['#ffd34d', '#f27a6b', '#5ad1a0', '#b79bff', '#ff9ab8', '#7fc0ff'];
  let x = -OX;
  for (let i = 0; x < 1290; i++) {
    const w = 230 + r() * 80, h = 420 + r() * 220, top = 1460 - h, c = cols[i % cols.length];
    box(x, top, w, h, 4, c); box(x - 10, top - 26, w + 20, 34, 6, '#c96a3c'); for (let k = 0; k < w; k += 28) box(x + k - 6, top - 26, 22, 34, 6, k % 56 ? '#b85b30' : '#d9784a');
    // ventana con reja
    box(x + 30, top + 60, 90, 110, 6, '#3f4763'); ctx.strokeStyle = C.ink; ctx.lineWidth = 5; for (let k = 0; k < 4; k++) line(x + 44 + k * 20, top + 60, x + 44 + k * 20, top + 170, 5); line(x + 30, top + 115, x + 120, top + 115, 5);
    // puerta
    box(x + w - 110, 1460 - 210, 80, 210, 6, i % 2 ? '#7a4c33' : '#3a6ad1'); ell(x + w - 46, 1460 - 100, 7, 7, C.yellow);
    if (h > 520) { box(x + 30, top + 210, w - 60, 20, 4, '#fff'); for (let k = 0; k < 4; k++) ell(x + 50 + k * 40, top + 196, 18, 14, '#3aa06a'); }
    if (i === 2) { box(x + 20, top + 250, 150, 50, 8, '#e8524a'); ctx.fillStyle = '#fff'; ctx.font = `700 34px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TIENDA', x + 95, top + 276); }
    x += w + 10;
  }
  // postes y cables
  for (let px = 100; px < 1290; px += 520) { box(px, 560, 22, 900, 6, '#8b7a6a'); box(px - 50, 600, 122, 14, 4, '#8b7a6a'); }
  ctx.strokeStyle = 'rgba(40,30,30,.6)'; ctx.lineWidth = 3; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.moveTo(-OX, 610 + k * 14); ctx.quadraticCurveTo(360, 680 + k * 14, 620, 610 + k * 14); ctx.quadraticCurveTo(880, 680 + k * 14, 1290, 610 + k * 14); ctx.stroke(); }
  // andén y calle
  ctx.fillStyle = '#c9cfdd'; ctx.fillRect(-OX, 1460, 1500, 120); ctx.fillStyle = '#b5bccd'; for (let k = -OX; k < 1290; k += 120) ctx.fillRect(k, 1460, 5, 120); ctx.fillStyle = '#9aa3b8'; ctx.fillRect(-OX, 1572, 1500, 16);
  ctx.fillStyle = '#5b6274'; ctx.fillRect(-OX, 1588, 1500, 340); ctx.fillStyle = '#ffd34d'; for (let k = -OX; k < 1290; k += 220) ctx.fillRect(k, 1760, 120, 16);
  for (let i = 0; i < 200; i++) ell(-OX + r() * 1500, 1600 + r() * 320, 2, 2, 'rgba(255,255,255,.12)');
});
function brayanRun(x, fy, s, t) {
  const p = t * 15, up = Math.abs(Math.sin(p)) * 16, G = '#5fb07a', Gs = '#4f9e6a';
  ctx.save(); ctx.translate(x, fy); ctx.scale(s, s); ell(0, 8, 120, 18, 'rgba(0,0,0,.22)'); ctx.translate(0, -up);
  const leg = (hx, ph) => { ctx.save(); ctx.translate(hx, -175); ctx.rotate(Math.sin(p + ph) * .7); box(-22, 0, 44, 165, 20, SKB); box(-30, 148, 80, 36, 14, '#fff'); box(-30, 172, 80, 10, 4, '#ff6b5a'); ctx.restore(); };
  leg(-30, 0); leg(30, Math.PI);
  box(-72, -262, 144, 110, 34, '#3d4c70');
  ctx.rotate(.08);
  const arm = (sx, ph, pad) => { ctx.save(); ctx.translate(sx, -455); ctx.rotate(Math.sin(p + ph) * .9); box(-25, 0, 50, 200, 25, Gs); ell(0, 206, 27, 27, SKB); if (pad) gamepad(0, 236, .42, .4); ctx.restore(); };
  arm(-112, 0, false);
  box(-100, -490, 200, 280, 74, G); box(-52, -318, 104, 58, 22, Gs);
  box(-16, -500, 32, 40, 5, '#fff'); line(-9, -488, 9, -488, 3, '#9aa3b8'); line(-9, -476, 9, -476, 3, '#9aa3b8');
  arm(112, Math.PI, true);
  box(-22, -514, 44, 40, 14, SKBs);
  bHead(0, -590, 1, 'determined', false, t, { bald: true, sweat: t });
  ctx.restore();
}
/* ---------- torneo ---------- */
function banner(t) {
  ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-OX, 640); ctx.quadraticCurveTo(540, 700, 1290, 640); ctx.stroke();
  for (let i = 0; i < 16; i++) { const x = -150 + i * 95, y = 650 + Math.sin((x + 150) / 1440 * Math.PI) * 44; poly([[x - 32, y], [x + 32, y], [x, y + 70 + Math.sin(t * 4 + i) * 4]], [C.yellow, C.blue, C.red, C.green][i % 4]); }
  ctx.save(); ctx.translate(540, 700); ctx.rotate(Math.sin(t * 2) * .01); box(-330, -60, 660, 130, 16, '#5a3a9a'); box(-316, -48, 632, 106, 10, '#7e57c2');
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 64px ${F}`; ctx.fillText('TORNEO CTA V – BARRIO', 0, 6); ctx.restore();
}
function kevinSign(x, y, t) {
  line(x + 110, y + 90, x + 110, y + 700, 12, '#8c5a3c');
  ctx.save(); ctx.translate(x, y); ctx.rotate(.04 + Math.sin(t * 3) * .03);
  box(-196, -94, 392, 188, 16, C.coffee); box(-186, -84, 372, 168, 12, '#fff'); box(-186, -84, 372, 18, 8, C.red);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 64px ${F}`; ctx.fillText('BUSCO DUPLA', 0, -18);
  ctx.font = `600 38px ${F}`; ctx.fillStyle = '#c93a3c'; ctx.fillText('🏆 3 veces campeón', 0, 48); ctx.restore();
}
function micro(x, y) { line(x, y, x + 34, y + 70, 12, '#2a2b3f'); ell(x - 4, y - 8, 22, 22, '#555a70'); ell(x - 10, y - 14, 7, 7, 'rgba(255,255,255,.5)'); }
function circleCam(cx, cy, r, col, draw, glow) {
  if (glow > 0) { ctx.save(); ctx.globalAlpha = glow; ell(cx, cy, r + 30, r + 30, col); ctx.restore(); }
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = '#fff3c4'; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = C.coffee; ctx.stroke(); ctx.clip(); ctx.translate(cx, cy); draw(); ctx.restore();
}
/* ---------- reloj ---------- */
function clockMin(t) { const K = EP.clockKeys; if (t < K[0][0] || t > S.arrive + 1.4) return null;
  for (let i = K.length - 1; i >= 0; i--) if (t >= K[i][0]) { if (i === K.length - 1) return K[i][1]; const [a, va] = K[i], [b, vb] = K[i + 1]; return va + (vb - va) * clamp((t - a) / (b - a)); } return 0; }
function clockW(t) {
  const m = clockMin(t); if (m === null) return;
  const mm = Math.floor(m), txt = `${1 + Math.floor(mm / 60)}:${String(mm % 60).padStart(2, '0')} PM`, urgent = mm >= 160, bl = urgent && Math.sin(t * 12) > 0;
  const k = eback(clamp((t - EP.clockKeys[0][0]) / .35)), out = clamp((t - S.arrive - 1.1) / .3);
  ctx.save(); ctx.translate(905, 290); ctx.scale(k * (1 - out), k * (1 - out)); ctx.rotate(.03);
  box(-128, -58, 256, 120, 22, 'rgba(0,0,0,.35)'); box(-134, -64, 256, 120, 22, bl ? C.red : '#1d1626'); ctx.lineWidth = 6; ctx.strokeStyle = C.coffee; rrect(-134, -64, 256, 120, 22); ctx.stroke();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 28px ${F}`; ctx.fillStyle = bl ? '#fff' : C.yellow; ctx.fillText('⏰ SÁBADO', -6, -34);
  ctx.font = `700 60px ${F}`; ctx.fillStyle = bl ? '#fff' : (urgent ? '#ff8080' : C.cream); ctx.fillText(txt, -6, 16); ctx.restore();
}
/* ---------- chats ---------- */
const KCHAT = { color: '#e2584a', icon: '🧢', title: 'Primo Kevin', sub: 'en línea', msgs: [
  { at: .35, text: '¿Sí sabe que el torneo es HOY a las 4? 🤣' },
  { at: .85, text: '🤣🤣', big: true }] };
const momPhoto = t => { ctx.drawImage(ROOM_CLEAN, 150, 980, 1100, 640, 0, 0, 1100, 640); bagsRowPhoto(); brayan(520, 780, .82, t, { bald: true, arm: 'point', ex: 'determined' }); broom(520 + 248, 780 - 309, 520 + 380, 780 - 40);
  ctx.save(); ctx.globalAlpha = .9; ctx.font = `700 60px ${F}`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('🙏', 980, 90); ctx.restore(); };
function bagsRowPhoto() { for (let i = 0; i < 3; i++) trashBag(140 + i * 90, 520, .9, (i - 1) * .2); }
const FAM4 = { color: '#3fa39a', icon: '👪', title: 'Familia 💕', sub: 'Mamá, Tía Gladys, Kevin, tú', msgs: [
  { at: .4, name: 'Mamá', nc: '#e8618c', photo: momPhoto, text: 'MILAGRO 🙏 está limpiando' },
  { at: 1.6, name: 'Tía Gladys', nc: '#7e57c2', text: '¿Está enfermo? 🤒' },
  { at: 2.6, name: 'Primo Kevin', nc: '#e2584a', text: 'eso es por la muchacha 👀 ya lo subí a historias 🔥' },
  { at: 3.6, name: 'Mamá', nc: '#e8618c', text: '¿¿QUÉ MUCHACHA??' }] };

function render(t) {
  ctx = MAIN; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const tb = talks(t, 'BRAYAN'), shakeOf = (k, a, d = .35) => { const x = t - k; return x >= 0 && x < d ? a * (1 - x / d) : 0; };
  let label = null;
  if (t < S.kchat) {
    // --- gancho: la avalancha ---
    const s = shakeOf(S.aval, 30, .5) + (t < S.aval && t > 1 ? Math.sin(t * 50) * 4 : 0);
    const cam = t < S.crawl ? { x: 650, y: 1120, z: 1.3 } : { x: 470, y: 1430, z: 1.9 };
    ctx.save(); camOn(cam, Math.sin(t * 90) * s, Math.cos(t * 70) * s);
    roomLive(t, { door: t < S.aval && t > 1 ? .06 + Math.abs(Math.sin(t * 9)) * .05 : 0 }); roomFront(t, { door: 0 }); box(190, 1066, 320, 190, 30, '#ff8c66');
    junk(t);
    if (t < S.aval) brayan(520 + (t > 1 ? Math.sin(t * 18) * 6 : 0), 1600, .9, t, { ex: 'determined', arm: 'point', bald: true, talk: tb });
    else { const pk = clamp((t - S.aval - .5) / .4); if (pk > 0) { const hy = 1560 - pk * 60; bHead(430, hy, .9, t < S.crawl ? 'shock' : 'sad', tb, t, { sweat: t, bald: true }); sockHat(440, hy - 78, .9); } ell(300, 1500, 60, 30, C.blue); ell(560, 1490, 50, 26, C.pink); }
    if (t > S.kchat - .8) phoneBuzz(600, 1540, t);
    ctx.restore();
    if (t >= S.aval && t < S.aval + .7) { const d = t - S.aval; ctx.save(); ctx.globalAlpha = 1 - d / .7; ctx.translate(540, 640); ctx.rotate(-.06); const sc = lerp(.5, 1.15, eout(clamp(d / .2))); ctx.scale(sc, sc); ctx.font = `700 190px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('¡CRASH!', 0, 0, C.yellow, 24); ctx.restore(); }
    if (t < S.aval) { const k = eback(clamp(t / .3)); ctx.save(); ctx.translate(540, 290); ctx.scale(k, k); ctx.rotate(-.03); ctx.font = `700 120px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; outlined('DÍA 4 SIN REDES', 0, 0, C.orange, 22); ctx.restore(); }
    else if (t > S.crawl) label = ['USTEDES VOTARON: EL CUARTO', S.crawl + .1];
  } else if (t < S.pizza) {
    // --- el chat de Kevin y el reloj ---
    const cut = S.kcut;
    if (t < cut) { ctx.save(); camOn({ x: 540, y: 960, z: 1 }); roomLive(t, { door: 0 }); roomFront(t, { door: 0 }); junk(t); ctx.restore(); bigMsg(t, S.kchat); }
    else { rays(540, 1150, '#ff6b5a', '#ff5545', t); bHead(540, 1120, 2.6, 'shock', tb, t, { sweat: t, bald: true }); label = ['¿CUARTO Y TORNEO?', cut + .15]; }
  } else if (t < S.sock) {
    // --- 40 cajas de pizza ---
    ctx.save(); camOn({ x: 540, y: 1010, z: 1.05 }); roomLive(t, { door: 0 }); roomFront(t, { door: 0 }); junk(t);
    const k = clamp((t - S.pizza - .1) / 1.4), n = Math.max(1, Math.round(lerp(1, 40, eio(k))));
    pizzaTower(880, 1820, Math.min(n, 18));
    brayan(380, 1860, .85, t, { bald: true, arm: 'up', ex: 'determined', talk: tb, bob: true });
    for (let i = 0; i < 9; i++) { const d = (t - S.pizza) - i * .4; if (d < 0 || d > .9) continue; const q = d / .9; trashBag(lerp(573, -160, q), 1322 - Math.sin(q * Math.PI) * 360, .8, q * 6); }
    ctx.restore();
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const pk = 1 + .15 * Math.max(0, Math.sin((t - S.pizza) * 30)) * (k < 1 ? 1 : 0); ctx.translate(800, 720); ctx.scale(pk, pk); ctx.font = `700 190px ${F}`; outlined(String(n), 0, 0, k < 1 ? C.cream : C.yellow, 22); ctx.font = `700 54px ${F}`; outlined('CAJAS', 0, 120, C.cream, 12); ctx.restore();
    if (k >= 1) label = ['40 CAJAS 🍕', S.pizza + 1.5];
  } else if (t < S.ctrl) {
    // --- la media viva ---
    ctx.save(); camOn({ x: 540, y: 1010, z: 1.05 }); roomLive(t, { door: 0 }); roomFront(t, { door: 0 }); junk(t);
    const k = clamp((t - S.sock) / 3.6), sx = lerp(380, 1020, k), bx = lerp(-140, 560, k);
    liveSock(sx, 1700, 1.4, t);
    brayan(bx, 1900, .85, t, { bald: true, arm: 'point', ex: 'angry', talk: tb, bob: true }); broom(bx + 302 * .85, 1900 - 377 * .85, bx + 470, 1900 - 120);
    ctx.restore();
    if (t > S.sock + .5) { stamp('PELIGRO BIOLÓGICO', 560, 720, '#3a9a3a', -.07, t - S.sock - .5); if (t > S.sock + .9) { ctx.save(); ctx.font = `90px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('☣️', 560, 860); ctx.restore(); } }
  } else if (t < S.mom) {
    // --- el control perdido ---
    if (t < S.ctrl + 1.1) {
      ctx.fillStyle = '#16121f'; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(540, 1150, 20, 540, 1150, 700); g.addColorStop(0, 'rgba(255,230,140,.75)'); g.addColorStop(1, 'rgba(255,230,140,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      box(-20, 0, 1120, 560, 0, '#4a2e22'); for (let i = 0; i < 7; i++) box(-20 + i * 170, 420, 120, 160, 10, '#5c3a2a');
      for (const [x, y] of [[180, 1500], [880, 1420], [300, 900], [820, 860]]) { ell(x, y, 46, 30, 'rgba(200,190,180,.35)'); ell(x + 20, y - 10, 30, 22, 'rgba(200,190,180,.3)'); }
      gamepad(540, 1150 - Math.sin(t * 3) * 14, 1.6, -.08);
      for (let i = 0; i < 6; i++) { const a = t * 1.5 + i * 1.05; sparkle(540 + Math.cos(a) * 300, 1150 + Math.sin(a) * 170, 24 + 10 * Math.sin(t * 6 + i), '#fff6c9'); }
    } else {
      rays(540, 1000, '#ffd34d', '#ffc21f', t);
      const s = 1.05, x = 540, fy = 1960; brayan(x, fy, s, t, { bald: true, arm: 'up', ex: 'happy', talk: tb });
      const hx = x + 227 * s, hy = fy - 621 * s; ell(hx, hy, 170, 120, 'rgba(255,255,255,.35)'); gamepad(hx, hy - 40, .85, -.2);
      for (let i = 0; i < 5; i++) { const kk = (t * .8 + i / 5) % 1; sparkle(hx - 200 + i * 100, hy - 120 - kk * 240, 20 * (1 - kk) + 6, '#fff'); }
      ctx.save(); ctx.font = `700 80px ${F}`; ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const kk = (t * .7 + i / 3) % 1; ctx.globalAlpha = 1 - kk; outlined('♪', 200 + i * 60, 900 - kk * 300, '#fff', 8); } ctx.restore();
      label = ['CONTROL ENCONTRADO 🎮', S.ctrl + 1.2];
    }
  } else if (t < S.fam) {
    // --- la mamá y la puerta que abre ---
    const od = clamp((t - S.mom - .2) / .35) * .9;
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); roomCleanLive(t, { door: od }); bagsRow();
    if (od > .3) mom(750, 1262, .76, t, { talk: talks(t, 'MAMÁ'), ex: 'shock' });
    roomCleanFront(t, { door: od });
    const cd = t - S.mom - .75; if (cd > 0) { const k = clamp(cd / .35); if (k < 1) mug(700, lerp(980, 1250, k * k), 1, k * 4); else { ell(700, 1272, lerp(40, 110, clamp((cd - .35) / .3)), 22, '#6b3a1e'); for (let i = 0; i < 4; i++) { const a = -2.6 + i * .6, q = clamp((cd - .35) / .4); box(700 + Math.cos(a) * 90 * q - 10, 1262 + Math.sin(a) * 60 * q, 26, 18, 4, '#fff'); } } }
    brayan(250, 1900, .85, t, { bald: true, arm: 'point', ex: t > S.mom + 1 ? 'happy' : 'neutral' }); broom(250 + 302 * .85, 1900 - 377 * .85, 250 + 400, 1900 - 80);
    ctx.restore();
    label = ['LA PUERTA ABRIÓ 😱', S.mom + .3];
  } else if (t < S.jean) {
    // --- el chat familiar ---
    const d = t - (S.fam + 4.1);
    if (d < 0) { ctx.save(); camOn({ x: 540, y: 960, z: 1 }); roomCleanLive(t, { door: 0 }); ctx.restore(); chatPhotoUI(t, S.fam, FAM4); }
    else { rays(540, 1100, '#8a6fd8', '#7a5fcb', t); label = ['NO PUEDO VER 😩', S.fam + 4.2]; const k = 1; ctx.save(); ctx.translate(540, 1100); ctx.scale(1.9, 1.9); bHead(0, 0, 1.25, 'shock', tb, t, { bald: true, sweat: t }); ctx.scale(1.25, 1.25); ell(-34, -2, 40, 30, '#e3ad8a'); ell(34, -2, 40, 30, '#e3ad8a'); ctx.strokeStyle = 'rgba(150,90,70,.6)'; for (let i = 0; i < 3; i++) { line(-64 + i * 16, -20, -60 + i * 16, 16, 3); line(64 - i * 16, -20, 60 - i * 16, 16, 3); } ctx.restore(); }
  } else if (t < S.shower) {
    // --- la plata en el jean ---
    if (t < S.sniff) {
      // levanta el colchón
      const d = t - S.jean, k = eout(clamp((d - .1) / .35));
      ctx.save(); camOn({ x: 360, y: 1180, z: 1.35 }); roomCleanLive(t, { door: 0 });
      box(-40, 1040, 560, 170, 20, '#2a2233'); for (let i = 0; i < 5; i++) box(-20 + i * 110, 1180, 70, 22, 6, '#5c3a2a');
      jeans(250, 1150, .42, .5);
      ctx.save(); ctx.translate(-40, 1200); ctx.rotate(-.5 * k); box(0, -160, 570, 150, 34, '#5aa9ff'); box(0, -160, 570, 36, 16, '#7fc0ff'); box(0, -40, 570, 30, 12, '#3f86d6'); ctx.restore();
      for (let i = 0; i < 6; i++) { const q = clamp((d - .2 - i * .05) / .9); if (q > 0 && q < 1) { ctx.save(); ctx.globalAlpha = .6 * (1 - q); ell(60 + i * 80, 1130 - q * 120, 40 + q * 50, 28 + q * 30, '#e8dccb'); ctx.restore(); } }
      const cq = clamp((d - .45) / 1.3); if (cq > 0 && cq < 1) { const cx = lerp(300, 820, cq), cy = 1290 + Math.sin(cq * 30) * 10; ctx.strokeStyle = '#3a2418'; for (let i = -1; i <= 1; i++) { line(cx + i * 14, cy, cx + i * 14 - 8, cy - 22 + Math.sin(t * 60 + i) * 6, 4); line(cx + i * 14, cy, cx + i * 14 - 8, cy + 22 - Math.sin(t * 60 + i) * 6, 4); } ell(cx, cy, 34, 16, '#6b3a1e'); ell(cx + 26, cy, 12, 10, '#4a2814'); line(cx + 34, cy - 4, cx + 60, cy - 16, 3); line(cx + 34, cy + 4, cx + 60, cy + 16, 3); }
      brayan(610, 1700, .75, t, { bald: true, arm: 'up', ex: d > .5 ? 'shock' : 'determined' });
      ctx.restore();
      if (d > .6) stamp('¡UNA CUCARACHA!', 600, 1560, '#8a5a2a', .05, d - .6);
    } else {
      const ds = t - S.sniff, sn = t < S.pocket, up = sn ? Math.sin(clamp(ds / 1.0) * Math.PI) : 0, gross = sn && ds > .7;
      if (t < S.bill) rays(540, 820, gross ? '#7a9a3a' : '#3f8f5a', gross ? '#6c8c30' : '#378452', t); else rays(540, 820, '#5ad17a', '#4cc56c', t);
      brayan(540, 1990, 1.1, t, { bald: true, ex: t >= S.bill ? 'happy' : gross ? 'shock' : 'determined', talk: tb, bob: true });
      const jy = 1720 - up * 250;
      jeans(540, jy, .8, -.06);
      if (sn && ds > .25) { ctx.strokeStyle = '#8fd45a'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const q = (t * 1.2 + i / 4) % 1, bx = 330 + i * 140, by = 1250 - q * 260; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + 24, by - 36, bx, by - 72); ctx.quadraticCurveTo(bx - 24, by - 108, bx, by - 144); ctx.stroke(); } ctx.globalAlpha = 1; }
      if (gross) stamp('¡GUÁCALA! 🤢', 540, 820, '#5a8a2a', -.06, ds - .7);
      if (!sn && t < S.bill) { const w = Math.sin(t * 22) * 10; line(690, 1560, 600 + w, 1668, 46, '#4f9e6a'); ell(596 + w, 1672, 30, 30, SKB);
        ctx.save(); ctx.font = `700 130px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; for (let i = 0; i < 3; i++) { const q = eback(clamp((t - S.pocket - i * .3) / .3)); if (q > 0) { ctx.save(); ctx.translate(250 + i * 290, 760 + (i % 2) * 90); ctx.scale(q, q); ctx.rotate((i - 1) * .2); outlined('?', 0, 0, C.yellow, 20); ctx.restore(); } } ctx.restore(); }
    }
    const bd = t - S.bill; if (bd > 0) { const k = eout(clamp(bd / .5)), by = lerp(1440, 700, k) + Math.sin(t * 4) * 10; ctx.save(); ctx.translate(600, by); ctx.rotate(Math.sin(t * 3) * .1); ell(0, 0, 260, 160, 'rgba(255,255,220,.45)'); box(-180, -86, 360, 172, 14, '#c95ab0'); box(-164, -70, 328, 140, 10, '#e07ac8'); ell(-100, 0, 46, 50, '#c95ab0'); ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 70px ${F}`; ctx.fillText('$20.000', 50, 4); ctx.restore(); for (let i = 0; i < 6; i++) { const a = t * 2 + i; sparkle(600 + Math.cos(a) * 280, by + Math.sin(a) * 150, 22, '#fff'); } }
  } else if (t < S.clean) {
    bathroom(t);
  } else if (t < S.run) {
    // --- cuarto limpio ---
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); roomCleanLive(t, { door: 0 }); roomCleanFront(t, { door: 0 });
    brayan(560, 1880, .9, t, { bald: true, ex: 'happy', talk: tb, bob: true }); towel(560, 1880 + Math.sin(t * 2.4) * 3, .9);
    for (let i = 0; i < 10; i++) { const kk = (t * .6 + i / 10) % 1, r = mulberry(i + 3); sparkle(80 + r() * 920, 400 + r() * 1300, 26 * Math.sin(kk * Math.PI), '#fff'); }
    ctx.restore();
    label = ['CUARTO LIMPIO ✨', S.clean + .15];
    const cb7 = EP.cues.find(c => c.k === 'b7'), ac = t - (cb7.t + cb7.d * .45);
    if (ac > 0) { const k = eback(clamp(ac / .3)); ctx.save(); ctx.translate(250, 1560); ctx.scale(k, k); ctx.rotate(-.06); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 60px ${F}`; outlined('EL PISO', 0, 0, C.yellow, 12); ctx.font = `700 40px ${F}`; outlined('(es café)', 0, 56, C.cream, 10); ctx.restore(); if (k > .9) { line(250, 1640, 230, 1760, 10, C.coffee); poly([[205, 1745], [255, 1745], [228, 1800]], C.coffee); } }
  } else if (t < S.arrive) {
    // --- la carrera ---
    const off = ((t - S.run) * 1600) % 1500; for (let k = -1; k <= 1; k++) ctx.drawImage(BARRIO, -OX - off + k * 1500, 0);
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const r = mulberry(i * 7 + Math.floor(t * 10)); const y = 1000 + r() * 800, x = 100 + r() * 300; line(x, y, x + 160 + r() * 120, y, 6); }
    brayanRun(560, 1770, 1.0, t);
    for (let i = 0; i < 4; i++) { const kk = (t * 3 + i / 4) % 1; ctx.save(); ctx.globalAlpha = .5 * (1 - kk); ell(470 - kk * 260, 1760 - kk * 30, 30 + kk * 40, 18 + kk * 20, '#e8dccb'); ctx.restore(); }
    ctx.save(); ctx.translate(850, 880); ctx.rotate(.05); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 46px ${F}`; outlined('camiseta', 0, 0, C.cream, 10); outlined('al revés', 0, 50, C.cream, 10); ctx.restore(); line(800, 940, 600, 1240, 8, C.cream); poly([[585, 1215], [625, 1235], [592, 1262]], C.cream);
    label = ['¡CORRE, BRAYAN!', S.run + .1];
  } else if (t < S.end) {
    // --- llegada al torneo ---
    ctx.save(); camOn({ x: 540, y: 1000, z: 1 }); ctx.drawImage(SHOP, -OX, 0); box(440, 280, 480, 290, 10, '#3a2a6a'); ctx.save(); rrect(440, 280, 480, 290, 10); ctx.clip(); ctx.translate(680, 425); ctaArt(480, 290); ctx.restore();
    banner(t);
    const pepeT = talks(t, 'DON PEPE'); donPepe(160, 1330, .85, t, { talk: pepeT }); micro(232, 800 + (pepeT ? Math.sin(t * 13) * 3 : 0)); counter();
    crowdHeads(t, 1240, 7, 4, t > S.duplas);
    const kvT = talks(t, 'KEVIN'), kc = EP.cues.find(c => c.k === 'k3'), beg = t > kc.t - .1;
    kevin(870, 1900, .9, t, { ex: beg ? 'sad' : 'happy', talk: kvT }); if (beg) { ctx.save(); ctx.font = `90px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const q = eback(clamp((t - kc.t + .1) / .3)); ctx.translate(985, 1330 + Math.sin(t * 9) * 8); ctx.scale(q, q); ctx.fillText('🙏', 0, 0); ctx.restore(); } ctx.save(); ctx.translate(830, 880); ctx.scale(.85, .85); kevinSign(0, 0, t); ctx.restore();
    const sfT = talks(t, 'SOFI'), sc = EP.cues.find(c => c.k === 's1'); sofi(230, 1900, .85, t, { wave: t < S.arrive + 2.6 || (t > sc.t - .1 && t < sc.t + sc.d + .2), talk: sfT });
    const ek = eout(clamp((t - S.arrive) / .45)); brayan(lerp(1300, 560, ek), 1990, .95, t, { bald: true, ex: t > S.duplas - .05 ? 'shock' : 'happy', talk: tb, sweat: t, bob: true });
    ctx.restore();
    if (t > S.duplas && t < S.duplas + 1.5) stamp('¿DUPLAS? 😱', 420, 880, C.red, -.08, t - S.duplas);
  } else if (t < S.poll) {
    // --- ¿con quién entra? ---
    rays(540, 1150, '#3a2a6a', '#33255f', t);
    const d = t - S.end, gs = d < 1.6 ? 1 : d < 3.2 ? 0 : .6, gk = d < 1.6 ? 0 : d < 3.2 ? 1 : .6;
    circleCam(280, 640, 180, '#ff8fc8', () => sofi(0, 830, 1.1, t, {}), gs * (.6 + .4 * Math.sin(t * 8)));
    circleCam(800, 640, 180, '#ffd23f', () => kevin(0, 850, 1.1, t, { ex: 'happy' }), gk * (.6 + .4 * Math.sin(t * 8)));
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `700 54px ${F}`; outlined('SOFI', 280, 880, '#ff8fc8', 12); outlined('KEVIN', 800, 880, C.yellow, 12); ctx.font = `700 120px ${F}`; outlined('¿?', 540, 640, C.cream, 16); ctx.restore();
    bHead(540, 1200, 2.0, d < 3.2 ? 'shock' : 'sad', tb, t, { bald: true, sweat: t, rot: d < 1.6 ? -.12 : d < 3.2 ? .12 : 0 });
  } else { pollAB(t); }
  barPops(t);
  if (label) { ctx.save(); if (clockMin(t) !== null) ctx.translate(-150, 0); sceneLabel(t, label[1], label[0]); ctx.restore(); }
  clockW(t);
  ctx.globalAlpha = 1; ctx.drawImage(GRAIN, 0, 0, W, H);
  const vg = ctx.createRadialGradient(540, 900, 520, 540, 960, 1280); vg.addColorStop(0, 'rgba(30,14,40,0)'); vg.addColorStop(1, 'rgba(30,14,40,.38)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  header(t + .2);
  caption(t);
  for (const tt of [S.crawl, S.kchat, S.kcut, S.pizza, S.sock, S.ctrl, S.ctrl + 1.1, S.mom, S.fam, S.jean, S.sniff, S.pocket, S.bill, S.shower, S.clean, S.run, S.arrive, S.end, S.poll]) { const d = t - tt; if (d >= 0 && d < .16) { ctx.fillStyle = `rgba(255,244,230,${.5 * (1 - d / .16)})`; ctx.fillRect(0, 0, W, H); } }
}
