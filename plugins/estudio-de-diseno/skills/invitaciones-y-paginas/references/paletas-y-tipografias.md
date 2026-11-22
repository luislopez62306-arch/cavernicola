# Paletas y tipografías

Elige **una paleta** y **una combinación de fuentes**. Declara todo en `:root`
antes de maquetar. Roles: `--fondo`, `--superficie`, `--tinta` (texto), `--acento`,
`--acento-2`, `--linea`. Comprueba contraste ≥ 4.5:1 entre `--tinta` y el fondo
donde haya párrafos.

## Paletas (hex exactos)

| Nombre | fondo | superficie | tinta | acento | acento-2 | línea | Ideal para |
|---|---|---|---|---|---|---|---|
| Burdeos y cielo | #b3c6d6 | #f4ecdc | #46161d | #5e1d27 | #c3d4ea | #a2958a | Boda clásica-romántica |
| Marfil y oro | #faf6ee | #ffffff | #3b3328 | #b8925a | #e8d9bd | #d9cbb0 | Boda elegante, bautizo |
| Salvia | #eef1ea | #fbfaf6 | #2f3a2f | #7d8f6e | #c9d3bf | #b7c0ad | Boda campestre/jardín |
| Terracota | #f6ede3 | #fffaf4 | #3e2a22 | #c0673f | #e3b28f | #d8c3b0 | Boda boho, cumpleaños adulto |
| Noche y champán | #14161c | #1e2129 | #f2ead9 | #d6b77a | #8b7a5a | #3a3d46 | Gala, graduación, XV elegante |
| Rosa empolvado | #f8eeee | #fffafa | #4a2c33 | #c98b96 | #ecc9cf | #e0c4c8 | XV años, baby shower niña |
| Azul niebla | #edf2f6 | #ffffff | #233446 | #6d8fb3 | #c7d6e6 | #c5d0db | Bautizo, baby shower niño |
| Lavanda | #f1eef7 | #fdfcff | #352d4a | #8a78b5 | #d6cdea | #cfc8de | XV años, primavera |
| Esmeralda | #0f2e26 | #163b31 | #f3ecdd | #c9a961 | #4f8a74 | #2f5a4c | Boda de noche, corporativo premium |
| Fiesta infantil | #fff8e7 | #ffffff | #2b2d42 | #ff6b6b | #4ecdc4 | #ffd166 | Cumpleaños infantil |
| Corporativo | #ffffff | #f5f7fa | #111827 | #2563eb | #0ea5e9 | #e5e7eb | Landing, evento empresarial |

## Combinaciones de fuentes (Google Fonts)

| Estilo | Títulos/nombres | Cifras/encabezados | Texto | Notas |
|---|---|---|---|---|
| Romántico clásico | Pinyon Script | Forum | Comfortaa | Usada en la invitación de Alejandro y Oksana |
| Elegante | Great Vibes | Cormorant Garamond 500 | Montserrat 400 | Muy versátil para bodas |
| Editorial | Italiana | Playfair Display | Lato | Revistas, gala |
| Moderno minimal | — | Cormorant Garamond italic | Jost 300/400 | Mayúsculas espaciadas `letter-spacing:.3em` |
| Boho | Allura | Marcellus | Quicksand | Terracota, salvia |
| Juvenil (XV) | Parisienne | Cinzel | Raleway | Cinzel solo en mayúsculas |
| Infantil | Fredoka 600 | Baloo 2 | Nunito | Bordes redondeados |
| Corporativo | — | Inter 700 / Manrope 800 | Inter 400 | Titulares con `letter-spacing:-.02em` |

Escalas recomendadas (columna de invitación, en `cqw`): nombres 10–15 · título de
sección 9–14 · cifras de hora 12–14 · párrafo 3.4–4 (nunca < 14 px reales) ·
etiquetas 2.6–3 con `letter-spacing:.15em`.

## Reglas de color que evitan el aspecto "plantilla"
- El acento ocupa ~10 % de la superficie: botones, filetes, el día marcado.
- Alterna secciones de fondo claro y oscuro para dar ritmo (como burdeos ↔ cielo).
- Sombras cálidas: `rgba(60,30,20,.25)` en vez de negro puro sobre fondos crema.
- Dorado realista = degradado, no un color plano:
  `linear-gradient(135deg,#b8925a,#f1dfb0 45%,#a77c3f 55%,#e6cf98)` con
  `background-clip:text` para títulos.
- Texturas: papel con `feTurbulence` en SVG a 4–6 % de opacidad (ver componentes.md).
