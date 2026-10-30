// ===== CONFIGURACIÓN CENTRAL DE LA EXPERIENCIA DE PARTÍCULAS (carpeta AFTER) =====
window.PCONFIG={
  count:8000,                                   // número de partículas
  palette:["#ffd166","#ef476f","#06d6a0","#4cc9f0","#f8f9fa","#c77dff"],
  size:[.018,.045],                             // tamaño en unidades de mundo (min,max): ~3-6 px en un reproductor de ~450 px
  brightness:[.55,1],                           // luminosidad base (min,max)
  edgeFraction:.35,                             // fracción de partículas que se reparten sobre el contorno de la silueta (más legible)
  depth:.5, cameraZ:3, fov:50,
  stage:{videoOpacity:.9,particleOpacity:1,blend:"screen",shapeScale:.8,shapeOffset:[0,.02],controlsHeight:56}, // controlsHeight: franja inferior que deja libre el canvas para los controles del video
  timeMode:"fraction",                          // "fraction": t de la secuencia = 0..1 de la duración del video; "seconds": segundos reales
  settleSeconds:6,                              // los últimos segundos del video las partículas se calman
  pausedMotion:.2,                              // movimiento ambiental con el video en pausa (la secuencia NO avanza)
  physics:{damping:2.2,flow:.55,flowScale:1.4,attract:7,contain:.12,recover:1.2}, // recover: velocidad con que las partículas desprendidas vuelven a su sitio
  // AUDIO REAL (AnalyserNode sobre el propio video). Requiere servidor local (http://). En file:// no hay análisis y NO se simula.
  audio:{
    bands:{bass:[30,160],mid:[160,2000],treble:[2000,9000]}, // Hz
    sensitivity:{bass:1,mid:1,treble:1},        // sensibilidad por banda (se normaliza automáticamente al volumen del video)
    agcSeconds:10, agcFloor:.02, kickGain:6,
    smoothing:{level:{attack:.12,release:.5},bass:{attack:.05,release:.25},mid:{attack:.2,release:.6},treble:{attack:.03,release:.15}}, // segundos
    bass:{expand:.22,wave:.8,pulse:.12}, mid:{wobble:.04,attractMod:.6}, treble:{detach:.5,maxFrac:.15,sparkle:1,kick:.5}, level:{speed:.8,disperse:.35}
  },
  cursor:{radius:.5,repel:9,attract:8,swirl:7,drag:.8,disturb:1.2}, // radio relativo a la altura; clic mantenido = atracción
  // Siluetas: máscara PNG 512x512 blanco=partículas (invert:true si es negro sobre blanco). Si el archivo no existe o no puede leerse,
  // se usa la silueta procedural. Para AÑADIR una figura: pon el PNG en assets/particles/shapes/ y agrega una entrada aquí.
  shapes:{
    flower:{src:"assets/particles/shapes/flower.png"},
    person:{src:"assets/particles/shapes/person.png"},
    face:{src:"assets/particles/shapes/face.png"},
    abstract:{src:"assets/particles/shapes/abstract.png"},
    geometric:{src:"assets/particles/shapes/geometric.png"}
  },
  // Secuencia (según video.currentTime). Campos: t, shape (id o null), peak (0-1), formIn (s para formarse), release (s antes del fin de la
  // escena en que se dispersa), intensity, audio, cursor{repel,attract,swirl,drag,disturb}, scale, offset[x,y], videoOpacity, particleOpacity.
  // offset[x,y]: posición de la figura (x: -1 izquierda … 1 derecha, y: -1 abajo … 1 arriba; [0,0] = centro). formIn/release se acortan solos si la escena es corta. La última escena debe tener release:0.
  sequence:[
    {t:0,   shape:null,       intensity:1,   audio:.8, cursor:{repel:1,attract:.4,swirl:.4,drag:.5,disturb:0}},          // 1 Libertad
    {t:.10, shape:"flower",   scale:.7, offset:[-.5,.05], formIn:4, release:3, intensity:.8, audio:1,  cursor:{repel:.8,swirl:.3,drag:.2,disturb:1.3}}, // 2 Naturaleza
    {t:.30, shape:"person",   scale:.7, offset:[.5,-.05], formIn:4, release:3, intensity:.7, audio:.8, cursor:{repel:.8,swirl:.3,drag:.2,disturb:1}},   // 3 Humanidad
    {t:.50, shape:"abstract", scale:.65, offset:[-.35,.2], peak:.7, formIn:4, release:2, intensity:1.7, audio:1.3, cursor:{repel:.6,swirl:1,drag:.8,disturb:.6}}, // 4 Expresión
    {t:.64, shape:"geometric",scale:.65, offset:[.45,-.15], peak:.85, formIn:4, release:3, intensity:1.2, audio:1.1, cursor:{repel:1,swirl:.5,drag:.3,disturb:1}},
    {t:.78, shape:"face",     scale:.7, offset:[-.4,0], formIn:5, release:0, intensity:.6, audio:1,  cursor:{repel:.7,swirl:.3,drag:.2,disturb:.9}}    // 5 Composición final
  ],
  endAd:{phrase:"why not?",delayMs:700}         // anuncio final tras el evento "ended" real del video
};