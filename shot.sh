#!/bin/sh
# Render page.html to entry.png with headless Chromium and crop to 1024x1024.
# Headless Chrome's --window-size reserves ~87px, so shoot taller and crop.
set -e
cd "$(dirname "$0")"
CHROME="$HOME/.cache/ms-playwright/chromium-1187/chrome-linux/chrome"
"$CHROME" --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1024,1111 \
  --screenshot=/tmp/news-image-20261127-full.png "file://$PWD/page.html"
python3 -c "from PIL import Image; Image.open('/tmp/news-image-20261127-full.png').convert('RGB').crop((0,0,1024,1024)).save('entry.png', optimize=True)"
ls -la entry.png
