/* ================= WALL + BOARDS LOGIC =================
   Boards are presented in DOM order of .frame elements (hardware first, then uPVC).
   Each .cluster has data-board="<frame id>" and data-step (1 = that board's title cluster). */
const world=document.getElementById('world'),vp=document.getElementById('viewport'),hint=document.getElementById('hint');
const WALL={x:-12950,y:-5950,w:27900,h:15900};
const NSs='http://www.w3.org/2000/svg';
const boards=[...document.querySelectorAll('.frame')].map(el=>{
  const box={x:el.offsetLeft-20,y:el.offsetTop-(+el.dataset.lamp||0)-20,w:el.offsetWidth+40,h:el.offsetHeight+(+el.dataset.lamp||0)+40};
  const cl=[...document.querySelectorAll('.cluster[data-board="'+el.id+'"]')].sort((a,b)=>a.dataset.step-b.dataset.step);
  return{el,id:el.id,name:el.dataset.name,box,clusters:cl,hero:cl[0],
    strings:document.getElementById('strings-'+el.id),pins:document.getElementById('pins-'+el.id)};
});
const clusters=boards.flatMap(b=>b.clusters);
const boardOf=c=>boards.find(b=>b.clusters.includes(c));
let phase='wall', cur=boards[0], zoomedOn=null, lockUntil=0;

/* The world stays hidden (body:not(.ready)) until everything has loaded; then the camera is placed on the wall
   view with no animation. Placing it earlier left the big room image only partly painted. */
let ready=false,doorQueued=false;
/* opening scene: the front door */
const intro=document.getElementById('intro');let introOn=!!intro;
/* wall view, optionally pulled back by k (k<1 = room further away, as seen from outside the door) */
function wallXf(k){const vw=vp.clientWidth,vh=vp.clientHeight-46,s=Math.max(vw/WALL.w,vh/WALL.h)*k;
  return `translate(${vw/2-(WALL.x+WALL.w/2)*s}px,${vh/2-(WALL.y+WALL.h/2)*s}px) scale(${s})`}
/* After the door scene the camera rests on the wall. Hovering a board only enters it once the mouse has
   really moved (otherwise the cursor, already over a board, would fly straight into it). */
let hoverArmed=!intro,armFrom=0,armDist=0,lastXY=null;
document.addEventListener('mousemove',e=>{if(hoverArmed||!armFrom||Date.now()<armFrom){lastXY=[e.clientX,e.clientY];return}
  if(lastXY)armDist+=Math.hypot(e.clientX-lastXY[0],e.clientY-lastXY[1]);lastXY=[e.clientX,e.clientY];if(armDist>60)hoverArmed=true});
/* fullscreen: browsers only allow it from a click or key press, so the first one (normally the door click) switches it on.
   The walk-in waits for the fullscreen resize so the camera path is worked out for the final screen size. */
let fsTried=false;
function goFullscreen(){if(fsTried||document.fullscreenElement)return null;fsTried=true;const el=document.documentElement;
  try{const p=el.requestFullscreen&&el.requestFullscreen();return p&&p.then?p:null}catch(e){return null}}
document.addEventListener('pointerdown',()=>{if(!introOn)goFullscreen()},{capture:true,once:true});
document.addEventListener('keydown',e=>{if(!introOn&&!/^[fF]$/.test(e.key))goFullscreen()},{capture:true,once:true});
function openDoor(){if(!introOn||intro.classList.contains('open'))return;
  const fs=goFullscreen();if(fs){fs.then(()=>setTimeout(openDoor,250),()=>openDoor());return}
  if(!ready){doorQueued=true;intro.classList.add('waiting');return}
  /* through the open door the room is seen from further back… */
  SFX.door();world.style.transition='none';world.style.transform=wallXf(.5);world.getBoundingClientRect();
  intro.classList.add('open');
  /* …then the camera walks in: door frame flies past, room comes up to the wall view and stops */
  setTimeout(()=>{intro.classList.add('through');world.style.transition='transform 1.8s cubic-bezier(.45,0,.2,1)';world.style.transform=wallXf(1)},1150);
  setTimeout(()=>{intro.remove();introOn=false;world.style.transition='';phase='wall';setPhase('wall');armFrom=Date.now()+300;lockUntil=Date.now()+600},3000)}
