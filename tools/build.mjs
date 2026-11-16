// Assembles index.html from tools/parts/* + the wall scene below.
// usage: node tools/build.mjs   (run from the project folder)
import fs from 'fs';
const P = f => fs.readFileSync(new URL('./parts/' + f, import.meta.url), 'utf8');
const baseCss = P('style.css'), clusters = P('clusters.html'), credits = P('credits.html'), diagrams = P('diagrams.js');

const css = `
/* ================= WALL SCENE ================= */
html,body{background:#8f8c86}
#world{background:none!important;box-shadow:none!important;width:7600px;height:3600px}
#roomphoto{position:absolute;left:-13000px;top:-6000px;width:28000px;height:16000px;z-index:-3;pointer-events:none;user-select:none}
.scene{position:absolute;pointer-events:none}

/* the board */
/* gallery frame: thin black moulding, wide white mat, glass, lit from an LED bar above */
#board{position:absolute;left:-720px;top:-720px;width:9040px;height:5040px;z-index:-1;border-radius:6px;pointer-events:auto;
  background:linear-gradient(#2c2c2c,#121212 2%,#0c0c0c 50%,#050505);
  box-shadow:0 70px 90px -20px rgba(15,6,2,.62),0 160px 220px -40px rgba(15,6,2,.45),-30px 30px 60px rgba(15,6,2,.25),30px 30px 60px rgba(15,6,2,.25),
    inset 0 6px 0 rgba(255,255,255,.18),inset 0 0 0 3px #000,inset 10px 0 14px rgba(255,255,255,.05),inset -10px 0 14px rgba(255,255,255,.04)}
#board::before{content:"";position:absolute;inset:110px;border-radius:2px;background:#000;box-shadow:0 0 0 10px #1b1b1b}
#board .face{position:absolute;inset:124px;overflow:hidden;
  background:radial-gradient(ellipse 62% 30% at 50% 0%,#fffdf8,rgba(255,253,248,0) 100%),
    linear-gradient(#fbfaf6,#f1f0ec 38%,#e4e3de 78%,#d9d8d3);
  box-shadow:inset 0 46px 40px -20px rgba(0,0,0,.45),inset 30px 0 30px -18px rgba(0,0,0,.28),inset -30px 0 30px -18px rgba(0,0,0,.28),inset 0 -20px 26px -14px rgba(0,0,0,.22)}
#board .face::before{content:"";position:absolute;inset:0;opacity:.5;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .48 0 0 0 0 .44 0 0 0 .16 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23p)'/%3E%3C/svg%3E");background-size:300px 300px}
#board .brand{display:none}
#wallglow{left:-3200px;top:-3000px;width:14000px;height:9000px;z-index:-2;mix-blend-mode:screen;
  background:radial-gradient(ellipse 4600px 2000px at 7000px 2000px,rgba(255,238,210,.34),rgba(255,238,210,.10) 45%,rgba(255,236,205,0) 72%)}
#glass{position:absolute;left:-550px;top:-550px;width:8700px;height:4700px;z-index:5;pointer-events:none;transition:opacity .8s;
  background:linear-gradient(rgba(255,250,240,.05),rgba(255,250,240,0) 25%,rgba(30,22,14,0) 55%,rgba(30,22,14,.07)),
    linear-gradient(168deg,rgba(255,255,255,0) 62%,rgba(255,255,255,.13) 72%,rgba(255,255,255,.04) 80%,rgba(255,255,255,0) 88%),
    linear-gradient(118deg,rgba(255,255,255,0) 8%,rgba(255,255,255,.05) 14%,rgba(255,255,255,0) 22%)}
body.zoomed #glass{opacity:0}
#lamp{left:200px;top:-1500px;width:7200px;height:2200px;z-index:1}

/* zones (hidden topics) */
.zone{position:absolute;z-index:4;cursor:pointer;transition:opacity .6s}
.zone svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.zone rect{fill:rgba(255,255,255,0);stroke:#2b3f73;stroke-width:9;stroke-dasharray:46 26;stroke-linecap:round;opacity:.5;transition:opacity .3s,fill .3s}
.zone:hover rect{opacity:.95;fill:rgba(255,236,150,.12)}
.zone .zt{position:absolute;left:0;right:0;top:50%;transform:translateY(-55%);text-align:center;font-family:'Ink Free','Segoe Print',var(--hand);color:#2b3f73}
.zone .zt b{display:block;font-size:240px;line-height:1;color:#b3121b;opacity:.85}
.zone .zt span{display:block;font-size:150px;line-height:1.1;font-weight:700}
.zone .zt em{display:block;font-size:64px;font-style:normal;opacity:.55;margin-top:18px}
.zone.big .zt span{font-size:250px;letter-spacing:.02em}
.zone.big .zt b{font-size:110px;color:#2b3f73}
.zone.gone{opacity:0;pointer-events:none}

/* cards appear one by one */
.cluster{pointer-events:none}
.cluster .item{opacity:0;transform:translateY(-60px) rotate(calc(var(--r,0deg) + 5deg)) scale(1.08);
  transition:opacity .45s ease var(--d,0s),transform .75s cubic-bezier(.2,1.5,.45,1) var(--d,0s),box-shadow .3s;
  box-shadow:2px 10px 18px rgba(40,40,60,.22),0 1px 3px rgba(0,0,0,.15)}
.cluster.shown{pointer-events:auto}
.cluster.shown .item{opacity:1;transform:rotate(var(--r,0deg))}
.cluster.shown .item:hover{box-shadow:4px 18px 30px rgba(40,40,60,.3)}
#strings path{fill:none!important;filter:none!important;stroke-linecap:round;transition:stroke-dashoffset 1.1s ease-in-out var(--d,0s)!important}
#strings .thread path{stroke-dashoffset:var(--len)}
#strings .thread.on path{stroke-dashoffset:0}
#strings .st{stroke:#a5141c!important}
#strings .sh{stroke:rgba(40,20,10,.22)!important}
#strings .thick path{stroke-width:3.4!important}
#strings .thin path{stroke-width:2.3!important}
#strings .thin .st{stroke:#7d1016!important}
body.still #strings path,body.still #pins .pin{transition:none!important}
#pins .pin{opacity:0;transform:translateY(-14px);transition:opacity .3s ease var(--d,0s),transform .45s cubic-bezier(.2,1.6,.4,1) var(--d,0s)}
#pins .pin.on{opacity:1;transform:none}
.mpl .rod{animation:rod 5s ease-in-out infinite!important}.mpl .hdl{animation:hdl 5s ease-in-out infinite!important}

#hint{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:6;background:rgba(31,42,68,.82);color:#fff;
  font:600 15px var(--body);letter-spacing:.04em;padding:9px 18px;border-radius:30px;transition:opacity .5s;pointer-events:none}
#vignette{position:fixed;inset:0;pointer-events:none;z-index:4;background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(50,30,10,.28))}
#hud{background:linear-gradient(transparent,rgba(25,18,10,.75))}
`;

