import numpy as np, soundfile as sf, json, subprocess, sys
from kokoro_onnx import Kokoro
A='/home/claude/tinto-frio-videos/pipeline/assets'
k=Kokoro(f'{A}/kokoro-q8.onnx',f'{A}/voices5.npz')
N=('am_adam',0.98,.9)
L={
 'n0':("Iban a robar tres mil millones de pesos... y se llevaron veinticuatro mil.",)+N,
 'n1':("Valledupar, mil novecientos noventa y cuatro. Su camión se varó camino al banco... y la gente que pasaba les ayudó a empujarlo.",)+N,
 'n2':("Atrás, escondidos, venían catorce hombres. Entraron al Banco de la República un domingo, a las seis de la mañana.",)+N,
 'n3':("Con sopletes cortaron puerta tras puerta hasta la bóveda. Veintiún horas adentro.",)+N,
 'n4':("Salieron con más de veinticuatro mil millones de pesos. Unas cuatro toneladas de billetes.",)+N,
 'n5':("Pero muchos billetes eran nuevos, y el banco tenía sus números de serie. Los sacó de circulación. Los apodaron los vallenatos... y quedaron convertidos en papel.",)+N,
 'n6':("Identificaron a veintiséis implicados. ¿Y el cerebro del plan? Según El Heraldo, terminó pobre... trabajando como vigilante.",)+N,
 'n7':("¿Qué robo cuento mañana? Comenta A o B... y sígueme para más.",)+N,
}
d={}
for key,(txt,v,sp,p) in L.items():
    a,sr=k.create(txt,voice=v,speed=sp,lang='es-419'); idx=np.where(np.abs(a)>0.01)[0]; a=a[max(0,idx[0]-300):idx[-1]+2000]
    sf.write('tmp.wav',a,sr)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i','tmp.wav','-af',f'asetrate={sr}*{p},aresample={sr},atempo={1/p}',f'n_{key}.wav'],check=True)
    d[key]=round(sf.info(f'n_{key}.wav').duration,3)
json.dump(d,open('ndur.json','w')); print(d, round(sum(d.values()),1))
