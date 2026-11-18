# Procedimiento diario: video de GTA VI

Responder siempre en español. Juanda pidió que el ciclo sea automático: no pedir permiso entre pasos.
Cuenta: Tinto Frío en Metricool (brandId `8213115`, zona `America/Bogota`): Instagram tint.ofrio, TikTok tintofrioo y YouTube.

## Reglas que no se rompen
- **Solo contenido original.** Nunca descargar, recortar ni volver a subir tráilers, gameplay, capturas, portadas, logos, música ni personajes de Rockstar ni de otros creadores. Tampoco fotos de búsquedas de imágenes. Todo se dibuja por código (fondo neón genérico, íconos, texto) con voz sintética.
- **Datos verificados.** Cada dato del video debe salir de Rockstar/Take-Two o de al menos dos medios distintos. Los rumores se dicen como rumor ("se rumorea") o no se usan. Nada inventado ni de memoria.
- Nada de handles ni datos personales en el video. Cierre fijo: "Sígueme para más".
- No repetir un tema que ya esté en `ESTADO.md`, salvo que haya una novedad real.

## 0. Preparar
1. Leer `gta/ESTADO.md`. Hoy es la fecha `YYYY-MM-DD` en Bogotá.
2. **Si ya hay un post de GTA VI programado o publicado hoy** (revisar `getScheduledPosts` de hoy y la tabla de ESTADO), no hacer nada más: terminar diciendo que hoy ya hay video.
3. Dependencias: `pip install --break-system-packages kokoro-onnx soundfile numpy pillow`.
4. Modelos de voz en `/home/claude/kokoro-models/` (si faltan):
   `curl -sSL -o kokoro-v1.0.int8.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx`
   `curl -sSL -o voices-v1.0.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin`

## 1. Tema del día
1. Buscar en la web noticias de GTA VI de las últimas 24–48 h (varias búsquedas distintas: noticias, Colombia/Latinoamérica, ventas/récords, reseñas, actualizaciones, polémicas, curiosidades del juego, GTA Online).
2. Escoger **un** tema que pase las tres preguntas: ¿le importa a casi todo el que juega o quiere jugar?, ¿hay un dato que la gente no sabe?, ¿se puede mostrar en pantalla en 30 s?
3. Revisar el rendimiento de los videos anteriores (paso 6) y preferir el tipo de tema y gancho que mejor retuvo.

## 2. Guion (25–40 s, ~2.5 palabras/s)
- **Gancho (0–2 s):** sin saludo, situación reconocible o dato fuerte.
- **Promesa (2–5 s):** pregunta o "el último dato…" que solo se responde al final.
- **Desarrollo:** máximo 3 pasos, micro-gancho cada ~8 s.
- **Revelación:** el dato más sorprendente.
- **Loop:** "Sígueme para más" y volver visualmente al gancho.
- Escribir cada frase dos veces: texto para la voz (fonético) y subtítulo. En la voz: "GTA VI" → "Ge te a seis", "Xbox" → "Equis box", "PC" → "pe ce", números en palabras.
- Preparar caption (gancho + intriga, sin revelar el último dato), 5 hashtags (#gtavi #gta6 + 3 del tema) y un primer comentario con pregunta.

## 3. Video
1. Copiar la carpeta del último video (`gta/videos/<fecha anterior>/`) a `gta/videos/YYYY-MM-DD/`.
2. `tts.py`: cambiar `LINES` (voz, subtítulo, pausa). Voz `em_alex`, `speed=1.12`, `lang="es"`. Correr: genera `voz.wav` y `segs.json`.
3. `make_video.py`: reescribir las escenas para el tema nuevo, una por frase o bloque. Reutilizar los helpers (`background`, `dim`, `title`, `chip`, `stamp_sprite`, `text_sprite`, `paste_c`, `pop`, `shake`, `caption`, `flash_alpha`). Estilo fijo: fondo synthwave con grilla que se mueve, títulos arriba (y 200–400), elementos en x 120–960, subtítulos centrados en y≈1440, algo que se mueva cada 2–3 s, un color por idea (verde = bueno/gratis, rojo = problema, amarillo = cifras).
4. `mix.py`: ajustar los eventos de efectos a los tiempos nuevos.
5. Previews: `python3 make_video.py preview 1.0,3.0,... sheet.png` (9–12 instantes) y **mirarlos**. Corregir texto cortado, solapamientos y escenas quietas.
6. `python3 mix.py && python3 make_video.py render` → `video.mp4`. Sacar 9 fotogramas del MP4 final con ffmpeg, armar la cuadrícula y revisarla. Verificar duración con ffprobe (±1 s del total de `segs.json`) y que el pico de audio sea ≤ -0.5 dB.

## 4. Publicar
1. Copiar `video.mp4` a la raíz del repo como `gta-YYYY-MM-DD.mp4`. Hacer commit solo de ese MP4, los `.py` y `segs.json` de la carpeta del día, y `gta/ESTADO.md`. Push a `main`.
2. Verificar que `https://raw.githubusercontent.com/juandapago/tinto-frio-videos/main/gta-YYYY-MM-DD.mp4` responde con el mismo tamaño del archivo local.
3. Hora: `getBestTimeToPostByNetwork` (instagram) para hoy. Escoger la franja con mayor valor entre las 10:00 y las 13:00 que quede al menos 90 min en el futuro. No ponerla a menos de 2 h de otro post ya programado ese día. Si nada sirve, 12:00.
4. `createScheduledPost` (blogId 8213115) con:
   - providers instagram, tiktok, youtube
   - `instagramData`: type REEL, showReelOnFeed true
   - `tiktokData`: privacyOption PUBLIC_TO_EVERYONE, title corto
   - `youtubeData`: type short, privacy public, category GAMING, madeForKids false, título, 5 tags
   - `text` (caption + hashtags) y `firstCommentText`
5. Confirmar con `getScheduledPosts` que quedó PENDING en las tres redes.

## 5. Cerrar
1. Agregar la fila del día a la tabla de `ESTADO.md` (fecha, tema, gancho, duración, hora, id del post) y push.
2. Resumen corto para Juanda: tema y datos clave con sus fuentes, hora programada, enlace del planificador de Metricool y el aprendizaje de rendimiento aplicado.
3. Si algo falla (GitHub, Metricool, datos sin verificar): no publicar a medias. Decirle a Juanda exactamente qué falló.

## 6. Rendimiento (antes de escoger tema)
`getAnalyticsDataByMetrics` para reels de Instagram (IGRE02, IGRE03, IGRE23, IGRE11, IGRE10, IGRE07, IGRE21, IGRE12, IGRE24, IGRE27, IGRE28, IGRE30) de los últimos 14 días. Mirar solo los videos de GTA (los de Brayan son otra serie):
- IGRE28/IGRE30 → calidad del gancho.
- IGRE27/IGRE24 → si se caen en la mitad.
- Compartidos, guardados y comentarios → qué temas mueven a la gente.
Anotar una conclusión concreta en `ESTADO.md` → "Aprendizajes".
