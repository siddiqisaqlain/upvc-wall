// usage: node search-web.mjs "query" "Category:X" "sub:Category:X" ...
//   plain text  -> Commons full-text file search
//   Category:X  -> files in that category
//   sub:Category:X -> subcategories of X
const UA = { 'User-Agent': 'edu-wall-presentation/1.0 (educational)' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const API = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&';
async function get(u) {
  for (let t = 0; t < 6; t++) {
    await sleep(4000);
    const tx = await (await fetch(u, { headers: UA })).text();
    try { return JSON.parse(tx) } catch { await sleep(20000 * (t + 1)) }
  }
}
for (const q of process.argv.slice(2)) {
  console.log('=== ' + q);
  if (q.startsWith('sub:')) {
    const d = await get(API + `list=categorymembers&cmtype=subcat&cmlimit=200&cmtitle=${encodeURIComponent(q.slice(4))}`);
    console.log('  ' + (d?.query?.categorymembers || []).map(c => c.title.replace('Category:', '')).join(' | '));
    continue;
  }
  const gen = q.startsWith('Category:')
    ? `generator=categorymembers&gcmtype=file&gcmlimit=50&gcmtitle=${encodeURIComponent(q)}`
    : `generator=search&gsrnamespace=6&gsrlimit=25&gsrsearch=${encodeURIComponent(q)}`;
  const d = await get(API + gen + '&prop=imageinfo&iiprop=url|size|extmetadata&iiextmetadatafilter=LicenseShortName');
  const pages = Object.values(d?.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
  for (const p of pages) {
    const ii = p.imageinfo?.[0]; if (!ii) continue;
    if (!/\.(jpe?g|png)$/i.test(p.title)) continue;
    console.log(`  ${p.title} | ${ii.extmetadata?.LicenseShortName?.value} | ${ii.width}x${ii.height}`);
  }
}
