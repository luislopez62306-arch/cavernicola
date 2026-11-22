# Checklist de calidad (antes de entregar)

Marca todo. Si algo falla, corrígelo y vuelve a capturar.

## Automático (`scripts/captura.js`)
- [ ] 0 errores de consola · 0 imágenes rotas · 0 desbordamiento horizontal
- [ ] Ningún texto de lectura < 12 px reales (párrafos idealmente ≥ 14 px)
- [ ] Todas las fuentes declaradas cargaron

## Visual (mirando las capturas móvil y escritorio)
- [ ] La portada comunica en 2 segundos: qué evento, quién, cuándo
- [ ] Jerarquía clara: un elemento dominante por sección
- [ ] Márgenes laterales consistentes (≈ 8–10 % del ancho en invitaciones)
- [ ] Alineaciones exactas: nada "casi centrado"; ejes de texto e imágenes coinciden
- [ ] Ritmo vertical: espacios entre secciones iguales o intencionadamente distintos
- [ ] Solo los colores y fuentes de la paleta elegida
- [ ] Imágenes nítidas (sin pixelado ni bordes de recorte visibles)
- [ ] Sin viudas feas en títulos (usa `&nbsp;` o `text-wrap: balance`)
- [ ] En escritorio la columna se ve intencional (fondo decorado, sombra)

## Contenido
- [ ] Fecha, día de la semana y hora coherentes (calcula el día de la semana, no lo supongas)
- [ ] Ortografía y acentos revisados; formato 24 h o a.m./p.m. consistente
- [ ] Sin lorem ipsum, "Texto aquí" ni datos de ejemplo sin avisar al usuario
- [ ] Datos variables centralizados en `CONFIG`

## Interacción
- [ ] Botones de mapa abren la ubicación correcta
- [ ] RSVP produce el mensaje de WhatsApp correcto (prueba `wa.me` con número de ejemplo)
- [ ] Cuenta regresiva correcta y muestra mensaje al llegar la fecha
- [ ] `.ics` se descarga y abre con fecha/hora correctas
- [ ] Música no suena sola (los navegadores lo bloquean): botón visible solo si hay canción
- [ ] Elementos con `hidden` realmente ocultos (`[hidden]{display:none!important}`)
- [ ] Foco visible con teclado; `prefers-reduced-motion` respetado

## Entrega
- [ ] Un solo archivo HTML autocontenido (o carpeta con rutas relativas si pesa > 10 MB)
- [ ] PNG/PDF exportados si el formato lo pide
- [ ] Resumen al usuario: decisiones tomadas + qué editar en `CONFIG` + cómo publicar