// ---------- scene svgs ----------
// LED picture-light bar (world x = 200 + svg x, world y = -1500 + svg y); frame top edge is at svg y 780
const lamp = `<svg class="scene" id="lamp" viewBox="0 0 7200 2200" overflow="visible">
  <defs>
    <linearGradient id="ledbar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".12" stop-color="#1a1a1a"/><stop offset=".8" stop-color="#0d0d0d"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <linearGradient id="stem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a0a"/><stop offset=".35" stop-color="#2a2a2a"/><stop offset=".6" stop-color="#151515"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <filter id="lb" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="30"/></filter>
    <filter id="ls" x="-10%" y="-100%" width="120%" height="400%"><feGaussianBlur stdDeviation="45"/></filter>
  </defs>
  <rect x="-480" y="520" width="8160" height="120" rx="40" fill="rgba(10,4,0,.55)" filter="url(#ls)"/>
  <rect x="3440" y="470" width="320" height="320" fill="url(#stem)"/>
  <rect x="3420" y="760" width="360" height="30" fill="#0b0b0b"/>
  <rect x="-500" y="300" width="8200" height="180" rx="14" fill="url(#ledbar)"/>
  <rect x="-500" y="302" width="8200" height="8" rx="4" fill="rgba(255,255,255,.18)"/>
  <rect x="-500" y="400" width="8200" height="10" fill="#000" opacity=".6"/>
  <rect x="-430" y="470" width="8060" height="60" rx="30" fill="#fff1d6" filter="url(#lb)" opacity=".8"/>
  <rect x="-460" y="470" width="8160" height="30" rx="12" fill="#fffaf0"/>
  <rect x="-380" y="476" width="8000" height="14" rx="7" fill="#ffffff"/>
</svg>`;

