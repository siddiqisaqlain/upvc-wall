// Assembles index.html from tools/parts/* + the wall scene below.
// usage: node tools/build.mjs   (run from the project folder)
import fs from 'fs';
const P = f => fs.readFileSync(new URL('./parts/' + f, import.meta.url), 'utf8');
const baseCss = P('style.css'), clusters = P('clusters.html'), credits = P('credits.html'), diagrams = P('diagrams.js');

const css = `
/* ================= WALL SCENE ================= */
html,body{background:#cfc5b6}
#world{background:none!important;box-shadow:none!important;width:7600px;height:3600px}
#world::before{content:"";position:absolute;left:-14000px;top:-9000px;width:30000px;height:20000px;z-index:-3;
  background-color:#8a4a32;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712000%27 height=%278000%27%3E%3Cfilter id=%27v%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.00035%27 numOctaves=%273%27 seed=%2711%27/%3E%3CfeColorMatrix values=%270 0 0 0 .18 0 0 0 0 .08 0 0 0 0 .03 0 0 0 1.1 -.35%27/%3E%3C/filter%3E%3Crect width=%2712000%27 height=%278000%27 filter=%27url(%23v)%27/%3E%3C/svg%3E"),url("tex/bricks.jpg"),url("tex/bricks.jpg");background-size:12000px 8000px,5200px 5200px,7300px 7300px;background-position:0 0,1200px 330px,3100px 2200px;background-blend-mode:normal,normal,normal}
#ceiling{left:-14000px;top:-9000px;width:30000px;height:6130px;z-index:-2;background:linear-gradient(#f6f3ee,#e4dfd7 85%,#d6d0c6)}
#cornice{left:-14000px;top:-2960px;width:30000px;height:140px;z-index:-2;background:linear-gradient(#ffffff,#ece7df 55%,#d9d3c9);box-shadow:0 40px 90px rgba(30,15,5,.35)}
#wallshade{left:-14000px;top:-2870px;width:30000px;height:9700px;z-index:-2;
  background:linear-gradient(to bottom,rgba(25,12,6,.38),rgba(25,12,6,.08) 20%,rgba(25,12,6,0) 45%,rgba(25,12,6,.05) 80%,rgba(25,12,6,.3)),
  linear-gradient(to right,rgba(25,12,6,.25),rgba(25,12,6,0) 20%,rgba(25,12,6,0) 80%,rgba(25,12,6,.3)),
  radial-gradient(ellipse 3200px 4200px at 9300px 4000px,rgba(255,240,220,.16),rgba(255,240,220,0) 70%),
  linear-gradient(rgba(70,50,40,.12),rgba(70,50,40,.12))}
#window{left:-8000px;top:-1400px;width:5400px;height:5500px;z-index:-2}
#world::after{content:none;
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
#skirting{left:-14000px;top:6670px;width:30000px;height:170px;z-index:-2;background:linear-gradient(#f4efe7,#e6dfd3 70%,#cfc6b8);box-shadow:0 -6px 18px rgba(80,60,30,.12)}

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
#plant{left:8700px;top:3800px;width:1500px;height:3150px;z-index:1}
#basket{left:-2150px;top:5180px;width:1100px;height:1750px;z-index:1}
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
let planks='';const VP=15000,FW=30000,FH=3300;const cols=['#b48557','#a67a4d','#bf8f60','#aa7d50','#b88a5a','#9f7347'];
for(let i=-150;i<150;i++){const t1=VP+i*105,t2=VP+(i+1)*105,b1=VP+i*470,b2=VP+(i+1)*470;planks+=`<polygon points="${t1},0 ${t2},0 ${b2},${FH} ${b1},${FH}" fill="${cols[(i*7+300)%cols.length]}" stroke="rgba(60,35,15,.4)" stroke-width="3"/>`;}
const floor=`<svg class="scene" id="floor" viewBox="0 0 ${FW} ${FH}" preserveAspectRatio="none" style="left:-14000px;top:6830px;width:${FW}px;height:${FH}px;z-index:-2">
<defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1608" stop-opacity=".6"/><stop offset=".3" stop-color="#2a1608" stop-opacity=".15"/><stop offset="1" stop-color="#2a1608" stop-opacity=".05"/></linearGradient>
<filter id="grain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".002 .06" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .2 0 0 0 0 .1 0 0 0 0 .03 0 0 0 .45 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="60"/></filter></defs>
${planks}<rect width="${FW}" height="${FH}" filter="url(#grain)" fill="#000"/><rect width="${FW}" height="${FH}" fill="url(#fl)"/>
<g filter="url(#soft)" opacity=".28"><polygon points="6300,0 10900,0 14600,3300 7600,3300" fill="#fff4dd"/><polygon points="8540,0 8700,0 11200,3300 10700,3300" fill="#7a5233" opacity=".5"/></g></svg>`;
const ceiling='<div class="scene" id="ceiling"></div><div class="scene" id="cornice"></div><div class="scene" id="wallshade"></div>';
const pane=(x1,y1,x2,y2)=>`<rect x="${x1}" y="${y1}" width="${x2-x1}" height="${y2-y1}" fill="none" stroke="#2b2b2b" stroke-width="10"/>
  <polygon points="${x1+(x2-x1)*.15},${y1} ${x1+(x2-x1)*.42},${y1} ${x1+(x2-x1)*.05},${y2} ${x1-(x2-x1)*.22},${y2}" fill="#fff" opacity=".10" clip-path="url(#gl)"/>
  <polygon points="${x1+(x2-x1)*.55},${y1} ${x1+(x2-x1)*.62},${y1} ${x1+(x2-x1)*.3},${y2} ${x1+(x2-x1)*.23},${y2}" fill="#fff" opacity=".08" clip-path="url(#gl)"/>`;
const sash=(x1,y1,x2,y2,hx)=>`<path d="M${x1} ${y1}H${x2}V${y2}H${x1}Z M${x1+190} ${y1+190}V${y2-190}H${x2-190}V${y1+190}Z" fill="url(#pvc)" fill-rule="evenodd" stroke="rgba(0,0,0,.18)" stroke-width="6"/>
  <rect x="${x1+120}" y="${y1+120}" width="${x2-x1-240}" height="${y2-y1-240}" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="5"/>
  ${pane(x1+190,y1+190,x2-190,y2-190)}
  <g transform="translate(${hx} ${(y1+y2)/2})"><rect x="-40" y="-90" width="80" height="190" rx="30" fill="#f7f7f5" stroke="rgba(0,0,0,.25)" stroke-width="5"/><rect x="-26" y="-20" width="52" height="420" rx="26" fill="#fbfbfa" stroke="rgba(0,0,0,.28)" stroke-width="5"/><rect x="-8" y="10" width="10" height="360" rx="5" fill="rgba(0,0,0,.06)"/></g>`;
const win=`<svg class="scene" id="window" viewBox="-200 -100 5400 5500">
<defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9dbe8"/><stop offset=".5" stop-color="#eef3f5"/><stop offset="1" stop-color="#f6f6f2"/></linearGradient>
 <linearGradient id="pvc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbf9"/><stop offset="1" stop-color="#e9e8e3"/></linearGradient>
 <linearGradient id="rev" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d2c6"/><stop offset="1" stop-color="#f3efe8"/></linearGradient>
 <linearGradient id="soff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdb5a8"/><stop offset="1" stop-color="#d9d2c6"/></linearGradient>
 <linearGradient id="sillsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0d05" stop-opacity=".45"/><stop offset="1" stop-color="#1a0d05" stop-opacity="0"/></linearGradient>
 <linearGradient id="headsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
 <filter id="far" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="55"/></filter>
 <clipPath id="gl"><rect x="260" y="160" width="4730" height="4820"/></clipPath>
