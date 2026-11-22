// Genera los HTML fuente y los PNG de las publicaciones del calendario de Invitto.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const OUT=path.resolve(__dirname,'..');
const FONTS='<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Forum&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Comfortaa:wght@400;600&display=swap" rel="stylesheet">';
const CSS=`:root{--b:#46161d;--c:#f4ecdc;--a:#b3c6d6}*{margin:0;box-sizing:border-box}
body{width:var(--w);height:var(--h);overflow:hidden;font-family:Comfortaa,sans-serif;color:var(--b);background:var(--c)}
.f{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:90px 80px;gap:36px}
.rayas{background:repeating-linear-gradient(90deg,var(--a) 0 60px,var(--c) 60px 120px)}
.osc{background:var(--b);color:var(--c)}.azul{background:var(--a)}
.caja{background:var(--c);border:3px solid var(--b);outline:2px solid var(--b);outline-offset:-18px;padding:70px 60px;display:flex;flex-direction:column;align-items:center;gap:28px;width:100%}
.osc .caja{background:transparent;border-color:var(--c);outline-color:var(--c)}
.script{font-family:'Pinyon Script',cursive;font-weight:400;line-height:1.1}
.forum{font-family:Forum,serif;letter-spacing:.06em;text-transform:uppercase}
.corm{font-family:'Cormorant Garamond',serif;font-weight:600;line-height:1.15}
.tag{font-family:Forum,serif;font-size:34px;letter-spacing:.3em;text-transform:uppercase}
.marca{position:absolute;bottom:56px;left:0;right:0;font-family:'Pinyon Script',cursive;font-size:64px}
.num{position:absolute;top:56px;right:70px;font-family:Forum,serif;font-size:34px;letter-spacing:.1em}
.tel{width:var(--tw,430px);border-radius:60px;background:#1b0a0d;padding:16px;box-shadow:0 30px 60px rgba(70,22,29,.35);flex:none}
.tel .pan{border-radius:46px;overflow:hidden;background:var(--c)}
.tel img{width:100%;display:block}
.fila{display:flex;gap:40px;align-items:center;justify-content:center;width:100%}
.p{font-size:38px;line-height:1.5}
.lista{list-style:none;padding:0;display:flex;flex-direction:column;gap:26px;width:100%;text-align:left}
.lista li{font-size:44px;display:flex;gap:26px;align-items:center}.lista b{font-family:Forum,serif;font-size:60px;min-width:60px}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:30px;width:100%}
.cmp>div{padding:44px 30px;border:3px solid var(--b);display:flex;flex-direction:column;gap:18px}
.cmp .si{background:var(--b);color:var(--c)}
.cmp h4{font-family:Forum,serif;font-size:36px;letter-spacing:.2em;font-weight:400}
.cmp p{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:54px;line-height:1.1}
.hueco{width:100%;height:330px;border:4px dashed currentColor;border-radius:40px;display:flex;align-items:center;justify-content:center;font-size:30px;opacity:.55}
.chip{display:inline-block;padding:18px 40px;border-radius:60px;background:var(--b);color:var(--c);font-family:Forum,serif;font-size:40px;letter-spacing:.12em}
.osc .chip{background:var(--c);color:var(--b)}
.pal{display:flex;gap:0;height:120px;width:300px;border:3px solid var(--b)}.pal i{flex:1}
`;
const tel=(img,w=430,top=0)=>`<div class="tel" style="--tw:${w}px"><div class="pan"><img src="capturas/${img}.png" style="margin-top:-${top}px"></div></div>`;
const M='<div class="marca">Invitto</div>';
const items=[];
const add=(nombre,w,h,body)=>items.push({nombre,w,h,body});
const reel=(n,clase,body)=>add(n+'-reel-portada',1080,1920,`<div class="f ${clase}">${body}${M}</div>`);
const hist=(n,clase,body)=>add(n+'-historia',1080,1920,`<div class="f ${clase}">${body}${M}</div>`);
const car=(n,slides)=>slides.forEach((s,i)=>add(`${n}-carrusel-${i+1}`,1080,1350,`<div class="f ${s[0]}">${s[1]}<div class="num">${i+1}/${slides.length}</div>${M}</div>`));
const cmp=(titulo,a,b)=>['', `<div class="tag">${titulo}</div><div class="cmp"><div><h4>PAPEL</h4><p>${a}</p></div><div class="si"><h4>INVITTO</h4><p>${b}</p></div></div>`];

