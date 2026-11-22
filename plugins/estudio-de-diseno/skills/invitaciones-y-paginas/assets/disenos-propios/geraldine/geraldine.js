/* Piezas compartidas por la invitación (index.html) y el generador de pases (pases.html):
   el monograma de Geraldine, el sello de lacre y la lógica de pases/códigos. */
(function(){
  const PUBLICO='https://TU-SITIO.com/';
  const r1=n=>Math.round(n*10)/10;

  // ---------- Gradientes dorados (una sola vez por página) ----------
  function ensureDefs(){
    if(document.getElementById('xvDefs'))return;
    const d=document.createElement('div');
    d.innerHTML='<svg id="xvDefs" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+
      '<linearGradient id="goldText" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2D7DB"/><stop offset=".42" stop-color="#FFFFFF"/><stop offset=".58" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D88C9A"/></linearGradient>'+
      '<linearGradient id="goldMetal" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#A8485C"/><stop offset=".22" stop-color="#FFFFFF"/><stop offset=".38" stop-color="#D88C9A"/><stop offset=".55" stop-color="#FFFFFF"/><stop offset=".72" stop-color="#A8485C"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>'+
      '<filter id="emboss" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="1.4" stdDeviation=".7" flood-color="#7E2E40" flood-opacity=".5"/><feDropShadow dx="0" dy="-.5" stdDeviation=".3" flood-color="#FFFFFF" flood-opacity=".6"/></filter>'+
      '<linearGradient id="pinkMetal" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#F2D7DB"/><stop offset=".3" stop-color="#D88C9A"/><stop offset=".5" stop-color="#F2D7DB"/><stop offset=".7" stop-color="#D88C9A"/><stop offset="1" stop-color="#D88C9A"/></linearGradient>'+
      '<filter id="glitter" x="-5%" y="-10%" width="110%" height="125%">'+
        '<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="7" result="n"/>'+
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 11 -6.6" result="spark"/>'+
        '<feColorMatrix in="n" type="matrix" values="0 0 0 0 .55  0 0 0 0 .05  0 0 0 0 .2  0 0 0 -9 4.2" result="dark"/>'+
        '<feComposite in="spark" in2="SourceAlpha" operator="in" result="sp"/>'+
        '<feComposite in="dark" in2="SourceAlpha" operator="in" result="dk"/>'+
        '<feDropShadow in="SourceGraphic" dx="0" dy="2" stdDeviation="2.5" flood-color="#7E2E40" flood-opacity=".45" result="base"/>'+
        '<feMerge><feMergeNode in="base"/><feMergeNode in="dk"/><feMergeNode in="sp"/></feMerge></filter>'+
      '<linearGradient id="goldLine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#A8485C"/></linearGradient>'+
      '<linearGradient id="burgText" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7E2E40"/><stop offset=".42" stop-color="#A8485C"/><stop offset=".55" stop-color="#D88C9A"/><stop offset=".7" stop-color="#A8485C"/><stop offset="1" stop-color="#7E2E40"/></linearGradient>'+
      '<radialGradient id="wax" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#C26A7C"/><stop offset=".55" stop-color="#A8485C"/><stop offset="1" stop-color="#7E2E40"/></radialGradient>'+
      '<linearGradient id="ribbon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A8485C"/><stop offset="1" stop-color="#7E2E40"/></linearGradient>'+
      '</defs></svg>';
    document.body.prepend(d.firstChild);
  }

  // ---------- Corona de laurel ----------
  function wreath(cx,cy,R,color){
    let s=`<path d="M${r1(cx+R*Math.cos(1.72))} ${r1(cy+R*Math.sin(1.72))}A${R} ${R} 0 0 1 ${r1(cx+R*Math.cos(4.25))} ${r1(cy+R*Math.sin(4.25))}M${r1(cx+R*Math.cos(1.42))} ${r1(cy+R*Math.sin(1.42))}A${R} ${R} 0 0 0 ${r1(cx+R*Math.cos(-1.11))} ${r1(cy+R*Math.sin(-1.11))}" fill="none" stroke="${color}" stroke-width="1.1"/>`;
    const leaf='M0 0Q7-5.4 15.5 0Q7 5.4 0 0Z';
    for(const side of [-1,1]){
      for(let i=0;i<10;i++){
        // de abajo (90°) hacia arriba por cada lado
        const deg=90+side*(14+i*15.5), a=deg*Math.PI/180;
        const x=cx+R*Math.cos(a), y=cy+R*Math.sin(a);
        const tan=deg+side*90; // dirección de crecimiento (hacia arriba)
        for(const k of [-1,1]){
          const off=k*2.2, nx=x+Math.cos(a)*off, ny=y+Math.sin(a)*off;
          const rot=tan+k*side*-30;
          const sc=1-i*0.035;
          s+=`<path d="${leaf}" fill="${color}" transform="translate(${r1(nx)} ${r1(ny)}) rotate(${r1(rot)}) scale(${r1(sc*100)/100})"/>`;
        }
      }
    }
    return s;
  }
  function tiara(cx,y,color,gem){
    return `<g transform="translate(${cx-24} ${y})"><path d="M2 24 5 9l8 9 6-14 5 13 5-13 6 14 8-9 3 15z" fill="${color}"/>`+
      `<rect x="1" y="23" width="46" height="4" rx="1.5" fill="${color}"/>`+
      `<circle cx="24" cy="3" r="3.2" fill="${gem}"/><circle cx="5" cy="8" r="2" fill="${gem}"/><circle cx="43" cy="8" r="2" fill="${gem}"/>`+
      `<circle cx="14.5" cy="16" r="1.6" fill="${gem}"/><circle cx="33.5" cy="16" r="1.6" fill="${gem}"/><circle cx="24" cy="25" r="1.4" fill="#FFFFFF"/></g>`;
  }

  // ---------- Monograma completo: tiara · laurel · G · XV · listón ----------
  function monogram(opts){
    const o=Object.assign({ribbon:true,name:'GERALDINE',dark:false},opts||{});
    const fill=o.dark?'url(#burgText)':'url(#goldText)', xv=o.dark?'#A8485C':'#FFFFFF';
    const h=o.ribbon?212:184;
    return `<svg viewBox="0 0 200 ${h}" role="img" aria-label="Monograma de Geraldine, XV años">`+
      wreath(100,104,74,fill)+
      tiara(100,6,fill,'#D88C9A')+
      `<circle cx="100" cy="104" r="60" fill="none" stroke="#D88C9A" stroke-width=".7" stroke-dasharray="1.5 4"/>`+
      `<text x="101" y="128" text-anchor="middle" font-family="'Pinyon Script',cursive" font-size="104" fill="${fill}">G</text>`+
      `<text x="100" y="${o.ribbon?156:160}" text-anchor="middle" font-family="'Cormorant Garamond',Georgia,serif" font-weight="600" font-size="15" letter-spacing="7" fill="${xv}" dx="3.5">XV</text>`+
      (o.ribbon?
        `<path d="M24 180h22v20H24l6-10z" fill="#7E2E40"/><path d="M176 180h-22v20h22l-6-10z" fill="#7E2E40"/>`+
        `<path d="M40 172h120l-2 4 2 20H40l2-20z" fill="url(#ribbon)"/>`+
        `<path d="M44 175.5h112M44 192.5h112" stroke="#FFFFFF" stroke-width=".6"/>`+
        `<text x="100" y="188.5" text-anchor="middle" font-family="'Cormorant Garamond',Georgia,serif" font-weight="600" font-size="12.5" letter-spacing="4.2" dx="2.1" fill="#FFFFFF">${o.name}</text>`
      :'')+
      `</svg>`;
  }

  // ---------- Sello de lacre con el monograma ----------
  function seal(){
    let d='';const N=60;
    for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,rr=92+Math.sin(i*1.7)*2.6+Math.sin(i*4.3)*1.6+(i%7===0?3:0);
      d+=(i?'L':'M')+r1(100+rr*Math.cos(a))+' '+r1(100+rr*Math.sin(a))}
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Sello con la inicial G">`+
      `<path d="${d}Z" fill="url(#wax)"/>`+
      `<circle cx="100" cy="100" r="74" fill="none" stroke="#7E2E40" stroke-width="5" opacity=".45"/>`+
      `<circle cx="100" cy="100" r="70" fill="none" stroke="url(#goldText)" stroke-width="1.2"/>`+
      `<g transform="translate(100 104) scale(.62) translate(-100 -104)">`+wreath(100,104,74,'url(#goldText)')+tiara(100,6,'url(#goldText)','#FFFFFF')+`</g>`+
      `<text x="101" y="127" text-anchor="middle" font-family="'Pinyon Script',cursive" font-size="84" fill="url(#goldText)">G</text>`+
      `<ellipse cx="70" cy="60" rx="22" ry="10" fill="#fff" opacity=".12" transform="rotate(-30 70 60)"/>`+
      `</svg>`;
  }

  // ---------- Logo con el nombre (estilo del de Danna Sofía): aro fino, G grande entrelazada con XV y el nombre abajo ----------
  // bg = color del fondo donde va, para que el "XV" se vea entrelazado sobre la G
  // Logotipo del nombre: letras decorativas con brillo rosa (glitter) y "XV" dorado arriba a la derecha
  function logo(){
    return `<svg viewBox="0 0 420 132" role="img" aria-label="Geraldine, XV años">`+
      `<text x="398" y="30" text-anchor="end" font-family="'Cormorant Garamond',Georgia,serif" font-weight="600" font-size="26" letter-spacing="3" fill="url(#goldMetal)" filter="url(#emboss)">XV</text>`+
      `<g filter="url(#glitter)">`+
      `<text x="210" y="112" text-anchor="middle" textLength="404" lengthAdjust="spacingAndGlyphs" font-family="'Cinzel Decorative',Cinzel,Georgia,serif" font-weight="700" font-size="76" fill="url(#pinkMetal)">GERALDINE</text>`+
      `</g></svg>`;
  }

  function mount(root){
    ensureDefs();
    (root||document).querySelectorAll('[data-mono]').forEach(el=>{
      const k=el.dataset.mono;
      el.innerHTML=k==='logo'?logo(el.dataset.bg):k==='seal'?seal():monogram({ribbon:k!=='plain',dark:k==='dark'});
    });
  }

  // ---------- Pases ----------
  const ABC='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const fnv=t=>{let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h};
  const clean=s=>String(s).trim().replace(/\s+/g,' ');
  const codeFor=(name,n)=>{const t=clean(name).toLowerCase()+'|'+n+'|XV-GERALDINE-2026';
    let c='';for(let i=0;i<5;i++)c+=ABC[fnv(t+'#'+i)%ABC.length];return 'GV-'+c};
  const enc=s=>[...new TextEncoder().encode(s)].map(b=>b.toString(16).padStart(2,'0')).join('');
  const dec=h=>new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(h.match(/../g).map(x=>parseInt(x,16))));
  const base=()=>{const h=location.hostname;
    if(/claude/i.test(h)||!/^https?:$/.test(location.protocol)||/^(localhost|127\.)/.test(h))return PUBLICO;
    return location.origin+location.pathname.replace(/[^/]*$/,'')};
  const linkFor=(name,n)=>{const b=base();return (b===PUBLICO?b:b+'index.html')+'#p'+n+'-'+enc(clean(name))};
  const plural=n=>n===1?'persona':'personas';
  const KEY='xv-geraldine-pases';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}};
  const save=l=>{try{localStorage.setItem(KEY,JSON.stringify(l));return true}catch(e){return false}};

  // Laurel + tiara como SVG independiente (sin texto), para dibujarlo en un canvas
  const wreathImageSVG=()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 184" width="800" height="736"><defs><linearGradient id="goldText" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7E2E40"/><stop offset=".45" stop-color="#D88C9A"/><stop offset=".6" stop-color="#A8485C"/><stop offset="1" stop-color="#7E2E40"/></linearGradient></defs>`+
    wreath(100,104,74,'url(#goldText)')+tiara(100,6,'url(#goldText)','#D88C9A')+
    `<circle cx="100" cy="104" r="60" fill="none" stroke="#A8485C" stroke-width=".7" stroke-dasharray="1.5 4"/></svg>`;

  window.XV={PUBLICO,monogram,seal,mount,wreathImageSVG,ensureDefs,codeFor,enc,dec,linkFor,plural,clean,load,save,PIN:'0000',PHONE:'520000000000'};
})();
