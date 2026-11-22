#!/usr/bin/env node
/*
 * Capturas + auditoría de calidad de una invitación o página.
 *
 * Uso:
 *   node captura.js archivo.html [--salida carpeta] [--sin-escritorio]
 *                   [--png-tarjeta 1080x1350 --selector .tarjeta]
 *                   [--pdf 5x7in | A5 | A6 | Letter]
 *
 * Genera: movil.png (390 px @2x, página completa), escritorio.png (1440 px),
 *         portada-movil.png (primer pantallazo), reporte.json
 * y escribe en consola los problemas encontrados. Sale con código 1 si hay errores graves.
 */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/usr/lib/node_modules/playwright')); }

const args = process.argv.slice(2);
const CON_VALOR = ['--salida', '--png-tarjeta', '--selector', '--pdf'];
const archivo = args.find((a, i) => !a.startsWith('--') && !CON_VALOR.includes(args[i - 1]));
if (!archivo) { console.error('Uso: node captura.js archivo.html [--salida carpeta]'); process.exit(2); }
const opt = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const salida = path.resolve(opt('--salida') || path.join(path.dirname(archivo), 'capturas'));
fs.mkdirSync(salida, { recursive: true });
const url = /^https?:/.test(archivo) ? archivo : 'file://' + path.resolve(archivo);

async function auditar(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const r = { desbordamiento: 0, imagenesRotas: [], textoPequeno: [], fuentesFallidas: [] };
    r.desbordamiento = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
    document.querySelectorAll('img').forEach(i => { if (i.complete && i.naturalWidth === 0) r.imagenesRotas.push(i.src.slice(0, 80)); });
    // imágenes ampliadas por encima de su resolución (se ven borrosas)
    r.imagenesBorrosas = [...document.querySelectorAll('img')].filter(i => i.naturalWidth && i.getBoundingClientRect().width * devicePixelRatio > i.naturalWidth * 1.5)
      .map(i => `${i.src.slice(0, 60)}… natural ${i.naturalWidth}px, mostrada ${Math.round(i.getBoundingClientRect().width * devicePixelRatio)}px`);
    const vistos = new Set();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, el = n.parentElement;
      if (!n.textContent.trim() || !el || vistos.has(el)) continue;
      vistos.add(el);
      const cs = getComputedStyle(el), b = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || b.width === 0 || el.closest('[hidden],[aria-hidden=true],script,style')) continue;
      const fs = parseFloat(cs.fontSize);
      if (fs < 12) r.textoPequeno.push(`${fs.toFixed(1)}px: "${n.textContent.trim().slice(0, 40)}"`);
    }
    document.fonts.forEach(f => { if (f.status === 'error') r.fuentesFallidas.push(f.family); });
    const usadas = new Set();
    document.querySelectorAll('body *').forEach(e => usadas.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim()));
    r.fuentesNoCargadas = [...usadas].filter(f => !/^(system-ui|serif|sans-serif|cursive|monospace|Georgia|Arial|Times New Roman|-apple-system)$/i.test(f) && !document.fonts.check(`16px "${f}"`));
    return r;
  });
}

(async () => {
  const browser = await chromium.launch();
  const reporte = { archivo: url, vistas: {} };
  const vistas = [['movil', { width: 390, height: 844 }, 2, true]];
  if (!args.includes('--sin-escritorio')) vistas.push(['escritorio', { width: 1440, height: 900 }, 1, false]);

  for (const [nombre, viewport, dpr, movil] of vistas) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: dpr, isMobile: movil, hasTouch: movil, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const errores = [];
    page.on('console', m => m.type() === 'error' && errores.push(m.text()));
    page.on('pageerror', e => errores.push(String(e)));
    page.on('requestfailed', q => errores.push('Falló la carga: ' + q.url().slice(0, 100)));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => errores.push('Carga: ' + e.message));
    // abrir sobre / intro si existe, y forzar animaciones de aparición
    await page.evaluate(() => {
      document.querySelector('#abrir, .sello, [data-abrir]')?.click();
      document.querySelectorAll('.rev, .reveal, [data-rev]').forEach(e => e.classList.add('vis', 'visible', 'in'));
    });
    await page.waitForTimeout(2200);
    if (movil) await page.screenshot({ path: path.join(salida, 'portada-movil.png') });
    // desplazar para disparar lazy-load e IntersectionObserver
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(salida, nombre + '.png'), fullPage: true });
    reporte.vistas[nombre] = { errores, ...(await auditar(page)) };
    await ctx.close();
  }

  const tarjeta = opt('--png-tarjeta');
  if (tarjeta) {
    const [w, h] = tarjeta.split('x').map(Number);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const sel = opt('--selector');
    const destino = path.join(salida, `tarjeta-${w}x${h}.png`);
    if (sel) await page.locator(sel).first().screenshot({ path: destino }); else await page.screenshot({ path: destino });
    reporte.tarjeta = destino; await ctx.close();
  }

  const pdf = opt('--pdf');
  if (pdf) {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.fonts.ready; document.querySelector('#abrir, .sello')?.click(); document.querySelectorAll('.rev').forEach(e => e.classList.add('vis')); });
    await page.waitForTimeout(1500);
    const m = pdf.match(/^([\d.]+)x([\d.]+)(in|mm|cm)$/);
    const destino = path.join(salida, 'impresion.pdf');
    await page.pdf({ path: destino, printBackground: true, preferCSSPageSize: true, ...(m ? { width: m[1] + m[3], height: m[2] + m[3] } : { format: pdf }) });
    reporte.pdf = destino;
  }

  await browser.close();
  fs.writeFileSync(path.join(salida, 'reporte.json'), JSON.stringify(reporte, null, 2));

  let graves = 0;
  console.log(`\nCapturas en: ${salida}`);
  for (const [n, v] of Object.entries(reporte.vistas)) {
    console.log(`\n== ${n} ==`);
    const linea = (ok, t, lista = []) => { console.log(`${ok ? '✔' : '✘'} ${t}`); lista.slice(0, 8).forEach(x => console.log('    · ' + x)); if (!ok) graves++; };
    linea(!v.errores.length, `Errores de consola/carga: ${v.errores.length}`, v.errores);
    linea(!v.imagenesRotas.length, `Imágenes rotas: ${v.imagenesRotas.length}`, v.imagenesRotas);
    linea(!v.desbordamiento, `Desbordamiento horizontal: ${v.desbordamiento}px`);
    linea(!v.textoPequeno.length, `Textos < 12px: ${v.textoPequeno.length}`, v.textoPequeno);
    linea(!v.fuentesFallidas.length && !v.fuentesNoCargadas.length, `Fuentes sin cargar: ${[...v.fuentesFallidas, ...v.fuentesNoCargadas].join(', ') || 0}`);
    if (v.imagenesBorrosas.length) { console.log(`⚠ Imágenes ampliadas (posible borrosidad): ${v.imagenesBorrosas.length}`); v.imagenesBorrosas.slice(0, 5).forEach(x => console.log('    · ' + x)); }
  }
  console.log(graves ? `\n${graves} problema(s) por corregir.` : '\nTodo limpio. Ahora revisa las capturas a ojo con el checklist.');
  process.exit(graves ? 1 : 0);
})();