const js = `
/* ================= WALL + BOARD LOGIC ================= */
const world=document.getElementById('world'),vp=document.getElementById('viewport'),hint=document.getElementById('hint');
const clusters=[...document.querySelectorAll('.cluster')].sort((a,b)=>a.dataset.step-b.dataset.step);
const WALL={x:-12950,y:-5950,w:27900,h:15900}, BOARD={x:-760,y:-1050,w:9120,h:5560};
let phase='wall', zoomedOn=null, lockUntil=0;
const svg=document.getElementById('strings'),pinsvg=document.getElementById('pins');
const NSs='http://www.w3.org/2000/svg';
function mk(tag,a,p){const e=document.createElementNS(NSs,tag);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e}
function itemBox(it){const c=it.parentElement;return{x:c.offsetLeft+it.offsetLeft,y:c.offsetTop+it.offsetTop,w:it.offsetWidth,h:it.offsetHeight}}
function clusterBox(c){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;c.querySelectorAll('.item').forEach(it=>{const b=itemBox(it);x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.w);y2=Math.max(y2,b.y+b.h)});return{x:x1,y:y1,w:x2-x1,h:y2-y1}}
function fit(b,pad=60,cover){const vw=vp.clientWidth,vh=vp.clientHeight-46;const s=Math[cover?'max':'min'](vw/(b.w+pad*2),vh/(b.h+pad*2));
  world.style.transform=\`translate(\${vw/2-(b.x+b.w/2)*s}px,\${vh/2-(b.y+b.h/2)*s}px) scale(\${s})\`;lockUntil=Date.now()+1300}
function setHint(t){hint.textContent=t;hint.style.opacity=t?1:0}
function setPhase(p,target){phase=p;zoomedOn=target||null;document.body.classList.toggle('inboard',p!=='wall');document.body.classList.toggle('zoomed',p==='zone'||p==='item');
  const n=clusters.filter(c=>c.classList.contains('shown')).length;
  document.getElementById('ht').textContent=p==='wall'?'The wall':p==='board'?'The board':(target&&target.dataset?target.dataset.name:'')||'';
  document.getElementById('hc').textContent=\`\${n} / \${clusters.length} revealed\`;
  document.getElementById('bar').style.width=(n/clusters.length*100)+'%';
  setHint(p==='wall'?'hover over the board to begin':p==='board'?(n<clusters.length?'hover over a topic to reveal it · click to zoom in':'all evidence on the board · click any card'):'click a card to read it · → next · Esc back to the board');}

/* zones */
const zones=new Map();
clusters.forEach(c=>{
  const b=clusterBox(c),pad=30;const z=document.createElement('div');z.className='zone'+(c.dataset.step==='1'?' big':'');
  Object.assign(z.style,{left:(b.x-pad)+'px',top:(b.y-pad)+'px',width:(b.w+pad*2)+'px',height:(b.h+pad*2)+'px'});
  const [no,...rest]=c.dataset.name.split(' · ');const title=rest.length?rest.join(' · '):no;
  z.innerHTML='<svg><rect x="0" y="0" width="100%" height="100%" rx="40"/></svg><div class="zt">'+
    (c.dataset.step==='1'?'<b>case file no. 09</b><span>uPVC WINDOWS<br>&amp; DOORS</span>':'<b>'+(rest.length?no:'✓')+'</b><span>'+title+'</span><em>hover to reveal</em>')+'</div>';
  world.appendChild(z);zones.set(c,z);
  z.addEventListener('mouseenter',()=>{if(phase==='wall'){enterBoard();return}if(Date.now()<lockUntil)return;reveal(c)});
  z.addEventListener('click',e=>{e.stopPropagation();if(phase==='wall'){enterBoard();return}reveal(c);zoomZone(c)});
  [...c.querySelectorAll('.item')].forEach((it,i)=>it.style.setProperty('--d',(i*0.22)+'s'));
});

/* marker arrows + magnets */
const arrows=new Map();
function buildMarks(){
  svg.innerHTML='';pinsvg.innerHTML='';
  const title=document.getElementById('title');
  const pinPos=it=>{const b=itemBox(it);return[b.x+b.w/2,b.y+16]};
  const thread=(c,A,B,cls,delay)=>{const[p1,p2]=[pinPos(A),pinPos(B)];const d=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);
    const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2+d*0.07;const dd='M'+p1[0]+','+p1[1]+' Q'+mx+','+my+' '+p2[0]+','+p2[1];
    const g=mk('g',{class:'thread '+cls},svg);g.style.setProperty('--d',delay+'s');
    mk('path',{d:dd,class:'sh',transform:'translate(3 7)'},g);const p=mk('path',{d:dd,class:'st'},g);
    const len=p.getTotalLength();g.querySelectorAll('path').forEach(q=>{q.style.strokeDasharray=len;q.style.setProperty('--len',len)});
    (c._threads=c._threads||[]).push(g);};
  clusters.forEach(c=>{const items=[...c.querySelectorAll('.item')];const step=c.dataset.step;
    items.forEach((it,i)=>it.style.setProperty('--d',(i*0.22)+'s'));
    if(step==='1'){items.filter(i=>i!==title).forEach((it,i)=>thread(c,title,it,'thin',0.4+i*0.22));}
    else{const head=c.querySelector('.head')||items[0];thread(c,title,head,'thick',0);
      items.filter(i=>i!==head).forEach(it=>thread(c,head,it,'thin',parseFloat(it.style.getPropertyValue('--d'))+0.25));}
    const cols=['#d62828','#f4a261','#2a9d8f','#e9c46a','#457b9d','#ffffff'];
    items.forEach((it,i)=>{const[x,y]=pinPos(it);const g=mk('g',{class:'pin'},pinsvg);g.style.setProperty('--d',(i*0.22+0.2)+'s');
      const col=cols[(i*2+ +step)%cols.length];
      mk('circle',{cx:x+3,cy:y+5,r:11,fill:'rgba(0,0,0,.35)'},g);mk('circle',{cx:x,cy:y,r:11,fill:col,stroke:'rgba(0,0,0,.35)'},g);
      mk('circle',{cx:x-3.5,cy:y-3.5,r:3.5,fill:'rgba(255,255,255,.75)'},g);
      (c._pins=c._pins||[]).push(g);});
  });
}
function reveal(c){if(c.classList.contains('shown'))return;c.classList.add('shown');zones.get(c).classList.add('gone');
  (c._pins||[]).forEach(p=>p.classList.add('on'));(c._threads||[]).forEach(t=>t.classList.add('on'));
  const s1=clusters[0];if(c!==s1&&!s1.classList.contains('shown'))reveal(s1);
  setPhase(phase,zoomedOn);}
function enterBoard(){fit(BOARD,20);setPhase('board');setTimeout(()=>reveal(clusters[0]),900)}
function toWall(){fit(WALL,0,1);setPhase('wall')}
function zoomZone(c){reveal(c);fit(clusterBox(c),70);setPhase('zone',c)}
function zoomItem(it){fit(itemBox(it),40);setPhase('item',it)}

document.getElementById('board').addEventListener('mouseenter',()=>{if(phase==='wall')enterBoard()});
document.querySelectorAll('.cluster .item').forEach(it=>it.addEventListener('click',e=>{e.stopPropagation();
  if(phase==='item'&&zoomedOn===it){zoomZone(it.parentElement);return}zoomItem(it)}));
vp.addEventListener('click',()=>{if(phase==='zone'||phase==='item')back();else if(phase==='wall')enterBoard()});
function back(){if(phase==='item')zoomZone(zoomedOn.parentElement);else if(phase==='zone'){fit(BOARD,20);setPhase('board')}else if(phase==='board')toWall()}
function next(){if(phase==='wall'){enterBoard();return}
  const cur=phase==='zone'?zoomedOn:phase==='item'?zoomedOn.parentElement:null;
  const nxt=clusters.find(c=>!c.classList.contains('shown')&&c.dataset.step!=='1')||(cur?clusters[clusters.indexOf(cur)+1]:null);
  if(nxt)zoomZone(nxt);else{fit(BOARD,20);setPhase('board')}}
document.addEventListener('keydown',e=>{
  const cr=document.getElementById('credits');if(cr.classList.contains('on')){if(['Escape','c','C'].includes(e.key))cr.classList.remove('on');return}
  if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();next()}
  else if(['ArrowLeft','PageUp','Backspace','Escape'].includes(e.key)){e.preventDefault();back()}
  else if(e.key==='w'||e.key==='W'||e.key==='Home')toWall();
  else if(e.key==='b'||e.key==='B'||e.key==='o'||e.key==='O'){fit(BOARD,20);setPhase('board')}
  else if(e.key==='a'||e.key==='A'){clusters.forEach(reveal);fit(BOARD,20);setPhase('board')}
  else if(e.key==='r'||e.key==='R')location.reload();
  else if(e.key==='c'||e.key==='C')cr.classList.add('on');
  else if(e.key==='h'||e.key==='H')document.body.classList.toggle('clean');
  else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}});
document.getElementById('next').onclick=e=>{e.stopPropagation();next()};
document.getElementById('prev').onclick=e=>{e.stopPropagation();back()};
document.getElementById('cbtn').onclick=e=>{e.stopPropagation();document.getElementById('credits').classList.add('on')};
window.addEventListener('resize',()=>{if(phase==='wall')fit(WALL,0,1);else if(phase==='board')fit(BOARD,20);else if(phase==='zone')fit(clusterBox(zoomedOn),70);else fit(itemBox(zoomedOn),40)});
window.addEventListener('load',()=>{buildMarks();const q=new URLSearchParams(location.search);
  if(q.has('still'))document.body.classList.add('still');
  const v=q.get('view');
  if(v==='board'){fit(BOARD,20);setPhase('board');reveal(clusters[0])}
  else if(v==='all'){clusters.forEach(reveal);fit(BOARD,20);setPhase('board')}
  else if(v&&v.startsWith('zone')){zoomZone(clusters[+v.slice(4)-1])}
  else toWall();});
`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>uPVC Case Wall</title>
<style>
${baseCss}
${css}
</style>
</head>
<body>
<div id="bar"></div>
<div id="viewport">
<div id="world">
<svg width="0" height="0" style="position:absolute">
  <defs>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#d9d9d9"/><line x1="0" y1="0" x2="0" y2="8" stroke="#666" stroke-width="2"/></pattern>
    <pattern id="brick" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#f1d9c4"/><line x1="0" y1="0" x2="0" y2="16" stroke="#b07a55" stroke-width="2"/></pattern>
    <pattern id="foam" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#ffe08a"/><circle cx="3" cy="3" r="1.6" fill="#e0b740"/><circle cx="8" cy="7" r="1.2" fill="#e0b740"/></pattern>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#b3121b"/></marker>
    <marker id="arrb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f6fb5"/></marker>
    <marker id="arrk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#1f2a44"/></marker>
    <marker id="mk" viewBox="0 0 20 20" refX="4" refY="10" markerWidth="5" markerHeight="5" orient="auto"><path d="M2,2 L16,10 L2,18" fill="none" stroke="#2b3f73" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></marker>
    <filter id="rough" filterUnits="userSpaceOnUse" x="-3000" y="-3000" width="14000" height="10000"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter>
  </defs>