</defs>
<polygon points="0,0 5000,0 4990,160 260,160" fill="url(#soff)"/>
<polygon points="0,0 260,160 260,4980 0,5130" fill="url(#rev)"/>
<g clip-path="url(#gl)"><g filter="url(#far)">
 <rect x="200" y="100" width="4900" height="5000" fill="url(#sky)"/>
 <path d="M200 2900 L700 2500 L1100 2700 L1700 2150 L2200 2600 L2700 2350 L3300 2750 L3900 2200 L4500 2650 L5100 2450 V3400 H200Z" fill="#c6d0d8"/>
 <path d="M1500 2330 L1700 2150 L1900 2320 L1800 2300 L1700 2360Z M3700 2380 L3900 2200 L4100 2370 L3950 2350Z" fill="#eef2f4"/>
 <path d="M200 3250 Q600 3050 1000 3200 T1800 3150 T2700 3220 T3600 3120 T4500 3230 T5100 3150 V4000 H200Z" fill="#a9b49d"/>
 <g fill="#8e9c84"><ellipse cx="900" cy="3350" rx="420" ry="520"/><ellipse cx="1500" cy="3450" rx="300" ry="420"/><ellipse cx="3800" cy="3380" rx="480" ry="560"/><ellipse cx="4500" cy="3500" rx="330" ry="420"/></g>
 <rect x="200" y="3800" width="4900" height="1300" fill="#c8c8bb"/>
 <path d="M2100 3700 H3300 V4300 H2100Z" fill="#e6dfd3"/><path d="M2000 3720 L2700 3350 L3400 3720Z" fill="#b89a8c"/>
