"""Genera el PDF profesional (A4 vertical, negro y dorado) de un plan de hipertrofia.

Uso: python3 scripts/generar_pdf.py plan.json salida.pdf
El JSON sigue la forma de plantilla-plan.json. Requiere Playwright con Chromium.
"""
import html, json, os, subprocess, sys, tempfile

A, BG, CARD, LINE, MUT, TX = '#D9A21B', '#0D0D0F', '#17171A', '#2A2A2E', '#A3A3AA', '#F4F4F5'
e = lambda s: html.escape(str(s))

CSS = f"""@page{{size:794px 1123px;margin:0}}*{{box-sizing:border-box}}body{{margin:0;font-family:Inter,sans-serif;color:{TX}}}
.pg{{width:794px;height:1123px;background:{BG};page-break-after:always;overflow:hidden;position:relative;padding:40px 44px 56px;display:flex;flex-direction:column;gap:14px}}
.os{{font-family:Oswald,sans-serif;font-weight:700;letter-spacing:.5px}}.lbl{{font-size:10px;letter-spacing:2.4px;font-weight:700;color:{A};text-transform:uppercase}}
.card{{background:{CARD};border:1px solid {LINE};border-radius:12px}}.mut{{color:{MUT}}}
.ft{{position:absolute;left:44px;right:44px;bottom:22px;display:flex;justify-content:space-between;font-size:9.5px;letter-spacing:1.5px;color:#6E6E76;border-top:1px solid {LINE};padding-top:10px}}
.hdr{{display:flex;justify-content:space-between;font-size:9.5px;letter-spacing:2px;color:#6E6E76;font-weight:600}}
.h2{{font-family:Oswald,sans-serif;font-weight:700;font-size:40px;margin:0;line-height:1}}ul{{margin:0;padding-left:16px}}li{{margin:3px 0}}
table{{width:100%;border-collapse:collapse;font-size:12px}}th{{text-align:left;font-size:9.5px;letter-spacing:1.8px;color:{MUT};font-weight:700;padding:0 8px 8px;border-bottom:1px solid {LINE}}}td{{padding:8px;border-bottom:1px solid #1F1F23;vertical-align:top}}
.chip{{display:inline-block;border:1px solid {LINE};border-radius:999px;padding:3px 10px;font-size:10.5px;color:#D4D4D8}}"""


class Doc:
    def __init__(self, p):
        self.p, self.n = p, 1

    def page(self, body, section):
        self.n += 1
        return (f'<div class=pg><div class=hdr><span>{e(self.p["titulo"]).upper()}</span><span>{e(section)}</span></div>'
                f'{body}<div class=ft><span>{e(self.p["subtitulo"])}</span><span>{self.n:02d}</span></div></div>')


def sets(d):
    return sum(int(x['series']) for x in d['ejercicios'])


def cover(p):
    ex = sum(len(d['ejercicios']) for d in p['dias'])
    stats = [(len(p['dias']), 'DÍAS / SEMANA'), (p['semanas'], 'SEMANAS'), (ex, 'EJERCICIOS'), (sum(sets(d) for d in p['dias']), 'SERIES / SEMANA')]
    idx = [('Cómo usar este plan', 2)] + [(f'Día {d["n"]} · {d["titulo"].capitalize()}', i + 3) for i, d in enumerate(p['dias'])]
    k = len(p['dias']) + 3
    idx += [('Progresión y volumen', k), ('Nutrición', k + 1), ('Recuperación y seguimiento', k + 2)]
    big = e(p["titulo"]).upper().split(' ', 1)
    return f"""<div class=pg style="padding:0;gap:0"><div style="position:absolute;right:-90px;top:120px;font-family:Oswald;font-weight:700;font-size:720px;line-height:1;color:#151518">{len(p['dias'])}</div>
<div style="position:relative;padding:64px 56px 0;display:flex;flex-direction:column;gap:22px">
<div style="display:flex;align-items:center;gap:12px"><div style="width:44px;height:3px;background:{A}"></div><span class=lbl style="font-size:11px;letter-spacing:4px">{e(p['nivel'])}</span></div>
<h1 class=os style="margin:0;font-size:104px;line-height:.92">{big[0]}<br><span style="color:{A}">{big[1] if len(big) > 1 else ''}</span></h1>
<p style="margin:6px 0 0;font-size:18px;line-height:1.5;color:#C9C9CF;max-width:480px">{e(p['descripcion'])}</p></div>
<div style="position:relative;margin-top:auto;padding:0 56px 30px;display:flex;flex-direction:column;gap:22px">
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">""" + ''.join(
        f'<div class=card style="padding:16px"><div class=os style="font-size:34px;color:{A}">{v}</div><div class=mut style="font-size:11px;letter-spacing:1.5px;font-weight:600">{k}</div></div>' for v, k in stats) + f"""</div>
<div class=card style="padding:18px 20px;display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;font-size:12.5px"><div class=lbl style="grid-column:span 2;margin-bottom:4px">Contenido</div>""" + ''.join(
        f'<div style="display:flex;justify-content:space-between;border-bottom:1px dashed {LINE};padding:4px 0"><span>{e(t)}</span><span class=mut>{n:02d}</span></div>' for t, n in idx) + '</div></div></div>'