</svg>
<img class="scene" id="roomphoto" src="room/room.jpg" alt="">
<div class="scene" id="wallglow"></div>
<div id="board"><div class="face"></div></div>
${lamp}
<svg id="strings" width="7600" height="3600"></svg>

${clusters}
<svg id="pins" width="7600" height="3600"></svg>
<div id="glass"></div>
</div>
</div>
<div id="vignette"></div>
<div id="hint"></div>
<div id="hud">
  <button id="prev" title="Back (← / Esc)">◀</button>
  <span class="t" id="ht">—</span><span id="hc"></span>
  <button id="next" title="Next topic (→ / Space)">▶</button>
  <span class="k">→ next topic · ← back · W wall · B board · A reveal all · C credits · F fullscreen · H hide bar</span>
  <button id="cbtn">Credits</button>
</div>

${credits}
<script>
${diagrams}
${js}
</script>
</body>
</html>
`;
// ---- scene bake page: only the room, fixed camera ----
const S={x:-13000,y:-6000,w:28000,h:16000,k:0.25};
const wallVer = (await import('crypto')).createHash('md5').update(fs.readFileSync(new URL('../img/wall.jpg', import.meta.url))).digest('hex').slice(0,8);
const bake = html.replace('</style>',`
#world{transform:translate(${-S.x*S.k}px,${-S.y*S.k}px) scale(${S.k})!important;transition:none!important}
.cluster,.zone,#hud,#hint,#vignette,#bar,#strings,#pins,#credits{display:none!important}
</style>`).replace(/<script>[\s\S]*<\/script>/,'');
fs.writeFileSync(new URL('./scene.html', import.meta.url), bake);
// ---- light page: the room is one baked image ----
const light = html
  .replace('</style>',`
#world::before{display:none!important}
html,body{background:#8f8c86}
#board{background:transparent!important;box-shadow:none!important}
#board::before{display:none!important}
#board .face,#board .brand,.scene,#label{display:none!important}
#sceneimg{position:absolute;left:${S.x}px;top:${S.y}px;width:${S.w}px;height:${S.h}px;z-index:-2;pointer-events:none;user-select:none}
</style>`)
  .replace('<div id="board">',`<img id="sceneimg" src="img/wall.jpg?v=${wallVer}" alt="" draggable="false"><div id="board">`);
fs.writeFileSync(new URL('../index.html', import.meta.url), light);
console.log('built index.html', html.length, 'bytes');
