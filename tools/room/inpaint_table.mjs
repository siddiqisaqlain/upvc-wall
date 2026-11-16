// Generates the photoreal room through the local ComfyUI API (RealVisXL + union ControlNet on guide.png).
// usage: node gen.mjs <prefix> <seed> [cnStrength] [steps]
import fs from 'fs';
const [prefix = 'room', seed = '1', cn = '0.6', steps = '30'] = process.argv.slice(2);
const API = 'http://127.0.0.1:8188';
const up=async(f,n)=>{const fd=new FormData();fd.append("image",new Blob([fs.readFileSync(new URL("./"+f,import.meta.url))]),n);fd.append("overwrite","true");await fetch(API+"/upload/image",{method:"POST",body:fd})};
await up("guide.png","upvc_guide.png");await up("base2.png","upvc_base.png");await up("mask.png","upvc_mask.png");

const pos = `RAW photo, a low solid beige travertine stone cube coffee table with natural pitted texture standing on an antique red persian rug, a small stack of art books on top, polished concrete floor, interior photography, photorealistic`;
const neg = `cartoon, illustration, painting, render, cgi, 3d, drawing, sketch, lowres, blurry, distorted perspective, tilted, warped lines, people, person, text, watermark, logo, oversaturated, black table, dark table, bowl, hole`;

const g = {
  1: { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: 'RealVisXL_V5.0_fp16.safetensors' } },
  2: { class_type: 'CLIPTextEncode', inputs: { text: pos, clip: ['1', 1] } },
  3: { class_type: 'CLIPTextEncode', inputs: { text: neg, clip: ['1', 1] } },
  4: { class_type: 'LoadImage', inputs: { image: 'upvc_guide.png' } },
  5: { class_type: 'ControlNetLoader', inputs: { control_net_name: 'controlnet-union-promax.safetensors' } },
  6: { class_type: 'SetUnionControlNetType', inputs: { control_net: ['5', 0], type: 'canny/lineart/anime_lineart/mlsd' } },
  7: { class_type: 'ControlNetApplyAdvanced', inputs: { positive: ['2', 0], negative: ['3', 0], control_net: ['6', 0], image: ['4', 0], strength: +cn, start_percent: 0, end_percent: 0.8, vae: ['1', 2] } },
  12: { class_type: 'LoadImage', inputs: { image: 'upvc_base.png' } },
  13: { class_type: 'LoadImageMask', inputs: { image: 'upvc_mask.png', channel: 'red' } },
  14: { class_type: 'VAEEncode', inputs: { pixels: ['12', 0], vae: ['1', 2] } },
  8: { class_type: 'SetLatentNoiseMask', inputs: { samples: ['14', 0], mask: ['13', 0] } },
  15: { class_type: 'ImageCompositeMasked', inputs: { destination: ['12', 0], source: ['10', 0], x: 0, y: 0, resize_source: false, mask: ['13', 0] } },
  9: { class_type: 'KSampler', inputs: { model: ['1', 0], positive: ['7', 0], negative: ['7', 1], latent_image: ['8', 0], seed: +seed, steps: +steps, cfg: 5, sampler_name: 'dpmpp_2m_sde', scheduler: 'karras', denoise: +(process.env.DN||0.92) } },
  10: { class_type: 'VAEDecode', inputs: { samples: ['9', 0], vae: ['1', 2] } },
  11: { class_type: 'SaveImage', inputs: { images: ['15', 0], filename_prefix: prefix } },
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
