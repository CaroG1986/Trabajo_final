// Estado final: mosaico "why bother?", pausa, desvanecimiento y desbloqueo de la carpeta. Independiente del catálogo.
(function(){
const rnd=(a,b)=>a+Math.random()*(b-a),T=[],tp=["classic","bold","banner","side"];let over=false,n=0;
const after=(f,ms)=>T.push(setTimeout(f,ms));
const ad=()=>({id:"final",title:CONFIG.final.phrase,textOnly:true,template:tp[n++%tp.length]});
function split(r,k,out){if(k<=1||r.w<120||r.h<90){out.push(r);return}
 const v=r.w/r.h>1.2?true:r.h/r.w>1.2?false:Math.random()<.5,f=rnd(.35,.65),k1=Math.max(1,Math.round(k*f));
 if(v){const a=Math.round(r.w*f);split({x:r.x,y:r.y,w:a,h:r.h},k1,out);split({x:r.x+a,y:r.y,w:r.w-a,h:r.h},k-k1,out)}
 else{const a=Math.round(r.h*f);split({x:r.x,y:r.y,w:r.w,h:a},k1,out);split({x:r.x,y:r.y+a,w:r.w,h:r.h-a},k-k1,out)}}
function tile(c,host){if(over)return;Popup.create(ad(),c.w,c.h,c.x,c.y,el=>fClose(el,host),host)}
function fClose(el,host){if(over)return;const c={x:parseFloat(el.style.left),y:parseFloat(el.style.top),w:el.offsetWidth,h:el.offsetHeight},p=[];
 if(c.w>=c.h&&c.w>=90){const a=Math.floor(c.w/2);p.push({...c,w:a},{...c,x:c.x+a,w:c.w-a})}
 else if(c.h>=70){const a=Math.floor(c.h/2);p.push({...c,h:a},{...c,y:c.y+a,h:c.h-a})}else p.push(c);
 p.forEach(q=>tile(q,host))}
function run(){const host=document.createElement("div");host.id="finale";document.getElementById("screen").append(host);
 const W=host.clientWidth,H=host.clientHeight,cells=[],C=CONFIG;split({x:0,y:0,w:W,h:H},C.finaleTiles,cells);
 const d=c=>Math.hypot(c.x+c.w/2-W/2,c.y+c.h/2-H/2);cells.sort((a,b)=>d(a)-d(b));
 cells.forEach((c,i)=>after(()=>tile(c,host),i*C.finaleStaggerMs));
 after(()=>{host.style.background=C.finaleBg;Popup.clear();after(()=>dismiss(host),C.final.holdSeconds*1000)},cells.length*C.finaleStaggerMs+500)}
function dismiss(host){over=true;host.classList.add("out");host.style.transition=`opacity ${CONFIG.final.fadeMs}ms ease`;host.style.opacity=0;
 after(()=>{T.forEach(clearTimeout);T.length=0;host.remove();Popup.clear();AdManager.stop();Desktop.unlockFolder()},CONFIG.final.fadeMs+60)}
window.FinalState={run};
})();
