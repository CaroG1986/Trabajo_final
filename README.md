# Simulación de escritorio con publicidad invasiva

## Ejecutar
Abre `index.html` en el navegador (doble clic). No requiere servidor ni instalación. Doble clic en el icono **Paint** para empezar.
Alternativa: `python3 -m http.server` y visita http://localhost:8000.

## Cómo funciona
`js/stageManager.js` suma puntos de progreso: 1 por segundo de dibujo activo (se detiene unos segundos después de soltar el ratón) y 2 por trazo completado. Al cruzar los umbrales se pasa de la etapa 0 (calma) a la 4 (invasión). Cerrar anuncios o limpiar el lienzo nunca baja la puntuación. mm

## Configuración (`js/config.js`)
Umbrales de etapa, pesos de tiempo/trazos, intervalos, anuncios por aparición, límite de ventanas por etapa, regla de desborde (`wait` o `replaceOldest`), escalas de tamaño y tamaños base. Para probar rápido, baja `stageThresholds` (p. ej. `[0,3,8,15,25]`).

## Añadir o cambiar anuncios (`js/stageContent.js`)
Añade un objeto al arreglo `AD_CATALOG`:
    {id:"ad-09", image:"assets/media/mi-imagen.jpg", title:"Titular", text:"Frase", template:"classic", size:"medium", minStage:2, cta:"Botón opcional"}
- Plantillas: `classic`, `side`, `banner`, `bold` (estilos en `css/winbox.css`, clases `tpl-*`).
- Tamaños: `small`, `medium`, `large`, `xl`. `minStage` es la etapa mínima (1-4).
- Reemplazar imagen: guarda un archivo con el mismo nombre en `assets/media/`. Si no existe, se muestra una imagen generada.
- Fondo: coloca `assets/wallpapers/wallpaper.jpg` (si falta, se ve un degradado).

## Versión "quimera" (actualización)
- Pantalla de entrada (`#intro`, `css/intro.css`): al pulsar START se abre Paint y arranca el reloj.
- Línea de tiempo (`js/config.js`): 0-10 s libertad; 10 s primera ventana centrada sobre el lienzo; 10-20 s aparición cada vez más frecuente; 20-30 s saturación; a los 30 s mosaico que cubre el 100 % de la pantalla. Los trazos solo adelantan el reloj (hasta `maxStrokeBonus`), nunca lo retrasan.
- Cerrar una ventana crea dos nuevas cerca de ella. En el mosaico final, cerrar una pieza la divide en dos, así la pantalla sigue cubierta.
- Rendimiento: `maxWindows` limita las ventanas simultáneas; al llegar al tope se elimina la más antigua y las nuevas crecen (`capGrow`).
- Contenido: con `textOnly:true` todos los anuncios muestran solo `why bother?`. Pon `textOnly:false` para volver a usar imagen, texto y botón del catálogo (`js/stageContent.js`).

## Anuncios editables, desenlace y video (última actualización)
- **Mensajes de los anuncios:** `js/stageContent.js` (id, title, text opcional, image opcional, cta opcional, template, size, minStage). Imágenes en `assets/media/`. Las ventanas creadas por duplicación reutilizan contenidos ya mostrados.
- **Frase del desenlace:** `CONFIG.final.phrase` en `js/config.js` (siempre `why bother?`, independiente del catálogo). Duración visible: `CONFIG.final.holdSeconds` (4); desvanecimiento: `fadeMs`.
- **Final:** `js/finalState.js` muestra el mosaico, espera, desvanece toda la publicidad, detiene definitivamente el sistema (`AdManager.stop()`) y desbloquea la carpeta. El dibujo no se toca.
- **Carpeta y video:** nombre en `CONFIG.folder.name`. Coloca tu archivo en `assets/video/ending-video.mp4` (mismo nombre) o cambia `CONFIG.video.src`. Si no existe, se muestra "Video pendiente de añadir". El video solo se reproduce al pulsar Play.

## Fondo, posición de figuras y video grande
- **Fondo de pantalla:** guarda tu imagen como `assets/wallpapers/wallpaper.jpg` o cambia `CONFIG.wallpaper` en `js/config.js` (p. ej. `"assets/wallpapers/mi-foto.png"`). Si el archivo no existe se ve el degradado azul.
- **Posición de las figuras de partículas:** en `js/particles/config.js`, cada escena de `sequence` tiene `offset:[x,y]` y `scale`.
- **Video grande:** `CONFIG.video.maximizeOnPlay:true` (en `js/config.js`) maximiza la ventana del video al pulsar Play. Pon `false` para desactivarlo.