def guide(doc, p):
    rir = [('0', 'Fallo técnico. No sale otra rep con buena forma.', '#E5484D'), ('1', 'Quedaba 1 rep. Máximo esfuerzo útil.', '#F07A3A'),
           ('2', 'Quedaban 2 reps. Zona principal de trabajo.', A), ('3', 'Quedaban 3 reps. Calentamiento y descarga.', '#6E6E76')]
    wk = ''.join(f'<div style="background:{"#201A0C" if w["prioridad"] else "#1C1C20"};border-top:3px solid {A if w["prioridad"] else "#4A4A52"};border-radius:8px;padding:10px 8px">'
                 f'<div class=mut style="font-size:9.5px;letter-spacing:1.5px;font-weight:700">{e(w["dia"])}</div><div class=os style="font-size:20px;color:{A if w["prioridad"] else TX}">{e(w["tag"])}</div>'
                 f'<div style="font-size:10.5px;line-height:1.3;color:#D4D4D8">{e(w["foco"])}</div></div>' for w in p['semana_tipo'])
    return doc.page(f"""<div><div class=lbl>Sección 01</div><h2 class=h2 style="margin-top:6px">CÓMO USAR ESTE PLAN</h2></div>
<div class=card style="padding:18px"><div class=lbl style="margin-bottom:12px">Semana tipo</div><div style="display:grid;grid-template-columns:repeat({len(p['semana_tipo'])},1fr);gap:6px">{wk}</div>
<div class=mut style="font-size:11px;margin-top:10px">Dorado = sesión prioritaria ({e(p['prioridad'])}).</div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div class=card style="padding:18px"><div class=lbl style="margin-bottom:10px">Escala RIR · reps en reserva</div>""" + ''.join(
        f'<div style="display:flex;gap:12px;align-items:center;padding:6px 0"><div class=os style="width:36px;height:36px;border-radius:8px;background:{c};color:{BG};display:flex;align-items:center;justify-content:center;font-size:18px">{n}</div><span style="font-size:12px">{t}</span></div>' for n, t, c in rir) + f"""</div>
<div class=card style="padding:18px;display:flex;flex-direction:column;gap:10px"><div class=lbl>Tempo · ejemplo 3-1-1</div>
<div style="display:grid;grid-template-columns:3fr 1fr 1fr;gap:4px;height:34px;font-size:10px;font-weight:700"><div style="background:{A};border-radius:6px 0 0 6px;color:{BG};display:flex;align-items:center;justify-content:center">3 s BAJANDO</div><div style="background:#5A4A1E;display:flex;align-items:center;justify-content:center">1 s</div><div style="background:#3A3A40;border-radius:0 6px 6px 0;display:flex;align-items:center;justify-content:center">1 s</div></div>
<div style="font-size:12px;line-height:1.45">Bajar · pausa en el estiramiento · subir explosivo y controlado.</div>
<div class=lbl style="margin-top:6px">Doble progresión</div><div style="font-size:12px;line-height:1.45">Cuando completes <b>todas</b> las series en el tope del rango, sube 2,5–5 % de peso y vuelve al mínimo del rango.</div></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div class=card style="padding:18px"><div class=lbl style="margin-bottom:8px">Protocolo FST-7</div><ul style="font-size:12px;line-height:1.45"><li>Último ejercicio del músculo prioritario.</li><li>7 series de 10–15 reps, 30–45 s de descanso.</li><li>Estira el músculo 10 s y bebe agua entre series.</li><li>Desde la semana 2; nunca en la descarga.</li></ul></div>
<div class=card style="padding:18px"><div class=lbl style="margin-bottom:8px">Calentamiento estándar</div><ul style="font-size:12px;line-height:1.45"><li>5–8 min de cardio suave.</li><li>Movilidad de la articulación del día.</li><li>Aproximaciones: 40 % × 10 · 60 % × 6 · 80 % × 3.</li><li>No cuentan como series efectivas.</li></ul></div></div>
<div class=card style="padding:16px 18px;font-size:11.5px;line-height:1.45;color:#D4D4D8">Ante dolor articular agudo, detén el ejercicio y usa la alternativa indicada. Este plan no sustituye la valoración de un profesional de la salud.</div>""", 'Cómo usar el plan')


