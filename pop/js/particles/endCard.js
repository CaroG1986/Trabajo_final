// Anuncio final "why not?": una sola ventana, sin duplicación al cerrarse.
window.EndAd={
 show(){if(document.querySelector(".ad.why-not"))return;const A=Popup.area(),w=Math.min(460,A.width*.8),h=Math.min(300,A.height*.6);
  const el=Popup.create({id:"why-not",title:PCONFIG.endAd.phrase,textOnly:true,template:"bold"},w,h,(A.width-w)/2,(A.height-h)/2,null);el.classList.add("why-not")},
 hide(){document.querySelectorAll(".ad.why-not").forEach(e=>e.remove())}};