</g></g>
<path d="M260 160H4990V4980H260Z M480 380V4760H4770V380Z" fill="url(#pvc)" fill-rule="evenodd" stroke="rgba(0,0,0,.2)" stroke-width="6"/>
<rect x="2180" y="250" width="900" height="44" rx="14" fill="#d8d7d1"/>
<rect x="480" y="1450" width="4290" height="160" fill="url(#pvc)" stroke="rgba(0,0,0,.18)" stroke-width="5"/>
<rect x="2560" y="1610" width="130" height="3150" fill="url(#pvc)" stroke="rgba(0,0,0,.18)" stroke-width="5"/>
<rect x="540" y="440" width="4170" height="950" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="5"/>
${pane(600,500,4650,1330)}
${sash(480,1610,2560,4760,2460)}
${sash(2690,1610,4770,4760,2790)}
<rect x="260" y="160" width="4730" height="420" fill="url(#headsh)"/>
<polygon points="260,4980 4990,4980 5150,5180 -150,5180" fill="#f4f1eb"/>
<rect x="-150" y="5180" width="5300" height="80" fill="#dcd6cb"/>
<rect x="-150" y="5260" width="5300" height="110" fill="url(#sillsh)"/>
</svg>`;
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
const WALL={x:-10150,y:-3900,w:22100,h:12430}, BOARD={x:-260,y:-260,w:8120,h:4120};
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
${ceiling}
${win}
${floor}<div class="scene" id="skirting"></div>
<div id="board"><div class="face"></div><div class="brand">CASE · BOARD</div></div>
${tray}
${plant}
${basket}
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
html,body{background:#d6c9b6}
#board{background:transparent!important;box-shadow:none!important}
#board .face,#board .brand,.scene,#label{display:none!important}
#sceneimg{position:absolute;left:${S.x}px;top:${S.y}px;width:${S.w}px;height:${S.h}px;z-index:-2;pointer-events:none;user-select:none}
</style>`)
  .replace('<div id="board">',`<img id="sceneimg" src="img/wall.jpg?v=${wallVer}" alt="" draggable="false"><div id="board">`);
fs.writeFileSync(new URL('../index.html', import.meta.url), light);
console.log('built index.html', html.length, 'bytes');