def day(doc, d):
    cols = 'grid-template-columns:28px 1fr 132px 150px;gap:14px'
    rows = ''.join(f"""<div style="display:grid;{cols};padding:7px 0;border-bottom:1px solid #1F1F23;align-items:start">
<div class=os style="font-size:24px;color:{A};line-height:1">{i:02d}</div>
<div style="display:flex;flex-direction:column;gap:3px"><div style="font-size:13.5px;font-weight:700">{e(x['nombre'])} <span style="font-size:9.5px;letter-spacing:1px;font-weight:700;color:{A};background:#2A220E;border-radius:4px;padding:2px 6px">{e(x['musculo']).upper()}</span></div>
<div style="font-size:10.8px;line-height:1.35;color:#C9C9CF">{e(x['tecnica'])}</div><div style="font-size:10.5px;color:#7E7E86">↺ Alternativa: {e(x['alternativa'])}</div></div>
<div style="display:flex;flex-direction:column;gap:3px;font-size:10.5px"><div><span class=os style="font-size:19px">{e(x['series'])}</span><span class=mut> × </span><span class=os style="font-size:19px">{e(x['reps'])}</span></div>
<div><span class=mut>RIR </span><b>{e(x['rir'])}</b><span class=mut> · TEMPO </span><b>{e(x['tempo'])}</b></div><div><span class=mut>DESCANSO </span><b>{e(x['descanso'])}</b></div></div>
<div><div class=mut style="font-size:9px;letter-spacing:1px;margin-bottom:4px">KG × REPS · S1–S5</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px">""" + ''.join(
        f'<div style="height:32px;border:1px solid #2E2E34;border-radius:5px;font-size:8px;color:#55555C;padding:2px 3px">S{k}</div>' for k in range(1, 6)) + '</div></div></div>'
        for i, x in enumerate(d['ejercicios'], 1))
    fin = (f'<div style="background:#24110F;border:1px solid #4E241E;border-radius:12px;padding:12px 16px;font-size:12px;color:#FFD9D0;line-height:1.4">'
           f'<b style="color:#FF7A5C;letter-spacing:1.5px">FINISHER · </b>{e(d["finisher"])}</div>') if d.get('finisher') else ''
    p = d['prioridad']
    tag = f'background:{A};color:{BG};border-color:{A};font-weight:700' if p else ''
    return doc.page(f"""<div style="display:flex;gap:18px"><div style="background:{A};color:{BG};border-radius:12px;width:92px;display:flex;flex-direction:column;align-items:center;justify-content:center"><span style="font-size:10px;font-weight:800;letter-spacing:3px">DÍA</span><span class=os style="font-size:58px;line-height:1">{d['n']}</span></div>
<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px"><h2 class=h2 style="font-size:34px">{e(d['titulo'])}</h2><div style="font-size:14px;color:{A};font-weight:600">{e(d['subtitulo'])}</div>
<div style="display:flex;gap:6px;flex-wrap:wrap"><span class=chip>{e(d['duracion'])}</span><span class=chip>{len(d['ejercicios'])} ejercicios</span><span class=chip>{sets(d)} series{' + FST-7' if d.get('finisher') else ''}</span><span class=chip style="{tag}">{'PRIORIDAD' if p else 'MANTENIMIENTO'}</span></div></div></div>
<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:12px"><div class=card style="padding:14px 16px"><div class=lbl style="margin-bottom:6px">Objetivo de la sesión</div><div style="font-size:11.8px;line-height:1.45;color:#D4D4D8">{e(d['objetivo'])}</div>
<div class=lbl style="margin:8px 0 3px">Claves</div><ul style="font-size:10.8px;line-height:1.35;color:#D4D4D8">{''.join('<li>' + e(k) + '</li>' for k in d['claves'])}</ul></div>
<div class=card style="padding:14px 16px"><div class=lbl style="margin-bottom:6px">Calentamiento</div>{''.join(f'<div style="display:flex;gap:8px;font-size:10.8px;line-height:1.35;padding:2px 0;color:#D4D4D8"><span class=os style="color:{A};width:14px">{j}</span><span>{e(w)}</span></div>' for j, w in enumerate(d['calentamiento'], 1))}</div></div>
<div><div style="display:grid;{cols};padding-bottom:8px;border-bottom:1px solid {LINE};font-size:9.5px;letter-spacing:1.8px;font-weight:700;color:{MUT}"><span>#</span><span>EJERCICIO · TÉCNICA</span><span>PRESCRIPCIÓN</span><span>REGISTRO</span></div>{rows}</div>
<div style="margin-top:auto;display:flex;flex-direction:column;gap:10px">{fin}<div style="font-size:13px;font-style:italic;color:#B4B4BB;text-align:right">“{e(d['frase'])}” <span style="color:{A};font-style:normal;font-weight:700">— Tu coach</span></div></div>""", f'Día {d["n"]} de {doc.ndays}')


