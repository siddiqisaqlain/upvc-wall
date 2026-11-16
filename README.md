# Hardware & uPVC — Case Wall

An interactive "investigation wall" presentation for an architecture class with two framed boards: **Board 1 — building hardware in the Indian market** (our market-survey photos + researched facts) and **Board 2 — uPVC windows & doors**.

Open `index.html` in a browser (works offline).

- Opens on a photoreal loft room (concrete wall, uPVC window, sofa, rug) with the board as a framed, picture-lit print: **hover the board** to bring up the title, then **hover each topic** to pin its cards on one by one
- `→` from the wall opens Board 1 (hardware), walks its topics, then moves to Board 2 · `1` / `2` jump to a board
- Click a topic or card to zoom in · `→` / Space / clicker: next topic · `←` / Esc: back
- `W` wall · `B` board · `A` reveal all · `C` credits · `F` fullscreen · `H` hide bar

The page is built from `tools/parts/*` by `node tools/build.mjs` (hardware cards: `tools/parts/hw-clusters.html`, uPVC cards: `tools/parts/clusters.html`, navigation: `tools/parts/nav.js`). Survey photos are cropped from the originals by `node tools/hw/crops.mjs`; web photos and sourced notes are in `tools/hw/` (`web-credits.json`, `research.md`). The room photo is AI-generated locally (ComfyUI, RealVisXL + ControlNet on `tools/room/guide2.png`; scripts in `tools/room/`) as `tools/room/room.jpg`. It is baked with the frame and light bar into `img/wall.jpg` (screenshot `tools/scene.html` at 7000×4000, convert to JPEG) so the camera stays smooth.

Photos are from Wikimedia Commons under their own licences (see the Credits screen and `img/credits.json`). Diagrams are schematic and not to scale.

## Presenting

- **Start:** double-click `present.cmd` (opens Edge fullscreen), or open `index.html` — the first click on the door switches to fullscreen.
- **Opening scene:** a uPVC front door with "MARKET SURVEY — BY SHAHID NAZIR KHAN" stencil-sprayed on the wall (`tools/intro/title.html`, rendered by `tools/intro/render.sh`).
- **Keys:** → next · ← back · W wall · 1 / 2 boards · B board · A reveal all · **N notes** · **P presenter window** · M sound · C credits · F fullscreen.
- **Presenter notes** (`tools/parts/notes.js`): a short "say" script and plain-language "words to know" for every stop. P opens them in a separate window you can keep on the laptop screen; arrow keys there drive the presentation.
- **Board 1** starts with the field visit: Sidiq Hardware Store, Sopore (34.288921° N, 74.456045° E).
- **Sound effects** (`tools/parts/sfx.js`) are synthesised live — no audio files.
