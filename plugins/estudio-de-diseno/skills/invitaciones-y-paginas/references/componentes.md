# Componentes listos y publicación

`assets/plantilla-base.html` ya contiene, funcionando: sobre de apertura con
sello, portada con marco y esquinas SVG, calendario con día marcado, cuenta
regresiva, botón "Agregar al calendario" (.ics), itinerario con iconos, lugares
con botón de mapa, paleta de vestimenta, galería, datos bancarios con "copiar",
RSVP por WhatsApp con pases personalizados por URL, música con botón y aparición
al hacer scroll. Copia de ahí. Abajo, piezas adicionales.

## Índice
1. Pases personalizados por invitado
2. Hospedaje / preguntas frecuentes (acordeón)
3. Carrusel de fotos deslizable
4. Cinta en movimiento (marquee)
5. Lluvia de corazones / confeti
6. Votación niño o niña (baby shower)
7. Encabezado fijo para landing
8. Tarjeta para imprimir / imagen para redes
9. RSVP a Google Sheets (en vez de WhatsApp)
10. Publicar

---

## 1. Pases personalizados
La plantilla lee `?pases=2&nombre=Familia+Pérez`. Genera los enlaces para el
usuario como lista lista para copiar:
```js
const base = 'https://usuario.github.io/boda/';
[['Familia Pérez',4],['Ana López',1]].map(([n,p]) => `${n}: ${base}?pases=${p}&nombre=${encodeURIComponent(n)}`).join('\n')
```

## 2. Acordeón (FAQ, hospedaje)
```html
<details class="faq"><summary>¿Puedo llevar niños?</summary><p>Esta celebración será solo para adultos.</p></details>
<style>
.faq{border-bottom:1px solid var(--linea);text-align:left;padding:4cqw 0}
.faq summary{cursor:pointer;list-style:none;font-family:var(--serif);font-size:5.5cqw;display:flex;justify-content:space-between}
.faq summary::after{content:"+";color:var(--acento);transition:transform .3s}
.faq[open] summary::after{transform:rotate(45deg)}
.faq p{margin-top:2cqw}
</style>
```

## 3. Carrusel deslizable (sin librerías)
```html
<div class="carrusel"><img src="…"><img src="…"><img src="…"></div>
<style>
.carrusel{display:flex;gap:3cqw;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 9cqw;margin:0 -9cqw;scrollbar-width:none}
.carrusel img{flex:0 0 78%;aspect-ratio:4/5;object-fit:cover;border-radius:2cqw;scroll-snap-align:center}
</style>
```

## 4. Cinta en movimiento
```html
<div class="cinta" aria-hidden="true"><div>SAVE THE DATE • 18.09.2027 • SAVE THE DATE • 18.09.2027 •&nbsp;</div></div>
<style>
.cinta{overflow:hidden;white-space:nowrap;border-block:1px solid var(--linea);padding:2.5cqw 0}
.cinta div{display:inline-block;font-family:var(--serif);letter-spacing:.2em;animation:corre 22s linear infinite;padding-left:100%}
@keyframes corre{to{transform:translateX(-100%)}}
</style>
```
(Duplica el texto dentro del div para que no quede hueco.)

## 5. Lluvia de corazones
```js
function lluvia(x, y, n = 14, colores = ['#b8925a','#c98b96','#e8d9bd']) {
  for (let i = 0; i < n; i++) {
    const s = Object.assign(document.createElement('span'), { textContent: '♥' });
    Object.assign(s.style, { position:'fixed', left: x + (Math.random()-.5)*120 + 'px', top: y + 'px', color: colores[i % colores.length],
      pointerEvents:'none', zIndex: 99, transition: 'transform 2s ease-out, opacity 2s', fontSize: 14 + Math.random()*12 + 'px' });
    document.body.append(s);
    requestAnimationFrame(() => { s.style.transform = `translate(${(Math.random()-.5)*80}px,-160px) scale(1.4)`; s.style.opacity = 0; });
    setTimeout(() => s.remove(), 2200);
  }
}
```

## 6. Votación niño / niña
Dos botones grandes (azul / rosa) que abren WhatsApp con "Voto: ¡Niño! 💙". Sin
servidor no se puede mostrar el conteo; si el usuario lo quiere, usar el punto 9.

## 7. Encabezado fijo (landing)
```html
<header class="top"><a class="logo" href="#">Marca</a><nav><a href="#servicios">Servicios</a><a href="#precios">Precios</a><a href="#contacto">Contacto</a></nav><a class="cta" href="#contacto">Reservar</a></header>
<style>
.top{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:24px;padding:14px max(16px,calc(50% - 560px));background:rgba(255,255,255,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--linea)}
.top nav{display:flex;gap:20px;margin-left:auto}
.top nav a{color:inherit;text-decoration:none;font-weight:500}
.cta{padding:10px 18px;border-radius:8px;background:var(--acento);color:#fff;text-decoration:none;font-weight:600}
@media (max-width:640px){.top nav{display:none}.cta{margin-left:auto}}
</style>
```

## 8. Impresión e imagen para redes
- Imagen: diseña un `<div class="tarjeta">` con tamaño fijo (ej. 1080×1350) y
  exporta con `node scripts/captura.js archivo.html --png-tarjeta 1080x1350 --selector .tarjeta`.
- PDF: `--pdf 5x7in` (o `A5`, `A6`, `Letter`). Añade al CSS:
  ```css
  @page{size:5in 7in;margin:0}
  @media print{body{background:none}.inv{box-shadow:none}.musica,.sobre,.desliza{display:none}
    *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  ```
  Para imprenta profesional pide 3 mm de sangrado: `size:133mm 184mm` con el fondo
  extendido hasta el borde y textos ≥ 5 mm dentro.

## 9. RSVP a Google Sheets
1. En la hoja: Extensiones → Apps Script, pegar:
   ```js
   function doPost(e){const s=SpreadsheetApp.getActive().getSheets()[0];const d=JSON.parse(e.postData.contents);
     s.appendRow([new Date(),d.nombre,d.asiste,d.personas,d.mensaje]);return ContentService.createTextOutput('ok');}
   ```
2. Implementar → Aplicación web → acceso "Cualquiera" → copiar URL en `CONFIG.sheets`.
3. En el submit: `fetch(CONFIG.sheets,{method:'POST',mode:'no-cors',body:JSON.stringify(datos)})`.

## 10. Publicar (explícaselo al usuario en pasos simples)
- **Más fácil**: arrastrar el `.html` a https://app.netlify.com/drop → da un enlace al instante.
- **GitHub Pages**: subir como `index.html` al repositorio → Settings → Pages →
  rama `main` → enlace `usuario.github.io/repositorio`.
- **Directo**: enviar el archivo por WhatsApp/correo; se abre en el navegador del teléfono.
- Para que la vista previa de WhatsApp muestre imagen, `og:image` debe ser una URL
  pública absoluta (sube la captura de portada junto al HTML).
