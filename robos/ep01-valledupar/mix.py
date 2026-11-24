import numpy as np, soundfile as sf, json
SR=48000; E=json.load(open('ep.json',encoding='utf-8')); T=E['total']; A=E['at']
N=int(SR*(T+.3)); sfx=np.zeros(N); mus=np.zeros(N); voc=np.zeros(N); rng=np.random.default_rng(7)
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
def hold(d,f,g): n=int(d*SR); return np.sin(2*np.pi*f*np.arange(n)/SR)*g
# gancho: golpe + cascada de fajos
bang(.05,.7); stampS(.05)
for i in range(60): put(sfx,.05+i*.06,noise(.05,.02,8),.10)
stampS(A['h24']); put(sfx,A['h24'],tone(1318,1318,.4,.25),.12); put(sfx,A['h24']+.08,tone(2093,2093,.5,.3),.12)
# calle: motor que tose + gente empujando
n=int((A['s2']-A['s1'])*SR); tt=np.arange(n)/SR; x=np.sign(np.sin(2*np.pi*38*tt+2*np.sin(2*np.pi*7*tt)))*.25*(np.sin(2*np.pi*1.3*tt)>-.2); put(sfx,A['s1'],x*np.minimum(1,tt/.3),.08)
for k in range(5): put(sfx,A['s1']+1.0+k*1.1,noise(.25,.08,6),.25)
stampS(A['s1']+.05); stampS(A['s1']+2.2); stampS(A['push']); put(sfx,A['push'],tone(500,900,.25,.12,'tri'),.12)
# garaje: carpa que sale volando + saltos
swoosh(A['s2'],.4); swoosh(A['tarp'],.6); put(sfx,A['tarp'],noise(.4,.15,20),.4)
for i in range(6): put(sfx,A['tarp']+.35+i*.22+.4,tone(120,60,.15,.06),.4)
stampS(A['s2']+.05); stampS(A['tarp']+.5)
# bóveda: soplete
swoosh(A['s3'],.4); n=int((A['s4']-A['s3']-.3)*SR); x=np.convolve(rng.standard_normal(n),np.ones(3)/3,'same'); tt=np.arange(n)/SR; x*=np.minimum(1,tt/.2)*(.8+.2*np.sin(2*np.pi*11*tt)); put(sfx,A['s3']+.3,x,.07)
for i in range(50): put(sfx,A['s3']+.4+rng.random()*(A['s4']-A['s3']-.8),noise(.03,.01,1),.22)
t=A['s3']+.2
while t<A['s4']-.3: put(sfx,t,tone(2400,2400,.02,.008,'sq'),.05); t+=.12
stampS(A['hrs'])
# plata
swoosh(A['s4'],.4)
for i in range(len(range(0,140))): put(sfx,A['s4']+.25+i*.026+.3,noise(.05,.02,8),.07)
t=A['s4']+.3
while t<A['s4']+3.7: put(sfx,t,tone(1800,1800,.025,.01,'sq'),.05); t+=.06
put(sfx,A['s4']+3.7,tone(1318,1318,.4,.25),.14); put(sfx,A['s4']+3.78,tone(2093,2093,.5,.3),.14); stampS(A['ton'])
# billetes marcados
swoosh(A['s5'],.4); n=int((A['s6']-A['s5'])*SR); put(sfx,A['s5'],np.convolve(rng.standard_normal(n),np.ones(12)/12,'same')*np.sin(np.linspace(0,np.pi,n))*.5,.12)
stampS(A['s5']+.3); bang(A['stampOut'],.8); stampS(A['stampOut']); stampS(A['vall']); [put(sfx,A['vall']+.1+i*.14,tone(f,f,.18,.1,'sq'),.07) for i,f in enumerate([392,494,587,494])]
put(sfx,A['paper'],noise(.5,.2,2),.35); stampS(A['paper'])
# implicados: sirena
swoosh(A['s6'],.4); n=int((A['s7']-A['s6'])*SR); tt=np.arange(n)/SR; f=700+250*np.sign(np.sin(2*np.pi*1.8*tt)); put(sfx,A['s6'],np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,tt/.2),.05)
# vigilante
swoosh(A['s7'],.4); stampS(A['s7']+.1); put(sfx,A['guard'],tone(392,196,.8,.4,'sq'),.08); stampS(A['guard'])
for k in range(4): put(sfx,A['s7']+.6+k*.55,tone(90,60,.08,.03),.4)
# encuesta
swoosh(A['poll'],.5); [put(sfx,A['poll']+.2+i*.25,tone(660+i*220,660+i*220,.12,.05,'tri'),.25) for i in range(2)]
# música: pulso de suspenso
b=60/96; t=0; k=0
while t<T:
    put(mus,t,tone(55,45,.35,.2),.45)
    if k%2: put(mus,t+b/2,noise(.06,.02,4),.06)
    if k%8==0: put(mus,t,hold(b*8,110,1)*np.exp(-np.arange(int(b*8*SR))/SR/3)*.05,1)
    if k%4==2: put(mus,t,tone(220,220,b*1.5,.6,'tri'),.035)
    t+=b; k+=1
mask=np.zeros(N)
for c in E['cues']:
    a,sr=sf.read(f"n_{c['k']}.wav"); a=np.interp(np.arange(int(len(a)*SR/sr))*sr/SR,np.arange(len(a)),a)
    put(voc,c['t'],a,1.2); i=int(c['t']*SR); mask[i:i+len(a)]=1
k=int(.2*SR); sm=np.convolve(mask,np.ones(k)/k,'same')
mix=voc+sfx*(1-.45*sm)+mus*(1-.55*sm)*.85
f=int(1.2*SR); mix[-f:]*=np.linspace(1,0,f); mix/=np.abs(mix).max()*1.05
sf.write('soundtrack.wav',np.stack([mix,mix],1),SR); print('ok')