// ---------- SEMANA 1 ----------
reel('semana1-post1','rayas',`<div class="caja"><div class="tag">Invitaciones digitales</div><div class="corm" style="font-size:92px">Esta es una invitación de boda…</div><div class="script" style="font-size:120px">y cabe en tu bolsillo</div></div>${tel('tarjeta',520)}`);
car('semana1-post2',[
 ['rayas',`<div class="caja"><div class="tag">Guarda este post</div><div class="script" style="font-size:150px">Papel vs. digital</div><div class="corm" style="font-size:64px">la comparación honesta</div><div class="p">Desliza →</div></div>`],
 cmp('Precio · 100 invitados','150–400 €','desde 49 €'),
 cmp('Entrega y confirmación','Correo, en mano y muchas llamadas','WhatsApp al instante y formulario integrado'),
 cmp('Cómo llegar y extras','Una dirección escrita','Botón al mapa, música y fotos'),
 cmp('Cambios y residuos','Reimprimir todo · papel y sobres','Se actualiza en minutos · cero residuos'),
 ['osc',`<div class="caja"><div class="script" style="font-size:130px">¿Te imaginas la tuya?</div><div class="p">Escríbenos por mensaje directo y te enseñamos un ejemplo real.</div><div class="chip">ENLACE EN LA BIO</div></div><div class="p" style="font-size:26px;opacity:.7">Precios orientativos del papel; varían según la ciudad.</div>`]]);
items.forEach(i=>{if(i.nombre.includes('carrusel')&&i.body.startsWith('<div class="f "'))i.body=i.body.replace('<div class="f "','<div class="f azul"')});
hist('semana1-post3','rayas',`<div class="caja"><div class="tag">Encuesta</div><div class="script" style="font-size:140px">¿Papel o digital?</div><div class="p">¿Cómo enviarías la invitación de tu boda?</div><div class="hueco">Espacio para el sticker de encuesta</div></div><div class="caja"><div class="corm" style="font-size:60px">¿Qué te preocupa de una invitación digital?</div><div class="hueco" style="height:220px">Espacio para la caja de preguntas</div></div>`);
reel('semana1-post4','osc',`<div class="tag">Spoiler: hay más</div><div class="corm" style="font-size:96px">3 cosas que tu invitación de papel no puede hacer</div><ul class="lista" style="width:auto"><li><b>1</b>Abrir el mapa</li><li><b>2</b>Sonar tu canción</li><li><b>3</b>Confirmar asistencia</li></ul><div class="fila">${tel('lugar',330)}${tel('rsvp',330)}</div>`);

