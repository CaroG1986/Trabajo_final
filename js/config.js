// Toda la configuración editable vive aquí (tiempos en segundos).
window.CONFIG={
  freeSeconds:10,        // fase de libertad: sin anuncios
  saturationSeconds:20,  // a partir de aquí: fase de saturación
  endSeconds:30,         // desenlace: pantalla 100 % cubierta
  strokeBonusSec:0.4,    // cada trazo (tras la fase libre) adelanta el reloj interno esta cantidad
  maxStrokeBonus:4,      // tope del adelanto por trazos (nunca retrasa el final)
  maxWindows:45,         // ventanas individuales simultáneas; al superarlo se elimina la más antigua y las nuevas crecen
  capGrow:1.2,           // multiplicador de tamaño de ventanas nuevas cuando se está en el límite
  maxScreenFraction:0.7, // tope de tamaño de una ventana respecto a la pantalla
  sizes:{small:[220,170],medium:[300,230],large:[420,320],xl:[540,400]},
  textOnly:false,        // true: fuerza solo el titular en todos los anuncios. false: usa todo el catálogo (imagen, texto, botón)
  windowTitle:"",        // texto de la barra de título de los anuncios
  finaleTiles:30,        // piezas del mosaico final
  finaleStaggerMs:35,    // retardo entre piezas del mosaico (de centro hacia afuera)
  finaleBg:"#1a2a8c",
  showHud:false,
    wallpaper:"assets/wallpapers/wallpaper.jpg", // imagen de fondo (si no existe, se ve el degradado azul)
  // Estado final (independiente del catálogo de anuncios)
  final:{phrase:"why bother?",holdSeconds:4,fadeMs:900}, // frase reservada, segundos que permanece, duración del desvanecimiento
  folder:{name:"AFTER"},                                  // carpeta que aparece al terminar la publicidad
  video:{src:"assets/video/ending-video.mp4",missingText:"Video pendiente de añadir",maximizeOnPlay:true} // maximizeOnPlay: al dar Play la ventana pasa a pantalla grande
};
