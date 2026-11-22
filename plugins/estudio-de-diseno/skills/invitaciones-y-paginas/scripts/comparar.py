#!/usr/bin/env python3
"""Compara una imagen de referencia con la captura del diseño.

Uso:
    python3 comparar.py referencia.png captura.png [--salida comparacion.png] [--recorte-alto]

Escala la captura al ancho de la referencia y genera una imagen con tres columnas:
referencia | render | diferencias (rojo = no coincide). Imprime el % de píxeles
distintos por franjas horizontales para ubicar dónde corregir.
Con --recorte-alto recorta la captura a la proporción de la referencia (útil si la
referencia es solo la portada y la captura es la página completa).
"""
import argparse
from PIL import Image, ImageChops, ImageDraw, ImageOps

ap = argparse.ArgumentParser()
ap.add_argument("referencia")
ap.add_argument("captura")
ap.add_argument("--salida", default="comparacion.png")
ap.add_argument("--recorte-alto", action="store_true")
ap.add_argument("--umbral", type=int, default=40, help="diferencia mínima (0-255) para marcar un píxel")
a = ap.parse_args()

ref = Image.open(a.referencia).convert("RGB")
cap = Image.open(a.captura).convert("RGB")
W = ref.width
cap = cap.resize((W, round(cap.height * W / cap.width)), Image.LANCZOS)
if a.recorte_alto:
    cap = cap.crop((0, 0, W, min(cap.height, ref.height)))
H = max(ref.height, cap.height)

def lienzo(im):
    c = Image.new("RGB", (W, H), "white")
    c.paste(im, (0, 0))
    return c

r, c = lienzo(ref), lienzo(cap)
dif = ImageChops.difference(r, c).convert("L").point(lambda v: 255 if v > a.umbral else 0)
mapa = Image.composite(Image.new("RGB", (W, H), (220, 30, 40)), ImageOps.grayscale(r).convert("RGB").point(lambda v: 150 + v // 3), dif)

sep = 12
out = Image.new("RGB", (W * 3 + sep * 2, H + 40), (40, 40, 40))
d = ImageDraw.Draw(out)
for i, (im, t) in enumerate([(r, "REFERENCIA"), (c, "RENDER"), (mapa, "DIFERENCIAS")]):
    out.paste(im, (i * (W + sep), 40))
    d.text((i * (W + sep) + 10, 12), t, fill="white")
out.save(a.salida)

total = sum(dif.histogram()[255:]) / (W * H) * 100
print(f"Comparación guardada en {a.salida}")
print(f"Píxeles distintos: {total:.1f}%")
franjas = 10
for k in range(franjas):
    y0, y1 = H * k // franjas, H * (k + 1) // franjas
    trozo = dif.crop((0, y0, W, y1))
    p = trozo.histogram()[255] / (W * (y1 - y0)) * 100
    barra = "█" * round(p / 2)
    print(f"  franja {k + 1:2d} ({y0 * 100 // H:3d}–{y1 * 100 // H:3d}% alto): {p:5.1f}% {barra}")
