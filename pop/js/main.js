// Escritorio: reloj, aplicaciones (Paint y carpeta AFTER con video), entrada y desbloqueo de la carpeta.
(function(){
const $=id=>document.getElementById(id),desk=$("desktop");let z=20;if(CONFIG.wallpaper)desk.style.backgroundImage=`url("${CONFIG.wallpaper}"),linear-gradient(135deg,#0b3d7a,#2a8fd6 55%,#9fd8f5)`;
function clock(){const d=new Date();$("clock").textContent=d.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"})+"\n"+d.toLocaleDateString("es")}
clock();setInterval(clock,10000);
function app(win,size,dx,label,onClose,onOpen){let task=null;
 const fit=()=>{const w=Math.max(320,Math.min(size[0],desk.clientWidth-120)),h=Math.max(240,Math.min(size[1],desk.clientHeight-30));
  win.style.width=w+"px";win.style.height=h+"px";win.style.left=Math.max(0,(desk.clientWidth-w)/2+dx)+"px";win.style.top="14px"};
 const open=()=>{if(!task){win.hidden=false;fit();task=document.createElement("button");task.className="task";task.textContent=label;
   task.onclick=()=>{win.hidden=!win.hidden;task.classList.toggle("min",win.hidden);win.style.zIndex=++z};$("tasks").append(task)}
  else{win.hidden=false;task.classList.remove("min")}
  win.style.zIndex=++z;onOpen&&onOpen()};
 win.addEventListener("pointerdown",()=>win.style.zIndex=++z);
 win.querySelector(".ctl").onclick=e=>{const a=e.target.dataset.a;if(a==="min"){win.hidden=true;task.classList.add("min")}
  if(a==="max")win.classList.toggle("max");if(a==="close"){win.hidden=true;win.classList.remove("max");task&&task.remove();task=null;onClose&&onClose()}};
 const tb=win.querySelector(".titlebar");
 tb.onpointerdown=e=>{if(e.target.closest("button")||win.classList.contains("max"))return;
  const sx=e.clientX-win.offsetLeft,sy=e.clientY-win.offsetTop;tb.setPointerCapture(e.pointerId);
  tb.onpointermove=m=>{win.style.left=Math.max(0,Math.min(desk.clientWidth-80,m.clientX-sx))+"px";win.style.top=Math.max(0,Math.min(desk.clientHeight-32,m.clientY-sy))+"px"};
  tb.onpointerup=()=>{tb.onpointermove=tb.onpointerup=null}};
 return open}
const openPaint=app($("paint-win"),[820,560],40,"🎨 Paint");
$("icon-paint").ondblclick=openPaint;$("icon-paint").onkeydown=e=>{if(e.key==="Enter")openPaint()};
// Carpeta AFTER + reproductor de video local (nunca se reproduce solo)
const vid=$("vid"),vmsg=$("vmsg"),name=CONFIG.folder.name;let loaded=false,bigDone=false;
$("icon-after").querySelector(".nm").textContent=name;$("video-win").querySelector(".t").textContent="📁 "+name;
const openVideo=app($("video-win"),[680,460],0,"📁 "+name,()=>{vid.pause();VideoStage.stop();bigDone=false},()=>{VideoStage.resume();if(loaded)return;loaded=true;
 vmsg.textContent=CONFIG.video.missingText;vid.onerror=()=>{vid.hidden=true;vmsg.hidden=false};vid.src=CONFIG.video.src;VideoStage.attach(vid)});
vid.addEventListener("play",()=>{if(CONFIG.video.maximizeOnPlay&&!bigDone){bigDone=true;$("video-win").classList.add("max")}});
$("icon-after").ondblclick=openVideo;$("icon-after").onkeydown=e=>{if(e.key==="Enter")openVideo()};
window.Desktop={unlockFolder(){const i=$("icon-after");i.hidden=false;i.classList.add("reveal")}};
$("go").focus();
$("go").onclick=()=>{$("intro").classList.add("hide");$("screen").removeAttribute("inert");openPaint();setTimeout(()=>{$("intro").remove();AdManager.start()},650)};
})();
