import numpy as np, soundfile as sf, json, subprocess
from kokoro_onnx import Kokoro
import os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
k=Kokoro(f'{ROOT}/assets/kokoro-q8.onnx',f'{ROOT}/assets/voices4.npz')
N=('pm_alex',1.0,.95); B=('em_alex',1.0,1.0); K=('em_alex',1.05,1.12); S=('ef_dora',1.0,1.1)
M=('ef_dora',1.05,1.0)
K=('em_alex',1.05,1.12)
L={
 'h0':("Sí. Fue a propósito... y funcionó.",'em_alex',0.9,0.96),
 'r0':("Ustedes votaron el modo duro... ¿me va a salir bien?",'em_alex',1.05,1.0),
 'n0':("Y justo entonces... salió Ce Te A Seis.",)+N,
 'b1':("Yo tengo el juego. Tú tienes la consola. Mi casa, esta noche.",'em_alex',0.95,0.96),
 's0':("¿Me estás invitando?",'ef_dora',1.0,1.12),
 'b2':("No. Te estoy avisando.",'em_alex',0.9,0.96),
 's1':("Ay, qué duro... Llevo la consola a las ocho.",'ef_dora',1.05,1.12),
 'b3':("Kevin, ni se le ocurra.",'em_alex',1.0,1.0),
 'n1':("Primera ducha voluntaria del mes.",)+N,
 'k0':("Quiubo, primo. Yo cargo.",)+K,
 'b4':("¿Usted cómo entró?",'em_alex',1.05,1.0),
 'm0':("Yo le abrí, mijo.",'ef_dora',1.05,1.0),
 's2':("¿Seis horas?",'ef_dora',1.0,1.12),
 'k1':("Y el cable es mío.",)+K,
 'n2':("Ce Te A Seis había salido. Pero no tanto.",)+N,
 'b5':("Esto no fue a propósito.",'em_alex',0.95,1.0),
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
