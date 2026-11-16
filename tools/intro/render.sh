#!/bin/sh
# Renders tools/intro/title.html to a transparent PNG for the door scene (needs internet once for the Google fonts).
E="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$E" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --default-background-color=00000000 \
  --virtual-time-budget=6000 --window-size=1480,1100 --screenshot="D:/RANGREZ/wall/upvc-board/img/intro/wall-title.png" \
  "file:///D:/RANGREZ/wall/upvc-board/tools/intro/title.html" 2>/dev/null
ffmpeg -loglevel error -y -i D:/RANGREZ/wall/upvc-board/img/intro/wall-title.png -c:v libwebp -quality 88 -pix_fmt yuva420p D:/RANGREZ/wall/upvc-board/img/intro/wall-title.webp && rm D:/RANGREZ/wall/upvc-board/img/intro/wall-title.png
