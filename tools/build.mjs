// Assembles index.html from tools/parts/* + the wall scene below.
// usage: node tools/build.mjs   (run from the project folder)
import fs from 'fs';
const P = f => fs.readFileSync(new URL('./parts/' + f, import.meta.url), 'utf8');
const baseCss = P('style.css'), credits = P('credits.html'), diagrams = P('diagrams.js'), nav = P('nav.js');
const hwClusters = P('hw-clusters.html'), upvcClusters = P('clusters.html');

// Boards, in presenting order. The hardware frame matches tools/room/guide2.html (px 220..554, py 186..495).
// Each frame = black moulding + white mat; content sits 720 inside the frame edge.
// lamp: centre x + bar width chosen to cover the light rod painted in the room photo.
const BOARDS = [
  { id: 'hw',   name: 'Hardware', L: -8420, T: -2120, W: 6960, H: 6440, lampX: -4940, lampW: 6600,
    content: { x: -8100, y: -1800, w: 6320, h: 5700 } },
  { id: 'upvc', name: 'uPVC windows', L: -720,  T: -720,  W: 9040, H: 5040, lampX: 3800,  lampW: 8200,
    content: { x: 0, y: 0, w: 7600, h: 3600 } },
];

const css = `
/* ================= WALL SCENE ================= */
html,body{background:#8f8c86}
#world{background:none!important;box-shadow:none!important;width:7600px;height:3600px}
#roomphoto{position:absolute;left:-13000px;top:-6000px;width:28000px;height:16000px;z-index:-3;pointer-events:none;user-select:none}
.scene{position:absolute;pointer-events:none}

/* gallery frames: thin black moulding, wide white mat, glass, lit from an LED bar above */
.frame{position:absolute;z-index:-1;border-radius:6px;pointer-events:auto;
  background:linear-gradient(#2c2c2c,#121212 2%,#0c0c0c 50%,#050505);
  box-shadow:0 70px 90px -20px rgba(15,6,2,.62),0 160px 220px -40px rgba(15,6,2,.45),-30px 30px 60px rgba(15,6,2,.25),30px 30px 60px rgba(15,6,2,.25),
    inset 0 6px 0 rgba(255,255,255,.18),inset 0 0 0 3px #000,inset 10px 0 14px rgba(255,255,255,.05),inset -10px 0 14px rgba(255,255,255,.04)}
.frame::before{content:"";position:absolute;inset:110px;border-radius:2px;background:#000;box-shadow:0 0 0 10px #1b1b1b}
.frame .face{position:absolute;inset:124px;overflow:hidden;
  background:radial-gradient(ellipse 62% 30% at 50% 0%,#fffdf8,rgba(255,253,248,0) 100%),
    linear-gradient(#fbfaf6,#f1f0ec 38%,#e4e3de 78%,#d9d8d3);
  box-shadow:inset 0 46px 40px -20px rgba(0,0,0,.45),inset 30px 0 30px -18px rgba(0,0,0,.28),inset -30px 0 30px -18px rgba(0,0,0,.28),inset 0 -20px 26px -14px rgba(0,0,0,.22)}
.frame .face::before{content:"";position:absolute;inset:0;opacity:.5;
  background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .48 0 0 0 0 .44 0 0 0 .16 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23p)'/%3E%3C/svg%3E");background-size:300px 300px}
.wallglow{z-index:-2;mix-blend-mode:screen}
.glass{position:absolute;z-index:5;pointer-events:none;transition:opacity .8s;
  background:linear-gradient(rgba(255,250,240,.05),rgba(255,250,240,0) 25%,rgba(30,22,14,0) 55%,rgba(30,22,14,.07)),
    linear-gradient(168deg,rgba(255,255,255,0) 62%,rgba(255,255,255,.13) 72%,rgba(255,255,255,.04) 80%,rgba(255,255,255,0) 88%),
    linear-gradient(118deg,rgba(255,255,255,0) 8%,rgba(255,255,255,.05) 14%,rgba(255,255,255,0) 22%)}
body.zoomed .glass{opacity:0}
.lamp{z-index:1}

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
.strings path{fill:none!important;filter:none!important;stroke-linecap:round;transition:stroke-dashoffset 1.1s ease-in-out var(--d,0s)!important}
.strings .thread path{stroke-dashoffset:var(--len)}
.strings .thread.on path{stroke-dashoffset:0}
.strings .st{stroke:#a5141c!important}
.strings .sh{stroke:rgba(40,20,10,.22)!important}
.strings .thick path{stroke-width:3.4!important}
.strings .thin path{stroke-width:2.3!important}
.strings .thin .st{stroke:#7d1016!important}
body.still .strings path,body.still .pins .pin,body.init .strings path,body.init .pins .pin{transition:none!important}
/* threads are only drawn on a board; drawn over the whole room view they stop the room image from painting */
body:not(.inboard) .strings,.strings .thread:not(.on){display:none}
.pins .pin{opacity:0;transform:translateY(-14px);transition:opacity .3s ease var(--d,0s),transform .45s cubic-bezier(.2,1.6,.4,1) var(--d,0s)}
.pins .pin.on{opacity:1;transform:none}
.mpl .rod{animation:rod 5s ease-in-out infinite!important}.mpl .hdl{animation:hdl 5s ease-in-out infinite!important}

/* board 1 draws everything 1.25x larger (bigger mat, same reading size when zoomed) */
.hwb .head{padding:22px 32px 20px}.hwb .head .no{font-size:27px}.hwb .head h2{font-size:47px}.hwb .head p{font-size:24px;margin-top:10px}
.hwb .card{padding:28px 30px 25px;background-image:linear-gradient(transparent 58px,#e8a3a3 58px,#e8a3a3 60px,transparent 60px),repeating-linear-gradient(transparent 0 41px,#cfe0ef 41px 42px);background-position:0 0,0 18px}
.hwb .card h3{font-size:29px;line-height:30px;margin-bottom:18px}.hwb .card p,.hwb .card li{font-size:24px;line-height:35px;margin-bottom:8px}
.hwb .note{padding:32px 28px 28px;font-size:32px}.hwb .note small{font-size:21px}
.hwb .photo{padding:17px 17px 12px}.hwb .photo figcaption{font-size:24px;padding:12px 5px 3px}.hwb .photo figcaption small{font-size:14px}
.hwb .sheet{padding:22px 25px 20px;background-size:25px 25px}.hwb .sheet h3{font-size:26px}.hwb .sheet .sub{font-size:21px}
.hwb .title{padding:50px 58px 42px}.hwb .title .stamp{font-size:30px}.hwb .title h1{font-size:90px}.hwb .title p{font-size:32px}.hwb .title .meta{font-size:22px}

/* opening scene: a uPVC front door, full screen; click → leaf swings in → camera goes through the doorway.
   Leaf box = door-leaf.jpg cut from tools/room/door_mid.png (x 1088..1607, y 209..1500 of 2688x1536). */
#intro{position:fixed;inset:0;z-index:30;overflow:hidden;cursor:pointer;transition:opacity 1.1s ease .2s}
#intro .stage{position:absolute;left:50%;top:50%;width:max(100vw,175vh);height:max(57.143vw,100vh);transform:translate(-50%,-50%);
  transform-origin:50.15% 55.66%;transition:transform 1.7s cubic-bezier(.55,0,.25,1);perspective:2200px;perspective-origin:50.15% 52%}
#intro .wall{position:absolute;left:0;top:0;width:100%;height:100%;z-index:2;pointer-events:none;user-select:none}
#intro .leaf{position:absolute;left:40.476%;top:13.607%;width:19.345%;height:84.115%;z-index:1;transform-style:preserve-3d;transform-origin:0 50%;
  background:url(img/intro/door-leaf.jpg) center/100% 100%;transition:transform 1.5s cubic-bezier(.45,0,.2,1),filter 1.5s}
#intro .leaf .edge{position:absolute;right:0;top:0;width:7%;height:100%;background:linear-gradient(90deg,#d9d9d4,#f4f4f1);transform-origin:100% 50%;transform:rotateY(-90deg)}
#intro.open .leaf{transform:rotateY(80deg);filter:brightness(.8)}
#intro.through .stage{transform:translate(-50%,-50%) scale(5)}
#intro.through{opacity:0}
body:not(.ready) #world{visibility:hidden}
#intro.waiting .knock{opacity:.6}
#intro .knock{position:absolute;left:50%;bottom:6%;transform:translateX(-50%);z-index:3;background:rgba(31,42,68,.85);color:#fff;font:600 16px var(--body);
  letter-spacing:.05em;padding:10px 22px;border-radius:30px;transition:opacity .4s;pointer-events:none}
#intro.open .knock{opacity:0}

#hint{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:6;background:rgba(31,42,68,.82);color:#fff;
  font:600 15px var(--body);letter-spacing:.04em;padding:9px 18px;border-radius:30px;transition:opacity .5s;pointer-events:none}
#vignette{position:fixed;inset:0;pointer-events:none;z-index:4;background:radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(50,30,10,.28))}
#hud{background:linear-gradient(transparent,rgba(25,18,10,.75))}
`;

