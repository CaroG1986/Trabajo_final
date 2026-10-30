// Secuencia de escenas basada en el tiempo de reproducción del video (no en temporizadores).
window.Sequence={resolve(t,dur){const S=PCONFIG.sequence,k=PCONFIG.timeMode==="fraction"?dur:1;let i=0;
 for(let j=0;j<S.length;j++)if(S[j].t*k<=t)i=j;
 const start=S[i].t*k,end=i+1<S.length?S[i+1].t*k:dur;return{scene:S[i],index:i,start,end,local:t-start,remaining:end-t}}};
