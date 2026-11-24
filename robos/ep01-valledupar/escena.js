/* ROBOS IMPOSIBLES · Ep. 1 completo (Valledupar 1994) — render(t) es función pura del tiempo */
const W = 1080, H = 1920;
const OUT = document.getElementById('c'), ctx = OUT.getContext('2d');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H, false); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k;
const eio = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2, eout = k => 1 - Math.pow(1 - k, 3);
const eback = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
function rnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- materiales toon con contorno ---------- */
const grad = (() => { const d = new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]); const tx = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); tx.minFilter = tx.magFilter = THREE.NearestFilter; tx.needsUpdate = true; return tx; })();
const toon = (c, o = {}) => new THREE.MeshToonMaterial(Object.assign({ color: c, gradientMap: grad }, o));
const INK = new THREE.MeshBasicMaterial({ color: 0x14101c, side: THREE.BackSide });
function mk(geo, mat, line = .035) {
  const g = new THREE.Group(); const m = new THREE.Mesh(geo, typeof mat === 'number' ? toon(mat) : mat); m.castShadow = true; m.receiveShadow = true; g.add(m);
  if (line) { const o = new THREE.Mesh(geo, INK); o.scale.setScalar(1 + line); g.add(o); }
  g.userData.m = m; return g;
}
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function textTex(lines, w, h, bg, fg, font) {
  return canvasTex(w, h, (x) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = font;
    lines.forEach((l, i) => x.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * parseInt(font.match(/(\d+)px/)[1]) * 1.15)); });
}
function person(body, o = {}) {
  const g = new THREE.Group();
  const torso = mk(new THREE.CapsuleGeometry(.32, .62, 4, 10), body); torso.position.y = 1.35; g.add(torso);
  const head = mk(new THREE.SphereGeometry(.27, 16, 12), o.skin || 0xc98d62); head.position.y = 2.05; g.add(head);
  if (o.cap) { const c = mk(new THREE.CylinderGeometry(.29, .29, .14, 16), o.cap); c.position.y = 2.24; g.add(c); const v = mk(new THREE.BoxGeometry(.32, .04, .22), o.cap, .02); v.position.set(0, 2.2, .3); g.add(v); }
  if (o.mask) { const m = mk(new THREE.SphereGeometry(.285, 16, 12), 0x1c1c24); m.position.y = 2.06; g.add(m); for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); e.position.set(s * .1, 2.1, .25); g.add(e); } }
  if (o.weld) { const m = mk(new THREE.BoxGeometry(.5, .42, .42), 0x2a2a36); m.position.set(0, 2.06, .06); g.add(m); const v = new THREE.Mesh(new THREE.BoxGeometry(.36, .1, .05), new THREE.MeshBasicMaterial({ color: 0x55c2ff })); v.position.set(0, 2.1, .29); g.add(v); }
  if (o.eyes !== false && !o.mask && !o.weld) for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 6), new THREE.MeshBasicMaterial({ color: 0x14101c })); e.position.set(s * .09, 2.1, .25); g.add(e); }
  const legs = []; for (const s of [-1, 1]) { const l = new THREE.Group(); const lm = mk(new THREE.BoxGeometry(.2, .78, .22), o.pants || 0x2f3550); lm.position.y = -.39; l.add(lm); l.position.set(s * .15, .82, 0); g.add(l); legs.push(l); }
  const arms = []; for (const s of [-1, 1]) { const a = new THREE.Group(); const am = mk(new THREE.CapsuleGeometry(.1, .5, 3, 8), body); am.position.y = -.3; a.add(am); a.position.set(s * .4, 1.75, 0); g.add(a); arms.push(a); }
  g.userData = { legs, arms }; return g;
}
function walk(p, t, sp = 9, amp = .55) { p.userData.legs.forEach((l, i) => l.rotation.x = Math.sin(t * sp + i * Math.PI) * amp); }
function makeTruck() {
  const truck = new THREE.Group();
  const cab = mk(new THREE.BoxGeometry(1.7, 1.55, 2.1), 0xd5352f); cab.position.set(1.9, 1.35, 0); truck.add(cab);
  const hood = mk(new THREE.BoxGeometry(.9, .8, 2.05), 0xc12d28); hood.position.set(3.05, .98, 0); truck.add(hood);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.8, .7), new THREE.MeshBasicMaterial({ color: 0x9ad2ff })); glass.rotation.y = Math.PI / 2; glass.position.set(2.76, 1.7, 0); truck.add(glass);
  const bed = mk(new THREE.BoxGeometry(3.4, .5, 2.2), 0x7a2420); bed.position.set(-.6, .85, 0); truck.add(bed);
  const tarpG = new THREE.Group(); tarpG.position.set(-2.25, 1.1, 0); truck.add(tarpG);
  const tarp = mk(new THREE.BoxGeometry(3.3, 1.7, 2.1), 0xb9a37a); tarp.position.set(1.65, .85, 0); tarpG.add(tarp);
  const wheels = []; for (const [x, z] of [[2.6, 1.05], [2.6, -1.05], [-1.4, 1.05], [-1.4, -1.05]]) { const w = mk(new THREE.CylinderGeometry(.46, .46, .32, 16), 0x17161c); w.rotation.x = Math.PI / 2; w.position.set(x, .46, z); truck.add(w); wheels.push(w); }
  const hl = new THREE.Mesh(new THREE.BoxGeometry(.06, .22, .4), new THREE.MeshBasicMaterial({ color: 0xfff3c0 })); hl.position.set(3.52, 1.05, .65); truck.add(hl); const hl2 = hl.clone(); hl2.position.z = -.65; truck.add(hl2);
  truck.userData = { wheels, tarpG }; return truck;
}
function makeBank(scene) {
  const bank = new THREE.Group(); scene.add(bank); bank.position.set(4, 0, -6.5);
  const body = mk(new THREE.BoxGeometry(13, 6.5, 6), 0xe9dcc0); body.position.y = 3.25; bank.add(body);
  const roof = mk(new THREE.BoxGeometry(13.8, .7, 6.8), 0xc9b48e); roof.position.y = 6.8; bank.add(roof);
  for (let i = 0; i < 4; i++) { const c = mk(new THREE.CylinderGeometry(.32, .36, 5.2, 14), 0xf4ead4); c.position.set(-5.6 + i * 1.6, 2.6, 3.4); bank.add(c); }
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.0), new THREE.MeshBasicMaterial({ map: textTex(['BANCO DE LA REPÚBLICA'], 1720, 226, '#1d3b6e', '#ffe9a8', '700 120px Oswald') }));
  sign.position.set(2.6, 5.75, 3.02); bank.add(sign);
  const garage = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.4), new THREE.MeshBasicMaterial({ color: 0x07060c })); garage.position.set(3.9, 1.7, 3.02); bank.add(garage);
  for (let i = 0; i < 3; i++) { const wdw = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.4), new THREE.MeshBasicMaterial({ color: i === 1 ? 0xffd97a : 0x2b3355 })); wdw.position.set(-4.6 + i * 2.5, 3.6, 3.31); bank.add(wdw); }
  return bank;
}
function nightStreet(scene) {
  scene.background = new THREE.Color(0x141a33); scene.fog = new THREE.Fog(0x141a33, 18, 46);
  scene.add(new THREE.HemisphereLight(0x8aa0ff, 0x2a1a2a, .75));
  const moon = new THREE.DirectionalLight(0xbcd0ff, 1.1); moon.position.set(-8, 14, 10); moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); Object.assign(moon.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18 }); scene.add(moon);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), toon(0x2b2d3a)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const walkway = new THREE.Mesh(new THREE.BoxGeometry(30, .15, 3.2), toon(0x55586a)); walkway.position.set(2, .07, -1.6); walkway.receiveShadow = true; scene.add(walkway);
  for (let i = 0; i < 9; i++) { const st = new THREE.Mesh(new THREE.BoxGeometry(.18, .02, 1.4), new THREE.MeshBasicMaterial({ color: 0xe8d36a })); st.position.set(7.9 + 2.2, .02, 14 - i * 3.6); scene.add(st); }
  const lamp = new THREE.Group(); scene.add(lamp); lamp.position.set(11.5, 0, 3);
  const pole = mk(new THREE.CylinderGeometry(.09, .12, 5.2, 8), 0x2a2d38); pole.position.y = 2.6; lamp.add(pole);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.28, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffe2a0 })); bulb.position.y = 5.2; lamp.add(bulb);
  const lampL = new THREE.PointLight(0xffc977, 30, 14, 1.5); lampL.position.set(11.5, 4.9, 3); scene.add(lampL);
  // casas del barrio
  for (let i = 0; i < 4; i++) { const h = mk(new THREE.BoxGeometry(4, 3 + rnd(i) * 2, 4), [0xf0a25a, 0x6fb7a8, 0xe07a8a, 0x9a86d6][i]); h.position.set(15 + (i % 2) * 4.5, 1.5, 2 - i * 5); scene.add(h); }
  makeBank(scene);
  return lampL;
}

