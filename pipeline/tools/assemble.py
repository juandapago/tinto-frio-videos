# Une: base de personajes (d4n/day1.js sin render) + helpers de días previos + escenas del día
import sys,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def grab(path,name):
    s=open(path,encoding='utf-8').read(); i=s.index('function '+name+'('); j=s.index(') {',i)+2; d=0
    for k in range(j,len(s)):
        if s[k]=='{': d+=1
        elif s[k]=='}':
            d-=1
            if d==0: return s[i:k+1]+'\n'
H=[(f'{ROOT}/helpers/day8.js','gameCase'),(f'{ROOT}/helpers/day8.js','consola'),(f'{ROOT}/helpers/day8.js','notifCard'),(f'{ROOT}/helpers/day5.js','bigScreen'),(f'{ROOT}/helpers/day5.js','hearts'),(f'{ROOT}/helpers/day5.js','emo'),(f'{ROOT}/helpers/day5.js','sofiAngry'),(f'{ROOT}/helpers/day6.js','cone'),(f'{ROOT}/helpers/day7.js','heladeria'),(f'{ROOT}/helpers/day7.js','coneEmpty'),(f'{ROOT}/helpers/day7.js','salaHome'),(f'{ROOT}/helpers/day7.js','sofaFront'),(f'{ROOT}/helpers/day8a.js','shades'),(f'{ROOT}/helpers/day8a.js','meltCone')]
helpers=''.join(grab(p,n) for p,n in H)
main=open(sys.argv[1],encoding='utf-8').read()
d=open(f'{ROOT}/base/day1_base.js',encoding='utf-8').read(); i=d.index('function render(t) {')
# votación por comentario (desde el Día 8): "Comenta A o B"
for x,y in [("heartLike(370, 70, .9 + .08 * Math.sin(t * 6 + i));","emo('💬', 370, 66, .9 + .08 * Math.sin(t * 6 + i), 80);"),
            ("outlined('DALE LIKE AL COMENTARIO', 540, y - 40, C.yellow, 14)","outlined('COMENTA  A  o  B', 540, y - 40, C.yellow, 14)"),
            ("outlined('DE TU OPCIÓN', 540, y + 34, C.cream, 12)","outlined('¡LA MÁS COMENTADA GANA!', 540, y + 34, C.cream, 12)"),
            ("heartLike(540, y + 140, 1.3 + .12 * Math.sin(t * 8))","emo('💬', 540, y + 140, 1.3 + .12 * Math.sin(t * 8), 110)")]:
    p0=d.index('function pollAB('); p1=d.index('\nconst FAM',p0); seg=d[p0:p1]; assert seg.count(x)==1,x; d=d[:p0]+seg.replace(x,y)+d[p1:]
i=d.index('function render(t) {')
open('day1.js','w',encoding='utf-8').write(d[:i]+helpers+main)