def progress(doc, p):
    W, V = p['progresion'], p['volumen']
    col = lambda w: '#4FA3FF' if 'descarga' in w['fase'].lower() else A
    mx = max(v['series'] + v.get('fst', 0) for v in V)
    return doc.page(f"""<div><div class=lbl>Sección 03</div><h2 class=h2 style="margin-top:6px">PROGRESIÓN Y VOLUMEN</h2></div>
<div class=card style="padding:20px"><div class=lbl style="margin-bottom:14px">Curva de intensidad</div><div style="display:grid;grid-template-columns:repeat({len(W)},1fr);gap:10px;align-items:end;height:150px">""" + ''.join(
        f'<div style="display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px;height:150px"><span class=os style="font-size:13px;color:{col(w)}">{w["intensidad"]}%</span><div style="width:100%;height:{w["intensidad"] * 1.1}px;border-radius:6px 6px 0 0;background:{col(w)}"></div></div>' for w in W) + f'</div><div style="display:grid;grid-template-columns:repeat({len(W)},1fr);gap:10px;margin-top:8px">' + ''.join(
        f'<div style="text-align:center"><div class=os style="font-size:15px">S{w["semana"]}</div><div class=mut style="font-size:10px">{e(w["fase"])}</div></div>' for w in W) + '</div></div><table><tr><th>SEMANA</th><th>FASE</th><th>QUÉ HACER</th></tr>' + ''.join(
        f'<tr><td class=os style="font-size:16px;color:{col(w)}">S{w["semana"]}</td><td style="font-weight:700">{e(w["fase"])}</td><td style="color:#D4D4D8">{e(w["detalle"])}</td></tr>' for w in W) + f'</table><div class=card style="padding:20px"><div class=lbl style="margin-bottom:12px">Series efectivas por semana</div>' + ''.join(
        f'<div style="display:grid;grid-template-columns:150px 1fr 90px;gap:12px;align-items:center;padding:5px 0;font-size:12.5px"><span style="{"font-weight:700" if v["prioridad"] else ""}">{e(v["musculo"])}</span><div style="height:10px;background:#26262B;border-radius:5px;display:flex;overflow:hidden"><div style="width:{v["series"] / mx * 100}%;background:{A if v["prioridad"] else "#5A5A62"}"></div><div style="width:{v.get("fst", 0) / mx * 100}%;background:#FF7A5C;opacity:.7"></div></div><span style="text-align:right"><b>{v["series"]}</b><span class=mut>{" + " + str(v["fst"]) + " FST" if v.get("fst") else ""}</span></span></div>' for v in V) + f'<div class=mut style="display:flex;gap:18px;margin-top:10px;font-size:10.5px"><span><b style="color:{A}">■</b> Prioridad</span><span><b style="color:#5A5A62">■</b> Mantenimiento</span><span><b style="color:#FF7A5C">■</b> Series FST-7</span></div></div>', 'Progresión')


def nutrition(doc, p):
    n = p['nutricion']
    return doc.page(f"""<div><div class=lbl>Sección 04</div><h2 class=h2 style="margin-top:6px">NUTRICIÓN</h2><div class=mut style="font-size:12.5px;margin-top:8px">Cantidades calculadas para {p['peso_kg']} kg de peso corporal.</div></div>
<div style="display:grid;grid-template-columns:repeat({len(n['macros'])},1fr);gap:10px">""" + ''.join(
        f'<div class=card style="padding:16px"><div class=lbl style="color:{MUT}">{e(m["nombre"])}</div><div class=os style="font-size:26px;color:{A};margin-top:4px">{e(m["valor"])}</div><div style="font-size:11.5px;color:#D4D4D8">{e(m["ejemplo"])}</div></div>' for m in n['macros']) + '</div><div class=card style="padding:20px"><div class=lbl style="margin-bottom:10px">Ejemplo de día de entrenamiento</div><table>' + ''.join(
        f'<tr><td class=os style="color:{A};width:60px;font-size:14px">{e(m["hora"])}</td><td style="font-weight:700;width:120px">{e(m["comida"])}</td><td style="color:#D4D4D8">{e(m["detalle"])}</td></tr>' for m in n['menu']) + f'</table></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div class=card style="padding:18px"><div class=lbl style="margin-bottom:8px">Reglas clave</div><ul style="font-size:12px;line-height:1.5">{"".join("<li>" + e(r) + "</li>" for r in n["reglas"])}</ul></div><div class=card style="padding:18px"><div class=lbl style="margin-bottom:8px">Suplementos con evidencia</div>' + ''.join(
        f'<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed {LINE};font-size:12px"><b>{e(a)}</b><span class=mut style="text-align:right">{e(b)}</span></div>' for a, b in n['suplementos']) + '</div></div>', 'Nutrición')


