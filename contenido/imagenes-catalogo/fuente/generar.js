// Genera los HTML fuente y los PNG de redes sociales de Invitto a partir de las capturas de capturar.js.
// Uso: node generar.js   (antes: node capturar.js <carpeta_ramas>)
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const SRC=__dirname,OUT=path.resolve(__dirname,'..');
const items=[];
const add=(nombre,w,h,tema,body)=>items.push({nombre,w,h,tema,body});

// ---------- Base común ----------
const BASE=`*{margin:0;box-sizing:border-box}
body{width:var(--w);height:var(--h);overflow:hidden;-webkit-font-smoothing:antialiased}
.f{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:110px 80px 150px;gap:40px;overflow:hidden}
.tel{position:relative;width:var(--tw,430px);height:calc(var(--tw,430px)*19.2/9);min-height:0;border-radius:64px;background:#15110f;padding:16px;flex:none;box-shadow:0 40px 70px rgba(0,0,0,.35),inset 0 0 0 2px #3a3330}
.tel::before{content:"";position:absolute;top:30px;left:50%;width:30%;height:30px;transform:translateX(-50%);background:#15110f;border-radius:20px;z-index:2}
.tel .pan{width:100%;height:100%;border-radius:50px;overflow:hidden;background:#fff}
.tel .pan img{width:100%;height:100%;object-fit:cover;display:block}
.fila{display:flex;gap:48px;align-items:center;justify-content:center;width:100%}
.lista{list-style:none;padding:0;display:flex;flex-direction:column;gap:30px;text-align:left}
.lista li{display:flex;gap:24px;align-items:flex-start;line-height:1.25}
.lista li::before{content:var(--vineta,"✦");flex:none;width:44px;text-align:center}
.marca{position:absolute;bottom:50px;left:0;right:0;font-size:72px;line-height:1}
.num{position:absolute;top:56px;right:70px;font-size:32px;letter-spacing:.12em}
.flecha{font-size:80px;line-height:1}`;
// pos: recorte vertical (cover). Si pos empieza por 'fit:' la captura se ajusta al ancho y se rellena con ese color.
const tel=(img,w=430,pos='top',extra='')=>{const fit=pos.startsWith('fit:');return `<div class="tel" style="--tw:${w}px;${extra}"><div class="pan"${fit?` style="background:${pos.slice(4)};display:flex;align-items:center"`:''}><img src="capturas/${img}.png" style="${fit?'height:auto':'object-position:center '+pos}"></div></div>`};

