// usage: node fetch-web.mjs <picks.json> <outDir> [creditsOut]
//   picks.json = [["key","File:Exact title.jpg"], ...]
// Downloads each Commons file at ~1200 px wide as JPEG (Commons renders PNG thumbs as PNG,
// so PNG sources are kept as .png) and records licence/author from extmetadata.
import fs from 'fs';
import path from 'path';
const [picksFile, outDir, creditsOut] = process.argv.slice(2);
const picks = JSON.parse(fs.readFileSync(picksFile, 'utf8'));
const UA = { 'User-Agent': 'edu-wall-presentation/1.0 (educational)' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
fs.mkdirSync(outDir, { recursive: true });
const credits = creditsOut && fs.existsSync(creditsOut) ? JSON.parse(fs.readFileSync(creditsOut, 'utf8')) : {};
const strip = s => (s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
for (const [key, title] of picks) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&iiextmetadatafilter=LicenseShortName|Artist|LicenseUrl`;
  let d;
  for (let t = 0; t < 6; t++) {
    await sleep(4000);
    const tx = await (await fetch(u, { headers: UA })).text();
    try { d = JSON.parse(tx); break } catch { await sleep(20000 * (t + 1)) }
  }
  const p = Object.values(d?.query?.pages || {})[0];
  const ii = p?.imageinfo?.[0];
  if (!ii) { console.log('MISS', key, title); continue }
  const src = ii.thumburl || ii.url;
  let buf;
  for (let t = 0; t < 5; t++) {
    await sleep(4000);
    const r = await fetch(src, { headers: UA });
    if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); break }
    await sleep(20000 * (t + 1));
  }
  if (!buf) { console.log('DLFAIL', key); continue }
  const ext = /\.png$/i.test(src) ? '.png' : '.jpg';
  const file = path.join(outDir, key + ext);
  fs.writeFileSync(file, buf);
  const m = ii.extmetadata || {};
  credits[key] = {
    file: `img/hw/web/${key}${ext}`,
    title: p.title,
    page: ii.descriptionurl,
    license: m.LicenseShortName?.value,
    licenseUrl: m.LicenseUrl?.value,
    artist: strip(m.Artist?.value),
  };
  console.log('OK', key, p.title, buf.length, credits[key].license, '|', credits[key].artist);
}
if (creditsOut) fs.writeFileSync(creditsOut, JSON.stringify(credits, null, 1));
