// Creación, arrastre y cierre de ventanas publicitarias.
(function(){
const layer=()=>document.getElementById("popup-layer");let z=10;
function fallback(ad){const h=[...ad.id].reduce((a,c)=>a*31+c.charCodeAt(0),7)%360;
 const s=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="hsl(${h},70%,55%)"/><circle cx="300" cy="90" r="70" fill="hsl(${(h+40)%360},80%,70%)"/><text x="20" y="270" font-size="28" font-family="sans-serif" fill="#fff">${ad.id}</text></svg>`;
 return "data:image/svg+xml,"+encodeURIComponent(s)}
function create(ad,w,h,x,y,onClose,parent){const host=parent||layer();
 const only=CONFIG.textOnly||ad.textOnly,hasImg=!only&&ad.image;const el=document.createElement("div");el._ad=ad;el.className="ad tpl-"+(ad.template||"classic")+(only?" textonly":hasImg?"":" noimg");
 el.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${++z}`;
 const head=document.createElement("div");head.className="titlebar";
 head.innerHTML='<span class="t"></span><span class="ctl"><button class="x" aria-label="Cerrar anuncio">✕</button></span>';
 head.querySelector(".t").textContent=CONFIG.windowTitle;
 const body=document.createElement("div");body.className="body";
 const img=document.createElement("img");img.alt="";if(hasImg)img.src=ad.image;img.onerror=()=>{img.onerror=null;img.src=fallback(ad)};
 const copy=document.createElement("div");copy.className="copy";
 const t=document.createElement("h3");t.textContent=ad.title;copy.append(t);
 if(ad.text&&!only){const p=document.createElement("p");p.textContent=ad.text;copy.append(p)}
 if(ad.cta&&!only){const b=document.createElement("button");b.className="cta";b.textContent=ad.cta;copy.append(b)}
 if(hasImg)body.append(img,copy);else body.append(copy);el.append(head,body);host.append(el);
 const close=()=>{onClose&&onClose(el);el.remove()};
 head.querySelector(".x").onclick=close;
 el.addEventListener("pointerdown",()=>el.style.zIndex=++z);
 head.addEventListener("pointerdown",e=>{if(e.target.closest("button")||parent)return;
  const r=el.getBoundingClientRect(),sx=e.clientX-r.left,sy=e.clientY-r.top,P=host.getBoundingClientRect();
  head.setPointerCapture(e.pointerId);
  head.onpointermove=m=>{el.style.left=Math.max(0,Math.min(P.width-60,m.clientX-P.left-sx))+"px";el.style.top=Math.max(0,Math.min(P.height-30,m.clientY-P.top-sy))+"px"};
  head.onpointerup=()=>{head.onpointermove=head.onpointerup=null}});
 return el}
window.Popup={create,count:()=>layer().children.length,oldest:()=>layer().firstElementChild,clear:()=>{layer().innerHTML=""},area:()=>layer().getBoundingClientRect()};
})();
