@echo off
rem Opens the presentation straight in fullscreen (Edge kiosk-style). Press Alt+F4 to close.
start "" msedge --start-fullscreen --new-window "%~dp0index.html"