// ---------- Temas (paleta y tipografías de cada invitación) ----------
const TEMAS={
 treinta:{fonts:'family=Alex+Brush&family=Cormorant+SC:wght@400;500;600&family=Cormorant+Garamond:wght@300;500;600',
  css:`:root{--page:#ecc3a2;--ink:#4a1d0d;--white:#fff8ef;--rust:#9a3a17;--rl:#c4622d;--cream:#fbf3e8}
body{font-family:"Cormorant SC",serif;color:var(--ink);background:var(--page)}
.velvet{background:radial-gradient(ellipse 70% 55% at 50% 45%,rgba(40,8,0,.55),transparent 70%),repeating-linear-gradient(90deg,#6e230b 0 14px,#b4501f 30px,#d27038 36px,#8a3313 52px,#5d1c08 68px);color:var(--white)}
.melo{background:linear-gradient(160deg,#f6e0c4,var(--page) 45%,#d99c80)}
.s{font-family:"Alex Brush",cursive;font-weight:400;line-height:1}
.c{font-family:"Cormorant SC",serif;font-weight:500;text-transform:uppercase;letter-spacing:.08em}
.tag{font-family:"Cormorant SC",serif;font-weight:600;font-size:36px;letter-spacing:.32em}
.tarj{background:var(--cream);color:var(--ink);border:3px solid var(--rl);outline:10px solid var(--cream);border-radius:150px 150px 24px 24px/90px 90px 24px 24px;padding:70px 60px 60px;display:flex;flex-direction:column;align-items:center;gap:26px;width:100%;box-shadow:0 30px 60px rgba(40,8,0,.4)}
.p{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:44px;line-height:1.3}
.lista li{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:46px}.lista li::before{color:var(--rl)}
.chip{display:inline-block;padding:22px 56px 28px;border-radius:80px;background:linear-gradient(170deg,#d0743d,#9a3a17);color:var(--white);font-family:"Alex Brush",cursive;font-size:68px;box-shadow:0 14px 28px rgba(90,25,5,.4)}
.marca{font-family:"Cormorant SC",serif;font-weight:600;font-size:50px;letter-spacing:.34em;text-indent:.34em}.velvet .marca{color:var(--white)}.melo .marca{color:var(--rust)}
.num{font-family:"Cormorant SC",serif}.velvet .num{color:#f5d9bf}.melo .num{color:var(--rust)}
.titulo-oro{background:linear-gradient(180deg,#fff8ef 10%,#f6d3b4 55%,#e9a77d);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 12px rgba(40,8,0,.45))}`},
 perlas:{fonts:'family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Pinyon+Script',
  css:`:root{--cream:#f3eee6;--paper:#fbf9f5;--taupe:#8a7d6d;--ink:#1f1c19;--soft:#5f574e;--line:#cbc2b4}
body{font-family:"Cormorant Garamond",serif;color:var(--ink);background:var(--cream)}
.tex{background:var(--cream)}
.cielo{background:radial-gradient(ellipse 45% 14% at 15% 18%,rgba(255,255,255,.9),transparent 70%),radial-gradient(ellipse 40% 12% at 88% 40%,rgba(255,255,255,.85),transparent 70%),radial-gradient(ellipse 50% 14% at 12% 72%,rgba(255,255,255,.8),transparent 70%),linear-gradient(180deg,#a9b6c6,#cfd5dc 45%,#e6e3de)}
.dark{background:var(--taupe);color:#fff}
.s{font-family:"Pinyon Script",cursive;font-weight:400;line-height:1.1;color:var(--soft)}.dark .s{color:#f1ebe2}
.up{font-weight:300;text-transform:uppercase;letter-spacing:.06em;line-height:.95}
.tag{font-size:34px;font-weight:500;letter-spacing:.34em;text-transform:uppercase}
.nota{background:var(--paper);color:var(--ink);padding:64px 56px;box-shadow:0 20px 40px rgba(0,0,0,.18);display:flex;flex-direction:column;align-items:center;gap:24px;width:100%}
.p{font-size:46px;font-weight:500;line-height:1.3}
.lista li{font-size:48px;font-weight:500}.lista li::before{content:"";width:26px;height:26px;margin:14px 9px 0;border-radius:50%;background:radial-gradient(circle at 36% 30%,#fff,#f7f3ec 25%,#ddd3c4 65%,#9f9282);box-shadow:0 3px 4px rgba(0,0,0,.3)}
.chip{display:inline-block;padding:24px 60px;border:2px solid currentColor;font-size:40px;font-weight:500;letter-spacing:.24em;text-transform:uppercase}
.perlas{height:34px;width:120%;background:radial-gradient(circle at 36% 30%,#fff,#f7f3ec 25%,#ddd3c4 65%,#9f9282 98%,transparent 100%) 0 0/34px 34px repeat-x;filter:drop-shadow(0 3px 3px rgba(0,0,0,.3));flex:none}
.marca{font-weight:500;font-size:50px;letter-spacing:.34em;text-indent:.34em;text-transform:uppercase}.num{font-weight:500}`},
 rosa:{fonts:'family=Great+Vibes&family=Fredoka:wght@600&family=Inter:wght@400;500;600',
  css:`:root{--rosa:#fbdce3;--blanco:#fff;--oscuro:#2e3230;--tinta:#1d1d1d}
body{font-family:"Great Vibes",cursive;color:var(--tinta);background:var(--rosa)}
.rosa{background:var(--rosa)}.blanco{background:#fff}.oscuro{background:var(--oscuro);color:#fff}
.s{font-family:"Great Vibes",cursive;font-weight:400;line-height:1.1}
.i{font-family:Inter,sans-serif}
.tag{font-family:Inter,sans-serif;font-weight:500;font-size:30px;letter-spacing:.3em;text-transform:uppercase}
.carta{background:#fff;color:var(--tinta);padding:70px 60px;display:flex;flex-direction:column;align-items:center;gap:28px;width:100%;box-shadow:0 30px 60px rgba(160,90,110,.2)}
.p{font-family:Inter,sans-serif;font-size:40px;line-height:1.4}
.lista li{font-family:Inter,sans-serif;font-size:42px;font-weight:500}.lista li::before{content:"♡";font-family:Inter,sans-serif}
.chip{display:inline-block;padding:26px 64px;border-radius:99px;background:var(--oscuro);color:#fff;font-family:Inter,sans-serif;font-weight:600;font-size:40px;letter-spacing:.06em}
.oscuro .chip{background:#fff;color:var(--tinta)}
.rasgo{position:absolute;left:0;width:100%;height:80px}.rasgo.ar{top:-1px}.rasgo.ab{bottom:-1px;transform:scaleY(-1)}
.marca{font-family:Fredoka,sans-serif;font-weight:600;font-size:60px}.num{font-family:Inter,sans-serif;font-weight:500;font-size:28px}`},
 marca:{fonts:'family=Pinyon+Script&family=Forum&family=Cormorant+Garamond:wght@500;600&family=Comfortaa:wght@400;600',
  css:`:root{--b:#46161d;--c:#f4ecdc;--a:#b3c6d6}
body{font-family:Comfortaa,sans-serif;color:var(--b);background:var(--c)}
.crema{background:var(--c)}.osc{background:var(--b);color:var(--c)}
.rayas{background:repeating-linear-gradient(90deg,var(--a) 0 60px,var(--c) 60px 120px)}
.s{font-family:"Pinyon Script",cursive;font-weight:400;line-height:1.1}
.forum{font-family:Forum,serif;letter-spacing:.06em;text-transform:uppercase}
.tag{font-family:Forum,serif;font-size:34px;letter-spacing:.3em;text-transform:uppercase}
.p{font-size:40px;line-height:1.45}
.caja{background:var(--c);border:3px solid var(--b);outline:2px solid var(--b);outline-offset:-18px;padding:64px 56px;display:flex;flex-direction:column;align-items:center;gap:26px;width:100%}
.osc .caja{background:transparent;border-color:var(--c);outline-color:var(--c)}
.chip{display:inline-block;padding:22px 52px;border-radius:60px;background:var(--b);color:var(--c);font-family:Forum,serif;font-size:42px;letter-spacing:.12em}
.osc .chip{background:var(--c);color:var(--b)}
.lista li{font-size:42px}.lista li::before{content:"·";font-family:Forum,serif;font-size:60px;line-height:.7}
.marca{font-family:"Pinyon Script",cursive}.num{font-family:Forum,serif}
.ficha{display:flex;flex-direction:column;align-items:center;gap:14px}.ficha b{font-family:Forum,serif;font-weight:400;font-size:34px;letter-spacing:.18em;text-transform:uppercase}`}
};
const RASGO=`<svg width="0" height="0" style="position:absolute"><defs><symbol id="rg" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 0H400V23L393.6 25.2 384.8 23.1 378.6 19.1 370.8 20.9 361.9 16.8 352 14.7 342.3 15.2 333.7 16.5 324.8 15.8 316.9 19.5 307.9 20.8 297.2 19.7 286.6 19.7 275.6 18.4 263.9 11.4 255.2 9.5 244.3 7 233.5 4.3 225.8 3 214.6 3 204 3 194.9 3 183.2 3 175 6.7 162.8 10.7 153 9.9 142.7 14.8 133.4 16.7 123.1 15.2 113.8 19.5 101.4 16 91.7 14.2 84.6 14.3 75.8 14.3 66.6 17.4 56.9 14.8 48.6 16.5 38.2 21 28.8 20.7 17.1 25.5 5.1 27.5 0 27.5Z" fill="CL"/></symbol></defs></svg>`;
const rasgo=(pos,color)=>`<svg class="rasgo ${pos}" viewBox="0 0 400 40" preserveAspectRatio="none"><use href="#rg" style="fill:${color}"/></svg>`;