if(intro){const q=new URLSearchParams(location.search);
  if(q.has('still')||q.has('view')||q.has('nodoor')){intro.remove();introOn=false}else{intro.addEventListener('click',e=>{e.stopPropagation();openDoor()});if(q.has('autodoor'))setTimeout(openDoor,+q.get('autodoor')||500)}}

function mk(tag,a,p){const e=document.createElementNS(NSs,tag);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e}
function itemBox(it){const c=it.parentElement;return{x:c.offsetLeft+it.offsetLeft,y:c.offsetTop+it.offsetTop,w:it.offsetWidth,h:it.offsetHeight}}
function clusterBox(c){let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;c.querySelectorAll('.item').forEach(it=>{const b=itemBox(it);x1=Math.min(x1,b.x);y1=Math.min(y1,b.y);x2=Math.max(x2,b.x+b.w);y2=Math.max(y2,b.y+b.h)});return{x:x1,y:y1,w:x2-x1,h:y2-y1}}
function fit(b,pad=60,cover){const vw=vp.clientWidth,vh=vp.clientHeight-46;const s=Math[cover?'max':'min'](vw/(b.w+pad*2),vh/(b.h+pad*2));
  world.style.transform=`translate(${vw/2-(b.x+b.w/2)*s}px,${vh/2-(b.y+b.h/2)*s}px) scale(${s})`;lockUntil=Date.now()+1300;
  /* camera glide sound: rising air moving in, falling air pulling back; silent for instant moves and resizes */
  if(world.style.transition!=="none"&&!fitQuiet&&Math.abs(s/lastS-1)>.02)SFX.move(s>lastS?1:-1);lastS=s}
let lastS=1,fitQuiet=false;
function setHint(t){hint.textContent=t;hint.style.opacity=t?1:0}
const shown=c=>c.classList.contains('shown');
function setPhase(p,target){phase=p;zoomedOn=target||null;document.body.classList.toggle('inboard',p!=='wall');document.body.classList.toggle('zoomed',p==='zone'||p==='item');
  const cl=cur.clusters,n=cl.filter(shown).length,all=clusters.filter(shown).length;
  document.getElementById('ht').textContent=p==='wall'?'The wall':p==='board'?cur.name:(target&&target.dataset?target.dataset.name:'')||'';
  document.getElementById('hc').textContent=p==='wall'?`${boards.length} boards`:`${n} / ${cl.length} revealed`;
  document.getElementById('bar').style.width=(all/clusters.length*100)+'%';
  const nb=boards[boards.indexOf(cur)+1];
  setHint(p==='wall'?'hover over a board to begin':p==='board'?(n<cl.length?'hover over a topic to reveal it · click to zoom in':(nb?'all evidence on this board · → next board':'all evidence on the board · click any card')):'click a card to read it · → next · Esc back to the board');updateNotes()}

/* zones */
const zones=new Map();
clusters.forEach(c=>{
  const b=clusterBox(c),pad=30,hero=c===boardOf(c).hero;const z=document.createElement('div');z.className='zone'+(hero?' big':'');
  Object.assign(z.style,{left:(b.x-pad)+'px',top:(b.y-pad)+'px',width:(b.w+pad*2)+'px',height:(b.h+pad*2)+'px'});
  const [no,...rest]=c.dataset.name.split(' · ');const title=rest.length?rest.join(' · '):no;
  z.innerHTML='<svg><rect x="0" y="0" width="100%" height="100%" rx="40"/></svg><div class="zt">'+
    (hero?'<b>'+c.dataset.kicker+'</b><span>'+c.dataset.big+'</span>':'<b>'+(rest.length?no:'✓')+'</b><span>'+title+'</span><em>hover to reveal</em>')+'</div>';
  world.appendChild(z);zones.set(c,z);
  z.addEventListener('mouseenter',()=>{const bd=boardOf(c);if(phase==='wall'||bd!==cur){if(phase==='wall')wallHover(bd);return}if(Date.now()<lockUntil)return;reveal(c)});
  z.addEventListener('mousemove',()=>{if(phase==='wall')wallHover(boardOf(c))});
  z.addEventListener('click',e=>{e.stopPropagation();const bd=boardOf(c);if(phase==='wall'||bd!==cur){enterBoard(bd);return}reveal(c);zoomZone(c)});
});