/* ---------- ESCENA A: la calle (camión varado y empujado / vigilante) ---------- */
const SA = new THREE.Scene(); const lampA = nightStreet(SA);
const truckA = makeTruck(); SA.add(truckA);
const pushers = [person(0x3f7fd6, { cap: 0xffd23f }), person(0xe06b9a), person(0x5fb07a, { cap: 0x222222 }), person(0xf0a25a)]; pushers.forEach(p => SA.add(p));
const smoke = []; for (let i = 0; i < 14; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.35, 10, 8), new THREE.MeshToonMaterial({ color: 0xbfc3cc, gradientMap: grad, transparent: true })); SA.add(s); smoke.push(s); }
const guard = person(0x4c6a9a, { cap: 0x1d2a44, pants: 0x1d2a44 }); SA.add(guard); guard.position.set(99, 0, 0);
const flash = new THREE.SpotLight(0xfff1c2, 0, 14, .32, .4, 1); SA.add(flash); SA.add(flash.target);

/* ---------- ESCENA B: el garaje (salen de la carpa) ---------- */
const SB = new THREE.Scene(); SB.background = new THREE.Color(0x0e0d14); SB.fog = new THREE.Fog(0x0e0d14, 10, 24);
SB.add(new THREE.HemisphereLight(0x7080b0, 0x201818, .5));
const bulbB = new THREE.PointLight(0xffd59a, 40, 16, 1.4); bulbB.position.set(0, 5.5, 1); bulbB.castShadow = true; bulbB.shadow.bias = -0.004; SB.add(bulbB); const fillB = new THREE.DirectionalLight(0xb8c8ff, .9); fillB.position.set(2, 3, 12); SB.add(fillB);
const floorB = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), toon(0x3a3a44)); floorB.rotation.x = -Math.PI / 2; floorB.receiveShadow = true; SB.add(floorB);
const wallB = new THREE.Mesh(new THREE.BoxGeometry(16, 8, .3), toon(0x4d5160)); wallB.position.set(0, 4, -5); SB.add(wallB);
const truckB = makeTruck(); truckB.rotation.y = Math.PI / 2; truckB.position.set(0, 0, -.5); SB.add(truckB);
const thieves = []; for (let i = 0; i < 6; i++) { const th = person([0x2b2b33, 0x343440, 0x3a2f2f][i % 3], { mask: true, pants: 0x1c1c22 }); SB.add(th); thieves.push(th); }

