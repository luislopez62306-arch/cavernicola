---
name: disenos-aesthetic
description: Úsalo cuando el usuario pida diseños "aesthetic", bonitos, estilo Canva, Pinterest o Instagram, o que parezcan hechos por un ilustrador (posts, flyers, portadas, invitaciones, stories, banners, páginas web, tarjetas, carteles). Da estilos de tendencia, paletas, tipografías, composición y recursos decorativos en HTML/CSS/SVG.
---

# Diseños Aesthetic (estilo Pinterest / Instagram / Canva)

Objetivo: que el resultado parezca hecho a mano por un ilustrador o diseñador de Canva, NO una plantilla genérica de web.

## 1. Flujo de trabajo
1. **Formato**: post IG 1080×1080, carrusel 1080×1350, story/reel 1080×1920, Pinterest pin 1000×1500, flyer A4/carta, banner web.
2. **Elige UN estilo** de la sección 2 (o pregunta si no está claro). No mezcles más de dos.
3. **Paleta** de 3–5 colores (sección 3) + 1–2 tipografías (sección 4).
4. **Composición** (sección 5) y **decoración** (sección 6).
5. Construye en HTML/CSS con SVG inline (o en Canva/Figma si hay conector). Renderiza con Playwright a PNG (`deviceScaleFactor: 2`) y **revisa la captura** antes de entregar.
6. Pasa el checklist final (sección 8).

## 2. Estilos de tendencia (lo que más se ve en Pinterest/Instagram)
| Estilo | Claves visuales |
|---|---|
| **Soft girl / coquette** | Rosas empolvados, moños/lazos, perlas, corazones, serif elegante + script, mucho aire |
| **Clean girl / minimal beige** | Beige, crema, taupe, tipografía serif fina, fotos con grano, líneas finas, simetría |
| **Y2K / cyber** | Cromo, degradados iridiscentes, estrellas de 4 puntas ✦, mariposas, fuentes bubble/pixel |
| **Retro 70s groovy** | Naranja, mostaza, marrón, verde oliva; fuentes gruesas redondeadas (tipo Cooper), ondas, flores daisy, sol |
| **Brutalismo / neo-brutalist** | Colores planos saturados, bordes negros gruesos, sombras duras desplazadas, grids visibles |
| **Scrapbook / collage** | Papel rasgado, cinta washi, stickers, recortes, letras tipo nota de rescate, polaroids rotadas ±3–6° |
| **Hand-drawn / doodle** | Trazos irregulares, garabatos, flechas a mano, subrayados tipo marcador, fuente manuscrita |
| **Pastel kawaii** | Pastel menta/lavanda/durazno, formas redondas, caritas, nubes, bordes gruesos redondeados |
| **Dark academia** | Verde bosque, burdeos, marrón, papel envejecido, serif clásica, marcos ornamentales |
| **Boho / terracota** | Terracota, arena, salvia, arcos, formas orgánicas tipo Matisse, hojas, sol minimalista |
| **Editorial / magazine** | Titular gigante serif, texto pequeño en mayúsculas espaciadas, números grandes, mucho blanco |
| **Gradiente aura / blur** | Manchas de color difuminadas (blur 80–120px), grano encima, texto blanco limpio |

## 3. Paletas listas
- Coquette: `#F7D6E0 #F2B5D4 #FFF5F7 #C9184A #5E3A45`
- Beige clean: `#F5EFE6 #E8DFCA #CBB89D #8B7E74 #3E3A36`
- Groovy 70s: `#F4A259 #E76F51 #F6D186 #6A994E #5B3A29`
- Kawaii pastel: `#CDEAC0 #FFD6E0 #E4C1F9 #FFF1C1 #A9DEF9`
- Boho: `#D27D56 #E9C46A #EADBC8 #87A878 #4A3B32`
- Dark academia: `#2F3E33 #6B2D2D #A68A64 #EDE0C8 #1C1C1C`
- Neo-brutal: `#FFE14D #FF6B9D #4DD4FF #FFFFFF #111111`
- Y2K: `#C0C0FF #FF9CEE #B5FFFC #E0E0E0 #1A1A2E`
Regla 60/30/10: 60% fondo, 30% secundario, 10% acento.

## 4. Tipografías (Google Fonts)
- Serif elegante: Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces (itálica = muy "Canva")
- Retro/groovy: Shrikhand, Righteous, Bagel Fat One, Rubik Mono One
- Manuscrita/script: Caveat, Pacifico, Dancing Script, Homemade Apple, Gloria Hallelujah, Sacramento
- Sans limpia: Poppins, DM Sans, Outfit, Space Grotesk (brutal)
- Combo clásico: titular serif itálica + subtítulo sans en MAYÚSCULAS con `letter-spacing: .2em` + una palabra en script.
Jerarquía: titular 3–5× el tamaño del texto. Máx. 3 tamaños.

## 5. Composición
- Márgenes generosos (≥6% del ancho). El espacio vacío es lo que lo hace "aesthetic".
- Usa un eje: centrado simétrico (minimal, invitaciones) o asimetría intencional (editorial, collage).
- Superpón capas: texto que se monta sobre una forma o imagen da profundidad.
- Rota elementos sueltos levemente (−4° a 6°) para efecto hecho a mano.
- Arcos y marcos (`border-radius: 999px 999px 0 0`) para fotos = muy Pinterest.

## 6. Recursos decorativos (CSS/SVG)
- **Grano/ruido**: SVG `feTurbulence` encima con `opacity:.08–.15; mix-blend-mode:multiply`.
- **Formas orgánicas (blobs)**: `path` SVG con curvas suaves o `border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%`.
- **Trazo a mano**: SVG con filtro `feDisplacementMap` leve sobre líneas y subrayados.
- **Estrellas ✦, chispas ✧, corazones, flores daisy, moños, nubes, sol con rayos** dibujados en SVG.
- **Cinta washi**: rectángulo semitransparente rotado con bordes en zigzag (`clip-path`).
- **Sombra dura** (brutal): `box-shadow: 6px 6px 0 #111; border: 3px solid #111`.
- **Sticker**: texto con contorno blanco grueso (`-webkit-text-stroke` o `paint-order: stroke`) + sombra suave.
- **Aura**: 2–3 círculos de color con `filter: blur(100px)`.

## 7. Qué evitar (lo que lo hace ver "de IA" o genérico)
- Degradado morado-azul por defecto, Inter/Arial en todo, tarjetas con sombra difusa idénticas.
- Demasiados elementos decorativos compitiendo; más de 2 fuentes display.
- Texto con poco contraste sobre foto (usa overlay o caja).
- Emojis como decoración en lugar de ilustraciones SVG.

## 8. Checklist final
- [ ] Un solo estilo claro, reconocible a primera vista
- [ ] Paleta ≤5 colores aplicada con 60/30/10
- [ ] Jerarquía: se lee el titular en 1 segundo
- [ ] Al menos un detalle "hecho a mano" (grano, rotación, trazo, sticker)
- [ ] Márgenes amplios y alineación coherente
- [ ] Contraste legible (WCAG AA en texto pequeño)
- [ ] Tamaño correcto para la red social y renderizado revisado en PNG