/* strings + pins */
function buildMarks(){
  /* threads are created hidden; without body.init every one of them would animate from 0 to hidden at load,
     and that repaint storm stops the big room image from ever finishing painting */
  document.body.classList.add('init');
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.remove('init')));
  boards.forEach(bd=>{bd.strings.innerHTML='';bd.pins.innerHTML='';
    const title=bd.hero.querySelector('.title');
    const pinPos=it=>{const b=itemBox(it);return[b.x+b.w/2,b.y+16]};
    const thread=(c,A,B,cls,delay)=>{const[p1,p2]=[pinPos(A),pinPos(B)];const d=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);
      const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2+d*0.07;const dd='M'+p1[0]+','+p1[1]+' Q'+mx+','+my+' '+p2[0]+','+p2[1];
      const g=mk('g',{class:'thread '+cls},bd.strings);g.style.setProperty('--d',delay+'s');
      mk('path',{d:dd,class:'sh',transform:'translate(3 7)'},g);const p=mk('path',{d:dd,class:'st'},g);
      const len=p.getTotalLength();g.querySelectorAll('path').forEach(q=>{q.style.strokeDasharray=len;q.style.setProperty('--len',len)});
      (c._threads=c._threads||[]).push(g);};
    bd.clusters.forEach(c=>{const items=[...c.querySelectorAll('.item')];const step=+c.dataset.step;
      items.forEach((it,i)=>it.style.setProperty('--d',(i*0.22)+'s'));
      if(c===bd.hero){items.filter(i=>i!==title).forEach((it,i)=>thread(c,title,it,'thin',0.4+i*0.22));}
      else{const head=c.querySelector('.head')||items[0];thread(c,title,head,'thick',0);
        items.filter(i=>i!==head).forEach(it=>thread(c,head,it,'thin',parseFloat(it.style.getPropertyValue('--d'))+0.25));}
      const cols=['#d62828','#f4a261','#2a9d8f','#e9c46a','#457b9d','#ffffff'];
      items.forEach((it,i)=>{const[x,y]=pinPos(it);const g=mk('g',{class:'pin'},bd.pins);g.style.setProperty('--d',(i*0.22+0.2)+'s');
        const col=cols[(i*2+step)%cols.length];
        mk('circle',{cx:x+3,cy:y+5,r:11,fill:'rgba(0,0,0,.35)'},g);mk('circle',{cx:x,cy:y,r:11,fill:col,stroke:'rgba(0,0,0,.35)'},g);
        mk('circle',{cx:x-3.5,cy:y-3.5,r:3.5,fill:'rgba(255,255,255,.75)'},g);
        (c._pins=c._pins||[]).push(g);});
    });
  });
}
function reveal(c){if(shown(c))return;SFX.pin((c._threads||[]).length>0);c.classList.add('shown');zones.get(c).classList.add('gone');
  (c._pins||[]).forEach(p=>p.classList.add('on'));(c._threads||[]).forEach(t=>t.classList.add('on'));
  const h=boardOf(c).hero;if(c!==h&&!shown(h))reveal(h);
  setPhase(phase,zoomedOn);}