// Ayudantes por serie
const serie=(clave,tema,marcaTxt='Invitto')=>({
 car:slides=>slides.forEach(([clase,body],i)=>add(`${clave}-carrusel-${i+1}`,1080,1350,tema,`<div class="f ${clase}">${body}<div class="num">${i+1}/${slides.length}</div><div class="marca">${marcaTxt}</div></div>`)),
 reel:(clase,body)=>add(`${clave}-reel-portada`,1080,1920,tema,`<div class="f ${clase}" style="padding:220px 80px 330px">${body}<div class="marca" style="bottom:210px">${marcaTxt}</div></div>`),
 hist:(clase,body)=>add(`${clave}-historia`,1080,1920,tema,`<div class="f ${clase}" style="padding:200px 80px 260px">${body}<div class="marca" style="bottom:120px">${marcaTxt}</div></div>`)
});

// ================= 1. CUMPLEAÑOS DE 30 · TERCIOPELO =================
{const s=serie('cumple30','treinta');
 s.car([
  ['velvet',`<div class="tag">Invitaciones digitales</div>
   <div class="s titulo-oro" style="font-size:190px">Cumpleaños</div>
   <div class="c" style="font-size:54px;color:#f5d9bf">de 30 años</div>
   <div class="tarj"><div class="s" style="font-size:84px;color:var(--rust)">Con telón, música y confirmación</div><div class="p">Una invitación que se abre en el celular de cada invitado</div></div>
   <div class="c" style="font-size:36px;color:#f5d9bf">Desliza →</div>`],
  ['melo',`<div class="s" style="font-size:110px;color:var(--rust)">Así se abre</div>
   <div class="fila">${tel('treinta/bienvenida',380)}<div class="flecha" style="color:var(--rust)">→</div>${tel('treinta/inicio',380)}</div>
   <div class="p" style="max-width:860px">Primero un sobre con sello de lacre. Al tocarlo, se abre el telón y empieza la música.</div>`],
  ['velvet',`<div class="fila" style="gap:56px">${tel('treinta/tira1',400,'62%')}<div class="tarj" style="flex:1;border-radius:110px 110px 20px 20px/70px 70px 20px 20px;padding:60px 40px;align-items:flex-start">
   <div class="s" style="font-size:86px;color:var(--rust);align-self:center">Lo que trae</div>
   <ul class="lista"><li>Reproductor de música</li><li>Calendario con el día marcado</li><li>Botón para ver la ubicación</li><li>Código de vestimenta con colores</li></ul></div></div>`],
  ['melo',`<div class="fila" style="gap:56px"><div style="flex:1;display:flex;flex-direction:column;gap:34px;align-items:flex-start;text-align:left">
   <div class="s" style="font-size:100px;color:var(--rust)">Y además…</div>
   <ul class="lista"><li>Cuenta regresiva hasta la fiesta</li><li>«Agregar a mi calendario»</li><li>Confirmación por WhatsApp con el mensaje listo</li><li>Foto en polaroid y galería</li></ul></div>${tel('treinta/rsvp',400,'top')}</div>`],
  ['velvet',`<div class="tarj"><div class="tag" style="color:var(--rust)">Tu cumpleaños</div><div class="s" style="font-size:130px;color:var(--rust)">¿Quieres la tuya?</div>
   <div class="p">Escríbenos por mensaje directo y te contamos cómo hacer tu invitación.</div><div class="chip">Escríbenos por DM</div></div>`]]);
 s.reel('velvet',`<div class="tag">Invitación digital de cumpleaños</div>
  <div class="s titulo-oro" style="font-size:150px">Se abre como un telón</div>${tel('treinta/inicio',460)}`);
 s.hist('melo',`<div class="tag" style="color:var(--rust)">Invitación digital</div>
  <div class="s" style="font-size:130px;color:var(--rust)">Tus 30,<br>con música</div>
  <div class="fila">${tel('treinta/bienvenida',400)}<div class="flecha" style="color:var(--rust)">→</div>${tel('treinta/inicio',400)}</div>
  <div class="p" style="max-width:820px">Sobre animado, telón, cuenta regresiva y confirmación por WhatsApp.</div>
  <div class="chip">Escríbenos por DM</div>`);
}

