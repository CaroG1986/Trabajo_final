// Motor de partículas (Three.js). Arrays tipados reutilizados; física en CPU.
(function(){
const ss=x=>x<=0?0:x>=1?1:x*x*(3-2*x),VS=`attribute float aSize;attribute float aBright;attribute vec3 aColor;uniform float uScale;varying vec3 vC;varying float vB;
void main(){vC=aColor;vB=aBright;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=max(1.8,aSize*uScale/(-mv.z));gl_Position=projectionMatrix*mv;}`,
FS=`varying vec3 vC;varying float vB;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float a=smoothstep(.5,.0,d);gl_FragColor=vec4(vC*vB,a*vB);}`;
window.ParticleEngine=class{
 constructor(cv){const C=PCONFIG,N=this.N=C.count;this.cv=cv;
  this.r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:false,powerPreference:"high-performance"});this.r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));this.r.setClearColor(0,0);
  this.cam=new THREE.PerspectiveCamera(C.fov,1,.1,50);this.cam.position.z=C.cameraZ;this.scene=new THREE.Scene();
  const P=this.pos=new Float32Array(N*3),rp=this.rp=new Float32Array(N*3),col=new Float32Array(N*3),sz=new Float32Array(N);
  this.vel=new Float32Array(N*3);this.tgt=new Float32Array(N*3);this.seed=new Float32Array(N);this.mass=new Float32Array(N);this.det=new Float32Array(N);
  this.bb=new Float32Array(N);this.br=new Float32Array(N);const perm=this.perm=new Uint32Array(N),pal=C.palette.map(h=>new THREE.Color(h));
  for(let i=0;i<N;i++){perm[i]=i;P[i*3]=Math.random()*2-1;P[i*3+1]=Math.random()*2-1;P[i*3+2]=(Math.random()-.5)*C.depth;
   this.seed[i]=Math.random();this.mass[i]=.6+Math.random()*.8;const c=pal[(Math.random()*pal.length)|0];col.set([c.r,c.g,c.b],i*3);
   sz[i]=C.size[0]+Math.random()*(C.size[1]-C.size[0]);this.bb[i]=this.br[i]=C.brightness[0]+Math.random()*(C.brightness[1]-C.brightness[0])}
  for(let i=N-1;i>0;i--){const j=(Math.random()*(i+1))|0,t=perm[i];perm[i]=perm[j];perm[j]=t}
  const g=new THREE.BufferGeometry(),D=THREE.DynamicDrawUsage;
  g.setAttribute("position",new THREE.BufferAttribute(rp,3).setUsage(D));g.setAttribute("aColor",new THREE.BufferAttribute(col,3));
  g.setAttribute("aSize",new THREE.BufferAttribute(sz,1));g.setAttribute("aBright",new THREE.BufferAttribute(this.br,1).setUsage(D));this.g=g;
  this.mat=new THREE.ShaderMaterial({uniforms:{uScale:{value:1}},vertexShader:VS,fragmentShader:FS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  const pts=new THREE.Points(g,this.mat);pts.frustumCulled=false;this.scene.add(pts);
  this.w=this.h=0;this.shapeId=null;this.tA=0;this.pulse=0;this.fresh=true;this.R=1;this.ox=this.oy=0;this.detFrac=0;this.ex=1;this.stepMs=0;
  this.c={form:0,intensity:1,audio:1,repel:1,attract:0,swirl:0,drag:0,disturb:0}}
 resize(w,h){this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();const th=Math.tan(this.cam.fov*Math.PI/360);
  this.halfH=th*this.cam.position.z;this.halfW=this.halfH*w/h;this.mat.uniforms.uScale.value=h*this.r.getPixelRatio()/(2*th);
  if(this.fresh){for(let i=0;i<this.N;i++){this.pos[i*3]*=this.halfW;this.pos[i*3+1]*=this.halfH}this.fresh=false}this.w=w;this.h=h}
 setShape(id){const p=Shapes.get(id);if(!p)return;const t=this.tgt,pm=this.perm;for(let i=0;i<this.N;i++){const j=pm[i]*3;t[i*3]=p[j];t[i*3+1]=p[j+1];t[i*3+2]=p[j+2]}this.shapeId=id}
 tick(dt,o){const C=PCONFIG,{st,a,cur:cu,playing,ended,t,dur}=o;if(o.w!==this.w||o.h!==this.h)this.resize(o.w,o.h);
  const sc=st.scene,ready=sc.shape&&Shapes.get(sc.shape);if(ready&&this.shapeId!==sc.shape)this.setShape(sc.shape);
  const settle=Math.max(0,Math.min(1,1-(dur-t)/C.settleSeconds));let fT=0;
  if(ready){const sd=Math.max(.001,st.end-st.start),fin=Math.min(sc.formIn||4,.45*sd),rel=Math.min(sc.release||0,.3*sd); // tiempos acotados a la duración de la escena
   fT=(sc.peak??1)*ss(st.local/fin)*(rel>0?1-ss((rel-st.remaining)/rel):1)}
  const cs=sc.cursor||{},k=1-Math.exp(-dt*1.8),c=this.c,cc=C.cursor,dn=cu.down;
  c.form+=(fT-c.form)*(1-Math.exp(-dt*3));c.intensity+=((sc.intensity??1)*(1-.85*settle)-c.intensity)*k;c.audio+=((sc.audio??1)*(1-.6*settle)-c.audio)*k;
  const T={repel:(cs.repel??1)*cc.repel*(dn?.15:1),attract:((cs.attract??0)+(dn?1:0))*cc.attract,swirl:(cs.swirl??.3)*cc.swirl,drag:(cs.drag??.3)*cc.drag,disturb:(cs.disturb??1)*cc.disturb};
  const kc=1-Math.exp(-dt*8);for(const q in T)c[q]+=(T[q]-c[q])*kc; // el cursor responde rápido (clic inmediato)
  const S=C.stage,mot=ended?.15:playing?1:C.pausedMotion,off=sc.offset||S.shapeOffset;
  this.R=Math.min(this.halfW,this.halfH)*(sc.scale??S.shapeScale);this.ox=off[0]*this.halfW;this.oy=off[1]*this.halfH;
  this.tA+=dt*mot*(.6+c.intensity*.4);this.pulse=Math.max(this.pulse*Math.exp(-dt*5),Math.min(1,a.kick));
  cu.update(dt,this.halfW,this.halfH);this.cu=cu;const t0=performance.now();this.step(dt,mot,a,c);this.stepMs+=(performance.now()-t0-this.stepMs)*.1;
  this.g.attributes.position.needsUpdate=true;this.g.attributes.aBright.needsUpdate=true;this.r.render(this.scene,this.cam)}
 // mot escala solo el movimiento ambiental (flujo); la atracción a la figura usa dt real para que forme incluso en pausa.
 step(dt,mot,a,c){const C=PCONFIG,A=C.audio,K=C.physics,N=this.N,P=this.pos,rp=this.rp,V=this.vel,T=this.tgt,sd=this.seed,ms=this.mass,DT=this.det,br=this.br,bb=this.bb,t=this.tA,
  R=this.R,ox=this.ox,oy=this.oy,au=c.audio,form=c.form,cu=this.cu,on=cu.on,cx=cu.x,cy=cu.y,cvx=cu.vx,cvy=cu.vy;
  const ex=this.ex=1+(a.bass*A.bass.expand+this.pulse*A.bass.pulse)*au,wob=a.mid*A.mid.wobble*au*R,wave=a.bass*A.bass.wave*au*R,
   att=K.attract*(1+a.mid*A.mid.attractMod*au)*(1-a.level*A.level.disperse*au),fg=K.flow*c.intensity*(1+a.level*A.level.speed*au)*mot,fs=K.flowScale,
   pr=a.onset*A.treble.detach*au*dt*8*Math.max(0,1-this.detFrac/A.treble.maxFrac), // desprendimiento por agudos, con tope de fracción
   sp=a.treble*A.treble.sparkle*au,crad=C.cursor.radius*this.halfH,cr2=crad*crad,rec=dt*K.recover;let dc=0;
  for(let i=0,j=0;i<N;i++,j+=3){let x=P[j],y=P[j+1],z=P[j+2],vx=V[j],vy=V[j+1],vz=V[j+2];const s=sd[i];let d=DT[i];
   if(d>0){d-=rec;if(d<0)d=0}
   if(pr>0&&Math.random()<pr){d=1;vx+=(Math.random()-.5)*A.treble.kick*R;vy+=(Math.random()-.5)*A.treble.kick*R}
   const lock=form*(1-d),fr=1-lock*.75;
   let ax=(Math.sin(y*fs*1.7+t*.31+s*6.28)+Math.cos(z*fs*2.1-t*.23+s*3))*fg*fr,ay=(Math.sin(z*fs*1.9+t*.27+s*4)+Math.cos(x*fs*1.5-t*.29+s*2))*fg*fr,
    az=(Math.sin(x*fs*1.3+t*.19)+Math.cos(y*fs*1.8+t*.33+s*5))*fg*fr*.5;
   ax-=x*K.contain;ay-=y*K.contain;az-=z*K.contain*3;
   if(lock>.002){const x0=T[j],y0=T[j+1],tx=x0*R+ox+wob*Math.sin(t*3+s*40),ty=y0*R+oy+wob*Math.cos(t*2.7+s*30),tz=T[j+2]*R,g=att*lock/ms[i];
    ax+=(tx-x)*g;ay+=(ty-y)*g;az+=(tz-z)*g}
   if(on){const dx=x-cx,dy=y-cy,q=dx*dx+dy*dy;if(q<cr2){const dd=Math.sqrt(q)+1e-4,f=1-dd/crad,f2=f*f,nx=dx/dd,ny=dy/dd,rp_=c.repel*f2*R,at=c.attract*f2*R,sw=c.swirl*f2*R;
    ax+=nx*(rp_-at)-ny*sw+(cvx-vx)*c.drag*f2*4;ay+=ny*(rp_-at)+nx*sw+(cvy-vy)*c.drag*f2*4;if(c.disturb*f2>.12)d=Math.min(1,d+c.disturb*f2*dt*8)}}
   const dm=Math.max(0,1-K.damping*(1+lock*1.5)*dt);vx=(vx+ax*dt)*dm;vy=(vy+ay*dt)*dm;vz=(vz+az*dt)*dm;
   x+=vx*dt;y+=vy*dt;z+=vz*dt;P[j]=x;P[j+1]=y;P[j+2]=z;V[j]=vx;V[j+1]=vy;V[j+2]=vz;DT[i]=d;if(d>.5)dc++;
   br[i]=bb[i]*(1+sp*(.5+.5*Math.sin(t*9+s*60))*1.2)+d*.3+lock*.2;
   // respiración y ondas de graves aplicadas directamente a la posición dibujada (el resorte es demasiado lento para seguir un pulso)
   const e=1+(ex-1)*(.35+.65*lock),qx=x-ox,qy=y-oy;rp[j]=ox+qx*e;rp[j+1]=oy+qy*e+(wave>.001&&lock>.01?Math.sin(Math.sqrt(qx*qx+qy*qy)/R*6-t*3)*wave*.2*lock:0);rp[j+2]=z*e}
  this.detFrac=dc/N}
 stats(){const N=this.N,P=this.pos,T=this.tgt,R=this.R;let fit=0,near=0,rad=0;
  for(let i=0,j=0;i<N;i++,j+=3){const dx=P[j]-(T[j]*R+this.ox),dy=P[j+1]-(T[j+1]*R+this.oy),d=Math.sqrt(dx*dx+dy*dy)/R;fit+=d;if(d<.12)near++;rad+=Math.sqrt(this.rp[j]*this.rp[j]+this.rp[j+1]*this.rp[j+1])}
  let nc=0;const cu=this.cu;if(cu&&cu.on){const r2=Math.pow(PCONFIG.cursor.radius*this.halfH*.5,2);for(let i=0,j=0;i<N;i++,j+=3){const dx=P[j]-cu.x,dy=P[j+1]-cu.y;if(dx*dx+dy*dy<r2)nc++}}
  return{stepMs:this.stepMs,nearCursor:nc/N,shape:this.shapeId,form:this.c.form,fit:fit/N,near:near/N,rad:rad/N,pulse:this.pulse,ex:this.ex,detFrac:this.detFrac,R,halfW:this.halfW,halfH:this.halfH}}
};
})();