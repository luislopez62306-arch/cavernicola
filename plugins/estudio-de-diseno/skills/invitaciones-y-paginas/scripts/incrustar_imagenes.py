#!/usr/bin/env python3
"""Incrusta las imágenes locales de un HTML como WebP base64 (archivo autocontenido).

Uso:
    python3 incrustar_imagenes.py entrada.html [salida.html] [--ancho-max 1440] [--calidad 88]

Busca src="...", url(...) y valores en CONFIG con rutas locales a .png/.jpg/.jpeg/.webp/.gif,
las redimensiona si superan --ancho-max (2× el ancho de una columna de 480 px es 960;
1440 cubre pantallas 3×), las convierte a WebP y las reemplaza por data URIs.
Los SVG se incrustan como texto URL-codificado. No toca URLs http(s) ni data: existentes.
"""
import argparse
import base64
import io
import os
import re
import sys
import urllib.parse
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("entrada")
ap.add_argument("salida", nargs="?")
ap.add_argument("--ancho-max", type=int, default=1440)
ap.add_argument("--calidad", type=int, default=88)
a = ap.parse_args()

base = os.path.dirname(os.path.abspath(a.entrada))
html = open(a.entrada, encoding="utf-8").read()
cache, total = {}, [0, 0]

def a_data_uri(ruta):
    if ruta in cache:
        return cache[ruta]
    p = os.path.join(base, urllib.parse.unquote(ruta))
    if not os.path.isfile(p):
        print(f"  ! no existe: {ruta}", file=sys.stderr)
        return None
    total[0] += os.path.getsize(p)
    if p.lower().endswith(".svg"):
        uri = "data:image/svg+xml," + urllib.parse.quote(open(p, encoding="utf-8").read(), safe=" =:/;,'#")
    else:
        im = Image.open(p)
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        if im.width > a.ancho_max:
            im = im.resize((a.ancho_max, round(im.height * a.ancho_max / im.width)), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=a.calidad, method=6)
        uri = "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()
    total[1] += len(uri)
    print(f"  ✔ {ruta} → {len(uri) // 1024} KB")
    cache[ruta] = uri
    return uri

patron = re.compile(r"""(src=["']|url\(["']?|["'])([^"'()\s]+?\.(?:png|jpe?g|webp|gif|svg))(?=["')])""", re.I)

def reemplazo(m):
    ruta = m.group(2)
    if re.match(r"^(https?:|data:|//)", ruta):
        return m.group(0)
    uri = a_data_uri(ruta)
    return m.group(1) + uri if uri else m.group(0)

html = patron.sub(reemplazo, html)
destino = a.salida or a.entrada
open(destino, "w", encoding="utf-8").write(html)
print(f"Listo: {destino} · imágenes {total[0] // 1024} KB originales → {total[1] // 1024} KB incrustadas · HTML {len(html) // 1024} KB")
if len(html) > 10 * 1024 * 1024:
    print("⚠ El HTML supera 10 MB: baja --ancho-max o --calidad, o publica las imágenes como archivos aparte.")
