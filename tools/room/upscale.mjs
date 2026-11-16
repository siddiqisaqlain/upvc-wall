// room_base.png (1344x768) -> 4x-UltraSharp -> 2688x1536 tile-ControlNet detail pass -> 4x-UltraSharp -> saved (10752x6144)
import fs from 'fs';
const API = 'http://127.0.0.1:8188';
const fd = new FormData(); fd.append('image', new Blob([fs.readFileSync(new URL('./' + (process.env.BASE || 'room_base.png'), import.meta.url))]), (process.env.UPNAME || 'upvc_roombase.png')); fd.append('overwrite', 'true');
await fetch(API + '/upload/image', { method: 'POST', body: fd });
const pos = process.env.PROMPT || 'RAW photo, industrial loft living room, limewashed grey concrete plaster wall, polished concrete floor, antique persian rug, green velvet sofa, white uPVC window, plants, architectural interior photography, sharp focus, fine detail, photorealistic';
const neg = 'cartoon, illustration, painting, cgi, blurry, lowres, oversharpened, artifacts, text, watermark';
const g = {
  1: { class_type: 'CheckpointLoaderSimple', inputs: { ckpt_name: 'RealVisXL_V5.0_fp16.safetensors' } },
  2: { class_type: 'CLIPTextEncode', inputs: { text: pos, clip: ['1', 1] } },
  3: { class_type: 'CLIPTextEncode', inputs: { text: neg, clip: ['1', 1] } },
  4: { class_type: 'LoadImage', inputs: { image: (process.env.UPNAME || 'upvc_roombase.png') } },
  5: { class_type: 'UpscaleModelLoader', inputs: { model_name: '4x-UltraSharp.pth' } },
  6: { class_type: 'ImageUpscaleWithModel', inputs: { upscale_model: ['5', 0], image: ['4', 0] } },
  7: { class_type: 'ImageScale', inputs: { image: ['6', 0], upscale_method: 'lanczos', width: 2688, height: 1536, crop: 'disabled' } },
  8: { class_type: 'ControlNetLoader', inputs: { control_net_name: 'controlnet-union-promax.safetensors' } },
  9: { class_type: 'SetUnionControlNetType', inputs: { control_net: ['8', 0], type: 'tile' } },
  10: { class_type: 'ControlNetApplyAdvanced', inputs: { positive: ['2', 0], negative: ['3', 0], control_net: ['9', 0], image: ['7', 0], strength: 0.5, start_percent: 0, end_percent: 1, vae: ['1', 2] } },
  11: { class_type: 'VAEEncodeTiled', inputs: { pixels: ['7', 0], vae: ['1', 2], tile_size: 1024, overlap: 64, temporal_size: 64, temporal_overlap: 8 } },
  12: { class_type: 'KSampler', inputs: { model: ['1', 0], positive: ['10', 0], negative: ['10', 1], latent_image: ['11', 0], seed: 7, steps: 24, cfg: 4.5, sampler_name: 'dpmpp_2m_sde', scheduler: 'karras', denoise: 0.35 } },
  13: { class_type: 'VAEDecodeTiled', inputs: { samples: ['12', 0], vae: ['1', 2], tile_size: 1024, overlap: 64, temporal_size: 64, temporal_overlap: 8 } },
  14: { class_type: 'ImageUpscaleWithModel', inputs: { upscale_model: ['5', 0], image: ['13', 0] } },
  15: { class_type: 'SaveImage', inputs: { images: ['14', 0], filename_prefix: (process.env.OUT || 'upvc_room') + 'HI' } },
  16: { class_type: 'SaveImage', inputs: { images: ['13', 0], filename_prefix: (process.env.OUT || 'upvc_room') + 'MID' } },
};
const r = await (await fetch(API + '/prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: g }) })).json();
if (!r.prompt_id) { console.log(JSON.stringify(r, null, 1)); process.exit(1); }
const t0 = Date.now();
for (;;) { await new Promise(s => setTimeout(s, 4000));
  const e = (await (await fetch(API + '/history/' + r.prompt_id)).json())[r.prompt_id];
  if (e?.status?.status_str === 'error') { console.log(JSON.stringify(e.status.messages).slice(0, 1500)); process.exit(1); }
  if (e?.outputs?.['15']) { console.log('OUT', e.outputs['15'].images[0].filename, e.outputs['16'].images[0].filename, ((Date.now() - t0) / 1000).toFixed(0) + 's'); break; } }
