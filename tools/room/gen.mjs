// Generates the photoreal room through the local ComfyUI API (RealVisXL + union ControlNet on guide.png).
// usage: node gen.mjs <prefix> <seed> [cnStrength] [steps]
import fs from 'fs';
const [prefix = 'room', seed = '1', cn = '0.6', steps = '30'] = process.argv.slice(2);
const API = 'http://127.0.0.1:8188';
const guide = fs.readFileSync(new URL('./' + (process.env.GUIDE || 'guide.png'), import.meta.url));
{ const fd = new FormData(); fd.append('image', new Blob([guide]), 'upvc_guide.png'); fd.append('overwrite', 'true');
  await fetch(API + '/upload/image', { method: 'POST', body: fd }); }

const pos = process.env.PROMPT || (process.env.TWO ? `RAW photo, straight-on frontal view of an industrial loft living room, back wall of pale grey limewashed concrete plaster with patchy texture and soft stains, ` +
 `two thin black picture frames with white mats hanging on the wall: a square frame on the left and a large wide frame in the middle, each with a slim black LED picture light bar above it, ` +
 `a bright white uPVC plastic casement window with white frames and a transom on the right of the wall, white window handles, deep window reveal, white window sill, daylight, ` +
 `a low walnut wood sideboard under the square frame with a ceramic vase and a few books, a low dark green velvet sofa under the wide frame, an antique red persian rug with an ornate medallion pattern and cream border on a polished grey concrete floor, a beige travertine stone cube coffee table on the rug, ` +
 `a tall bird of paradise plant in a black pot on the far left, a small potted plant near the window, ` +
 `exposed metal conduit pipes along the concrete ceiling, black enamel industrial pendant lamps, warm interior light mixed with soft daylight, ` +
 `architectural interior photography, 24mm lens, eye level, natural shadows, highly detailed, photorealistic, 8k` : `RAW photo, straight-on frontal view of an industrial loft living room, back wall of pale grey limewashed concrete plaster with patchy texture and soft stains, ` +
 `a large thin black picture frame with a white mat hanging on the wall, a slim black LED picture light bar above the frame, ` +
 `a bright white uPVC plastic casement window with white frames and a transom on the left of the wall, white window handles, deep window reveal, white window sill, daylight, ` +
 `a low dark green boucle modular sofa under the frame, an antique red persian rug with an ornate medallion pattern and cream border on a polished grey concrete floor, a beige travertine stone cube coffee table on the rug, ` +
 `potted monstera on a stool, tall bird of paradise plant in a black pot, a tall leaning floor mirror with a thin black frame, a stack of magazines on the floor, ` +
 `exposed metal conduit pipes along the concrete ceiling, black enamel industrial pendant lamps, warm interior light mixed with soft daylight, ` +
 `architectural interior photography, 24mm lens, eye level, natural shadows, highly detailed, photorealistic, 8k`);
const neg = process.env.NEG || `cartoon, illustration, painting, render, cgi, 3d, drawing, sketch, lowres, blurry, distorted perspective, tilted, warped lines, people, person, text, watermark, logo, oversaturated, brick wall, black window frame, dark window frame, plants overlapping the frame`;

const g = {
  1: { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: 'RealVisXL_V5.0_fp16.safetensors' } },
  2: { class_type: 'CLIPTextEncode', inputs: { text: pos, clip: ['1', 1] } },
  3: { class_type: 'CLIPTextEncode', inputs: { text: neg, clip: ['1', 1] } },
  4: { class_type: 'LoadImage', inputs: { image: 'upvc_guide.png' } },
  5: { class_type: 'ControlNetLoader', inputs: { control_net_name: 'controlnet-union-promax.safetensors' } },
  6: { class_type: 'SetUnionControlNetType', inputs: { control_net: ['5', 0], type: 'canny/lineart/anime_lineart/mlsd' } },
  7: { class_type: 'ControlNetApplyAdvanced', inputs: { positive: ['2', 0], negative: ['3', 0], control_net: ['6', 0], image: ['4', 0], strength: +cn, start_percent: 0, end_percent: 0.8, vae: ['1', 2] } },
  8: { class_type: 'EmptyLatentImage', inputs: { width: 1344, height: 768, batch_size: 1 } },
  9: { class_type: 'KSampler', inputs: { model: ['1', 0], positive: ['7', 0], negative: ['7', 1], latent_image: ['8', 0], seed: +seed, steps: +steps, cfg: 5, sampler_name: 'dpmpp_2m_sde', scheduler: 'karras', denoise: 1 } },
  10: { class_type: 'VAEDecode', inputs: { samples: ['9', 0], vae: ['1', 2] } },
  11: { class_type: 'SaveImage', inputs: { images: ['10', 0], filename_prefix: prefix } },
};
const r = await (await fetch(API + '/prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: g }) })).json();
if (!r.prompt_id) { console.log(JSON.stringify(r, null, 1)); process.exit(1); }
const t0 = Date.now();
for (;;) {
  await new Promise(s => setTimeout(s, 3000));
  const h = await (await fetch(API + '/history/' + r.prompt_id)).json();
  const e = h[r.prompt_id];
  if (e?.status?.status_str === 'error') { console.log(JSON.stringify(e.status.messages).slice(0, 1500)); process.exit(1); }
  if (e?.outputs?.['11']) { for (const im of e.outputs['11'].images) console.log('OUT', im.filename, ((Date.now() - t0) / 1000).toFixed(0) + 's'); break; }
}
