import base64,sys
import os,json
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); B=f'{ROOT}/base'; D=os.getcwd()
DAY=json.load(open(f'{D}/ep.json',encoding='utf-8'))['day']
F=f'{ROOT}/assets/fonts'
t2=open(f'{B}/template2.html',encoding='utf-8').read()
def sec(a,b): i=t2.index(a); j=t2.index(b,i+10); return t2[i:j]
h=open(f'{B}/template3.html',encoding='utf-8').read()
h=h.replace('/*INC:ICONOS*/',sec('/* ============ ÍCONOS Y SELLOS','/* ============ VOZ /')).replace('/*INC:VOZ*/',sec('/* ============ VOZ /','/* ============ PANTALLAS')).replace('/*INC:PANTALLAS*/',sec('/* ============ PANTALLAS','/* ============ EPISODIO')).replace('/*INC:REPRO*/',t2[t2.index('/* ============ REPRODUCCIÓN'):t2.rindex('})();')])
h=h.replace("  // pelo: mal cortado, grasoso, con remolino y un lado aplastado","  if (o.bald) { ell(-26, -66, 34, 13, 'rgba(255,255,255,.55)', -.35); ell(-48, -46, 8, 5, 'rgba(255,255,255,.45)', -.5); ell(30, -78, 14, 5, 'rgba(255,255,255,.3)', .2); }\n  if (!o.bald) {\n  // pelo: mal cortado, grasoso, con remolino y un lado aplastado",1)
h=h.replace("  } else [[-44, -106], [8, -122], [52, -104]].forEach(([dx, dy]) => poly([[dx - 18, dy + 22], [dx, dy], [dx + 18, dy + 22]], HAIR));","  } else [[-44, -106], [8, -122], [52, -104]].forEach(([dx, dy]) => poly([[dx - 18, dy + 22], [dx, dy], [dx + 18, dy + 22]], HAIR));\n  }",1)
assert h.count('if (!o.bald)')==1
a=h.index('const ROOM = layer(() => {'); z=h.index('const OFFICE = layer(',a); src=h[a:z]
c1=src.index('  // desorden en el piso'); c2=src.index('  // rayo de luz'); rc=src[:c1]+src[c2:]
rc=rc.replace('const ROOM = layer','const ROOM_CLEAN = layer',1).replace("ell(-120, 30, 90, 46, 'rgba(120,60,30,.28)');","")
h=h[:z]+rc+h[z:]
i=h.index('function render(t) {'); j=h.index('function deleteApps(',i)
h=h[:i]+open(f'{D}/day1.js',encoding='utf-8').read()+'\n'+h[j:]
h=h.replace('<title>Brayan Día 0</title>','<title>Brayan Día '+str(DAY)+'</title>').replace('Día 0 de la serie 30 días sin redes, en caricatura: Brayan pierde el trabajo, su novia le termina por chat, su mamá lo regaña en un cuarto desordenado y él pide al público que decida su vida.','Episodio de la serie 30 días sin redes de Brayan.')
b=lambda p: base64.b64encode(open(p,'rb').read()).decode()
h=h.replace('/*F_OSW700*/',b(f'{F}/oswald-latin-700-normal.woff2')).replace('/*F_OSW600*/',b(f'{F}/oswald-latin-600-normal.woff2'))
h=h.replace('/*AUDIO*/',b(f'{D}/soundtrack.mp3') if len(sys.argv)<2 else '')
h=h.replace('/*EP*/null',open(f'{D}/ep.json',encoding='utf-8').read())
old='  const top = cy - (lines.length - 1) * lh / 2;\n'
assert h.count(old)==1
h=h.replace(old,old+"  if (cue.who === 'NARRADOR') { const bw = Math.max(...lw) + 80, bh = lines.length * lh + 44; box(540 - bw / 2, top - lh / 2 - 22, bw, bh, 26, 'rgba(22,18,36,.74)'); ctx.lineWidth = 4; ctx.strokeStyle = '#b8c4e0'; rrect(540 - bw / 2, top - lh / 2 - 22, bw, bh, 26); ctx.stroke(); }\n")
open(f'/home/claude/brayan-dia-{DAY}.html','w',encoding='utf-8').write(h); print(len(h)//1024,'KB')
