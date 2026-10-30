// Análisis REAL del audio del video (Web Audio API + AnalyserNode). Sin simulaciones: si no hay análisis, los valores son 0.
window.AudioAnalysis=class{
 constructor(v){this.v=v;this.status="idle";this.s={level:0,bass:0,mid:0,treble:0};this.ref={bass:.05,mid:.05,treble:.05};
  this.raw={bass:0,mid:0,treble:0};this.pb=0;this.ts=0}
 get state(){return this.ctx?this.ctx.state:"none"}
 init(){if(this.status!=="idle")return;
  if(location.protocol==="file:"){this.status="unavailable";console.warn("Análisis de audio no disponible en file://. Abre el proyecto con un servidor local (ver README).");return}
  try{ // createMediaElementSource solo puede llamarse UNA vez por elemento: se guarda en el propio elemento
   const st=this.v._pa||(this.v._pa=(()=>{const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC(),src=ctx.createMediaElementSource(this.v),an=ctx.createAnalyser();
    an.fftSize=2048;an.smoothingTimeConstant=.5;src.connect(an);an.connect(ctx.destination);return{ctx,an}})());
   this.ctx=st.ctx;this.an=st.an;this.buf=new Uint8Array(this.an.frequencyBinCount);this.status="ok"}
  catch(e){this.status="unavailable";console.error("AudioAnalysis",e)}}
 resume(){if(this.ctx&&this.ctx.state!=="running")this.ctx.resume().catch(()=>{})}
 read(){const d=this.buf,bw=this.ctx.sampleRate/this.an.fftSize,B=PCONFIG.audio.bands;this.an.getByteFrequencyData(d);
  const avg=([a,b])=>{const i0=Math.max(1,Math.round(a/bw)),i1=Math.min(d.length-1,Math.max(i0,Math.round(b/bw)));let s=0;for(let i=i0;i<=i1;i++)s+=d[i];return s/((i1-i0+1)*255)};
  this.raw.bass=avg(B.bass);this.raw.mid=avg(B.mid);this.raw.treble=avg(B.treble)}
 update(dt,playing){const A=PCONFIG.audio,R=this.raw,n={bass:0,mid:0,treble:0};
  if(this.status==="ok"&&playing&&this.ctx.state==="running"){this.read();
   for(const k in n){this.ref[k]=Math.max(R[k],this.ref[k]*Math.exp(-dt/A.agcSeconds),A.agcFloor);n[k]=Math.min(1,R[k]/this.ref[k]*A.sensitivity[k])}} // normalización automática al volumen del video
  else{R.bass=R.mid=R.treble=0}
  n.level=n.bass*.4+n.mid*.4+n.treble*.2;
  for(const k of["level","bass","mid","treble"]){const m=A.smoothing[k],tau=n[k]>this.s[k]?m.attack:m.release;this.s[k]+=(n[k]-this.s[k])*(1-Math.exp(-dt/tau))}
  const kick=Math.max(0,n.bass-this.pb)*A.kickGain;this.pb=n.bass;
  this.ts+=(n.treble-this.ts)*(1-Math.exp(-dt/.4));const onset=Math.max(0,n.treble-this.ts); // ataque de agudos
  return{level:this.s.level,bass:this.s.bass,mid:this.s.mid,treble:this.s.treble,kick,onset,status:this.status}}
};