// ================= 2. CUMPLEAÑOS CON PERLAS =================
{const s=serie('cumple-perlas','perlas');
 s.car([
  ['cielo',`<div class="nota" style="gap:30px"><div class="tag">Invitaciones digitales</div>
   <div class="up" style="font-size:118px">Cumpleaños</div><div class="s" style="font-size:96px">elegante, con perlas</div><div class="perlas" style="width:100%"></div>
   <div class="p">Una invitación serena, en tonos crema y topo, para abrir en el celular</div></div>
   <div class="tag" style="font-size:30px">Desliza →</div>`],
  ['tex',`<div class="fila">${tel('perlas/larga',360,'top')}${tel('perlas/mensaje',360,'fit:#f3eee6')}</div>
   <div class="up" style="font-size:72px">Tu nombre, en grande</div><div class="s" style="font-size:70px">y un mensaje para tus invitados</div>`],
  ['dark',`<div class="fila" style="gap:56px">${tel('perlas/programa',400,'top')}<div style="flex:1;display:flex;flex-direction:column;gap:34px;align-items:flex-start;text-align:left">
   <div class="up" style="font-size:80px">Lo que trae</div>
   <ul class="lista"><li>Programa del día con horarios</li><li>Calendario con la fecha destacada</li><li>Lugar y hora, con enlace al mapa</li></ul></div></div>`],
  ['tex',`<div class="fila" style="gap:56px"><div style="flex:1;display:flex;flex-direction:column;gap:34px;align-items:flex-start;text-align:left">
   <div class="up" style="font-size:80px">Y además</div>
   <ul class="lista"><li>Dress code con la paleta de colores</li><li>Canal de Telegram para avisos</li><li>Sección de deseos y regalos</li></ul></div>${tel('perlas/vestimenta',400,'top')}</div>`],
  ['dark',`<div class="perlas"></div><div class="tag">Tu cumpleaños</div><div class="up" style="font-size:120px">¿Quieres<br>la tuya?</div>
   <div class="p" style="max-width:820px">Escríbenos por mensaje directo y te contamos cómo hacer tu invitación.</div><div class="chip">Escríbenos por DM</div><div class="perlas"></div>`]]);
 s.reel('cielo',`<div class="tag">Invitación digital</div><div class="up" style="font-size:120px">Cumpleaños</div><div class="s" style="font-size:96px">con perlas</div>${tel('perlas/larga',440,'top')}`);
 s.hist('dark',`<div class="perlas"></div><div class="tag">Invitación digital</div><div class="s" style="font-size:110px">El programa<br>de tu fiesta</div>
  ${tel('perlas/programa',440,'top')}<div class="chip">Escríbenos por DM</div>`);
}

