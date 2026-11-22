---
name: invitaciones-y-paginas
description: Diseña invitaciones digitales y páginas web terminadas, listas para entregar — bodas, XV años, bautizos, cumpleaños, baby shower, graduaciones, eventos corporativos, landing pages, menús, tarjetas y páginas de negocio. Produce un único archivo HTML final (y PNG/PDF para impresión) con diseño exacto, cuidado al detalle y verificado con capturas. Úsalo SIEMPRE que el usuario pida crear, rediseñar, copiar o mejorar una invitación, tarjeta, save the date, página, landing, sitio de evento o cualquier pieza visual, aunque no diga "skill", y especialmente cuando comparta una imagen de referencia que quiera replicar fielmente.
---

# Invitaciones y páginas — diseños exactos y finales

El objetivo no es un "borrador bonito": es una pieza **terminada** que el usuario
pueda enviar hoy mismo. Eso significa textos reales, datos editables en un solo
lugar, imágenes nítidas, interacción que funciona y una verificación visual hecha
por ti antes de entregar.

Habla con el usuario en su idioma (normalmente español) y sin jerga técnica.

## Flujo de trabajo

### 1. Entender el encargo (sin interrogatorios)

Reúne estos datos. Lo que el usuario no diga, **decídelo tú con buen criterio y
dilo al entregar** — no detengas el trabajo por datos que se cambian en 10 segundos.

| Dato | Si falta… |
|---|---|
| Tipo de pieza y evento | Pregunta solo si es ambiguo de verdad |
| Nombres, fecha, hora, lugares | Usa marcadores realistas y márcalos en `CONFIG` |
| Estilo / paleta | Elige uno de `references/paletas-y-tipografias.md` acorde al evento |
| Imagen de referencia | Si existe, manda la referencia: modo **fidelidad** (paso 2b) |
| Secciones | Usa la lista del tipo de evento en `references/tipos-de-evento.md` |
| Formato | Digital (HTML móvil) por defecto; PNG/PDF si es para imprimir o WhatsApp como imagen |
| RSVP | WhatsApp por defecto (no requiere servidor) |

Pregunta como máximo una vez y agrupa las preguntas. Si el usuario ya pidió cosas
en conversaciones o archivos anteriores (por ejemplo un `index.html` existente o
un historial de commits), léelos primero: sus preferencias pasadas son el mejor
brief.

### 2a. Diseñar desde cero

1. Lee `references/tipos-de-evento.md` (secciones y textos de ejemplo del evento).
2. Lee `references/paletas-y-tipografias.md` y fija **una** paleta (5–6 colores en
   hex) y **una** pareja/trío de fuentes. Escríbelas como variables CSS antes de
   dibujar nada. La coherencia viene de usar solo esas.
3. Parte de `assets/plantilla-base.html`: ya trae columna móvil, `CONFIG`,
   portada, cuenta regresiva, calendario, itinerario, lugares con mapa, código de
   vestimenta, regalos, galería, RSVP por WhatsApp, agregar al calendario, música
   y sobre animado de apertura. Quita lo que no aplique; no dejes secciones vacías.
4. Ve a `references/componentes.md` si necesitas un componente que no está en la
   plantilla.

### 2b. Modo fidelidad (hay imagen de referencia)

Cuando el usuario comparte una imagen y dice "así", "igual", "como esta", la
referencia es el contrato. Lee `references/fidelidad-a-referencia.md` y sigue su
método: medir proporciones, recortar/reutilizar adornos, posicionar en `%`/`cqw`
sobre la imagen, igualar fuentes y colores con cuentagotas, y comparar lado a lado
con `scripts/comparar.py` hasta que no haya diferencias visibles. No "interpretes"
ni "mejores" la referencia salvo que te lo pidan: el usuario quiere *esa*
invitación, con sus datos.

### 3. Construir

Reglas que hacen que el resultado sea final y no un prototipo:

- **Un solo archivo HTML** autocontenido. Imágenes incrustadas en base64 (WebP)
  con `scripts/incrustar_imagenes.py`, para que funcione al mandarlo por WhatsApp,
  correo o subirlo a cualquier hosting. Fuentes desde Google Fonts con
  respaldo (`Georgia, serif`, etc.).
