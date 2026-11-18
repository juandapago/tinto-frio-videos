# Procedimiento diario: siguiente día de Brayan

Responder siempre en español. Todo se hace sin pedir permiso entre pasos: Juanda pidió que el ciclo completo sea automático.

## 0. Preparar
1. Clonar `juandapago/tinto-frio-videos` (si no está) y leer `pipeline/ESTADO.md`. El día nuevo es N = último día + 1.
2. Instalar dependencias si faltan: `pip install --break-system-packages kokoro-onnx soundfile numpy pillow`. Playwright y ffmpeg ya vienen en el entorno.

## 1. Votos y rendimiento del día anterior
1. **Votos:** abrir el reel del día N-1 en Instagram (cuenta tint.ofrio) con el navegador integrado de la app de escritorio, cargar todos los comentarios y contar cuántos dicen A y cuántos B (ignorar el primer comentario propio). Si se puede, sumar también los de TikTok y YouTube. Gana la más comentada; en empate, decide la más divertida para la historia y se dice en el resumen.
   - Si el navegador no está disponible o Instagram no tiene la sesión iniciada: no inventar un ganador. Avisar a Juanda (en el resumen final) y detenerse antes de producir.
2. **Rendimiento (Metricool, brandId 8213115):** con `getAnalyticsDataByMetrics` pedir para los reels de Instagram IGRE02, IGRE03, IGRE23, IGRE11, IGRE10, IGRE07, IGRE21, IGRE12, IGRE24, IGRE26, IGRE27, IGRE28, IGRE30. Comparar el último episodio con los anteriores:
   - IGRE28 (pasa los 3 s) / IGRE30 (salta antes de 3 s) → calidad del gancho.
   - IGRE27 (retención %) e IGRE24 (tiempo medio) → si se caen en la mitad.
   - Comentarios, compartidos y guardados → si la encuesta y el humor funcionan.
   Anotar en `ESTADO.md` → "Aprendizajes de rendimiento" una o dos conclusiones concretas y aplicarlas al guion nuevo.
3. **Mejor hora:** `getBestTimeToPostByNetwork` (instagram, America/Bogota) para hoy. Elegir la mejor franja que quede al menos 90 minutos en el futuro; si no hay datos, usar 19:00.

## 2. Guion
Usar las skills `episodio-brayan` y `critico-brayan` si están disponibles (si no, seguir las reglas de la serie de ESTADO.md):
1. Escribir el guion del Día N con la opción ganadora, la continuidad de ESTADO.md y las conclusiones de rendimiento.
2. Criticarlo, aplicar los fixes y repetir hasta veredicto **Alto** sin puntos [Seguro] (máximo 4 rondas).
3. La encuesta termina con "Comenta A o B. La más comentada gana."

## 3. Video
Trabajar en `pipeline/episodios/dia-NN/` copiando `ep.py`, `mix.py`, `voces.py` y `escenas.js` del último día y adaptándolos:
1. `voces.py` (Kokoro, `lang='es-419'`): Brayan `em_alex`; Kevin `em_alex` 1.05 pitch 1.12; Mamá `ef_dora` 1.05; Sofi `ef_dora` pitch 1.12; Narrador `pm_alex` 1.0 pitch 0.95. "CTA VI" se escribe "Ce Te A Seis" en la voz. El cue `b10` es "Comenta A o B. La más comentada gana."
2. `ep.py` → `ep.json` (con `day=N`, cues, tiempos de escena, barras y opciones A/B).
3. `escenas.js` con `render(t)` para el día; helpers disponibles en `pipeline/helpers` (se añaden en `tools/assemble.py`).
4. `python3 ../../tools/assemble.py escenas.js && node --check day1.js`
5. `python3 mix.py` → `ffmpeg -i soundtrack.wav -af loudnorm=I=-14:TP=-2.5:LRA=11 st_norm.wav` → `ffmpeg -i st_norm.wav -b:a 192k soundtrack.mp3`
6. `python3 ../../tools/build.py` (debe imprimir `errors []` en frames) → revisar 15–25 fotogramas con `node ../../tools/frames.js chk '[...]'`, juntarlos en hojas de contacto y mirarlos. Corregir solapamientos, caras tapadas y cosas quietas; hacer una ronda del crítico sobre los fotogramas.
7. `node ../../tools/render.js .` → `/home/claude/brayan-dia-N.mp4`. Verificar con ffprobe (1080×1920) y volumedetect (pico ≤ -1 dB).

## 4. Publicar
1. Copiar el MP4 a la raíz del repo como `dia-NN.mp4`, hacer commit (solo el MP4, `ESTADO.md` y los archivos fuente del episodio) y push a `main`.
2. `createScheduledPost` en Metricool (blogId 8213115) a la hora elegida, con media `https://raw.githubusercontent.com/juandapago/tinto-frio-videos/main/dia-NN.mp4`, providers instagram (REEL, showReelOnFeed true), tiktok (con `title`, PUBLIC_TO_EVERYONE) y youtube (type short, público, category COMEDY, madeForKids false, título).
3. Texto: descripción con gancho en la primera línea, las opciones A y B, "👇 Comenta A o B. ¡La más comentada gana y define el Día N+1!", "Día N de 30 sin redes. Ustedes deciden." y 5 hashtags (#30diassinredes #ustedesdeciden #humorcolombiano + 2 del episodio).
4. `firstCommentText`: "🗳️ ¿A o B? Comenta tu letra 👇 La que tenga más comentarios gana y define el Día N+1 😏".

## 5. Cerrar
1. Actualizar `ESTADO.md` (último episodio, encuesta abierta, barras, resumen del día, aprendizajes) y hacer push.
2. Resumen final para Juanda: ganador del día anterior y conteo de votos, 2–3 datos de rendimiento con la mejora aplicada, de qué trata el nuevo episodio, hora programada y enlace del planificador de Metricool.