/* ---------- ESCENA C: la bóveda y los sopletes ---------- */
const SC = new THREE.Scene(); SC.background = new THREE.Color(0x0d0b12); SC.fog = new THREE.Fog(0x0d0b12, 10, 22);
SC.add(new THREE.HemisphereLight(0x6070a0, 0x1a1010, .45));
const redL = new THREE.PointLight(0xff3a3a, 14, 14, 1.5); redL.position.set(-3.5, 4.2, 2); SC.add(redL);
const wallC = new THREE.Mesh(new THREE.BoxGeometry(16, 8, .4), toon(0x5a5e6a)); wallC.position.set(0, 4, -.4); wallC.receiveShadow = true; SC.add(wallC);
const floorC = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), toon(0x34363f)); floorC.rotation.x = -Math.PI / 2; floorC.receiveShadow = true; SC.add(floorC);
const vault = new THREE.Group(); SC.add(vault); vault.position.set(0, 2.5, 0);
const vdoor = mk(new THREE.CylinderGeometry(2.25, 2.25, .55, 48), toon(0xa7adb8), .02); vdoor.rotation.x = Math.PI / 2; vault.add(vdoor);
const vring = mk(new THREE.TorusGeometry(2.3, .16, 10, 48), 0x6c7280, .02); vring.position.z = .3; vault.add(vring);
const hub = mk(new THREE.CylinderGeometry(.55, .55, .3, 24), 0x7a808e); hub.rotation.x = Math.PI / 2; hub.position.z = .4; vault.add(hub);
for (let i = 0; i < 3; i++) { const sp = mk(new THREE.BoxGeometry(.12, 1.4, .12), 0x7a808e, .02); sp.position.z = .5; sp.rotation.z = i * Math.PI / 3; vault.add(sp); }
for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const b = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), toon(0x575c68)); b.position.set(Math.cos(a) * 1.95, Math.sin(a) * 1.95, .3); vault.add(b); }
const CUT = 56, cutDots = []; for (let i = 0; i < CUT; i++) { const a = Math.PI * .5 - i / CUT * Math.PI * 2; const d = new THREE.Mesh(new THREE.SphereGeometry(.075, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffb347 })); d.position.set(Math.cos(a) * 1.55, Math.sin(a) * 1.55, .31); vault.add(d); cutDots.push(d); }
const torchL = new THREE.PointLight(0xff9a3c, 0, 9, 1.4); SC.add(torchL);
const welder1 = person(0x2b2b33, { weld: true, pants: 0x1c1c22 }), welder2 = person(0x343440, { weld: true, pants: 0x1c1c22 });
welder2.position.set(-2.8, 0, 2.2); welder2.rotation.y = Math.PI / 4; SC.add(welder1, welder2);
for (const [x, c] of [[-3.8, 0x3a8f5a], [-3.3, 0x2f6fb0]]) { const tk = mk(new THREE.CylinderGeometry(.26, .26, 1.6, 14), c); tk.position.set(x, .8, 1.2); SC.add(tk); }
const SP = 150, sparks = []; const spGeo = new THREE.BoxGeometry(.045, .045, .16); for (let i = 0; i < SP; i++) { const m = new THREE.Mesh(spGeo, new THREE.MeshBasicMaterial({ color: i % 3 ? 0xffc04d : 0xffffff })); SC.add(m); sparks.push(m); }

/* ---------- ESCENA D: la plata ---------- */
const SD = new THREE.Scene(); SD.background = new THREE.Color(0x14120e);
SD.add(new THREE.HemisphereLight(0xfff0d0, 0x2a2010, .6));
const spot = new THREE.SpotLight(0xffe2a8, 130, 24, .75, .5, 1.4); spot.position.set(0, 9, 3); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); SD.add(spot); SD.add(spot.target);
const floorD = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), toon(0x3d3a33)); floorD.rotation.x = -Math.PI / 2; floorD.receiveShadow = true; SD.add(floorD);
const backD = new THREE.Mesh(new THREE.BoxGeometry(16, 9, .3), toon(0x575247)); backD.position.set(0, 4.5, -3.5); SD.add(backD);
for (let r = 0; r < 3; r++) { const sh = mk(new THREE.BoxGeometry(9, .14, 1.2), 0x6b5a3e, .02); sh.position.set(0, 1.4 + r * 1.6, -2.8); SD.add(sh); }
const bTex = canvasTex(128, 64, (x) => { x.fillStyle = '#7fb58d'; x.fillRect(0, 0, 128, 64); x.fillStyle = '#5d9470'; for (let i = 0; i < 6; i++) x.fillRect(0, i * 11, 128, 3); x.fillStyle = '#f4f1e4'; x.fillRect(54, 0, 20, 64); });
const bundleGeo = new THREE.BoxGeometry(.62, .22, .32), bundleMat = toon(0xffffff, { map: bTex });
const targets = []; { let n = 0; for (let L = 0; L < 7; L++) { const rows = 7 - L, cols = 8 - L; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { targets.push([(c - (cols - 1) / 2) * .64 + (rnd(n) - .5) * .06, .11 + L * .23, (r - (rows - 1) / 2) * .36 + .4, (rnd(n + 9) - .5) * .25]); n++; } } }
const bundles = targets.map(() => { const b = new THREE.Mesh(bundleGeo, bundleMat); b.castShadow = true; b.receiveShadow = true; SD.add(b); return b; });
const cigBoxes = []; for (let i = 0; i < 6; i++) { const bx = mk(new THREE.BoxGeometry(1.1, .9, .9), 0xb8925c); bx.position.set(-3.6 + (i % 2) * 1.2, .45 + Math.floor(i / 2) * .92, -.4 - (i % 2) * .2); SD.add(bx); cigBoxes.push(bx); }