- **Datos en `CONFIG`** al inicio del `<script>`: nombres, fecha ISO, horas,
  lugares, URLs de mapa, teléfono de WhatsApp, fecha límite, foto, música. Todo el
  texto variable se rellena desde ahí con `data-cfg`. Así el usuario edita un solo
  bloque.
- **Móvil primero**: columna `max-width: 480px` centrada, `container-type:
  inline-size` y tamaños en `cqw` para que la composición escale idéntica en
  cualquier teléfono. En escritorio, la columna flota sobre un fondo decorativo.
- **Tipografía con jerarquía clara**: script/caligráfica solo para nombres y
  títulos cortos; serif elegante para cifras y encabezados; sans legible
  (≥ 14 px reales) para párrafos. Números con `font-variant-numeric: lining-nums`.
- **Textos reales y cálidos**, sin lorem ipsum ni "Texto aquí". Revisa ortografía
  y acentos (sábado, días, recepción, confirmación).
- **Interacción que funciona**: botones de mapa abren Google Maps, RSVP genera el
  mensaje de WhatsApp, cuenta regresiva calcula de verdad, "agregar al calendario"
  descarga un `.ics` válido.
- **Accesibilidad básica**: contraste AA en texto de lectura, `alt` en imágenes de
  contenido, `:focus-visible`, `prefers-reduced-motion`.
- **Animaciones sutiles** (aparecer al hacer scroll, 0.6–1.2 s, `ease`). Nada que
  maree ni que retrase leer la fecha.
- **Imágenes nítidas**: nunca escales una imagen por encima de su tamaño real. Si
  un adorno se ve pixelado, reconstrúyelo en SVG o consigue una versión mayor.

### 4. Verificar (obligatorio antes de entregar)

Ejecuta:

```bash
node <skill>/scripts/captura.js ruta/al/archivo.html --salida <carpeta>
```

Genera capturas a página completa en móvil (390 px, retina) y escritorio
(1440 px), y reporta: errores de consola, imágenes rotas, desbordamiento
horizontal, texto más pequeño de 12 px, y fuentes que no cargaron. **Mira las
capturas** con la herramienta de lectura de imágenes y revisa con
`references/checklist-calidad.md`. Corrige y repite hasta que el reporte salga
limpio y la imagen se vea como un diseño profesional terminado. Si hubo
referencia, también:

```bash
python3 <skill>/scripts/comparar.py referencia.png <carpeta>/movil.png --salida <carpeta>/comparacion.png
```

### 5. Entregar

- El archivo final (y PNG/PDF si aplica: `captura.js --png-tarjeta` /
  `--pdf 5x7in`).
- Muestra la captura móvil al usuario.
- Un resumen breve: qué decidiste por él (paleta, fuentes, textos de ejemplo),
  qué datos cambiar en `CONFIG` y cómo publicarlo (ver "Publicar" en
  `references/componentes.md`).
- Si trabajas en un repositorio, haz commit con un mensaje descriptivo.

## Archivos del skill

- `references/tipos-de-evento.md` — secciones, orden y textos modelo por evento y para páginas de negocio.
- `references/paletas-y-tipografias.md` — paletas exactas (hex) y combinaciones de fuentes probadas.
- `references/fidelidad-a-referencia.md` — método para replicar una imagen de referencia al detalle.
- `references/componentes.md` — código listo: sobre animado, cuenta regresiva, calendario, RSVP, .ics, música, galería, regalos, etc., y cómo publicar.
- `references/checklist-calidad.md` — revisión final antes de entregar.
- `assets/plantilla-base.html` — plantilla completa y funcional para partir.
- `scripts/captura.js` — capturas + auditoría automática (+ PNG/PDF de impresión).
- `scripts/comparar.py` — comparación lado a lado y mapa de diferencias con la referencia.
- `scripts/incrustar_imagenes.py` — convierte imágenes locales a WebP base64 dentro del HTML.
