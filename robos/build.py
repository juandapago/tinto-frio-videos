import base64,json,os
F='/home/claude/tinto-frio-videos/pipeline/assets/fonts'
b=lambda p: base64.b64encode(open(p,'rb').read()).decode()
three=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'node_modules/three/build/three.min.js'),encoding='utf-8').read()
h=f'''<!doctype html><html><head><meta charset="utf-8"><title>Robos Imposibles Ep1</title><style>
@font-face{{font-family:Oswald;font-weight:700;src:url(data:font/woff2;base64,{b(F+'/oswald-latin-700-normal.woff2')}) format('woff2')}}
@font-face{{font-family:Oswald;font-weight:600;src:url(data:font/woff2;base64,{b(F+'/oswald-latin-600-normal.woff2')}) format('woff2')}}
body{{margin:0;background:#000}}canvas{{width:540px;height:960px}}</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
<script>{three}</script><script>const EP={open('ep.json',encoding='utf-8').read()};</script>
<script>document.fonts.load('700 40px Oswald').then(()=>{{const s=document.createElement('script');s.textContent={json.dumps(open('escena.js',encoding='utf-8').read())};document.body.appendChild(s);}});</script></body></html>'''
open('robos.html','w',encoding='utf-8').write(h); print(len(h)//1024,'KB')
