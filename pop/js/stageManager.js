// js/stageManager.js
// Progresión dirigida por tiempo y duplicación al cerrar. El desenlace vive en finalState.js.
(function(){
const C=CONFIG;let t0=0,bonus=0,next=0,strokes=0,run=false,dead=false,first=true,raf=0,shown={},seen=[];
const now=()=>performance.now(),real=()=>(now()-t0)/1000,eff=()=>real()+bonus;
const L=(a,b,k)=>a+(b-a)*Math.max(0,Math.min(1,k)),rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const stage=e=>e<C.saturationSeconds?1:2;
function pick(st){const p=AD_CATALOG.filter(a=>a.minStage<=st).sort((a,b)=>(shown[a.id]||0)-(shown[b.id]||0)+Math.random()-.5);
 const ad=p[0];shown[ad.id]=(shown[ad.id]||0)+1;if(!seen.includes(ad))seen.push(ad);return ad}
function make(ad,w,h,x,y){if(dead)return;const A=Popup.area();
 if(Popup.count()>=C.maxWindows){Popup.oldest().remove();w*=C.capGrow;h*=C.capGrow}
 w=Math.max(140,Math.min(w,A.width*C.maxScreenFraction));h=Math.max(100,Math.min(h,A.height*C.maxScreenFraction));
 Popup.create(ad,w,h,cl(x,0,A.width-w),cl(y,0,A.height-h),onClose)}
function area(){const A=Popup.area(),w=document.querySelector("#paint-win .canvas-wrap"),r=w&&w.offsetParent?w.getBoundingClientRect():A;
 return{x:r.left-A.left,y:r.top-A.top,w:r.width,h:r.height}}
function spawnTimed(e){const k=L(.9,1.8,(e-C.freeSeconds)/(C.endSeconds-C.freeSeconds)),ad=pick(stage(e)),b=C.sizes[ad.size]||C.sizes.medium,R=area();
 let w=b[0]*k*rnd(.85,1.25),h=b[1]*k*rnd(.85,1.25),x,y;
 if(first){first=false;w=b[0]*1.3;h=b[1]*1.3;x=R.x+R.w/2-w/2;y=R.y+R.h/2-h/2}
 else{x=R.x+Math.random()*R.w-w/2;y=R.y+Math.random()*R.h-h/2}
 make(ad,w,h,x,y)}
// Cerrar una ventana crea dos nuevas que reutilizan contenidos ya vistos.
function onClose(el){if(dead||!run)return;const x=parseFloat(el.style.left),y=parseFloat(el.style.top),w=el.offsetWidth,h=el.offsetHeight;
 for(let i=0;i<2;i++){const ad=i?el._ad:seen[Math.floor(Math.random()*seen.length)]||el._ad;
  make(ad,w*rnd(.75,1.15),h*rnd(.75,1.15),x+(i?.2:-.2)*w+rnd(-.2,.2)*w,y+rnd(-.3,.3)*h)}}
function tick2(){const e=eff();
 if(e>=C.endSeconds){run=false;FinalState.run();return}
 if(e>=C.freeSeconds&&now()>=next){for(let i=0,n=e<C.saturationSeconds?1:2;i<n;i++)try{spawnTimed(e)}catch(err){console.error("spawn",err)}
  next=now()+1000*(e<C.saturationSeconds?L(2.2,1,(e-C.freeSeconds)/(C.saturationSeconds-C.freeSeconds)):L(.9,.25,(e-C.saturationSeconds)/(C.endSeconds-C.saturationSeconds)))}
}
function tick(){if(!run){clearInterval(raf);return}try{tick2()}catch(err){console.error("AdManager",err)}}
window.AdManager={start(){if(dead)return;t0=now();bonus=0;next=0;strokes=0;first=true;run=true;raf=setInterval(tick,100)},
 stop(){dead=true;run=false;clearInterval(raf)}, // definitivo: ya no hay anuncios ni duplicaciones
 strokeStart(){},strokeEnd(){strokes++;if(run&&real()>=C.freeSeconds)bonus=Math.min(C.maxStrokeBonus,bonus+C.strokeBonusSec)},
 strokes:()=>strokes};
})();