/* ---------- ESCENA E: billetes marcados ---------- */
const SE = new THREE.Scene(); SE.background = new THREE.Color(0x0f2a1e); SE.fog = new THREE.Fog(0x0f2a1e, 8, 26);
SE.add(new THREE.HemisphereLight(0xe8fff0, 0x10301c, 1.0)); const keyE = new THREE.DirectionalLight(0xffffff, 1.4); keyE.position.set(3, 6, 8); SE.add(keyE);
function billTex(serial, gray) {
  return canvasTex(1024, 480, (x, w, h) => {
    const base = gray ? '#b9b9b2' : '#cfe3c6', ink = gray ? '#77776f' : '#2f6e4a';
    x.fillStyle = base; x.fillRect(0, 0, w, h); x.strokeStyle = ink; x.lineWidth = 14; x.strokeRect(20, 20, w - 40, h - 40);
    for (let i = 0; i < 18; i++) { x.strokeStyle = gray ? 'rgba(90,90,85,.25)' : 'rgba(47,110,74,.22)'; x.lineWidth = 3; x.beginPath(); x.ellipse(w * .72, h * .5, 60 + i * 9, 40 + i * 7, 0, 0, 7); x.stroke(); }
    x.fillStyle = ink; x.font = '700 120px Oswald'; x.textAlign = 'left'; x.fillText('10.000', 60, 160); x.font = '700 44px Oswald'; x.fillText('DIEZ MIL PESOS', 64, 230);
    x.fillStyle = gray ? '#6d6d66' : '#b3262a'; x.font = '700 58px Oswald'; x.fillText('No. ' + serial, 60, 410);
  });
}
const BILLS = 36, bills = []; for (let i = 0; i < BILLS; i++) { const s = String(68200001 + Math.floor(rnd(i + 40) * 399999)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); const m = new THREE.Mesh(new THREE.PlaneGeometry(2.0, .94), new THREE.MeshToonMaterial({ map: billTex(s, false), gradientMap: grad, side: THREE.DoubleSide })); m.userData.gray = billTex(s, true); SE.add(m); bills.push(m); }
const hero = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.36, .03), [0, 0, 0, 0, new THREE.MeshToonMaterial({ map: billTex('68.200.001', false), gradientMap: grad }), toon(0xcfe3c6)].map(m => m || toon(0xcfe3c6)));
hero.userData.color = hero.material[4].map; hero.userData.gray = billTex('68.200.001', true); SE.add(hero);

/* ---------- ESCENA F: los implicados ---------- */
const SF = new THREE.Scene(); SF.background = new THREE.Color(0x1a1c26);
SF.add(new THREE.HemisphereLight(0xffffff, 0x303040, .8)); const keyF = new THREE.DirectionalLight(0xffffff, 1.0); keyF.position.set(2, 8, 10); keyF.castShadow = true; keyF.shadow.mapSize.set(1024, 1024); Object.assign(keyF.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); SF.add(keyF);
const chart = new THREE.Mesh(new THREE.PlaneGeometry(22, 6), new THREE.MeshToonMaterial({ gradientMap: grad, map: canvasTex(2200, 600, (x, w, h) => { x.fillStyle = '#cfd3de'; x.fillRect(0, 0, w, h); for (let i = 0; i <= 6; i++) { const y = h - i * 95 - 20; x.fillStyle = '#4a4f60'; x.fillRect(0, y, w, i % 2 ? 3 : 6); x.font = '700 44px Oswald'; x.fillText((1.2 + i * .2).toFixed(1) + ' m', 20, y - 12); } }) }));
chart.position.set(0, 3, -1.2); chart.receiveShadow = true; SF.add(chart);
const floorF = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), toon(0x2c2f3c)); floorF.rotation.x = -Math.PI / 2; floorF.receiveShadow = true; SF.add(floorF);
const suspects = []; const SC6 = [0x3f7fd6, 0xe06b9a, 0x5fb07a, 0xf0a25a, 0x9a86d6, 0x6fb7a8, 0xd5352f, 0xffd23f]; for (let i = 0; i < 8; i++) { const p = person(SC6[i], { pants: 0x2f3550 }); p.position.set(-8.4 + i * 2.4, 0, 0); p.scale.setScalar(.95 + rnd(i + 3) * .15); SF.add(p); suspects.push(p); }
const sirR = new THREE.PointLight(0xff2a2a, 0, 26, 1.2), sirB = new THREE.PointLight(0x2a6aff, 0, 26, 1.2); sirR.position.set(-6, 6, 6); sirB.position.set(6, 6, 6); SF.add(sirR, sirB);

