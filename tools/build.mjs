// Assembles index.html from tools/parts/* + the wall scene below.
// usage: node tools/build.mjs   (run from the project folder)
import fs from 'fs';
const P = f => fs.readFileSync(new URL('./parts/' + f, import.meta.url), 'utf8');
const baseCss = P('style.css'), clusters = P('clusters.html'), credits = P('credits.html'), diagrams = P('diagrams.js');

const css = `
/* ================= WALL SCENE ================= */
html,body{background:#cfc5b6}
#world{background:none!important;box-shadow:none!important;width:7600px;height:3600px}
#world::before{content:"";position:absolute;left:-7000px;top:-6000px;width:22000px;height:16000px;z-index:-3;
  background-color:#d9cdbb;
  background-image:
    radial-gradient(ellipse 60% 45% at 52% 38%, rgba(255,250,240,.55), rgba(255,250,240,0) 70%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='900'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.0045' numOctaves='4' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .47 0 0 0 0 .38 0 0 0 .28 0'/%3E%3C/filter%3E%3Crect width='900' height='900' filter='url(%23w)'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .34 0 0 0 0 .28 0 0 0 .22 0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size:auto,2400px 2400px,520px 520px}
.scene{position:absolute;pointer-events:none}
#floorold{display:none;
  background:
    linear-gradient(rgba(40,22,8,.55),rgba(40,22,8,0) 260px),
    repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 4px,transparent 4px 520px),
    repeating-linear-gradient(90deg,#b98a5c 0 260px,#a97a4e 260px 520px,#c39466 520px 780px,#ad7f52 780px 1040px);}
#floorold::after{content:"";position:absolute;inset:0;opacity:.35;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='120'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.004 .09' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .25 0 0 0 0 .13 0 0 0 0 .05 0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='400' height='120' filter='url(%23f)'/%3E%3C/svg%3E");background-size:1600px 480px}
#skirting{left:-7000px;top:4400px;width:22000px;height:170px;z-index:-2;background:linear-gradient(#f4efe7,#e6dfd3 70%,#cfc6b8);box-shadow:0 -6px 18px rgba(80,60,30,.12)}

/* the board */
#board{position:absolute;left:-230px;top:-230px;width:8060px;height:4060px;z-index:-1;border-radius:14px;
  background:linear-gradient(135deg,#d9dde1,#f7f8f9 18%,#b9bfc6 40%,#eef0f2 62%,#aab1b8 85%,#e4e7ea);
  box-shadow:0 90px 160px rgba(60,40,20,.34),0 24px 40px rgba(60,40,20,.28);padding:60px;pointer-events:auto}
#board .face{position:absolute;inset:60px;border-radius:4px;background:#fdfdfc;overflow:hidden;
  box-shadow:inset 0 0 0 2px rgba(0,0,0,.06), inset 0 8px 30px rgba(0,0,0,.05)}
#board .face::before{content:"";position:absolute;inset:0;
  background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.9) 42%,rgba(255,255,255,0) 52%),
  radial-gradient(ellipse 900px 300px at 20% 70%,rgba(120,130,150,.06),transparent 70%),
  radial-gradient(ellipse 700px 260px at 75% 25%,rgba(120,130,150,.05),transparent 70%),
  radial-gradient(ellipse 500px 200px at 60% 85%,rgba(160,60,60,.035),transparent 70%)}
#board .brand{position:absolute;right:120px;bottom:16px;font:600 22px var(--body);color:#8b939b;letter-spacing:.25em}
#tray{left:1400px;top:3826px;width:4800px;height:110px;z-index:-1;border-radius:0 0 30px 30px;
  background:linear-gradient(#c3c9cf,#eef0f2 30%,#a7aeb5);box-shadow:0 30px 40px rgba(60,40,20,.25)}
#tray i{position:absolute;top:8px;height:44px;border-radius:22px;box-shadow:0 6px 8px rgba(0,0,0,.25)}
#lamp{left:2600px;top:-760px;width:2400px;height:600px;z-index:1}
#cone{left:-1400px;top:-400px;width:10400px;height:3600px;z-index:2;mix-blend-mode:soft-light;transition:opacity 1s;
  background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(255,236,190,.95),rgba(255,236,190,0) 70%)}
#gobo{left:-5200px;top:-2600px;width:5600px;height:7600px;z-index:2;transform:skewX(-22deg) rotate(3deg);
  filter:blur(34px);mix-blend-mode:screen;transition:opacity 1.2s;opacity:.55}
#gobo div{position:absolute;background:rgba(255,232,190,.75)}
#plant{left:8150px;top:1650px;width:1500px;height:3150px;z-index:1}
#basket{left:-2050px;top:2950px;width:1100px;height:1750px;z-index:1}
#label{position:absolute;left:8230px;top:250px;width:1050px;background:#faf7f1;padding:60px 60px 54px;z-index:1;
  box-shadow:0 22px 40px rgba(60,40,20,.25);font-family:var(--type);pointer-events:none}
#label h4{font-size:30px;letter-spacing:.3em;color:#9a3b2b;margin:0 0 26px}
#label h5{font:700 64px/1.05 var(--type);margin:0 0 26px;color:#1f2a44}
#label p{font:34px/1.4 var(--hand);color:#444;margin:0 0 14px}
#label .hint{margin-top:34px;font:600 30px var(--body);color:#9a3b2b;letter-spacing:.06em}
body.inboard #gobo{opacity:.45} body.inboard #cone{opacity:.5}
body.zoomed #gobo, body.zoomed #cone{opacity:0}

/* zones (hidden topics) */
.zone{position:absolute;z-index:4;cursor:pointer;transition:opacity .6s}
.zone svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.zone rect{fill:rgba(255,255,255,0);stroke:#2b3f73;stroke-width:9;stroke-dasharray:46 26;stroke-linecap:round;opacity:.5;filter:url(#rough);transition:opacity .3s,fill .3s}
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
#strings path{stroke:#2b3f73!important;stroke-width:10!important;opacity:.75;filter:url(#rough)!important;transition:stroke-dashoffset 1.2s ease-in-out!important}
#strings path.hidden{stroke-dashoffset:var(--len)!important}
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
const lamp = `<svg class="scene" id="lamp" viewBox="0 0 2400 600">
  <defs><linearGradient id="brass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d38a"/><stop offset=".45" stop-color="#b8892f"/><stop offset="1" stop-color="#6e4c14"/></linearGradient></defs>
  <rect x="1150" y="420" width="100" height="160" rx="12" fill="url(#brass)"/>
  <path d="M1200 430 C1200 300 1200 240 1200 200" stroke="#8a6420" stroke-width="34" fill="none"/>
  <rect x="200" y="110" width="2000" height="130" rx="65" fill="url(#brass)"/>
  <rect x="230" y="210" width="1940" height="20" rx="10" fill="#fff6d8" opacity=".9"/>
  <ellipse cx="1200" cy="600" rx="140" ry="18" fill="rgba(0,0,0,.15)"/></svg>`;

let leaves = '';
const L = [[-38,1500,'#2f5d3a'],[-22,1850,'#3b6e45'],[-8,2150,'#2d5a37'],[6,2050,'#41784c'],[18,1700,'#335f3d'],[30,1450,'#3d7148'],[-50,1100,'#356240'],[42,1150,'#2c5636']];
L.forEach(([a, h, c]) => {
  const w = 120;
  leaves += `<g transform="translate(750 2450) rotate(${a})"><path d="M${-w/2} 0 C${-w} ${-h*.45} ${-w*.25} ${-h*.85} 0 ${-h} C${w*.25} ${-h*.85} ${w} ${-h*.45} ${w/2} 0 Z" fill="${c}"/>
   <path d="M${-w/2+10} -10 C${-w*.85} ${-h*.45} ${-w*.2} ${-h*.84} 0 ${-h+10}" stroke="#c9b65a" stroke-width="10" fill="none" opacity=".8"/>
   <path d="M0 -40 V${-h*.9}" stroke="rgba(255,255,255,.08)" stroke-width="30"/>
   ${[...Array(6)].map((_, i) => `<path d="M${-w*.4} ${-h*(.12+i*.13)} q${w*.4} -40 ${w*.8} 0" stroke="rgba(10,30,15,.35)" stroke-width="12" fill="none"/>`).join('')}</g>`;
});
const plant = `<svg class="scene" id="plant" viewBox="0 0 1500 3150">
  <ellipse cx="750" cy="3100" rx="560" ry="50" fill="rgba(40,20,5,.35)"/>
  ${leaves}
  <path d="M330 2380 H1170 L1090 3080 H410 Z" fill="#efe9df"/><path d="M330 2380 H1170 L1150 2540 H350 Z" fill="#e2dacd"/>
  <path d="M410 3080 H1090 L1100 3000 H400 Z" fill="#d8cfc1"/><path d="M900 2400 L1150 2420 L1080 3060 L960 3070 Z" fill="rgba(0,0,0,.07)"/></svg>`;
const basket = `<svg class="scene" id="basket" viewBox="0 0 1100 1750">
  <defs><pattern id="weave" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#c49a5f"/><path d="M0 15 H60 M0 45 H60" stroke="#a87c43" stroke-width="12"/><path d="M15 0 V30 M45 30 V60" stroke="#dcb77d" stroke-width="10"/></pattern></defs>
  <ellipse cx="550" cy="1720" rx="470" ry="36" fill="rgba(40,20,5,.35)"/>
  <g><rect x="380" y="60" width="110" height="1300" rx="55" fill="#f4f1ea" transform="rotate(-12 435 700)"/><ellipse cx="300" cy="80" rx="55" ry="22" fill="#d9d2c4" transform="rotate(-12 435 700)"/></g>
  <g><rect x="520" y="0" width="120" height="1350" rx="60" fill="#dfe8f1" transform="rotate(6 580 700)"/></g>
  <g><rect x="640" y="160" width="100" height="1200" rx="50" fill="#f6e7c8" transform="rotate(16 690 760)"/></g>
  <g><rect x="450" y="200" width="70" height="1150" rx="35" fill="#2b3f73" transform="rotate(-3 485 760)"/></g>
  <path d="M180 1000 H920 L860 1720 H240 Z" fill="url(#weave)"/><rect x="160" y="980" width="780" height="60" rx="30" fill="#a87c43"/></svg>`;
let planks='';const VP=10800;const cols=['#b48557','#a67a4d','#bf8f60','#aa7d50','#b88a5a','#9f7347'];
for(let i=-70;i<70;i++){const t1=VP+i*95,t2=VP+(i+1)*95,b1=VP+i*420,b2=VP+(i+1)*420;planks+=`<polygon points="${t1},0 ${t2},0 ${b2},1700 ${b1},1700" fill="${cols[(i*7+100)%cols.length]}" stroke="rgba(60,35,15,.45)" stroke-width="3"/>`;}
for(let r=0;r<9;r++){const y=Math.round(1700*Math.pow(r/9,1.6));planks+=`<line x1="0" y1="${y}" x2="22000" y2="${y}" stroke="rgba(60,35,15,.0)" />`}
const floor=`<svg class="scene" id="floor" viewBox="0 0 22000 1700" preserveAspectRatio="none" style="left:-7000px;top:4560px;width:22000px;height:1700px;z-index:-2">
<defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2210" stop-opacity=".55"/><stop offset=".35" stop-color="#3a2210" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity=".06"/></linearGradient>
<radialGradient id="sheen" cx=".3" cy=".25" r=".35"><stop offset="0" stop-color="#ffe9c6" stop-opacity=".45"/><stop offset="1" stop-color="#ffe9c6" stop-opacity="0"/></radialGradient>
<filter id="grain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".002 .06" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .1 0 0 0 0 .03 0 0 0 .45 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
${planks}<rect width="22000" height="1700" filter="url(#grain)" fill="#000"/><rect width="22000" height="1700" fill="url(#fl)"/><rect width="22000" height="1700" fill="url(#sheen)"/></svg>`;
const gobo = `<div class="scene" id="gobo">
  <div style="left:0;top:0;width:2650px;height:3600px"></div><div style="left:2950px;top:0;width:2650px;height:3600px"></div>
  <div style="left:0;top:3900px;width:2650px;height:3700px"></div><div style="left:2950px;top:3900px;width:2650px;height:3700px"></div></div>`;
const tray = `<div class="scene" id="tray"><i style="left:700px;width:520px;background:linear-gradient(#e14b4b,#9e1b1b)"></i><i style="left:1300px;width:520px;background:linear-gradient(#3d5bb0,#1f2f66)"></i><i style="left:1900px;width:520px;background:linear-gradient(#333,#000)"></i><i style="left:3200px;width:700px;height:70px;top:-14px;border-radius:12px;background:linear-gradient(#3a3a3a 0 60%,#d8d1c4 60%)"></i></div>`;
const label = `<div id="label"><h4>CASE FILE · NO. 09</h4><h5>uPVC Windows &amp; Doors</h5>
  <p>Profiles, glass, hardware, opening types and installation — an investigation in ten parts.</p>
  <p>Building Materials &amp; Construction</p><div class="hint">→ hover the board to begin</div></div>`;

const js = `
/* ================= WALL + BOARD LOGIC ================= */
const world=document.getElementById('world'),vp=document.getElementById('viewport'),hint=document.getElementById('hint');
const clusters=[...document.querySelectorAll('.cluster')].sort((a,b)=>a.dataset.step-b.dataset.step);
const WALL={x:-2350,y:-1300,w:11900,h:6600}, BOARD={x:-260,y:-260,w:8120,h:4120};
let phase='wall', zoomedOn=null, lockUntil=0;
const svg=document.getElementById('strings'),pinsvg=document.getElementById('pins');
const NSs='http://www.w3.org/2000/svg';
function mk(tag,a,p){const e=document.createElementNS(NSs,tag);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e}
function itemBox(it){const c=it.parentElement;return{x:c.offsetLeft+it.offsetLeft,y:c.offsetTop+it.offsetTop,w:it.offsetWidth,h:it.offsetHeight}}
function clusterBox(c){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;c.querySelectorAll('.item').forEach(it=>{const b=itemBox(it);x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.w);y2=Math.max(y2,b.y+b.h)});return{x:x1,y:y1,w:x2-x1,h:y2-y1}}
function fit(b,pad=60){const vw=vp.clientWidth,vh=vp.clientHeight-46;const s=Math.min(vw/(b.w+pad*2),vh/(b.h+pad*2));
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
  const title=document.getElementById('title');const tb=itemBox(title);
  clusters.forEach(c=>{const items=[...c.querySelectorAll('.item')];
    if(c.dataset.step!=='1'){const head=c.querySelector('.head')||items[0];const hb=itemBox(head);
      const p1=[tb.x+tb.w/2+(hb.x+hb.w/2-tb.x-tb.w/2)*0.18,tb.y+tb.h/2+(hb.y-tb.y)*0.25];
      const p2=[hb.x+hb.w/2+(tb.x-hb.x)*0.04,hb.y+hb.h/2];
      const ax=p2[0]-p1[0],ay=p2[1]-p1[1],L=Math.hypot(ax,ay);
      const mx=(p1[0]+p2[0])/2-ay*0.12,my=(p1[1]+p2[1])/2+ax*0.12;
      const k=(L-260)/L;const end=[p1[0]+ax*k,p1[1]+ay*k];
      const p=mk('path',{d:\`M\${p1[0]},\${p1[1]} Q\${mx},\${my} \${end[0]},\${end[1]}\`},svg);
      const len=p.getTotalLength();p.style.strokeDasharray=len;p.style.setProperty('--len',len);p.classList.add('hidden');arrows.set(c,p);}
    const cols=['#d62828','#2b3f73','#f2b705','#1a1a1a','#2a9d8f'];
    items.forEach((it,i)=>{const b=itemBox(it);const g=mk('g',{class:'pin'},pinsvg);g.style.setProperty('--d',(i*0.22+0.25)+'s');
      const col=cols[(i+ +c.dataset.step)%cols.length];
      mk('circle',{cx:b.x+b.w/2+4,cy:b.y+20,r:22,fill:'rgba(0,0,0,.25)'},g);mk('circle',{cx:b.x+b.w/2,cy:b.y+14,r:22,fill:col},g);
      mk('circle',{cx:b.x+b.w/2-7,cy:b.y+7,r:7,fill:'rgba(255,255,255,.55)'},g);
      (c._pins=c._pins||[]).push(g);});
  });
}
function reveal(c){if(c.classList.contains('shown'))return;c.classList.add('shown');zones.get(c).classList.add('gone');
  (c._pins||[]).forEach(p=>p.classList.add('on'));
  const s1=clusters[0];if(c!==s1&&!s1.classList.contains('shown'))reveal(s1);
  const a=arrows.get(c);if(a){setTimeout(()=>a.classList.remove('hidden'),150);setTimeout(()=>a.setAttribute('marker-end','url(#mk)'),document.body.classList.contains('still')?0:1250)}
  setPhase(phase,zoomedOn);}
function enterBoard(){fit(BOARD,20);setPhase('board');setTimeout(()=>reveal(clusters[0]),900)}
function toWall(){fit(WALL,0);setPhase('wall')}
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
window.addEventListener('resize',()=>{if(phase==='wall')fit(WALL,0);else if(phase==='board')fit(BOARD,20);else if(phase==='zone')fit(clusterBox(zoomedOn),70);else fit(itemBox(zoomedOn),40)});
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
${floor}<div class="scene" id="skirting"></div>
${gobo}
<div id="board"><div class="face"></div><div class="brand">CASE · BOARD</div></div>
${tray}
${lamp}
<div class="scene" id="cone"></div>
${plant}
${basket}
${label}
<svg id="strings" width="7600" height="3600"></svg>

${clusters}
<svg id="pins" width="7600" height="3600"></svg>
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
fs.writeFileSync(new URL('../index.html', import.meta.url), html);
console.log('built index.html', html.length, 'bytes');
