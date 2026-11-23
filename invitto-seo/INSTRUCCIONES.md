# Invitto: paquete SEO

## Archivos
| Archivo | Qué hacer |
|---|---|
| `xv-anos.html` | Súbelo a la raíz del sitio (junto a `index.html`) |
| `bodas.html` | Súbelo a la raíz |
| `bautizo-baby-shower.html` | Súbelo a la raíz |
| `sitemap.xml` | Reemplaza el actual |

Cada página ya trae título, descripción, canonical, Open Graph, datos estructurados (Service, FAQ, Breadcrumb), botón de WhatsApp y enlaces entre páginas.
Busca los comentarios `<!-- PEGA AQUÍ TUS DISEÑOS -->` y `<!-- TESTIMONIOS -->` para agregar imágenes y reseñas reales.

## Cambios en `index.html` (dentro de `<head>`)

Reemplaza el `<title>` y la `<meta name="description">`:

```html
<title>Invitaciones Digitales Interactivas para XV Años, Bodas y Bautizos | Invitto</title>
<meta name="description" content="Invitaciones digitales personalizadas con música, pase con nombre y confirmación por WhatsApp. Hacemos tu invitación en línea para todo México. Desde $1,000 MXN.">
```

Reemplaza el bloque `application/ld+json` actual (LocalBusiness) por:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OnlineBusiness",
  "name": "Invitto · Crea Studio",
  "url": "https://invittomx.com/",
  "logo": "https://invittomx.com/img/logo-crema.png",
  "image": "https://invittomx.com/img/og.jpg",
  "description": "Invitaciones digitales interactivas para XV años, bodas, bautizos y más, para todo México.",
  "telephone": "+52 668 358 6262",
  "priceRange": "$1000 - $2000 MXN",
  "areaServed": { "@type": "Country", "name": "México" },
  "sameAs": ["https://www.instagram.com/invitto.creastudio"]
}
</script>
```

## Cambios en el texto de `index.html`
- H1: `Invitaciones digitales que hacen decir ¡wow!` (deja "Que digan ¡wow! antes de llegar" como subtítulo).
- Cambia "Familias de Sinaloa ya estrenaron la suya" → "Familias de todo México ya estrenaron la suya".
- Pon `alt` a las imágenes vacías: ej. `alt="Invitación digital XV años"`.
- En el menú o en los filtros del catálogo, enlaza a `/xv-anos.html`, `/bodas.html` y `/bautizo-baby-shower.html`.

## Después de subir
1. Entra a Google Search Console → Sitemaps → envía `https://invittomx.com/sitemap.xml`.
2. Usa "Inspeccionar URL" en cada página nueva y pide indexación.
3. En Hostinger: redirige `www` → `invittomx.com` y activa caché.

## Descripción del sitio (para Google, Instagram, Facebook, WhatsApp Business)

**Corta (meta / 155 caracteres):**
> Invitaciones digitales personalizadas con música, pase con nombre y confirmación por WhatsApp. Para XV años, bodas y bautizos en todo México. Desde $1,000.

**Larga (Perfil de Google / Facebook / "Acerca de"):**
> Invitto · Crea Studio diseña invitaciones digitales interactivas para XV años, bodas, bautizos, baby showers y cumpleaños en todo México. Cada invitación se abre como un regalo, suena con tu canción favorita, muestra la cuenta regresiva, el itinerario y el mapa, e incluye un pase personalizado con el nombre de cada familia. Tus invitados confirman en un toque y las respuestas te llegan directo a WhatsApp. Todo es 100% en línea y personalizado con tus colores y fotos, desde $1,000 MXN. Escríbenos y haz que digan ¡wow! antes de llegar.
