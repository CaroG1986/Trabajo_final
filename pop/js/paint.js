// Lógica de dibujo. No depende de los anuncios salvo por avisar de trazos.
(function(){
const cv=document.getElementById("canvas"),ctx=cv.getContext("2d");
ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);ctx.lineCap=ctx.lineJoin="round";
const $=id=>document.getElementById(id);let tool="brush",down=false,lx,ly;
const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
const set=t=>{tool=t;$("p-brush").classList.toggle("on",t==="brush");$("p-eraser").classList.toggle("on",t==="eraser")};
$("p-brush").onclick=()=>set("brush");$("p-eraser").onclick=()=>set("eraser");
$("p-clear").onclick=()=>{ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height)};
$("p-save").onclick=()=>cv.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="dibujo.png";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
function dot(x,y){ctx.fillStyle=ctx.strokeStyle=tool==="eraser"?"#fff":$("p-color").value;ctx.lineWidth=+$("p-size").value;
 ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y}
cv.addEventListener("pointerdown",e=>{if(e.button!==0)return;cv.setPointerCapture(e.pointerId);down=true;[lx,ly]=pos(e);dot(lx+.01,ly);AdManager.strokeStart()});
cv.addEventListener("pointermove",e=>{if(down)dot(...pos(e))});
const end=()=>{if(!down)return;down=false;AdManager.strokeEnd();$("st-strokes").textContent="Trazos: "+AdManager.strokes()};
cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);
})();
