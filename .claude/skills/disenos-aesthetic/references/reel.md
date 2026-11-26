# Reels animados (HTML → MP4)
1. `reel.html` a 1080×1920 que expone `window.render(t)` (t en segundos) y dibuja TODO en función de t (sin animaciones CSS con reloj).
2. `grabar.js`: Playwright abre la página, para cada frame (30 fps) llama `render(i/30)`, screenshot a `f/0001.png`.
3. `ffmpeg -y -framerate 30 -i f/%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 reel.mp4`.
4. Estructura que funcionó (13 s): gancho 0–2 s → 3 escenas de 3 s con zoom lento → cierre con logo, frase y WhatsApp 2 s.
5. Revisa 3 frames sueltos (inicio, mitad, cierre) antes de entregar.
