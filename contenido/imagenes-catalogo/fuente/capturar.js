// Captura las invitaciones de otras ramas con los datos personales reemplazados por datos ficticios.
// Uso: node capturar.js <carpeta_con_ramas_extraidas>
// Cada rama se extrae antes con: git archive origin/claude/<rama> | tar -x -C <carpeta>/<rama>
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const R=process.argv[2]||'/tmp/claude-0/-home-user-cavernicola/2a395123-2b8e-58cd-a400-1549901da270/scratchpad/ramas';
const OUT=path.join(__dirname,'capturas');
const NOANIM='*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1!important;transform:none!important}';
(async()=>{
const b=await chromium.launch();
const abrir=async(archivo,dir,antes)=>{fs.mkdirSync(path.join(OUT,dir),{recursive:true});
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
  if(antes)await antes(p);
  await p.goto('file://'+path.join(R,archivo));await p.waitForLoadState('networkidle').catch(()=>{});
  await p.evaluate(()=>document.fonts.ready);return p};
const foto=(p,dir,n,el)=>(el?el.screenshot({path:path.join(OUT,dir,n+'.png')}):p.screenshot({path:path.join(OUT,dir,n+'.png')}));

// ---------- 1. Cumpleaños de 30 (terciopelo óxido) — rama claude/digital-invitation-g69l8y ----------
{const d='treinta',p=await abrir('digital-invitation-g69l8y/invitacion-cumple.html',d);
 await p.evaluate(()=>{
  const walk=n=>{if(n.nodeType===3){n.nodeValue=n.nodeValue.replace(/Valeria/g,'Camila')}else n.childNodes.forEach(walk)};walk(document.body);
  document.querySelectorAll('svg text').forEach(t=>{if(t.textContent.trim()==='V')t.textContent='C'});
  document.querySelector('.note p').textContent='Te espero en el salón «Jardín Aurora», en el centro de la ciudad';
  document.getElementById('tel').textContent='55 0000 0000';
 });
 await foto(p,d,'bienvenida');
 await p.click('#openEnv',{force:true});await p.waitForTimeout(4600);
 await p.addStyleTag({content:NOANIM+'.fab{display:none!important}.petals{display:none!important}'});
 await p.evaluate(()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));
  ['d','h','m','s'].forEach((id,i)=>document.getElementById(id).textContent=['20','08','45','12'][i])});
 await p.waitForTimeout(400);
 await foto(p,d,'inicio');await p.screenshot({path:path.join(OUT,d,'larga.png'),fullPage:true});
 const pan=await p.$$('.panel');await foto(p,d,'tira1',pan[0]);await foto(p,d,'tira2',pan[1]);
 await foto(p,d,'galeria',await p.$('.gal'));await foto(p,d,'rsvp',await p.$('.rsvp'));
 await p.close();}

// ---------- 2. Cumpleaños con perlas — rama claude/serene-hamilton-7kvyx3 (anahi.html) ----------
{const d='perlas',p=await abrir('serene-hamilton-7kvyx3/anahi.html',d);
 await p.addStyleTag({content:NOANIM});
 await p.evaluate(()=>{
  const walk=n=>{if(n.nodeType===3){n.nodeValue=n.nodeValue.replace(/Anahí/g,'Lucía').replace(/ANAHÍ/g,'LUCÍA')}else n.childNodes.forEach(walk)};walk(document.body);
  document.querySelectorAll('svg text').forEach(t=>{if(t.textContent.trim()==='A')t.textContent='L'});
  document.querySelectorAll('.photo .ph').forEach(e=>e.innerHTML='<b>L</b><small>Aquí va tu foto</small>');
  const v=document.querySelector('.vcard');v.querySelector('b').textContent='Salón Las Magnolias';v.querySelector('p').textContent='Centro de la ciudad';
 });
 await p.waitForTimeout(400);
 const s=await p.$$('section');const nom=['portada','mensaje','calendario','lugar','programa','vestimenta','canal','deseos'];
 for(let i=0;i<s.length;i++)await foto(p,d,nom[i],s[i]);
 await p.screenshot({path:path.join(OUT,d,'larga.png'),fullPage:true});
 await p.close();}

// ---------- 3. Birthday party rosa — rama claude/trusting-heisenberg-vs3ybn (cumple.html) ----------
// Las fotos reales de la cumpleañera no llegan a cargarse: se bloquean y se sustituyen por un degradado.
{const d='rosa',p=await abrir('trusting-heisenberg-vs3ybn/cumple.html',d,pg=>pg.route(/foto\d\.jpg$/,r=>r.abort()));
 await p.evaluate(()=>{
  document.querySelectorAll('.foto img').forEach(i=>{const w=i.getAttribute('width'),h=i.getAttribute('height'),dv=document.createElement('div');
    dv.style.cssText='width:100%;aspect-ratio:'+w+'/'+h+';background:linear-gradient(160deg,#fbdce3,#f4b6c4 55%,#e78fa5);display:grid;place-items:center;font-size:13cqw;color:#fff';
    dv.textContent='Aquí va tu foto';i.replaceWith(dv)});
  document.querySelector('.lugar p').innerHTML='Salón «La Terraza»<br>centro de la ciudad';
  document.querySelector('.nick').textContent='@tu.usuario';
 });
 await foto(p,d,'sobre');
 await p.click('#sobre',{force:true});await p.waitForTimeout(1200);
 await p.addStyleTag({content:NOANIM+'.cal{margin-top:3cqw!important}'});
 await p.evaluate(()=>document.querySelectorAll('.reveal,.flecha').forEach(e=>e.classList.add('on')));
 await p.waitForTimeout(400);
 const s=await p.$$('main>section');const nom=['portada','texto','lugar','itinerario','regalos','vestimenta','final'];
 for(let i=0;i<s.length;i++)await foto(p,d,nom[i],s[i]);
 await p.screenshot({path:path.join(OUT,d,'larga.png'),fullPage:true});
 // Panel de respuestas que ve la anfitriona, con invitados de ejemplo
 await p.evaluate(()=>{document.getElementById('panel').style.display='block';
  document.getElementById('t-si').textContent='3';document.getElementById('t-no').textContent='1';document.getElementById('t-pers').textContent='6';
  document.getElementById('lista').innerHTML=[['Laura M.','viene · 2'],['Diego R.','viene · 3'],['Marta S.','no viene'],['Pablo G.','viene · 1']].map(([a,c])=>'<li><span>'+a+'</span><span>'+c+'</span></li>').join('')});
 await foto(p,d,'panel',await p.$('#panel'));
 await p.close();}
await b.close();})();