def recovery(doc, p):
    med = ['Peso en ayunas (kg)', 'Cintura (cm)', 'Pecho (cm)', 'Muslo (cm)', 'Brazo (cm)', 'Energía 1–10', 'Sueño (h promedio)']
    s = int(p['semanas'])
    return doc.page(f"""<div><div class=lbl>Sección 05</div><h2 class=h2 style="margin-top:6px">RECUPERACIÓN Y SEGUIMIENTO</h2></div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">""" + ''.join(
        f'<div class=card style="padding:16px"><div class=os style="font-size:26px;color:{A}">{v}</div><div style="font-size:12px;font-weight:700;margin-top:2px">{k}</div><div class=mut style="font-size:11px;margin-top:4px">{d}</div></div>' for v, k, d in [('7–9 h', 'Sueño', 'Horario fijo; habitación oscura y fresca.'), ('8–10 mil', 'Pasos diarios', 'Mejoran la recuperación y el apetito.'), ('1+ día', 'Descanso total', 'El músculo crece fuera del gym.')]) + '</div><div class=card style="padding:18px"><div class=lbl style="margin-bottom:10px">Ajustes según tu respuesta</div><table><tr><th>SI…</th><th>ENTONCES…</th></tr>' + ''.join(
        f'<tr><td style="font-weight:700;width:46%">{e(a)}</td><td style="color:#D4D4D8">{e(b)}</td></tr>' for a, b in p['ajustes']) + '</table></div><div class=card style="padding:18px"><div class=lbl style="margin-bottom:10px">Registro corporal semanal</div><table><tr><th>MEDIDA</th>' + ''.join(
        f'<th style="text-align:center">S{i}</th>' for i in range(1, s + 1)) + '</tr>' + ''.join(f'<tr><td style="font-weight:600">{m}</td>' + '<td style="border-left:1px solid #1F1F23;height:28px"></td>' * s + '</tr>' for m in med) + f"""</table></div>
<div style="margin-top:auto;background:{A};color:{BG};border-radius:14px;padding:22px 26px"><div class=os style="font-size:24px;line-height:1.15">“{e(p['frase_final']).upper()}”</div><div style="font-size:12px;font-weight:700;margin-top:8px;letter-spacing:2px">— TU COACH</div></div>""", 'Recuperación')


def build(p):
    doc = Doc(p)
    doc.ndays = len(p['dias'])
    body = cover(p) + guide(doc, p) + ''.join(day(doc, d) for d in p['dias']) + progress(doc, p) + nutrition(doc, p) + recovery(doc, p)
    return ('<html><head><meta charset=utf-8><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
            f'<style>{CSS}</style></head><body>{body}</body></html>')


JS = """const {chromium}=require('playwright');(async()=>{const [src,out]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+src,{waitUntil:'networkidle'}).catch(()=>{});await p.evaluate(()=>document.fonts.ready);
const over=await p.evaluate(()=>[...document.querySelectorAll('.pg')].map((e,i)=>e.scrollHeight>1123?i+1:0).filter(Boolean));
await p.pdf({path:out,width:'794px',height:'1123px',printBackground:true});await b.close();
if(over.length){console.error('DESBORDE en páginas: '+over.join(', ')+'. Acorta el texto de esos días.');process.exit(2)}console.log('OK')})()"""

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Uso: python3 scripts/generar_pdf.py plan.json salida.pdf')
    plan = json.load(open(sys.argv[1], encoding='utf-8'))
    with tempfile.TemporaryDirectory() as t:
        src = os.path.join(t, 'plan.html')
        open(src, 'w', encoding='utf-8').write(build(plan))
        js = os.path.join(t, 'render.js')
        open(js, 'w').write(JS)
        sys.exit(subprocess.run(['node', js, src, os.path.abspath(sys.argv[2])]).returncode)