// ================= 3. BIRTHDAY PARTY · LAZO ROSA =================
{const s=serie('cumple-rosa','rosa');
 s.car([
  ['rosa',`<div class="carta"><img src="capturas/rosa/lazo.png" style="width:150px"><div class="tag">Invitaciones digitales</div>
   <div class="s" style="font-size:170px">Birthday party!</div><div class="p">Invitación de cumpleaños en rosa, blanco y negro, con lazo y pastel dibujados</div></div>
   <div class="tag" style="font-size:28px">Desliza →</div>`],
  ['blanco',`<div class="s" style="font-size:110px">Se abre como un sobre</div>
   <div class="fila">${tel('rosa/sobre',380)}<div class="flecha i" style="font-size:70px">→</div>${tel('rosa/larga',380,'top')}</div>
   <div class="p">«Tienes una invitación · toca para abrir»</div>`],
  ['oscuro',`${rasgo('ar','#fbdce3')}<div class="fila" style="gap:56px">${tel('rosa/lugar',400,'top')}<div style="flex:1;display:flex;flex-direction:column;gap:34px;align-items:flex-start;text-align:left">
   <div class="s" style="font-size:110px">¿Dónde será?</div>
   <ul class="lista"><li>Botón para abrir el mapa</li><li>Agregar al calendario</li><li>Itinerario con flechas animadas</li></ul></div></div>${rasgo('ab','#fbdce3')}`],
  ['rosa',`<div class="fila" style="gap:50px"><div style="flex:1;display:flex;flex-direction:column;gap:30px;align-items:flex-start;text-align:left">
   <div class="s" style="font-size:96px">Confirman y tú lo ves</div>
   <ul class="lista"><li>Formulario de asistencia</li><li>Panel con quién viene y cuántos son</li><li>Lista de deseos y código de vestimenta</li></ul>
   <img src="capturas/rosa/panel.png" style="width:100%;border-radius:24px;box-shadow:0 20px 40px rgba(160,90,110,.25)"></div>${tel('rosa/final',400,'78%')}</div>`],
  ['oscuro',`${rasgo('ar','#fbdce3')}<img src="capturas/rosa/pastel.png" style="width:220px;filter:invert(1)"><div class="s" style="font-size:150px">¿Quieres la tuya?</div>
   <div class="p" style="max-width:820px">Escríbenos por mensaje directo y te contamos cómo hacer tu invitación.</div><div class="chip">Escríbenos por DM</div>${rasgo('ab','#fbdce3')}`]]);
 s.reel('rosa',`<div class="tag">Invitación digital</div><div class="s" style="font-size:170px">Birthday party!</div>${tel('rosa/larga',440,'top')}`);
 s.hist('blanco',`<img src="capturas/rosa/lazo.png" style="width:130px"><div class="s" style="font-size:130px">Tienes una invitación</div>
  <div class="fila">${tel('rosa/sobre',390)}${tel('rosa/itinerario',390,'fit:#fff')}</div><div class="chip">Escríbenos por DM</div>`);
}

