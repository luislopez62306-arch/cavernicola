# Modo fidelidad: replicar una imagen de referencia

El usuario quiere *esa* pieza con sus datos. La medida del éxito es que, puestas
lado a lado, no se distingan salvo por los textos que pidió cambiar.

## 1. Analizar antes de escribir código
Mira la referencia con la herramienta de lectura de imágenes y anota:
- Proporción del lienzo (ancho:alto) y de cada bloque/sección.
- Lista de elementos con su caja aproximada en % del ancho/alto (izq, arriba,
  ancho, alto) y su rotación.
- Fuentes: identifica la familia más cercana en Google Fonts (script con trazo
  fino → Pinyon Script / Great Vibes; serif de mayúsculas romanas → Forum /
  Cinzel; serif fina de cifras → Cormorant Garamond). Prueba 2–3 candidatas y
  compara.
- Colores: extrae con cuentagotas (Pillow):
  ```bash
  python3 -c "from PIL import Image;im=Image.open('ref.png').convert('RGB');print('#%02x%02x%02x'%im.getpixel((X,Y)))"
  ```
- Qué es imagen (adornos, flores, marcos, texturas, fotos) y qué es texto vivo.

## 2. Adornos e ilustraciones
Orden de preferencia:
1. **Recortar de la referencia** los adornos y fondos (Pillow `crop`), limpiar el
   texto original (rellenar con el color/textura del fondo) y reutilizarlos. Es lo
   más fiel.
2. Si el recorte queda pequeño o borroso: escalar ×2–×4 con `Image.LANCZOS` +
   `ImageFilter.UnsharpMask(radius=2, percent=120)`; si hay herramientas de IA de
   imagen disponibles (p. ej. generación/expansión de imágenes vía MCP), úsalas
   para obtener versión en alta resolución del *mismo* adorno.
3. Formas geométricas, marcos simples, filetes, corazones, flores esquemáticas:
   **redibujar en SVG** (nítido a cualquier tamaño).
Exporta a WebP calidad 85–90 e incrusta con `scripts/incrustar_imagenes.py`.

## 3. Maquetar sobre la imagen
- Cada sección = `<section>` con la imagen de fondo como `<img class="bg">`
  (ancho 100 %, alto automático, así se respeta la proporción exacta) y el texto
  en capas `position:absolute` con `left/top/width/height` en **%** de la sección.
- Tamaños de letra en `cqw` (con `container-type:inline-size` en la columna) para
  que todo escale junto en cualquier pantalla.
- Rotaciones con `transform: rotate(-8deg)` medidas en la referencia.
- Si el texto debe caer dentro de un marco, usa una caja flex centrada del tamaño
  del hueco del marco.

## 4. Comparar e iterar
```bash
node scripts/captura.js invitacion.html --salida out
python3 scripts/comparar.py referencia.png out/movil.png --salida out/comparacion.png
```
`comparacion.png` muestra referencia | render | mapa de diferencias (rojo = no
coincide). Revisa por zonas: posición de cada texto (±1 % del ancho), tamaño,
color, grosor, interlineado, espaciado entre letras. Corrige y repite. Detente
cuando el mapa de diferencias solo marque los textos que el usuario cambió.

Si la referencia tiene texto en otro idioma, tradúcelo con el mismo largo
aproximado para no romper la composición; si queda más largo, reduce el tamaño
de letra antes que mover los adornos.