// ---------- scene pieces per board ----------
// LED picture-light bar in world coordinates (bar 180 tall, 480 above the frame top, stem down to the frame).
const lampSvg = (id, cx, bw, T) => {
  const x0 = cx - bw / 2, vx = x0 - 600, vy = T - 1000, vw = bw + 1200, vh = 1200;
  return `<svg class="scene lamp" id="lamp-${id}" viewBox="${vx} ${vy} ${vw} ${vh}" overflow="visible" style="left:${vx}px;top:${vy}px;width:${vw}px;height:${vh}px">
  <defs>
    <linearGradient id="ledbar-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset=".12" stop-color="#1a1a1a"/><stop offset=".8" stop-color="#0d0d0d"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <linearGradient id="stem-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0a0a"/><stop offset=".35" stop-color="#2a2a2a"/><stop offset=".6" stop-color="#151515"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <filter id="lb-${id}" x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="30"/></filter>
    <filter id="ls-${id}" x="-10%" y="-100%" width="120%" height="400%"><feGaussianBlur stdDeviation="45"/></filter>
  </defs>
  <rect x="${x0 + 20}" y="${T - 260}" width="${bw - 40}" height="120" rx="40" fill="rgba(10,4,0,.55)" filter="url(#ls-${id})"/>
  <rect x="${cx - 160}" y="${T - 310}" width="320" height="320" fill="url(#stem-${id})"/>
  <rect x="${cx - 180}" y="${T - 20}" width="360" height="30" fill="#0b0b0b"/>
  <rect x="${x0}" y="${T - 480}" width="${bw}" height="180" rx="14" fill="url(#ledbar-${id})"/>
  <rect x="${x0}" y="${T - 478}" width="${bw}" height="8" rx="4" fill="rgba(255,255,255,.18)"/>
  <rect x="${x0}" y="${T - 380}" width="${bw}" height="10" fill="#000" opacity=".6"/>
  <rect x="${x0 + 70}" y="${T - 310}" width="${bw - 140}" height="60" rx="30" fill="#fff1d6" filter="url(#lb-${id})" opacity=".8"/>
  <rect x="${x0 + 40}" y="${T - 310}" width="${bw - 40}" height="30" rx="12" fill="#fffaf0"/>
  <rect x="${x0 + 120}" y="${T - 304}" width="${bw - 240}" height="14" rx="7" fill="#ffffff"/>
</svg>`;
};
const glow = b => { const cx = b.L + b.W / 2, k = b.W / 9040;
  return `<div class="scene wallglow" style="left:${cx - 7000}px;top:${b.T - 2280}px;width:14000px;height:9000px;background:radial-gradient(ellipse ${Math.round(4600 * k)}px ${Math.round(2000 * Math.max(k, .8))}px at 7000px 2000px,rgba(255,238,210,.34),rgba(255,238,210,.10) 45%,rgba(255,236,205,0) 72%)"></div>`; };