/* ---------- cámara ---------- */
const cam = new THREE.PerspectiveCamera(46, W / H, .1, 120);
function move(t, t0, t1, p0, p1, l0, l1, fov = 46, ease = eio) { const k = ease(clamp((t - t0) / (t1 - t0))); cam.fov = fov; cam.updateProjectionMatrix(); const sh = .03; cam.position.set(lerp(p0[0], p1[0], k) + Math.sin(t * 1.7) * sh, lerp(p0[1], p1[1], k) + Math.sin(t * 2.3) * sh, lerp(p0[2], p1[2], k)); cam.lookAt(lerp(l0[0], l1[0], k), lerp(l0[1], l1[1], k), lerp(l0[2], l1[2], k)); }
function orbit(t, t0, t1, c, r, h, a0, a1, fov = 46) { const k = eio(clamp((t - t0) / (t1 - t0))), a = lerp(a0, a1, k); cam.fov = fov; cam.updateProjectionMatrix(); cam.position.set(c[0] + Math.sin(a) * r, h, c[2] + Math.cos(a) * r); cam.lookAt(c[0], c[1], c[2]); }

/* ---------- 2D encima ---------- */
const F = 'Oswald, Impact, sans-serif', CR = '#fff4e6', YL = '#ffd23f', RD = '#ff4d4d', GN = '#7ee08a';
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function outlined(txt, x, y, fill, lw) { ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = '#1a1220'; ctx.strokeText(txt, x, y); ctx.fillStyle = fill; ctx.fillText(txt, x, y); }
function stamp(txt, x, y, col, rot, d, size = 70) {
  if (d < 0) return; const k = d < .25 ? eback(clamp(d / .25)) : 1, pop = 1 + .5 * (1 - clamp(d / .12)); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k * pop, k * pop);
  ctx.font = `700 ${size}px ${F}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const w = Math.min(ctx.measureText(txt).width + 70, 900), h = size * 1.45;
  ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(-w / 2 + 8, -h / 2 + 8, w, h, 18); ctx.fill(); ctx.fillStyle = CR; rr(-w / 2, -h / 2, w, h, 18); ctx.fill(); ctx.lineWidth = 9; ctx.strokeStyle = col; rr(-w / 2, -h / 2, w, h, 18); ctx.stroke();
  ctx.fillStyle = col; ctx.fillText(txt, 0, 6, 840); ctx.restore();
}
function plate(lines, y, k) { if (k <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(k, k); ctx.rotate(-.02); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const hh = lines.reduce((s, l) => s + l[1] * 1.12, 0);
  let wmax = 0; lines.forEach(l => { ctx.font = `700 ${l[1]}px ${F}`; wmax = Math.max(wmax, ctx.measureText(l[0]).width); });
  ctx.fillStyle = 'rgba(12,10,22,.8)'; rr(-wmax / 2 - 44, -hh / 2 - 28, wmax + 88, hh + 56, 30); ctx.fill(); let y0 = -hh / 2; lines.forEach(l => { ctx.font = `700 ${l[1]}px ${F}`; outlined(l[0], 0, y0 + l[1] * .56, l[2], Math.max(8, l[1] / 6)); y0 += l[1] * 1.12; }); ctx.restore(); }
function caption(t) {
  const c = EP.cues.find(c => t >= c.t && t < c.t + c.d + .15); if (!c) return;
  const words = c.cap.split(' '), lens = words.map(w => w.length + 2), tot = lens.reduce((a, b) => a + b, 0); let acc = 0; const ends = lens.map(l => (acc += l) / tot);
  const prog = clamp((t - c.t) / c.d), cur = ends.findIndex(e => e >= prog);
  ctx.font = `700 60px ${F}`; const maxW = 880, lines = [[]]; let lw = 0;
  words.forEach((w, i) => { const ww = ctx.measureText(w + ' ').width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push(i); lw += ww; });
  // ventana de 2 líneas alrededor de la palabra actual (máx. 3 líneas)
  let li0 = Math.max(0, lines.findIndex(l => l.includes(Math.max(cur, 0))) - 1); const show = lines.slice(li0, li0 + 3);
  const lh = 74, y0 = c.y - (show.length - 1) * lh / 2; const wid = show.map(l => ctx.measureText(l.map(i => words[i]).join(' ')).width); const bw = Math.max(...wid) + 76, bh = show.length * lh + 36;
  ctx.fillStyle = 'rgba(12,10,22,.74)'; rr(540 - bw / 2, y0 - lh / 2 - 18, bw, bh, 26); ctx.fill();
  ctx.textBaseline = 'middle';
  show.forEach((l, li) => { let x = 540 - wid[li] / 2; l.forEach(i => { const w = words[i], key = c.hl.includes(w.toLowerCase().replace(/[¡!¿?.,:…$“”]/g, '')), isCur = i === cur; ctx.save(); ctx.textAlign = 'left'; ctx.font = `700 60px ${F}`; ctx.globalAlpha = i <= cur || cur < 0 ? 1 : .5;
    outlined(w, x, y0 + li * lh, isCur || key ? YL : CR, 10); ctx.restore(); x += ctx.measureText(w + ' ').width; }); });
}
function vignette() { const g = ctx.createRadialGradient(540, 900, 520, 540, 960, 1320); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.42)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
const money = v => '$' + v.toLocaleString('es-CO');

/* ---------- render(t) ---------- */
function renderAt(t) {
  const A = EP.at; let scene;
  if (t < A.s1) {
    // HOOK: la pila crece rápido, órbita rápida
    scene = SD; const d = t + 1.2;
    bundles.forEach((b, i) => { const td = i * .012, fall = clamp((d - td) / .25), [x, y, z, ry] = targets[i]; b.visible = d > td; b.position.set(x, lerp(7.5, y, fall * fall), z); b.rotation.set(0, ry + (1 - fall) * 2, (1 - fall) * .8); });
    cigBoxes.forEach(b => b.visible = false);
    orbit(t, 0, A.s1, [0, 1.0, .3], 7.2, 3.4, -.9, .5, 50);
  } else if (t < A.s2) {
    // CALLE: camión varado echando humo, la gente lo empuja; cámara acompaña
    scene = SA; const k = clamp((t - A.s1) / (A.s2 - A.s1 - .2)), z = lerp(9.5, .3, eout(k)); truckA.visible = true; truckA.rotation.y = Math.PI / 2; truckA.position.set(7.9, 0, z); truckA.userData.wheels.forEach(w => w.rotation.y = z / .46);
    pushers.forEach((p, i) => { p.rotation.order = 'YXZ'; p.position.set(7.9 - 1.2 + i * .8, 0, z + 2.95 + (i % 2) * .2); p.rotation.y = Math.PI; p.rotation.x = .3; p.userData.arms.forEach(a => a.rotation.x = -1.35); walk(p, t + i, 11 * (1 - k * .5), .6); });
    smoke.forEach((s, i) => { const P = 1.6, age = (t + i / smoke.length * P) % P; s.visible = true; s.position.set(7.9 + (rnd(i) - .5) * .6, 1.5 + age * 1.6, z - 3.1 - age * .4); s.scale.setScalar(.4 + age * .9); s.material.opacity = .85 * (1 - age / P); });
    guard.position.set(99, 0, 0); flash.intensity = 0; lampA.intensity = 30;
    move(t, A.s1, A.s2, [2.0, 2.4, z + 9.5], [3.6, 4.2, 10.5], [7.9, 1.6, z - 1], [7.4, 2.6, -1.5], 50, k => k);
  } else if (t < A.s3) {
    // GARAJE: se levanta la carpa y saltan los ladrones
    scene = SB; const d = t - A.s2, up = eout(clamp((t - A.tarp) / .5));
    truckB.userData.tarpG.position.y = 1.1 + up * 3.2; truckB.userData.tarpG.position.x = -2.25 - up * 1.5; truckB.userData.tarpG.rotation.z = -up * .5;
    thieves.forEach((th, i) => { const t0 = A.tarp + .35 + i * .22, k = clamp((t - t0) / .45), hop = Math.sin(k * Math.PI) * 1.2; const sx = (i % 3 - 1) * .7, ex = (i - 2.5) * 1.15;
      th.position.set(lerp(sx, ex, k), lerp(1.1, 0, k) + hop * (k < 1 ? 1 : 0), lerp(-.6 + (i % 3) * .6, 3.4 + (i % 2) * .9, k)); th.visible = t > A.tarp + .1; th.rotation.y = 0; th.userData.arms.forEach((a, j) => a.rotation.x = k < 1 ? -2.4 : -.3 + Math.sin(t * 3 + i + j) * .1); if (k >= 1) walk(th, 0, 0, 0); });
    move(t, A.s2, A.s3, [0, 2.4, 11.5], [1.6, 2.9, 7.6], [0, 1.6, -1], [0, 1.6, 0], 50);
  } else if (t < A.s4) {
    // BÓVEDA: sopletes; cámara orbita la puerta
    scene = SC; const d = t - A.s3, prog = clamp((d - .3) / (A.s4 - A.s3 - .6));
    const ang = Math.PI * .5 - prog * Math.PI * 2, tp = V3(Math.cos(ang) * 1.55, 2.5 + Math.sin(ang) * 1.55, .45);
    cutDots.forEach((dt, i) => { dt.visible = i / CUT < prog; dt.material.color.setHex(i / CUT > prog - .08 ? 0xffe9a8 : 0xd8572a); });
    const fl = .75 + .25 * Math.sin(t * 61) + .15 * rnd(Math.floor(t * 30)); torchL.intensity = 30 * fl; torchL.position.copy(tp).add(V3(0, 0, .5));
    sparks.forEach((s, i) => { const P = .55, age = ((t + rnd(i) * P) % P), tb = t - age; const bp = Math.min(prog, clamp((tb - A.s3 - .3) / (A.s4 - A.s3 - .6))); const a2 = Math.PI * .5 - bp * Math.PI * 2;
      const vx = (rnd(i + 1) - .5) * 4.5, vy = rnd(i + 2) * 3.4 + .6, vz = rnd(i + 3) * 2.6 + .4; s.position.set(Math.cos(a2) * 1.55 + vx * age, 2.5 + Math.sin(a2) * 1.55 + vy * age - 4.9 * age * age, .45 + vz * age); s.lookAt(s.position.x + vx, s.position.y + vy - 9.8 * age, s.position.z + vz); s.visible = d > .3 && age < P * .95; s.scale.setScalar(1 - age / P * .7); });
    welder1.position.set(tp.x + .95, 0, 1.4); welder1.rotation.y = -Math.PI / 2.4; welder1.userData.arms.forEach(a => { a.rotation.x = -1.2; a.rotation.z = .2; }); welder2.userData.arms.forEach((a, i) => a.rotation.x = -.6 + Math.sin(t * 2 + i) * .1);
    redL.intensity = 10 + 6 * (Math.sin(t * 5) > 0 ? 1 : 0);
    orbit(t, A.s3, A.s4, [0, 2.3, 0], 8.6, 2.6, .55, -.35, 46);
  } else if (t < A.s5) {
    // PLATA: grúa que sube mientras cae la pila y aparecen las cajas de cigarrillos
    scene = SD; const d = t - A.s4;
    bundles.forEach((b, i) => { const td = .25 + i * .026, fall = clamp((d - td) / .3), [x, y, z, ry] = targets[i]; b.visible = d > td; b.position.set(x, lerp(7.5, y, fall * fall), z); b.rotation.set(0, ry + (1 - fall) * 2, (1 - fall) * .8); });
    cigBoxes.forEach((b, i) => { const k = eback(clamp((d - 2.2 - i * .15) / .3)); b.visible = k > 0; b.scale.setScalar(Math.max(.001, k)); });
    move(t, A.s4, A.s5, [1.2, 1.0, 6.2], [3.4, 6.0, 7.0], [0, .9, 0], [-.4, .8, 0], 46);
  } else if (t < A.s6) {
    // BILLETES MARCADOS
    scene = SE; const d = t - A.s5, gray = t >= A.paper, crum = clamp((t - A.paper) / .6);
    bills.forEach((m, i) => { const sp = .35 + rnd(i) * .5, y = 9 - ((d * sp * 2.2 + rnd(i + 7) * 12) % 14); m.position.set((rnd(i + 1) - .5) * 9, y, -3 - rnd(i + 2) * 7); m.rotation.set(d * (1 + rnd(i + 3)) + i, d * (.8 + rnd(i + 4)) + i * 2, d * .5); if (gray && !m.userData.isGray) { m.material.map = m.userData.gray; m.material.needsUpdate = true; m.userData.isGray = true; } if (!gray && m.userData.isGray) { m.material.map = billTex('0', false); m.userData.isGray = false; } m.scale.set(1, 1 - crum * .7, 1); });
    hero.material[4].map = gray ? hero.userData.gray : hero.userData.color; hero.material[4].needsUpdate = true;
    hero.position.set(0, 3.1 + Math.sin(t * 1.4) * .08, 0); hero.rotation.set(-.12 + Math.sin(t * .9) * .05, Math.sin(t * .7) * .18, .04); hero.scale.set(1 - crum * .25, 1 - crum * .55, 1);
    move(t, A.s5, A.s6, [0, 3.1, 8.6], [.3, 3.2, 7.2], [0, 3.0, 0], [0, 3.0, 0], 46);
  } else if (t < A.s7) {
    // LOS IMPLICADOS: travelling por la fila con luces de policía
    scene = SF; const on = Math.sin(t * 9) > 0; sirR.intensity = on ? 60 : 4; sirB.intensity = on ? 4 : 60;
    suspects.forEach((p, i) => { p.userData.arms.forEach(a => a.rotation.x = 0); p.rotation.y = Math.sin(t * 1.5 + i) * .08; });
    move(t, A.s6, A.s7, [-5.5, 2.4, 9.5], [4.5, 2.6, 9.0], [-4.5, 1.7, 0], [4.8, 1.7, 0], 48, k => k);
  } else if (t < A.poll) {
    // EL VIGILANTE: el banco de noche, push-in hacia él
    scene = SA; truckA.visible = false; pushers.forEach(p => p.position.set(99, 0, 0)); smoke.forEach(s => s.visible = false);
    guard.position.set(7.0, 0, -2.6); guard.rotation.y = .35; guard.userData.arms[1].rotation.x = -1.1; guard.userData.arms[0].rotation.x = 0; walk(guard, 0, 0, 0);
    flash.intensity = 80; flash.position.set(7.4, 1.8, -2.1); flash.target.position.set(9.5, 0, 2.5); lampA.intensity = 30;
    move(t, A.s7, A.poll, [3.8, 3.0, 9.5], [6.0, 2.4, 2.2], [6.8, 2.2, -2.5], [7.0, 2.0, -2.6], 46);
  } else {
    scene = SC; sparks.forEach(s => s.visible = false); cutDots.forEach(d => d.visible = true); torchL.intensity = 0; redL.intensity = 12;
    orbit(t, A.poll, A.poll + 8, [0, 2.3, 0], 8.6, 2.6, -.35, -.1, 46);
  }
  renderer.render(scene, cam);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = t >= A.poll ? 'blur(10px) brightness(.55)' : 'none'; ctx.drawImage(renderer.domElement, 0, 0, W, H); ctx.filter = 'none';
  // transición "látigo": barrido horizontal corto en cada corte
  for (const tt of [A.s1, A.s2, A.s3, A.s4, A.s5, A.s6, A.s7, A.poll]) { const dd = t - tt; if (dd >= 0 && dd < .16) { const k = 1 - dd / .16; ctx.globalAlpha = .35 * k; for (let j = 1; j <= 4; j++) ctx.drawImage(renderer.domElement, -j * 70 * k, 0, W, H); ctx.globalAlpha = 1; } }
  vignette();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  // ---- textos por plano (títulos con centro en y 330–600, nada importante bajo y 1600) ----
  if (t < A.s1) {
    plate([['IBAN POR', 54, CR], ['$3.000 MILLONES…', 98, YL]], 400, t < .01 ? 1 : 1);
    if (t > A.h24) { const k = eback(clamp((t - A.h24) / .3)); plate([['…Y SE LLEVARON', 52, CR], ['$24.000 MILLONES', 104, GN]], 650, k); }
    ctx.font = `700 38px ${F}`; outlined('ROBOS IMPOSIBLES · EP. 1', 540, 860, RD, 8);
  } else if (t < A.s2) {
    stamp('VALLEDUPAR · 1994', 540, 360, '#1d3b6e', .02, t - A.s1 - .05, 60);
    if (t > A.s1 + 2.2 && t < A.push) stamp('SE VARÓ EL CAMIÓN 💨', 540, 500, '#e0a41c', -.03, t - A.s1 - 2.2, 62);
    if (t > A.push) stamp('¡LA GENTE AYUDÓ A EMPUJAR! 😳', 540, 500, RD, -.03, t - A.push, 58);
  } else if (t < A.s3) {
    stamp('DOMINGO · 6:00 A. M.', 540, 360, '#1d3b6e', .02, t - A.s2 - .05, 60);
    if (t > A.tarp + .5) stamp('14 HOMBRES ESCONDIDOS', 540, 500, RD, -.03, t - A.tarp - .5, 64);
  } else if (t < A.s4) {
    const hrs = Math.min(21, Math.floor(clamp((t - A.s3) / (A.s4 - A.s3 - .4)) * 21)); plate([['⏱️ ' + String(hrs).padStart(2, '0') + ' H ADENTRO', 74, YL]], 380, 1);
    if (t > A.hrs) stamp('21 HORAS EN EL BANCO', 540, 540, RD, -.03, t - A.hrs, 62);
  } else if (t < A.s5) {
    const k = clamp((t - A.s4 - .3) / 3.4), val = Math.round(eout(k) * 24000);
    plate([['SE LLEVARON', 46, CR], [money(val) + ' MILLONES', 92, GN]], 410, 1);
    if (t > A.ton) stamp('≈ 4 TONELADAS 💵', 540, 610, RD, -.03, t - A.ton, 64);
  } else if (t < A.s6) {
    if (t < A.stampOut) stamp('NÚMEROS DE SERIE 🔍', 540, 380, '#1d3b6e', .02, t - A.s5 - .3, 60);
    if (t > A.stampOut) { const d = t - A.stampOut, k = d < .25 ? eback(clamp(d / .25)) : 1; ctx.save(); ctx.translate(540, 1000); ctx.rotate(-.18); ctx.scale(k * (1 + .6 * (1 - clamp(d / .12))), k * (1 + .6 * (1 - clamp(d / .12)))); ctx.lineWidth = 12; ctx.strokeStyle = RD; rr(-400, -80, 800, 160, 20); ctx.stroke(); ctx.font = `700 78px ${F}`; ctx.fillStyle = RD; ctx.fillText('FUERA DE CIRCULACIÓN', 0, 6, 760); ctx.restore(); }
    if (t > A.vall) stamp('“LOS VALLENATOS” 🪗', 540, 380, '#2f6e4a', .02, t - A.vall, 66);
    if (t > A.paper) stamp('= PAPEL 🗑️', 540, 540, RD, -.04, t - A.paper, 70);
  } else if (t < A.s7) {
    const n = Math.min(26, Math.max(1, Math.round(eout(clamp((t - A.s6 - .3) / 1.6)) * 26))); plate([[String(n) + ' IMPLICADOS', 96, YL]], 400, 1);
  } else if (t < A.poll) {
    stamp('¿Y EL CEREBRO DEL PLAN? 🧠', 540, 380, '#7e57c2', .02, t - A.s7 - .1, 58);
    if (t > A.guard) stamp('HOY ES VIGILANTE 🔦', 540, 530, RD, -.03, t - A.guard, 66);
  } else {
    const d = t - A.poll; ctx.font = `700 86px ${F}`; outlined('¿QUÉ ROBO SIGUE?', 540, 380, CR, 16);
    [['A', 'EL TÚNEL DEL BANCO CENTRAL', 'Brasil · 2005', '#ff8a3d'], ['B', 'EL ROBO DEL MUSEO GARDNER', 'Estados Unidos · 1990', '#3d8bff']].forEach(([k, a, b, col], i) => {
      const s = eback(clamp((d - .2 - i * .25) / .35)); if (s <= 0) return; ctx.save(); ctx.translate(540, 640 + i * 290); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(-412, -112, 840, 240, 30); ctx.fill(); ctx.fillStyle = CR; rr(-420, -120, 840, 240, 30); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#1a1220'; rr(-420, -120, 840, 240, 30); ctx.stroke();
      ctx.fillStyle = col; rr(-395, -95, 170, 190, 26); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#1a1220'; ctx.font = `700 130px ${F}`; ctx.fillText(k, -310, 8);
      ctx.textAlign = 'left'; ctx.font = `700 50px ${F}`; ctx.fillText(a, -195, -28, 590); ctx.font = `600 42px ${F}`; ctx.fillStyle = '#6b5a4e'; ctx.fillText(b, -195, 42); ctx.restore(); });
    const k = clamp((d - .9) / .3); ctx.globalAlpha = k; ctx.font = `700 70px ${F}`; outlined('COMENTA  A  o  B 💬', 540, 1260, YL, 14); ctx.font = `700 50px ${F}`; outlined('SÍGUEME PARA MÁS ROBOS', 540, 1350, CR, 10); ctx.globalAlpha = 1;
  }
  if (t < A.poll) caption(t);
}
window.renderAt = renderAt; window.TOTAL = EP.total;
