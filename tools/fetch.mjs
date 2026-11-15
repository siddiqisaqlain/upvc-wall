// usage: node fetch.mjs  -> downloads picks into ../img and writes ../img/credits.json
import fs from 'fs';
const picks = [
 ['sash','UPVC Sash Window','UPVC Sash Window.jpg'],
 ['india','Pondicherry UPVC window Golden grill','Windows of Pondicherry'],
 ['tt-closed','Hotel Terminus closed tilt and turn window','closed tilt and turn'],
 ['tt-open','Hotel Terminus open tilt and turn windows','open tilt and turn'],
 ['casement','Modern Casement Window 01','Modern Casement Window 01'],
 ['espag','Espagnolette.JPG','Espagnolette.JPG'],
 ['diderot','Espagnolette Diderot Encyclopedie XXXIV','XXXIV'],
 ['handle','Fenstergriff Tensolock F 04','Tensolock'],
 ['liftslide','Motorische-Hebeschiebetür','Hebeschiebet'],
 ['beschlag','Fensterbeschlag-Imbach','Fensterbeschlag-Imbach'],
 ['timber','EURO 68 wooden window profile with insulated glazing 01','glazing 01'],
 ['dh','Double hung window.jpeg','Double hung window.jpeg'],
 ['balancer','Spiral Balancer 001','Spiral Balancer'],
 ['dgu','Будова Склопакета','Будова'],
];
fs.mkdirSync('../img',{recursive:true});
const credits={};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for (const [key,q,must] of picks){
  const u=`https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=15&gsrsearch=${encodeURIComponent(q)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&iiextmetadatafilter=LicenseShortName|Artist`;
  let d; for(let t=0;t<5;t++){ await sleep(3000); const tx=await (await fetch(u,{headers:{'User-Agent':'edu-wall-presentation/1.0 (educational)'}})).text(); try{d=JSON.parse(tx);break}catch{await sleep(15000)} }
  const p=Object.values(d?.query?.pages||{}).find(p=>p.title.includes(must));
  if(!p){console.log('MISS',key);continue}
  const ii=p.imageinfo[0], m=ii.extmetadata;
  const src=ii.thumburl||ii.url;
  let buf; for(let t=0;t<4;t++){ await sleep(3000); const r=await fetch(src,{headers:{'User-Agent':'edu-wall-presentation/1.0 (educational)'}}); if(r.ok){buf=Buffer.from(await r.arrayBuffer());break} await sleep(15000)}
  if(!buf){console.log('DLFAIL',key);continue}
  const ext=src.match(/\.(jpe?g|png)$/i)?.[0].toLowerCase()||'.jpg';
  fs.writeFileSync(`../img/${key}${ext}`,buf);
  credits[key]={file:`img/${key}${ext}`,title:p.title,page:ii.descriptionurl,license:m.LicenseShortName?.value,artist:(m.Artist?.value||'').replace(/<[^>]+>/g,'').trim()};
  console.log('OK',key,p.title,buf.length);
}
fs.writeFileSync('../img/credits.json',JSON.stringify(credits,null,1));
