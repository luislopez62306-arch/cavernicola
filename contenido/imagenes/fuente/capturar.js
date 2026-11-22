const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});
await p.goto('file:///home/user/cavernicola/index.html');await p.evaluate(()=>document.fonts.ready);
await p.addStyleTag({content:'*{animation:none!important;transition:none!important}'});
await p.evaluate(()=>{const r={novio:'Ana',novia:'Luis',lugar1:'Jardín Botánico',sala1:'Sala Principal',lugar2:'Hacienda Los Olivos',limite:'1 de julio de 2027'};
document.querySelectorAll('[data-cfg]').forEach(e=>{if(r[e.dataset.cfg])e.textContent=r[e.dataset.cfg]});
document.querySelectorAll('[data-ini]').forEach(e=>e.textContent='A & L');
const h=document.querySelector('.hero .bg');h.style.filter='blur(30px) brightness(.6)';});
await p.waitForTimeout(500);
for(const s of ['hero','tarjeta','plan','lugar','vest','foto','detalles','rsvp']){const el=await p.$('section.'+s);await el.screenshot({path:'capturas/'+s+'.png'});}
await b.close();})();
