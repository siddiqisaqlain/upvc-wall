/* Sound effects, synthesised with Web Audio (no audio files).
   door()  — uPVC front door: lever handle, latch, gasket unsealing, the leaf swinging, then the walk-in
   move()  — camera glide: dir +1 = moving in (rising air), -1 = pulling back (falling air)
   pin()   — a thumbtack going into the cork when a topic appears, with a thread pulled tight
   tick()  — very soft tap when the pointer passes over a card
   M toggles sound; the choice is remembered. Browsers only allow audio after a click or key press,
   so sound starts with the click on the door. */
const SFX=(()=>{
  let ac=null,out=null,noise=null,muted=false,lastPin=0,lastTick=0;
  try{muted=localStorage.getItem('wall-mute')==='1'}catch(e){}
  function init(){
    if(ac){if(ac.state==='suspended')ac.resume();return true}
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;
    ac=new C();
    const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(ac.destination);
    out=ac.createGain();out.gain.value=muted?0:.8;out.connect(comp);
    noise=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=noise.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    return true}
  const ok=()=>ac&&ac.state==='running'&&!muted;
  /* a burst of noise through a filter, with an attack/decay envelope; f may be [from,to] to sweep */
  function burst(t,dur,{type='bandpass',f=1000,q=1,vol=.5,att=.005}={}){
    const s=ac.createBufferSource();s.buffer=noise;s.loop=true;
    const fl=ac.createBiquadFilter();fl.type=type;fl.Q.value=q;
    const [f0,f1]=Array.isArray(f)?f:[f,f];fl.frequency.setValueAtTime(f0,t);
    if(f1!==f0)fl.frequency.exponentialRampToValueAtTime(f1,t+dur);
    const g=ac.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);
    g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    s.connect(fl).connect(g).connect(out);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
  /* a short pitched knock (body of a click/thud) */
  function knock(t,f,dur,vol,type='sine'){
    const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.55,t+dur);
    const g=ac.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    o.connect(g).connect(out);o.start(t);o.stop(t+dur+.02)}
  /* air moving: noise whose band and level rise and fall over dur */
  function air(t,dur,f0,fpk,f1,vol,q=.8){
    const s=ac.createBufferSource();s.buffer=noise;s.loop=true;
    const fl=ac.createBiquadFilter();fl.type='bandpass';fl.Q.value=q;
    fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(fpk,t+dur*.45);fl.frequency.exponentialRampToValueAtTime(f1,t+dur);
    const g=ac.createGain();g.gain.setValueAtTime(.0008,t);g.gain.exponentialRampToValueAtTime(vol,t+dur*.4);g.gain.exponentialRampToValueAtTime(.0008,t+dur);
    s.connect(fl).connect(g).connect(out);s.start(t,Math.random()*1.5);s.stop(t+dur+.05)}
  return{
    init,
    get muted(){return muted},
    toggle(){muted=!muted;try{localStorage.setItem('wall-mute',muted?'1':'0')}catch(e){}
      if(init())out.gain.setTargetAtTime(muted?0:.8,ac.currentTime,.03);
      if(!muted)setTimeout(()=>this.tick(true),60);return muted},
    door(){if(!init()||muted)return;const t=ac.currentTime+.03;
      /* lever handle pressed down: spring + metal click */
      burst(t,.05,{f:3200,q:4,vol:.35});knock(t,420,.06,.25,'triangle');
      /* latch bolt withdraws */
      burst(t+.11,.04,{f:5200,q:6,vol:.3});knock(t+.11,900,.04,.15,'square');
      /* gasket lets go — the soft suck/pop of a sealed uPVC door */
      burst(t+.22,.16,{type:'lowpass',f:[700,180],q:2,vol:.55,att:.01});knock(t+.22,95,.18,.45);
      /* leaf swings open: a long, low draught of air with a faint hinge creak */
      air(t+.25,1.1,250,900,300,.22,.9);
      const o=ac.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(310,t+.3);
      o.frequency.linearRampToValueAtTime(360,t+.6);o.frequency.linearRampToValueAtTime(290,t+1);
      const bf=ac.createBiquadFilter();bf.type='bandpass';bf.frequency.value=1300;bf.Q.value=12;
      const g=ac.createGain();g.gain.setValueAtTime(.0008,t+.3);g.gain.exponentialRampToValueAtTime(.05,t+.45);g.gain.exponentialRampToValueAtTime(.0008,t+1.05);
      o.connect(bf).connect(g).connect(out);o.start(t+.3);o.stop(t+1.1);
      /* the door handle released, springing back */
      burst(t+.55,.04,{f:2600,q:5,vol:.18});
      /* walking in through the doorway: a long rush of air as the camera moves to the wall */
      air(t+1.15,1.9,220,1300,260,.3,.6);
      /* two soft footsteps on the threshold */
      [1.35,1.85].forEach((d,i)=>{burst(t+d,.09,{type:'lowpass',f:[500,150],q:1,vol:.28-i*.06,att:.004});knock(t+d,70,.1,.3-i*.08)})},
    move(dir=1,dur=1.25){if(!ok())return;const t=ac.currentTime+.01;
      if(dir>0)air(t,dur,350,1700,700,.16);else air(t,dur,1500,700,220,.14)},
    pin(thread){if(!ok())return;const now=ac.currentTime;if(now-lastPin<.12)return;lastPin=now;const t=now+.02;
      /* tack point pierces the cork, then the head seats with a dull thud */
      burst(t,.025,{f:4200,q:3,vol:.28});knock(t+.012,190,.07,.32,'triangle');
      burst(t+.012,.06,{type:'lowpass',f:900,q:1,vol:.18});
      /* the red thread drawn tight from the hero card */
      if(thread)burst(t+.09,.22,{type:'highpass',f:[1800,5200],q:.7,vol:.07,att:.06})},
    tick(force){if(!force&&!ok())return;if(!ac||muted)return;const now=ac.currentTime;if(!force&&now-lastTick<.09)return;lastTick=now;
      burst(now+.005,.018,{f:6500,q:5,vol:.07})}
  }})();
/* the first click or key anywhere unlocks audio (needed when the door is skipped) */
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>SFX.init(),{capture:true,once:true}));
