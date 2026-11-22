# Estudio de diseño (plugin para Claude Code)

Skill **invitaciones-y-paginas**: crea invitaciones digitales y páginas web
terminadas (un solo HTML listo para enviar por WhatsApp o publicar), con
paletas y tipografías curadas, modo de fidelidad a una imagen de referencia,
y verificación automática con capturas.

## Instalar
En Claude Code:
```
/plugin marketplace add luislopez62306-arch/cavernicola
/plugin install estudio-de-diseno@cavernicola
```
Dentro de este repositorio el skill ya está activo (`.claude/skills/`).

## Usar
Solo pide lo que quieres, por ejemplo:
- "Hazme la invitación de XV años de Valeria, 14 de marzo, en rosa empolvado"
- "Quiero esta invitación igualita (adjunto imagen) pero con nuestros datos"
- "Diseña la landing page de mi panadería"

## Contenido
- `SKILL.md`: flujo de trabajo (brief → diseño → construcción → verificación → entrega)
- `references/`: tipos de evento, paletas y fuentes, fidelidad a referencia, componentes, checklist
- `references/estilo-de-la-casa.md` + `assets/disenos-propios/`: tus diseños Geraldine y Danna Sofía, que el skill usa como base por defecto
- `assets/plantilla-base.html`: plantilla genérica para estilos distintos
- `scripts/captura.js`: capturas móvil/escritorio + auditoría + PNG/PDF de impresión
- `scripts/comparar.py`: referencia vs. render con mapa de diferencias
- `scripts/incrustar_imagenes.py`: imágenes → WebP base64 dentro del HTML
