// Crops the market-survey photos (D:\RANGREZ\wall\hardware) into img/hw/<key>.jpg
// crop = [x0, y0, x1, y1] as fractions of the upright image.  usage: node tools/hw/crops.mjs
import fs from 'fs';
import { execFileSync } from 'child_process';
const SRC = 'D:/RANGREZ/wall/hardware/';
const list = fs.readFileSync(new URL('./list.txt', import.meta.url), 'utf8').split(/\r?\n/).filter(Boolean);
const file = n => /.heic$/i.test(list[n - 1]) ? `D:/RANGREZ/wall/upvc-board/tools/hw/heic/${String(n).padStart(2, '0')}.jpg` : SRC + list[n - 1];
const C = {
  'hinges-ss':      [50, [0, .27, 1, .63]],
  'stoppers':       [50, [.05, 0, .66, .25]],
  'hinge-hand':     [27, [.22, .32, .82, .74]],
  'towerbolt-hand': [28, [.12, .28, .97, .7]],
  'bolts-board':    [10, [0, 0, 1, 1]],
  'aldrops':        [22, [0, 0, 1, 1]],
  'gate-hooks':     [47, [0, .1, .52, 1]],
  'ss-board':       [48, [0, 0, 1, 1]],
  'dorset':         [13, [.2, .1, .86, 1]],
  'hafele-locks':   [52, [.2, 0, .8, 1]],
  'mortise-bodies': [55, [.2, .05, .82, 1]],
  'closers':        [53, [.22, .36, .88, .74]],
  'closer-panel':   [53, [.25, 0, .95, 1]],
  'glass-panel':    [54, [.15, 0, .78, 1]],
  'main-pulls':     [39, [0, 0, 1, 1]],
  'brass-pull':     [6,  [.22, .18, .82, 1]],
  'profiles':       [2,  [0, .25, 1, 1]],
  'knobs':          [7,  [.08, .32, .96, .96]],
  'flush-pulls':    [3,  [0, .28, 1, .86]],
  'curvy-pulls':    [44, [0, .1, 1, .9]],
  'pull-wall':      [36, [0, 0, 1, 1]],
  'handle-hand':    [56, [0, .08, 1, .86]],
  'curtain-rods':   [49, [0, 0, 1, 1]],
  'finials':        [14, [.18, .04, .92, .86]],
  'coat-rail':      [19, [.08, .08, .92, .92]],
  'robe-hooks':     [24, [.08, 0, .78, .46]],
  'shop':           [15, [0, 0, 1, 1]],
  'survey-1':       [61, [0, 0, 1, 1]],
  'survey-2':       [58, [0, 0, 1, 1]],
  'aldrop-board':   [37, [0, 0, 1, 1]],
  'decor-pulls':    [40, [0, 0, 1, 1]],
};
fs.mkdirSync(new URL('../../img/hw/', import.meta.url), { recursive: true });
for (const [key, [n, [x0, y0, x1, y1]]] of Object.entries(C)) {
  const out = new URL(`../../img/hw/${key}.jpg`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  const vf = `crop=iw*${x1 - x0}:ih*${y1 - y0}:iw*${x0}:ih*${y0},scale='min(900,iw)':-2`;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file(n), '-frames:v', '1', '-update', '1', '-vf', vf, '-q:v', '3', out]);
  console.log(key, '<-', list[n - 1]);
}
