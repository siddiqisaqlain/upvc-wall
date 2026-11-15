/* ---------- diagram generators ---------- */
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent,text){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(text!=null)e.textContent=text;parent&&parent.appendChild(e);return e}
const INK='#1f2a44';
function win(g,x,y,w,h){el('rect',{x,y,width:w,height:h,fill:'#fff',stroke:INK,'stroke-width':4},g);el('rect',{x:x+10,y:y+10,width:w-20,height:h-20,fill:'#dcecf7',stroke:INK},g)}
function tri(g,pts,dash){el('polyline',{points:pts.map(p=>p.join(',')).join(' '),fill:'none',stroke:INK,'stroke-width':1.6,'stroke-dasharray':dash||''},g)}
function arrow(g,x1,y1,x2,y2){el('line',{x1,y1,x2,y2,stroke:'#b3121b','stroke-width':3,'marker-end':'url(#arr)'},g)}
function label(g,x,y,t,s){el('text',{x,y,'text-anchor':'middle',class:'lbl',style:'font-size:'+(s||15)+'px;font-weight:600'},g,t)}

(function types(){
  const s=document.getElementById('typesGrid');const W=170,H=170,cw=200,ch=230;
  const list=[
   ['Fixed',(g,x,y,w,h)=>{label(g,x+w/2,y+h/2+5,'FIXED',13)}],
   ['Side-hung casement',(g,x,y,w,h)=>tri(g,[[x+w-10,y+10],[x+10,y+h/2],[x+w-10,y+h-10]])],
   ['Top-hung',(g,x,y,w,h)=>tri(g,[[x+10,y+h-10],[x+w/2,y+10],[x+w-10,y+h-10]])],
   ['Bottom-hung (hopper)',(g,x,y,w,h)=>tri(g,[[x+10,y+10],[x+w/2,y+h-10],[x+w-10,y+10]],'6 5')],
   ['Tilt & turn',(g,x,y,w,h)=>{tri(g,[[x+w-10,y+10],[x+10,y+h/2],[x+w-10,y+h-10]],'6 5');tri(g,[[x+10,y+10],[x+w/2,y+h-10],[x+w-10,y+10]],'2 4')}],
   ['Horizontal sliding',(g,x,y,w,h)=>{el('line',{x1:x+w/2,y1:y+10,x2:x+w/2,y2:y+h-10,stroke:INK,'stroke-width':3},g);arrow(g,x+30,y+h/2,x+w/2-12,y+h/2);label(g,x+w*.75,y+h/2+5,'fixed',12)}],
   ['Vertical sliding sash',(g,x,y,w,h)=>{el('line',{x1:x+10,y1:y+h/2,x2:x+w-10,y2:y+h/2,stroke:INK,'stroke-width':3},g);arrow(g,x+w/2,y+h-22,x+w/2,y+h/2+12);arrow(g,x+w/2,y+22,x+w/2,y+h/2-12)}],
   ['Pivot (centre-hung)',(g,x,y,w,h)=>{el('line',{x1:x+4,y1:y+h/2,x2:x+w-4,y2:y+h/2,stroke:'#b3121b','stroke-width':2,'stroke-dasharray':'10 4 2 4'},g);el('circle',{cx:x+6,cy:y+h/2,r:5,fill:'#b3121b'},g);el('circle',{cx:x+w-6,cy:y+h/2,r:5,fill:'#b3121b'},g);tri(g,[[x+10,y+10],[x+10,y+h/2],[x+w-10,y+10]],'6 5');tri(g,[[x+10,y+h-10],[x+w-10,y+h/2],[x+w-10,y+h-10]])}],
  ];
  list.forEach(([name,fn],i)=>{const x=15+(i%4)*cw,y=10+Math.floor(i/4)*ch;const g=el('g',{},s);win(g,x,y,W,H);fn(g,x,y,W,H);label(g,x+W/2,y+H+28,name,16)});
})();

