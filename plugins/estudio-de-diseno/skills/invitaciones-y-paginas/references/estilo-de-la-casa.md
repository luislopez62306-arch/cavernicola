# Estilo de la casa: los diseños propios del usuario

Estos son los diseños que el usuario ya hizo y aprobó. **Son el punto de partida
por defecto** para cualquier invitación nueva (sobre todo XV años, cumpleaños y
bodas): se ven como "su marca". Parte de uno de ellos y cámbiale datos, colores,
fotos y monograma; no empieces desde cero salvo que el usuario pida otro estilo.

Archivos (copias sin datos personales, fotos sustituidas por marcadores):
- `assets/disenos-propios/geraldine/` — index.html, geraldine.js, pases.html, monograma.png, monograma-claro.png, foto1–4.jpg
- `assets/disenos-propios/danna-sofia/` — index.html, pases.html, logo-nombre.png, glitter.jpg, saten.jpg, foto.jpg, foto2–3.jpg

Si tienes la herramienta Artifact, las versiones vivas más recientes están en los
artefactos del usuario "XV Años Geraldine" y "XV Años Danna Sofía" (búscalos con
`action: "list"`); úsalas si difieren de las copias. Si el usuario menciona otro
diseño suyo por nombre (p. ej. "Ana Daniela", "Mariely", "Lilia Elissa"), búscalo
igual en sus artefactos antes de diseñar.

## Cuál elegir

| | **Geraldine** | **Danna Sofía** |
|---|---|---|
| Ambiente | Vino profundo + rosa empolvado, elegante y dramático | Rosa palo / rose-gold, romántico y luminoso |
| Fondo | Paneles vino `#6E1726` / `#7A1F2E` sobre `#4A0C16`, con franjas rosa `#F2D7DB` intercaladas y bordes ondulados | Acuarela rosa con vetas doradas; tarjeta en arco color papel `#FFF6F7` |
| Portada | "Píldora" vino con foto en arco invertido abajo, botón corazón, nombre en Great Vibes + "mis XV Años" en Forum mayúsculas | Portada tipo revista: "EDICIÓN XV · 2026", nombre gigante con letras degradadas + segundo nombre en itálica encima, foto con marco fino separado |
| Monograma | Inicial en Pinyon Script dentro de óvalo con moño (PNG) + monograma SVG generado en `geraldine.js` (laurel, tiara, listón con nombre, sello de lacre) | Logo PNG rose-gold con iniciales entrelazadas y nombre |
| Títulos | Forum en MAYÚSCULAS con filete y corazón debajo (`.disp`) | Cormorant Garamond itálica con degradado rosa (`h2.gold`) |
| Cuenta regresiva | Números Forum separados por ":" | Cajitas blancas translúcidas sobre textura de glitter, con números que se deslizan |
| Pase | Boleto vino `.tk` con muescas laterales y código | Boleto blanco `.ticket` con perforación y **QR** + pantalla de verificación |
| Ideal para | XV/boda de noche, colores vino, rojo, esmeralda, azul marino | XV/bautizo/baby shower de día, rosa, lila, champán, azul cielo |

## Lo que comparten (la "firma" del usuario; mantenlo siempre)

1. **Intro tipo video** a pantalla completa (`#intro`) con vetas SVG que se dibujan y 3 escenas encadenadas:
   s1 "¡Tienes / una / invitación / especial!" → s2 monograma grande con destello → s3 monograma chico + fecha + botón "Ver invitación" y "Saltar". La música empieza al tocar el botón (con *fade in*).
