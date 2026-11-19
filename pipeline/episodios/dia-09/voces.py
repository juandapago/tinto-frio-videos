import numpy as np, soundfile as sf, json, subprocess
from kokoro_onnx import Kokoro
import os
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
k=Kokoro(f'{ROOT}/assets/kokoro-q8.onnx',f'{ROOT}/assets/voices4.npz')
N=('pm_alex',1.0,.95); K=('em_alex',1.05,1.12)
L={
 'h0':("Eché a Kevin... y se llevó el cable. Y eso no fue lo peor.",'em_alex',1.0,0.96),
 'r0':("Ustedes votaron echarlo... ¿salvo la cita sin cable?",'em_alex',1.05,1.0),
 'k0':("Me voy, primo. Pero el cable se va conmigo.",)+K,
 'b1':("¡Váyase!",'em_alex',1.0,1.0),
 'n0':("La pantalla quedó negra. Y la cita también.",)+N,
 'b2':("Tengo cero pesos, Kevin.",'em_alex',0.95,1.0),
 'b3':("Sofi está aburrida... y yo sin plan.",'em_alex',1.0,1.0),
 's0':("Brayan... la consola trae cable.",'ef_dora',1.0,1.12),
 'b4':("Eché a mi primo... por nada.",'em_alex',0.95,0.96),
 's1':("Bueno, quedan seis horas... ¿hablamos?",'ef_dora',1.05,1.12),
 'b5':("¿Hablar? ¿Sin pantalla?",'em_alex',1.05,1.0),
 'n1':("Y por primera vez en nueve días... Brayan conversó.",)+N,
 'k1':("Primo... traje pizza.",)+K,
 'b6':("Lo peor... es que huele delicioso.",'em_alex',0.95,1.0),
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