const frame = b => `<div class="frame" id="${b.id}" data-name="${b.name}" data-lamp="310" style="left:${b.L}px;top:${b.T}px;width:${b.W}px;height:${b.H}px"><div class="face"></div></div>`;
const marks = (b, kind) => { const c = b.content;
  return `<svg class="${kind}" id="${kind}-${b.id}" width="${c.w}" height="${c.h}" viewBox="${c.x} ${c.y} ${c.w} ${c.h}" style="left:${c.x}px;top:${c.y}px"></svg>`; };
const glass = b => `<div class="glass" style="left:${b.L + 170}px;top:${b.T + 170}px;width:${b.W - 340}px;height:${b.H - 340}px"></div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hardware &amp; uPVC Case Wall</title>
<style>
${baseCss}
${css}
</style>
</head>
<body>
<div id="intro" title="Click to open the door"><div class="stage"><div class="leaf"><i class="edge"></i></div><img class="wall" src="img/intro/door-wall.webp" alt="A white uPVC front door in a plaster wall" draggable="false"></div><div class="knock">click the door to enter</div></div>
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
${BOARDS.map(glow).join('\n')}
<!--FRAMES-->
${BOARDS.map(frame).join('\n')}
${BOARDS.map(b => lampSvg(b.id, b.lampX, b.lampW, b.T)).join('\n')}
${BOARDS.map(b => marks(b, 'strings')).join('\n')}

${hwClusters}
${upvcClusters}
${BOARDS.map(b => marks(b, 'pins')).join('\n')}
${BOARDS.map(glass).join('\n')}
</div>
</div>
<div id="vignette"></div>
<div id="hint"></div>
<div id="hud">
  <button id="prev" title="Back (← / Esc)">◀</button>
  <span class="t" id="ht">—</span><span id="hc"></span>
  <button id="next" title="Next topic (→ / Space)">▶</button>
  <span class="k">→ next · ← back · W wall · 1 / 2 boards · B board · A reveal all · C credits · F fullscreen · H hide bar</span>
  <button id="cbtn">Credits</button>
</div>

${credits}
<script>
${diagrams}
${nav}
</script>
</body>
</html>
`;
// ---- scene bake page: only the room, frames and lamps, fixed camera ----
const S = { x: -13000, y: -6000, w: 28000, h: 16000, k: 0.25 };
const wallVer = (await import('crypto')).createHash('md5').update(fs.readFileSync(new URL('../img/wall.jpg', import.meta.url))).digest('hex').slice(0, 8);
const bake = html.replace('</style>', `
#world{transform:translate(${-S.x * S.k}px,${-S.y * S.k}px) scale(${S.k})!important;transition:none!important}
.cluster,.zone,#hud,#hint,#vignette,#bar,.strings,.pins,.glass,#credits,#intro{display:none!important}
</style>`).replace(/<script>[\s\S]*<\/script>/, '');
fs.writeFileSync(new URL('./scene.html', import.meta.url), bake);
// ---- light page: the room is one baked image ----
const light = html
  .replace('</style>', `
html,body{background:#8f8c86}
.frame{background:transparent!important;box-shadow:none!important}
.frame::before{display:none!important}
.frame .face,.scene{display:none!important}
#sceneimg{position:absolute;left:${S.x}px;top:${S.y}px;width:${S.w}px;height:${S.h}px;z-index:-2;pointer-events:none;user-select:none}
</style>`)
  .replace('<!--FRAMES-->', `<img id="sceneimg" src="img/wall.jpg?v=${wallVer}" alt="" draggable="false">`);
fs.writeFileSync(new URL('../index.html', import.meta.url), light);
console.log('built index.html', html.length, 'bytes');