(function doors(){
  const s=document.getElementById('doorsGrid');const ch=225;
  function door(g,x,y,w,h){el('rect',{x,y,width:w,height:h,fill:'#fff',stroke:INK,'stroke-width':4},g);el('rect',{x:x+9,y:y+9,width:w-18,height:h-18,fill:'#dcecf7',stroke:INK},g)}
  // French doors
  let g=el('g',{},s);door(g,20,20,80,170);door(g,100,20,80,170);
  tri(g,[[91,29],[29,105],[91,181]]);tri(g,[[109,29],[171,105],[109,181]]);label(g,100,215,'French doors (pair)',16);
  // sliding patio
  g=el('g',{},s);door(g,220,20,90,170);door(g,300,20,90,170);arrow(g,240,105,300,105);label(g,305,215,'Sliding patio (in-line)',16);
  // lift & slide
  g=el('g',{},s);door(g,420,20,95,170);door(g,505,20,95,170);arrow(g,440,105,500,105);arrow(g,465,170,465,138);label(g,510,215,'Lift & slide',16);
  label(g,490,162,'lift',12);
  // entrance
  g=el('g',{},s);el('rect',{x:640,y:20,width:110,height:170,fill:'#f1f3f6',stroke:INK,'stroke-width':4},g);
  el('rect',{x:656,y:36,width:78,height:60,fill:'#dcecf7',stroke:INK},g);
  [40,75,105,140,175].forEach(yy=>el('circle',{cx:738,cy:yy,r:4.5,fill:'#b3121b'},g));el('rect',{x:722,y:100,width:8,height:30,rx:3,fill:INK},g);
  label(g,695,215,'Entrance (multipoint)',16);
  // bi-fold elevation + plan
  g=el('g',{transform:'translate(0,30)'},s);for(let i=0;i<4;i++)door(g,20+i*70,250,70,150);
  el('polyline',{points:'40,440 75,415 110,440 145,415 180,440 215,415 250,440 285,415',fill:'none',stroke:'#b3121b','stroke-width':3},g);
  label(g,160,412,'',14);el('text',{x:20,y:458,class:'lbl',style:'font-size:13px'},g,'plan: panels fold & stack to one side');
  label(g,160,240,'Bi-fold / slide & fold',16);
  // tilt & slide
  g=el('g',{transform:'translate(0,30)'},s);door(g,330,250,100,150);door(g,420,250,100,150);
  tri(g,[[339,259],[380,391],[421,259]],'6 5');arrow(g,355,325,420,325);label(g,425,240,'Tilt & slide (PSK)',16);
  // threshold detail
  g=el('g',{transform:'translate(0,30)'},s);el('rect',{x:570,y:330,width:200,height:20,fill:'#cfd6dd',stroke:INK},g);el('rect',{x:600,y:290,width:140,height:40,fill:'#fff',stroke:INK,'stroke-width':2},g);
  el('path',{d:'M560 350 H780',stroke:INK},g);el('path',{d:'M760 330 V350',stroke:'#b3121b','stroke-width':2,'marker-start':'url(#arr)','marker-end':'url(#arr)'},g);
  label(g,670,375,'low threshold ≈ 15–20 mm',14);label(g,670,240,'Threshold detail',16);
})();

(function tilt(){
  const g=document.getElementById('tt');
  const pos=[['Handle DOWN','closed & locked',0,null],['Handle SIDEWAYS','TURN — swings in like a door',90,'turn'],['Handle UP','TILT — top opens ~10–15 cm',180,'tilt']];
  pos.forEach(([t,d,ang,mode],i)=>{
    const x=20+i*260;const gg=el('g',{},g);
    el('rect',{x,y:20,width:120,height:180,fill:'#fff',stroke:INK,'stroke-width':4},gg);el('rect',{x:x+10,y:30,width:100,height:160,fill:'#dcecf7',stroke:INK},gg);
    if(mode==='turn')tri(gg,[[x+110,30],[x+10,110],[x+110,190]],'6 5');
    if(mode==='tilt')tri(gg,[[x+10,30],[x+60,190],[x+110,30]],'6 5');
    if(!mode)el('text',{x:x+60,y:115,'text-anchor':'middle',style:'font-size:30px'},gg,'🔒');
    const hx=x+170,hy=95;el('circle',{cx:hx,cy:hy,r:44,fill:'none',stroke:'#c8d3df','stroke-width':2},gg);
    const h=el('g',{transform:`rotate(${ang} ${hx} ${hy})`},gg);el('rect',{x:hx-9,y:hy-9,width:18,height:18,rx:4,fill:INK},h);el('rect',{x:hx-5,y:hy,width:10,height:44,rx:5,fill:'#b3121b'},h);
    el('text',{x:x+100,y:235,'text-anchor':'middle',class:'lbl',style:'font-weight:700;font-size:16px'},gg,t);
    el('text',{x:x+100,y:258,'text-anchor':'middle',class:'lbl',style:'font-size:14px'},gg,d);
  });
})();