function showBoard(bd){cur=bd;fit(bd.box,20);setPhase('board')}
function enterBoard(bd){showBoard(bd);setTimeout(()=>reveal(bd.hero),900)}
function toWall(){fit(WALL,0,1);setPhase('wall')}
function zoomZone(c){cur=boardOf(c);reveal(c);fit(clusterBox(c),70);setPhase('zone',c)}
function zoomItem(it){cur=boardOf(it.parentElement);fit(itemBox(it),40);setPhase('item',it)}

function wallHover(bd){if(phase==='wall'&&!introOn&&hoverArmed&&Date.now()>lockUntil)enterBoard(bd)}
boards.forEach(bd=>['mouseenter','mousemove'].forEach(ev=>bd.el.addEventListener(ev,()=>wallHover(bd))));
document.querySelectorAll('.cluster .item').forEach(it=>it.addEventListener('click',e=>{e.stopPropagation();
  if(phase==='wall'){enterBoard(boardOf(it.parentElement));return}
  if(phase==='item'&&zoomedOn===it){zoomZone(it.parentElement);return}zoomItem(it)}));
vp.addEventListener('click',()=>{if(phase==='zone'||phase==='item')back();else if(phase==='wall')enterBoard(boards[0])});
function back(){if(phase==='item')zoomZone(zoomedOn.parentElement);else if(phase==='zone')showBoard(cur);else if(phase==='board')toWall()}
function next(){if(phase==='wall'){enterBoard(boards[0]);return}
  const c=phase==='zone'?zoomedOn:phase==='item'?zoomedOn.parentElement:null;
  const todo=cur.clusters.find(x=>!shown(x)&&x!==cur.hero);
  if(todo){zoomZone(todo);return}
  if(c){const i=cur.clusters.indexOf(c);if(i>0&&i<cur.clusters.length-1){zoomZone(cur.clusters[i+1]);return}showBoard(cur);return}
  const nb=boards[boards.indexOf(cur)+1];if(nb)enterBoard(nb);else showBoard(cur)}
document.addEventListener('keydown',e=>{
  if(introOn){if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();openDoor()}return}
  const cr=document.getElementById('credits');if(cr.classList.contains('on')){if(['Escape','c','C'].includes(e.key))cr.classList.remove('on');return}
  if(['ArrowRight','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();next()}
  else if(['ArrowLeft','PageUp','Backspace','Escape'].includes(e.key)){e.preventDefault();back()}
  else if(e.key==='w'||e.key==='W'||e.key==='Home')toWall();
  else if(e.key==='b'||e.key==='B'||e.key==='o'||e.key==='O')showBoard(cur);
  else if(/^[1-9]$/.test(e.key)&&boards[+e.key-1])enterBoard(boards[+e.key-1]);
  else if(e.key==='a'||e.key==='A'){cur.clusters.forEach(reveal);showBoard(cur)}
  else if(e.key==='r'||e.key==='R')location.reload();
  else if(e.key==='c'||e.key==='C')cr.classList.add('on');
  else if(e.key==='m'||e.key==='M')toggleSound();
  else if(e.key==='h'||e.key==='H')document.body.classList.toggle('clean');
  else if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}});
document.getElementById('next').onclick=e=>{e.stopPropagation();next()};
document.getElementById('prev').onclick=e=>{e.stopPropagation();back()};
document.getElementById('cbtn').onclick=e=>{e.stopPropagation();document.getElementById('credits').classList.add('on')};
window.addEventListener('resize',()=>{if(introOn)return;fitQuiet=true;setTimeout(()=>fitQuiet=false,0);if(phase==='wall')fit(WALL,0,1);else if(phase==='board')fit(cur.box,20);else if(phase==='zone')fit(clusterBox(zoomedOn),70);else fit(itemBox(zoomedOn),40)});
window.addEventListener('load',()=>{buildMarks();const q=new URLSearchParams(location.search);
  if(q.has('still'))document.body.classList.add('still');
  /* always start on the wall with no animation: animating away from the untransformed (scale 1) world
     never paints — the room layer is far too big at that scale — and left the old opening stuck on "01 The material" */
  world.style.transition='none';toWall();world.getBoundingClientRect();world.style.transition='';
  document.body.classList.add('ready');ready=true;if(doorQueued)setTimeout(openDoor,150);
  const v=q.get('view'),bd=boards[(+q.get('b')||1)-1]||boards[0];
  if(v)setTimeout(()=>{
    if(v==='board'){cur=bd;reveal(bd.hero);showBoard(bd)}
    else if(v==='all'){cur=bd;bd.clusters.forEach(reveal);showBoard(bd)}
    else if(v.startsWith('zone')){zoomZone(bd.clusters[+v.slice(4)-1])}},q.has('still')?0:300);});