// ================= CATÁLOGO =================
{const s=serie('catalogo','marca');
 const ficha=(img,pos,w,t)=>`<div class="ficha">${tel(img,w,pos)}<b>${t}</b></div>`;
 const hoja=(clase,tipo,titulo,img,pos,lista)=>[clase,`<div class="tag">${tipo}</div><div class="s" style="font-size:120px">${titulo}</div>
   <div class="fila" style="gap:56px">${tel(img,400,pos)}<ul class="lista" style="flex:1">${lista.map(x=>`<li>${x}</li>`).join('')}</ul></div>`];
 s.car([
  ['rayas',`<div class="caja" style="padding:50px 40px;gap:20px"><div class="tag">Catálogo</div><div class="s" style="font-size:116px">Nuestros diseños</div><div class="forum" style="font-size:44px">Bodas · Cumpleaños</div>
   <div class="fila" style="gap:22px;margin-top:10px">${ficha('boda/tarjeta','top',180,'Boda')}${ficha('treinta/inicio','top',180,'Telón')}${ficha('perlas/larga','top',180,'Perlas')}${ficha('rosa/larga','top',180,'Lazo')}</div>
   <div class="p" style="font-size:34px">Desliza →</div></div>`],
  hoja('crema','Bodas','Encaje y burdeos','boda/tarjeta','top',['Calendario «save the date»','Plan del día','Confirmación con acompañantes']),
  hoja('osc','Cumpleaños','Telón de terciopelo','treinta/inicio','top',['Sobre y telón animados','Música y cuenta regresiva','Confirmación por WhatsApp']),
  hoja('crema','Cumpleaños','Perlas y crema','perlas/larga','top',['Programa del día','Dress code con colores','Canal de Telegram']),
  hoja('osc','Cumpleaños','Lazo rosa','rosa/larga','top',['Sobre de entrada','Mapa y calendario','Panel de respuestas']),
  ['rayas',`<div class="caja"><div class="s" style="font-size:140px">¿Cuál te gusta?</div><div class="p">Escríbenos por mensaje directo con el número del diseño y el tipo de evento.</div><div class="chip">ESCRÍBENOS POR DM</div></div>`]]);
}

// ---------- Render ----------
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({deviceScaleFactor:1});
 for(const it of items){const T=TEMAS[it.tema];
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?${T.fonts}&display=swap" rel="stylesheet"><style>${BASE}\n${T.css}</style></head><body style="--w:${it.w}px;--h:${it.h}px">${it.tema==='rosa'?RASGO.replace('CL','#fbdce3'):''}${it.body}</body></html>`;
  const f=path.join(SRC,it.nombre+'.html');fs.writeFileSync(f,html);
  await p.setViewportSize({width:it.w,height:it.h});await p.goto('file://'+f,{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
  await p.screenshot({path:path.join(OUT,it.nombre+'.png')});console.log(it.nombre);}
 await b.close();})();