2. **Destellos** dorados/blancos flotando en un `<canvas id="sparks">` encima de todo (opacidad baja después del intro).
3. **Música** con botón flotante (play/pausa, barras de ecualizador, nombre de la canción) que se encoge al hacer scroll; se oculta solo si el audio no carga.
4. **Orden de secciones**: mensaje de gratitud (con inicial capitular) → calendario de la semana con el día dentro de un corazón → pase personal (si el enlace trae invitado) → cuenta regresiva + "Agregar al calendario" (Google Calendar) → frase con comillas grandes → papás / padrinos / chambelán → código de vestimenta (siluetas o muestras de color + aviso "*color reservado para la quinceañera" + botón "Pregúntanos" a WhatsApp) → foto intermedia → ceremonia y recepción con "Cómo llegar" → itinerario con línea curva e iconos SVG alternados izquierda/derecha → no niños (opcional) → mesa de regalos con dibujos (regalo / lluvia de sobres) → RSVP por WhatsApp con fecha límite → despedida con foto en arco u óvalo y firma en caligrafía.
5. **Pases por invitado**: enlace `index.html#p{N}-{nombre en hex}`; muestra "PASE PARA …", número de lugares, código (`XX-ABCDE` calculado con FNV) y limita el selector de personas. Generador oculto en `pases.html` (o 5 toques al monograma) protegido con PIN.
6. **Botón flotante** "Confirmar asistencia" que aparece después de la portada y se esconde al llegar al RSVP.
7. **Animaciones**: secciones `.reveal` que suben al aparecer; títulos que se "escriben" con `clip-path`; foto final que entra con desenfoque; Ken Burns lento en la portada. Todo se apaga con `prefers-reduced-motion`.
8. **Tipografía**: Cormorant Garamond (texto, 18–20 px base, cifras `lining-nums`), Great Vibes / Pinyon Script / Sacramento (nombres y firma), Forum o Cinzel (mayúsculas espaciadas). Etiquetas en mayúsculas con `letter-spacing:.24–.32em`.
9. **Texto en español de México**, cálido y en primera persona de la festejada ("Te espero", "Con cariño,"), horas en formato "6:00 PM", fecha "23 · 12 · 2026".
10. **Formato**: columna móvil máx. 480 px, `env(safe-area-inset-*)` para iPhone, archivos separados (fotos .jpg ~1050×1400, monograma .png, musica.mp3) publicados juntos.

## Cómo adaptar uno a un evento nuevo

1. Copia la carpeta del diseño elegido a la carpeta de trabajo.
2. Cambia en el HTML: nombre(s), fecha (texto del intro, portada, calendario, cuenta regresiva `new Date('AAAA-MM-DDTHH:MM:00-07:00')`, fecha límite, enlace de Google Calendar con fechas en UTC), papás/padrinos, lugares y enlaces de mapa, itinerario, código de vestimenta, regalos.
3. Cambia teléfono (`PHONE` / `wa.me/52…`), `PIN`, `PUBLICO` (URL donde se publicará) y el prefijo del código de pase (`GV-`, `DS-` → iniciales nuevas) **en todos los archivos** (index, pases, .js).
4. Paleta: cambia las variables de `:root` y los colores escritos a mano dentro de los SVG en `data:` (búscalos con `grep -n '%23'` y `grep -n '#[0-9A-F]\{6\}'`). Mantén la relación oscuro/medio/claro de la paleta original.
5. Monograma: genera uno nuevo con la inicial (en Geraldine, `geraldine.js` lo dibuja en SVG: cambia la letra y el nombre del listón) o reemplaza el PNG por uno con el mismo tamaño y fondo transparente.
6. Fotos: mismas proporciones que los marcadores (3:4 vertical, 4:3 horizontal); comprímelas a ~150–250 KB.
7. Verifica con `scripts/captura.js` (los 404 de `musica.mp3` y fotos son normales hasta que el usuario las ponga). En el diseño Danna Sofía sube a ≥ 12 px las etiquetas pequeñas ("EDICIÓN XV", "MIS XV AÑOS", unidades de la cuenta) si el reporte las marca.
8. Nunca publiques en un repositorio público fotos, teléfonos ni nombres reales de los festejados sin que el usuario lo pida: publica la invitación final como artefacto o en su hosting.