/* sound: soft tap when the pointer crosses a card on an open board; M or the speaker button mutes */
document.querySelectorAll('.cluster .item').forEach(it=>it.addEventListener('mouseenter',()=>{if(phase!=='wall'&&!introOn&&shown(it.parentElement))SFX.tick()}));
const sbtn=document.getElementById('sbtn');function showSound(){sbtn.textContent=SFX.muted?'🔇':'🔊';sbtn.title=SFX.muted?'Sound off (M)':'Sound on (M)'}
function toggleSound(){SFX.toggle();showSound()}sbtn.onclick=e=>{e.stopPropagation();toggleSound()};showSound();

/* ===== presenter notes: N = panel on this page, P = separate window (drag it to the laptop screen;
   arrow keys pressed there drive this page too) ===== */
var notesEl=document.getElementById('notes'),pw=null;
function notesKey(){if(phase==='wall'||!cur)return'wall';if(phase==='board')return cur.id+':1';
  const c=phase==='item'&&zoomedOn?zoomedOn.parentElement:zoomedOn;return c?c.dataset.board+':'+c.dataset.step:cur.id+':1'}
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function notesHtml(){const n=NOTES[notesKey()];if(!n)return'';
  return`<h4>${esc(n.t)}</h4><div class="wk">Say</div><ol>${n.say.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`+
    (n.terms?`<div class="wk">Words to know</div><dl>${n.terms.map(([a,b])=>`<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>`:'')}
function updateNotes(){if(!notesEl)return;const h=notesHtml();notesEl.innerHTML=h;
  if(pw&&!pw.closed){const b=pw.document.getElementById('pn');if(b){b.innerHTML=h;pw.document.title='Notes — '+(NOTES[notesKey()]||{}).t}}}
function toggleNotes(){document.body.classList.toggle('notes');updateNotes()}
function openPresenter(){
  if(pw&&!pw.closed){pw.focus();return}
  pw=window.open('','wallnotes','width=560,height=820');if(!pw)return;
  const css=[...document.styleSheets].flatMap(ss=>{try{return[...ss.cssRules].map(r=>r.cssText).filter(t=>t.includes('.pn'))}catch(e){return[]}}).join('\n');
  pw.document.open();pw.document.write(`<!doctype html><meta charset="utf-8"><title>Notes</title><style>
    body{margin:0;background:#12161f;color:#eef1f6;font:19px/1.5 system-ui,Segoe UI,sans-serif}
    .pn{padding:22px 26px}.pn h4{font-size:16px}.bar{position:sticky;top:0;background:#1d2333;padding:8px 26px;font:13px system-ui;color:#8a93a6}
    ${css}</style><div class="bar">→ next · ← back · keys here control the presentation</div><div class="pn" id="pn"></div>`);pw.document.close();
  pw.document.addEventListener('keydown',e=>{if(e.key==='p'||e.key==='P')return;e.preventDefault();
    document.dispatchEvent(new KeyboardEvent('keydown',{key:e.key}))});
  updateNotes()}
document.getElementById('nbtn').onclick=e=>{e.stopPropagation();toggleNotes()};
document.addEventListener('keydown',e=>{if(introOn)return;
  if(e.key==='n'||e.key==='N')toggleNotes();else if(e.key==='p'||e.key==='P')openPresenter()});

