# uPVC Windows & Doors — Case Wall

An interactive "investigation wall" presentation about uPVC windows, doors and hardware, made for an architecture class.

Open `index.html` in a browser (works offline).

- Opens on a room wall with a whiteboard: **hover the board** to bring up the title, then **hover each topic** to pin its cards on one by one
- Click a topic or card to zoom in · `→` / Space / clicker: next topic · `←` / Esc: back
- `W` wall · `B` board · `A` reveal all · `C` credits · `F` fullscreen · `H` hide bar

The page is built from `tools/parts/*` by `node tools/build.mjs`. The room is baked into `img/wall.jpg` (screenshot `tools/scene.html` at 6300×3780 and convert to JPEG) so the camera stays smooth.

Photos are from Wikimedia Commons under their own licences (see the Credits screen and `img/credits.json`). Diagrams are schematic and not to scale.