// ---------- SEMANA 2 ----------
reel('semana2-post1','azul',`<div class="caja"><div class="script" style="font-size:150px">«¿Y si mi abuela no sabe usarla?»</div><div class="p">Si sabe abrir un WhatsApp, sabe abrir tu invitación.</div></div>${tel('tarjeta',540)}`);
car('semana2-post2',[
 ['osc',`<div class="caja"><div class="tag">Paso a paso</div><div class="script" style="font-size:140px">Así funciona el RSVP</div><div class="p">Adiós a las 40 llamadas de «¿al final venís?»</div></div>`],
 ['rayas',`<div class="caja"><div class="forum" style="font-size:120px">1</div><div class="corm" style="font-size:74px">Tu invitado abre el enlace</div><div class="p">Desde WhatsApp, sin descargar nada.</div></div>`],
 ['azul',`<div class="fila">${tel('rsvp',400)}<div style="text-align:left;flex:1"><div class="forum" style="font-size:120px">2</div><div class="corm" style="font-size:66px">Escribe su nombre y toca «Sí, con gusto»</div></div></div>`],
 ['rayas',`<div class="caja"><div class="forum" style="font-size:120px">3</div><div class="corm" style="font-size:74px">Elige sus acompañantes</div><div class="p">Solo yo, +1, +2 o +3.</div></div>`],
 ['azul',`<div class="caja"><div class="forum" style="font-size:120px">4</div><div class="corm" style="font-size:74px">Tú recibes la lista</div><div class="p">Sabes quién viene y con cuántas personas, sin perseguir a nadie.</div></div>`],
 ['osc',`<div class="caja"><div class="script" style="font-size:130px">¿Lo quieres en tu boda?</div><div class="p">Escríbenos y te mandamos una invitación de ejemplo.</div><div class="chip">ENLACE EN LA BIO</div></div>`]]);
hist('semana2-post3','osc',`<div class="tag">Respondemos</div><div class="script" style="font-size:150px">Vuestras dudas</div><div class="caja"><div class="hueco" style="height:300px">Pega aquí la pregunta recibida</div><div class="corm" style="font-size:56px;text-align:left;width:100%">Respuesta:</div><div class="p" style="text-align:left;width:100%;opacity:.8">Escribe aquí la respuesta (2–3 líneas, letra grande).</div></div>`);
reel('semana2-post4','rayas',`<div class="caja"><div class="corm" style="font-size:96px">Cuánto me ahorré en invitaciones</div><div class="cmp"><div><h4>PAPEL</h4><p>X €</p></div><div class="si"><h4>INVITTO</h4><p>Y €</p></div></div><div class="script" style="font-size:110px">¿Y el resto? Para la luna de miel</div></div>`);

// ---------- SEMANA 3 ----------
const pal=(c)=>`<div class="pal">${c.map(x=>`<i style="background:${x}"></i>`).join('')}</div>`;
reel('semana3-post1','azul',`<div class="caja"><div class="script" style="font-size:170px">Elige tu estilo</div><div class="p">Comenta 1, 2 o 3</div></div><div class="fila" style="gap:30px">${[['1','Romántico',['#46161d','#f4ecdc','#b3c6d6']],['2','Minimal',['#ffffff','#e8e4de','#2b2b2b']],['3','Campestre',['#5f7350','#efe8d6','#c9a96e']]].map(([n,t,c])=>`<div style="display:flex;flex-direction:column;align-items:center;gap:18px"><div class="forum" style="font-size:90px">${n}</div>${pal(c)}<div class="corm" style="font-size:50px">${t}</div></div>`).join('')}</div>`);
car('semana3-post2',[
 ['azul',`<div class="caja"><div class="tag">Para tus invitados</div><div class="script" style="font-size:150px">El dress code</div><div class="corm" style="font-size:62px">explicado con colores</div></div>`],
 ['rayas',`<div class="fila">${tel('vest',420)}<div style="text-align:left;flex:1" class="caja"><div class="corm" style="font-size:58px">Tu paleta, en la invitación</div><div class="p" style="font-size:34px">Cada invitado ve los colores de tu boda en su móvil.</div></div></div>`],
 ['osc',`<div class="caja"><div class="tag">Consejo 1</div><div class="corm" style="font-size:74px">Elige de 4 a 8 colores</div><div class="p">Así es fácil combinarlos y no limita a nadie.</div></div>`],
 ['azul',`<div class="caja"><div class="tag">Consejo 2</div><div class="corm" style="font-size:74px">Di qué evitar</div><div class="p">Por ejemplo: «el blanco, mejor para la novia».</div></div>`],
 ['osc',`<div class="caja"><div class="script" style="font-size:120px">Que nadie vaya de blanco</div><div class="p">Tu invitación lo deja claro.</div><div class="chip">ENLACE EN LA BIO</div></div>`]]);
