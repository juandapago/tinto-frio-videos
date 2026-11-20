import numpy as np, soundfile as sf, json
SR=48000; E=json.load(open('ep.json',encoding='utf-8')); T=E['total']; A=E['at']
N=int(SR*(T+.3)); sfx=np.zeros(N); mus=np.zeros(N); voc=np.zeros(N); rng=np.random.default_rng(4)
def put(b,t,x,g=1.0):
    i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N: b[i:j]+=g*x[:j-i]
def env(n,a=.004,r=.1): t=np.arange(n)/SR; return np.minimum(1,t/a)*np.exp(-t/r)
def tone(f0,f1,d,r=.1,kind='sine',a=.004):
    n=int(d*SR); f=np.geomspace(f0,f1,n); ph=2*np.pi*np.cumsum(f)/SR
    w=np.sin(ph) if kind=='sine' else (np.sign(np.sin(ph))*.5 if kind=='sq' else 2/np.pi*np.arcsin(np.sin(ph)))
    return w*env(n,a,r)
def noise(d,r=.1,k=1): n=int(d*SR); x=rng.standard_normal(n); x=np.convolve(x,np.ones(k)/k,'same') if k>1 else x; return x*env(n,.003,r)
def bang(t,g=1): put(sfx,t,noise(.3,.07,6),.9*g); put(sfx,t,tone(120,40,.4,.14),1.0*g)
def stampS(t): put(sfx,t,noise(.15,.04,2),.45); put(sfx,t,tone(140,60,.25,.1),.55)
def swoosh(t,g=.3): put(sfx,t,noise(.35,.12,30),g)
def pop(t,f=700): put(sfx,t,tone(f,f*1.6,.09,.035),.28)
def crowd(t,d,g=.25): n=int(d*SR); x=np.convolve(rng.standard_normal(n),np.ones(30)/30,'same'); put(sfx,t,x*np.sin(np.linspace(0,np.pi,n))*4,g)
def chime(t,g=.12): [put(sfx,t+i*.07,tone(f,f,.4,.18),g) for i,f in enumerate([1318,1568,2093,2637])]
# ---- DÍA 10 ----
C_=lambda k:[c for c in E['cues'] if c['k']==k][0]['t']
put(sfx,.2,tone(200,90,.6,.4,'sq'),.10); [put(sfx,.3+i*.28,noise(.06,.02,6),.25) for i in range(13)]
stampS(1.0); chime(1.05,.1); stampS(2.2); put(sfx,2.2,tone(500,200,.5,.25,'sq'),.08)
swoosh(A['recap'],.3); pop(C_('r0')+2.25,600); pop(C_('r0')+2.3,800)
swoosh(A['door'],.3); stampS(C_('s0')+.4); put(sfx,C_('s0')+1.2,tone(988,784,.6,.3),.12)
swoosh(A['run'],.3); [put(sfx,A['run']+i*.28,noise(.06,.02,6),.25) for i in range(5)]
swoosh(A['chat'],.3); [pop(A['chat']+a,700+i*90) for i,a in enumerate([.3,1.5,2.7,3.9])]; stampS(A['chat']+4.6)
swoosh(A['shop'],.3); chime(A['shop']+.1,.08)
stampS(A['pocket']+.3); put(sfx,A['pocket']+.35,tone(392,196,.7,.35,'sq'),.08)
stampS(C_('s1')); [put(sfx,C_('s1')+.05+i*.06,tone(2600,2900,.06,.03),.1) for i in range(3)]
put(sfx,C_('b3'),tone(392,370,.25,.15,'sq'),.07); put(sfx,C_('b3')+.3,tone(349,311,.7,.4,'sq'),.07)
swoosh(A['meanw'],.4); put(sfx,A['meanw']+.2,tone(300,300,1.2,.8,'sine'),.06)
[put(sfx,A['done']+i*.1,tone(f,f,.3,.15,'tri'),.16) for i,f in enumerate([784,988,1175,1568])]; stampS(A['pelon']); pop(A['pelon']+.1,500)
swoosh(A['last'],.3); swoosh(C_('b4'),.3); put(sfx,C_('b4')+.3,tone(523,659,.5,.3,'tri'),.08)
swoosh(A['poll']); [put(sfx,A['poll']+.3+i*.3,tone(660+i*220,660+i*220,.12,.05,'tri'),.25) for i in range(2)]
# barras
for t0,name,a0,a1,_ in E['bars']:
    swoosh(t0,.2)
    if name=='PLATA': put(sfx,t0+.4,tone(300,150,.4,.2,'sq'),.12)
    elif name=='ESTRÉS' and a1>a0: [put(sfx,t0+.4+i*.06,tone(300+i*60,300+i*60,.05,.02,'sq'),.12) for i in range(8)]
    elif name=='ESTRÉS': put(sfx,t0+.4,tone(1200,500,.5,.2,'tri'),.18)
    else: [put(sfx,t0+.4+i*.07,tone(3500,3300,.06,.03),.08) for i in range(6)]; put(sfx,t0+.4,tone(600,1200,.3,.12,'tri'),.2)
# música lofi
bpm=108; b=60/bpm; t=.3; k=0
chords=[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]]
while t<T:
    ch=chords[(k//4)%4]
    if k%4==0:
        for f in ch: put(mus,t,tone(f,f,b*4,r=1.4,a=.04),.05)
        put(mus,t,tone(ch[0]/2,ch[0]/2,b*2,r=.5),.17)
    if k%2==0: put(mus,t,tone(110,45,.2,r=.07),.33)
    else: put(mus,t,noise(.12,.05,4),.07)
    put(mus,t+b/2,noise(.04,.015),.03)
    t+=b; k+=1
g=np.ones(N)
for a,bb,v in [(A['chat'],A['shop'],.6),(A['meanw'],A['last'],.6),(A['poll'],T,.55)]: g[int(a*SR):int(bb*SR)]=v
ks=int(.3*SR); g=np.convolve(g,np.ones(ks)/ks,'same'); mus*=g
mask=np.zeros(N)
for c in E['cues']:
    a,sr=sf.read(f"n_{c['k']}.wav"); a=np.interp(np.arange(int(len(a)*SR/sr))*sr/SR,np.arange(len(a)),a)
    put(voc,c['t'],a,{'BRAYAN':1.0,'NARRADOR':1.2}.get(c['who'],1.15)); i=int(c['t']*SR); mask[i:i+len(a)]=1
k=int(.2*SR); sm=np.convolve(mask,np.ones(k)/k,'same')
mix=voc+sfx*(1-.45*sm)+mus*(1-.6*sm)*.8
f=int(1.5*SR); mix[-f:]*=np.linspace(1,0,f); mix/=np.abs(mix).max()*1.05
sf.write('soundtrack.wav',np.stack([mix,mix],1),SR); print('ok')
