// El cursor como fuerza: posición, velocidad suavizada y estado de clic en coordenadas de mundo.
window.Cursor=class{
 constructor(el){this.x=0;this.y=0;this.nx=0;this.ny=0;this.vx=0;this.vy=0;this.on=false;this.down=false;
  el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();this.nx=(e.clientX-r.left)/r.width*2-1;this.ny=-((e.clientY-r.top)/r.height*2-1);this.on=true});
  el.addEventListener("pointerleave",()=>{this.on=false});el.addEventListener("pointerdown",()=>{this.down=true});addEventListener("pointerup",()=>{this.down=false})}
 update(dt,hw,hh){const x=this.nx*hw,y=this.ny*hh;if(dt>0){const k=1-Math.exp(-dt*10),m=6;
  this.vx+=(Math.max(-m,Math.min(m,(x-this.x)/dt))-this.vx)*k;this.vy+=(Math.max(-m,Math.min(m,(y-this.y)/dt))-this.vy)*k}this.x=x;this.y=y}
};