hist('semana3-post3','rayas',`<div class="caja"><div class="tag">Detrás de cámaras</div><div class="script" style="font-size:130px">Así creamos tu invitación</div><div class="p">Foto · nombres · fecha · lugar</div></div>${tel('plan',480)}<div class="chip">¿QUIERES LA TUYA?</div>`);
reel('semana3-post4','osc',`<div class="tag">Invitto</div><div class="script" style="font-size:180px">No solo bodas</div><ul class="lista" style="width:auto"><li><b>·</b>Bautizos</li><li><b>·</b>Fiestas de 15 años</li><li><b>·</b>Aniversarios</li><li><b>·</b>Baby showers</li></ul><div class="corm" style="font-size:60px">Cualquier celebración merece una invitación bonita</div>`);

// ---------- SEMANA 4 ----------
reel('semana4-post1','rayas',`<div class="caja"><div class="corm" style="font-size:96px">Lo que dijeron los invitados</div><div class="script" style="font-size:120px">al recibir la invitación</div></div>${tel('foto',500)}`);
car('semana4-post2',[
 ['osc',`<div class="caja"><div class="tag">Así de fácil</div><div class="script" style="font-size:140px">Pide tu invitación</div><div class="corm" style="font-size:70px">en 4 pasos</div></div>`],
 ['rayas',`<div class="caja"><div class="forum" style="font-size:120px">1</div><div class="corm" style="font-size:80px">Escríbenos</div><div class="p">Por mensaje directo o WhatsApp.</div></div>`],
 ['azul',`<div class="caja"><div class="forum" style="font-size:120px">2</div><div class="corm" style="font-size:80px">Elige diseño</div><div class="p">Colores, estilo y secciones.</div></div>`],
 ['rayas',`<div class="caja"><div class="forum" style="font-size:120px">3</div><div class="corm" style="font-size:80px">Envía datos y fotos</div><div class="p">Nombres, fecha, lugar y hora.</div></div>`],
 ['azul',`<div class="caja"><div class="forum" style="font-size:120px">4</div><div class="corm" style="font-size:80px">Recíbela en 48–72 h</div><div class="p">Lista para enviar por WhatsApp.</div></div>`],
 ['osc',`<div class="caja"><div class="script" style="font-size:140px">¿Empezamos?</div><div class="chip">ENLACE EN LA BIO</div></div>`]]);
hist('semana4-post3','osc',`<div class="tag">Solo esta semana</div><div class="caja"><div class="script" style="font-size:150px">Música de fondo gratis</div><div class="corm" style="font-size:62px">en el paquete Básico</div></div><div class="hueco" style="height:260px">Espacio para el sticker de cuenta atrás</div><div class="chip">ESCRÍBENOS</div>`);
reel('semana4-post4','azul',`<div class="caja"><div class="corm" style="font-size:96px">Envía tu invitación en 3 segundos</div><div class="script" style="font-size:110px">un enlace, todos tus invitados</div></div>${tel('lugar',500)}`);

(async()=>{const b=await chromium.launch();
for(const it of items){const html=`<!doctype html><html lang="es"><head><meta charset="utf-8">${FONTS}<style>${CSS}</style><style>body{--w:${it.w}px;--h:${it.h}px}</style></head><body>${it.body}</body></html>`;
 const f=path.join(__dirname,it.nombre+'.html');fs.writeFileSync(f,html);
 const p=await b.newPage({viewport:{width:it.w,height:it.h},deviceScaleFactor:1});
 await p.goto('file://'+f,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:path.join(OUT,it.nombre+'.png')});
 const ov=await p.evaluate(()=>{const f=document.querySelector('.f');return f.scrollHeight>innerHeight+2});if(ov)console.log('DESBORDA',it.nombre);
 await p.close();}
await b.close();console.log(items.length,'imágenes');})();
