// Formación de figuras: convierte máscaras (PNG o procedurales) en puntos objetivo normalizados (-1..1).
// Máscara PNG 512x512: blanco = partículas, negro = vacío (o usa invert:true en config). Sin PNG válido -> silueta procedural.
(function(){
const S=512,cache={},srcOf={},W="#fff";let ready=null;
const D={ // siluetas procedurales de respaldo (dibujadas en un canvas 512x512)
 flower(c){c.translate(256,200);const pet=(n,r,rx,ry,o)=>{for(let k=0;k<n;k++){c.save();c.rotate(o+k*6.2832/n);c.beginPath();c.ellipse(0,-r,rx,ry,0,0,7);c.fill();c.restore()}};
  pet(8,108,42,86,0);c.strokeStyle="#000";c.lineWidth=6;for(let k=0;k<8;k++){c.save();c.rotate((k+.5)*6.2832/8);c.beginPath();c.moveTo(0,-60);c.lineTo(0,-205);c.stroke();c.restore()}
  c.fillStyle="#000";c.beginPath();c.arc(0,0,64,0,7);c.fill();c.fillStyle=W;pet(8,46,20,38,.39);c.beginPath();c.arc(0,0,24,0,7);c.fill();
  c.fillStyle=c.strokeStyle=W;c.resetTransform();c.lineWidth=14;c.beginPath();c.moveTo(256,394);c.quadraticCurveTo(236,450,256,510);c.stroke();
  c.beginPath();c.moveTo(252,470);c.bezierCurveTo(200,430,170,450,150,420);c.bezierCurveTo(200,415,235,440,252,470);c.fill();
  c.beginPath();c.moveTo(258,440);c.bezierCurveTo(310,400,345,420,372,385);c.bezierCurveTo(325,380,285,410,258,440);c.fill()},
 person(c){const L=(w,...p)=>{c.lineWidth=w;c.beginPath();c.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)c.lineTo(p[i],p[i+1]);c.stroke()},
  poly=(...p)=>{c.beginPath();c.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)c.lineTo(p[i],p[i+1]);c.closePath();c.fill()},dot=(x,y,r)=>{c.beginPath();c.arc(x,y,r,0,7);c.fill()};
  dot(256,66,38);L(24,256,100,256,132);poly(194,136,318,136,296,296,216,296);L(26,196,146,160,232,142,312);L(26,316,146,352,232,370,312);dot(140,326,17);dot(372,326,17);
  L(42,232,290,224,396,214,486);L(42,280,290,288,396,298,486);c.beginPath();c.ellipse(204,497,30,12,-.1,0,7);c.fill();c.beginPath();c.ellipse(308,497,30,12,.1,0,7);c.fill()},
 face(c){c.beginPath();c.moveTo(120,330);c.bezierCurveTo(60,260,70,110,190,45);c.bezierCurveTo(290,0,385,50,395,150);c.bezierCurveTo(398,185,392,200,396,215);c.lineTo(440,300);
  c.bezierCurveTo(446,312,436,322,418,322);c.lineTo(398,324);c.lineTo(404,346);c.lineTo(392,356);c.lineTo(404,372);c.lineTo(392,392);c.bezierCurveTo(396,420,388,440,360,452);
  c.lineTo(330,470);c.lineTo(335,512);c.lineTo(130,512);c.lineTo(150,400);c.bezierCurveTo(125,380,125,350,120,330);c.closePath();c.fill();
  c.fillStyle=c.strokeStyle="#000";c.beginPath();c.ellipse(342,205,19,7,.15,0,7);c.fill();c.lineWidth=7;c.beginPath();c.arc(225,255,26,-1.2,1.9);c.stroke()},
 abstract(c){for(let k=0;k<70;k++){const a=k*.45,r=8+k*3.3;c.beginPath();c.arc(256+Math.cos(a)*r*.9,256+Math.sin(a)*r*.9,5+k*.28,0,7);c.fill()}},
 geometric(c){c.lineWidth=14;const P=(n,r,o)=>{c.beginPath();for(let i=0;i<=n;i++){const a=o+i*6.2832/n;c.lineTo(256+Math.cos(a)*r,256+Math.sin(a)*r)}c.stroke()};
  P(3,230,-1.5708);P(4,170,.785);P(6,115,0);c.beginPath();c.arc(256,256,40,0,7);c.fill()}
};
function blank(){const cv=document.createElement("canvas");cv.width=cv.height=S;const c=cv.getContext("2d");c.fillStyle="#000";c.fillRect(0,0,S,S);c.fillStyle=c.strokeStyle=W;c.lineCap=c.lineJoin="round";return[cv,c]}
function proc(id){if(!D[id])return null;const[cv,c]=blank();D[id](c);return cv}
// Muestrea N puntos: una fracción sobre el contorno (edgeFraction) y el resto sobre el relleno.
function sample(cv,N,inv){const d=cv.getContext("2d").getImageData(0,0,S,S).data,on=new Uint8Array(S*S),px=[],ed=[];
 for(let i=0;i<S*S;i++)on[i]=(inv?d[i*4]<128:d[i*4]>128)?1:0;
 for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){const p=y*S+x;if(!on[p])continue;px.push(p);if(!on[p-1]||!on[p+1]||!on[p-S]||!on[p+S])ed.push(p)}
 if(!px.length)return null;const ef=ed.length?PCONFIG.edgeFraction:0,o=new Float32Array(N*3);
 for(let i=0;i<N;i++){const L=Math.random()<ef?ed:px,p=L[(Math.random()*L.length)|0],x=p%S+Math.random(),y=((p/S)|0)+Math.random();
  o[i*3]=(x/S-.5)*2;o[i*3+1]=-(y/S-.5)*2;o[i*3+2]=(Math.random()-.5)*PCONFIG.depth}return o}
function loadOne(id,cfg,N){return new Promise(res=>{const fb=()=>{const cv=proc(id);cache[id]=cv?sample(cv,N):null;srcOf[id]=cache[id]?"procedural":"missing";res()};
 if(!cfg.src)return fb();const img=new Image();
 img.onload=()=>{try{const[cv,c]=blank();const k=Math.min(S/img.width,S/img.height);c.drawImage(img,(S-img.width*k)/2,(S-img.height*k)/2,img.width*k,img.height*k);
  cache[id]=sample(cv,N,cfg.invert)}catch(e){cache[id]=null} // en file:// el canvas queda "tainted": se usa la silueta procedural
  if(cache[id]){srcOf[id]="png";res()}else fb()};img.onerror=fb;img.src=cfg.src})}
window.Shapes={loadAll(N){return ready||(ready=Promise.all(Object.keys(PCONFIG.shapes).map(id=>loadOne(id,PCONFIG.shapes[id],N))))}, // promesa memoizada
 get:id=>cache[id]||null,source:id=>srcOf[id],canvas:proc};
})();