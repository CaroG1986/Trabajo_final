// CATÁLOGO EDITABLE de anuncios iniciales. La frase del desenlace NO está aquí: vive en CONFIG.final.phrase.
// Campos: id, title (obligatorio), text (opcional), image (opcional, ruta en assets/media/), cta (botón opcional),
// template (classic|side|banner|bold), size (small|medium|large|xl), minStage (1 = fase 10-20 s, 2 = fase 20-30 s).
window.AD_CATALOG=[
 {id:"ad-01",title:"¡Felicidades! Eres el visitante 1.000.000",text:"Reclama tu premio antes de que pase.",image:"assets/media/anuncio-01.jpg",template:"classic",size:"medium",minStage:1,cta:"Reclamar"},
 {id:"ad-02",title:"Dibuja más rápido con ArtMax",text:"Hazlo en la mitad de tiempo.",image:"assets/media/anuncio-02.jpg",template:"side",size:"small",minStage:1},
 {id:"ad-03",title:"Tu personaje merece un upgrade",text:"Descarga el pack premium.",image:"assets/media/anuncio-03.jpg",template:"banner",size:"medium",minStage:1,cta:"Descargar"},
 {id:"ad-04",title:"¿Seguro que es suficiente?",template:"bold",size:"medium",minStage:2},
 {id:"ad-05",title:"OFERTA RELÁMPAGO",text:"Solo hoy. Como ayer y como mañana.",image:"assets/media/anuncio-05.jpg",template:"classic",size:"large",minStage:2,cta:"Comprar ya"},
 {id:"ad-06",title:"Ya casi terminas. O no.",text:"Un anuncio más, solo uno.",template:"side",size:"large",minStage:2}
];
