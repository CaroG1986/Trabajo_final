// Integra video + partículas + audio + cursor. La única referencia temporal es video.currentTime.
window.VideoStage=(function(){
let vid,wrap,cv,eng,au,cu,note,hud,raf=0,last=0,inited=false,ended=false,endTimer=0,vOp=1,pOp=0;
const debug=/[?&]debug/.test(location.search);
function attach(v){if(inited||!window.THREE||!window.PCONFIG)return;inited=true;vid=v;wrap=v.parentElement;Shapes.loadAll(PCONFIG.count); // precarga de máscaras
 cv=document.createElement("canvas");cv.className="pcv";cv.style.opacity=0;cv.style.mixBlendMode=PCONFIG.stage.blend;cv.style.height=`calc(100% - ${PCONFIG.stage.controlsHeight}px)`;wrap.append(cv);
 const reset=()=>{ended=false;clearTimeout(endTimer);EndAd.hide()};
 v.addEventListener("play",()=>{reset();start()});
 v.addEventListener("seeking",reset);v.addEventListener("seeked",resume);
 v.addEventListener("ended",()=>{ended=true;clearTimeout(endTimer);endTimer=setTimeout(()=>{if(vid.ended)EndAd.show()},PCONFIG.endAd.delayMs)})}
function start(){if(!eng){eng=new ParticleEngine(cv);cu=new Cursor(cv);au=new AudioAnalysis(vid)}au.init();au.resume();
 if(au.status==="unavailable"&&!note){note=document.createElement("div");note.className="pnote";note.textContent="Sin análisis de audio: abre el proyecto con un servidor local (ver README).";wrap.append(note)}
 if(debug&&!hud){hud=document.createElement("pre");hud.className="phud";wrap.append(hud)}resume()}
function resume(){if(inited&&eng&&!raf){last=performance.now();raf=requestAnimationFrame(frame)}}
function stop(){cancelAnimationFrame(raf);raf=0;clearTimeout(endTimer)}
function frame(now){raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;const w=cv.clientWidth,h=cv.clientHeight;if(!wrap.offsetParent||!w||!h)return;
 const playing=!vid.paused&&!vid.ended,dur=vid.duration||60,t=vid.currentTime,st=Sequence.resolve(t,dur),S=PCONFIG.stage,sc=st.scene,k=1-Math.exp(-dt*2);
 eng.tick(dt,{st,a:au.update(dt,playing),cur:cu,playing,ended,t,dur,w,h});
 vOp+=((sc.videoOpacity??S.videoOpacity)-vOp)*k;pOp+=((sc.particleOpacity??S.particleOpacity)-pOp)*k;vid.style.opacity=vOp;cv.style.opacity=pOp;
 if(hud)hud.textContent=JSON.stringify(info(),(n,v)=>typeof v==="number"?+v.toFixed(2):v)}
function info(){const a=au?au.s:{},r=au?au.raw:{};return{t:vid.currentTime,playing:!vid.paused,scene:Sequence.resolve(vid.currentTime,vid.duration||60).index,loop:!!raf,
 audio:au?{status:au.status,ctx:au.state,level:a.level,bass:a.bass,mid:a.mid,treble:a.treble,rawBass:r.bass,rawMid:r.mid,rawTreble:r.treble}:null,engine:eng?eng.stats():null,
 cursor:cu?{on:cu.on,x:cu.x,y:cu.y,down:cu.down}:null}}
return{attach,stop,resume,info}})();