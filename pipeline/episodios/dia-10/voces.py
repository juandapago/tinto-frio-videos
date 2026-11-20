import numpy as np, soundfile as sf, json, subprocess
from kokoro_onnx import Kokoro
import os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
k=Kokoro(f'{ROOT}/assets/kokoro-q8.onnx',f'{ROOT}/assets/voices4.npz')
N=('pm_alex',1.0,.95); K=('em_alex',1.05,1.12)
L={
 'h0':("Me escapé con Sofi... con cero pesos en el bolsillo.",'em_alex',1.0,0.96),
 'r0':("Ustedes votaron escaparnos... ¿pero a dónde lleva uno a alguien sin plata?",'em_alex',1.08,1.0),
 'k0':("¡Primo! ¿Y la pizza?",)+K,
 's0':("Ese primo está muy cansón.",'ef_dora',1.0,1.12),
 'b1':("Dos helados, por favor...",'em_alex',1.0,1.0),
 'b2':("Sofi... se me quedó la billetera. Y la plata. Y todo.",'em_alex',1.0,0.96),
 's1':("Tranquilo. Hoy pago yo... otra vez.",'ef_dora',1.0,1.12),
 'b3':("Segunda cita... y otra vez paga ella.",'em_alex',0.95,0.96),
 'n0':("Mientras tanto, en la casa de Brayan...",)+N,
 'k1':("Ya bajó, primo. Le creé un personaje: Brayan Pelón.",)+K,
 's2':("Brayan... la próxima invitas tú, ¿sí?",'ef_dora',1.0,1.12),
 'b4':("Claro... ¿alguien sabe cómo se consigue plata en un día?",'em_alex',1.05,1.0),
 'b10':("Comenta A o B. La más comentada gana.",'em_alex',1.05,1.0),
}
d={}
for key,(txt,v,sp,p) in L.items():
    a,sr=k.create(txt,voice=v,speed=sp,lang='es-419'); idx=np.where(np.abs(a)>0.01)[0]; a=a[max(0,idx[0]-300):idx[-1]+2000]
    sf.write('tmp.wav',a,sr)
    if p!=1.0: subprocess.run(['ffmpeg','-loglevel','error','-y','-i','tmp.wav','-af',f'asetrate={sr}*{p},aresample={sr},atempo={1/p}',f'n_{key}.wav'],check=True)
    else: sf.write(f'n_{key}.wav',a,sr)
    d[key]=round(sf.info(f'n_{key}.wav').duration,3)
json.dump(d,open('ndur.json','w')); print(d, round(sum(d.values()),1))
