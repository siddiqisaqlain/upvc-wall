# uPVC Windows & Doors — Case Wall

An interactive "investigation wall" presentation about uPVC windows, doors and hardware, made for an architecture class.

Open `index.html` in a browser (works offline).

- Opens on a photoreal loft room (concrete wall, uPVC window, sofa, rug) with the board as a framed, picture-lit print: **hover the board** to bring up the title, then **hover each topic** to pin its cards on one by one
- Click a topic or card to zoom in · `→` / Space / clicker: next topic · `←` / Esc: back
- `W` wall · `B` board · `A` reveal all · `C` credits · `F` fullscreen · `H` hide bar

The page is built from `tools/parts/*` by `node tools/build.mjs`. The room photo is AI-generated locally (ComfyUI, RealVisXL + ControlNet on `tools/room/guide.png`; scripts in `tools/room/`) as `tools/room/room.jpg`. It is baked with the frame and light bar into `img/wall.jpg` (screenshot `tools/scene.html` at 7000×4000, convert to JPEG) so the camera stays smooth.

Photos are from Wikimedia Commons under their own licences (see the Credits screen and `img/credits.json`). Diagrams are schematic and not to scale.
