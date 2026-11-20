# Design system rules: Figma → code

## Context

- The repository (`luislopez62306-arch/cavernicola`, branch `claude/digital-invitation-g69l8y`) has no commits yet.
- The only product so far is a **single-file HTML invitation**: "Los 30 de Valeria", a 30th birthday invitation in Spanish.
- It is published as a claude.ai Artifact.
  - Working copy: `invitacion-cumple.html`, in the session scratchpad. Copy it into the repo before treating it as source of truth.
- There is no framework, bundler, package.json, component library or Storybook.

Treat everything below as the conventions to follow when turning Figma frames into code for this project.

## 1. Tokens

Tokens are CSS custom properties on `:root`, at the top of the `<style>` block. There is no token pipeline: no Style Dictionary and no JSON tokens. Map Figma variables to these names by hand.

```css
:root{
  --page:#ecc3a2;       /* page background (peach) */
  --ink:#4a1d0d;        /* body text on light surfaces */
  --white:#fff8ef;      /* text on velvet/dark */
  --rust:#9a3a17;       /* primary accent, headings */
  --rust-light:#c4622d; /* borders, buttons, focus */
  --cream:#fbf3e8;      /* cards */
  --script:"Alex Brush","Brush Script MT",cursive;      /* display / headings */
  --caps:"Cormorant SC","Cormorant Garamond",Georgia,serif; /* body, small caps */
  color-scheme:light;
}
```

### Extended palette

These colors are used inline. Add tokens for them if Figma defines them as variables.

| Use | Colors |
|---|---|
| Velvet stripes | `#6e230b`, `#b4501f`, `#d27038`, `#8a3313`, `#5d1c08` |
| Muted label text | `#7a4a35`, `#8a5a40` |
| Hairlines | `#e3c3a8`, `#ecd3bd` |

### Typography

- Fonts are loaded from Google Fonts: Alex Brush, Cormorant SC (300/400/500) and Cormorant Garamond (300/400).
- Headings use script.
- Everything else uses small caps (`.caps`, uppercase).
- Countdown numbers use Cormorant Garamond 300.

### Spacing and sizing

Inside image panels, everything is in **container query units** (`cqw`), so text scales with the panel width:

```css
.panel{position:relative;container-type:inline-size}
.title{top:13%;font-size:14cqw}
```

Outside panels, use `px`/`rem` and `clamp()`, for example `font-size:clamp(1.9rem,8.4vw,2.3rem)`.

## 2. Components

There is no component framework. "Components" are BEM-less class groups in one HTML file:

| Component | Classes | Notes |
|---|---|---|
| Welcome envelope | `.welcome`, `.env`, `.flap`, `.flapOpen`, `.letter`, `.seal` | Inline SVG (viewBox 0 0 300 250). It opens when `.opening` is set on `.welcome`. |
| Image panel | `.panel > img` plus `.t` text overlays | Text is absolutely positioned in `%` over a raster background. |
| Curtain | `.curtain.l/.r.velvet` | It opens when `body.go` is set. |
| Polaroid stack | `.stack`, `.pol.b1/.b2/.b3/.front`, `.ph`, `.pclip`, `.cap` | Photo upload uses `<label><input type=file hidden>`. |
| Gallery | `.gal`, `.ggrid.one`, `.gp`, `.gph` | |
| RSVP card | `.rsvp > div`, `.cd3` (countdown), `form#rsvp`, `.send`, `.pill`, `.copy` | It builds a WhatsApp message. |
| Music button | `.fab` | Uses a Web Audio synth; no audio files. |

How text overlays work:

- `.t` is `position:absolute; left:0; right:0; text-align:center`.
- Modifiers set the font and color: `.script` / `.caps` for the font, `.w` (white) / `.k` (ink) for the color.

```html
<h2 class="t script w place-h">Lugar y hora</h2>
<p class="t caps k det-b">…</p>
```

## 3. Frameworks and libraries

- The page is plain HTML, CSS and vanilla JS, all inline in one file.
- There is no build step and no bundler.
- External resources:
  - Google Fonts is the only stylesheet.
  - No script CDNs are used.
- When implementing Figma output, convert any React/Tailwind snippets from the Figma MCP to plain HTML and CSS that use the tokens above.

## 4. Assets

- Raster images are **embedded as base64 data URIs**:
  - two JPEG panels, 1172px wide
  - one WebP bow
  - The page must stay under 16MB. It is about 1.7MB now.
- The asset pipeline is offline, in Python with OpenCV:
  1. Retouch at low resolution.
  2. Upscale ×4 with Real-ESRGAN.
  3. Resize to 1172px wide.
  4. Unsharp mask (1.35 / −0.35, σ 1.2).
  5. Save as progressive JPEG, quality 93.
- Replace an image by swapping its exact base64 string.
- Never embed photos of real people. Photo slots are user-upload placeholders, preview only and not stored.
- There is no CDN.

## 5. Icons

- Icons are inline SVG. They use `fill`/`stroke="currentColor"` or token hex values, and `aria-hidden="true"`.
- Examples: the player controls, the dress and suit line icons, and the chevron for the select (a data-URI SVG).
- There is no icon library and no naming convention. Keep icons inline, 1.2–1.6 stroke width, colored `var(--rust)`.

## 6. Styling

- There is one global `<style>` block with plain class selectors. Later "patch" sections override earlier rules, for example `/* ---- Correcciones ---- */`.
  - When adding rules, append a new commented section, or edit the original rule in place.
- Responsive layout:
  - **Mobile first.** `.col` is one column with a max width of 420px.
  - At `≥820px`, it becomes two columns and `.rsvp` spans both.
  - Below 819px, panels merge into one continuous strip, with no gaps or radii.
  - Side gutters are at least 16px, using `env(safe-area-inset-*)`.
- Motion:
  - Every animation is wrapped in `prefers-reduced-motion:no-preference` or has a `reduce` fallback.
  - Scroll reveal uses `.reveal` → `.in` with IntersectionObserver.
- Accessibility:
  - Focus ring: `outline:2px solid #f2c27a`.
  - The welcome screen is a `role="dialog"`.
  - The countdown has `role="timer"`.

## 7. Project structure

```
invitacion-cumple.html   # whole app: <style> tokens+components, markup, <script>
(scratchpad tooling, not in repo)
  fix*.py, esr.py        # image retouch / upscale
  pb*.js, full.js, env.js # Playwright screenshot checks at 414px, DPR 2
```

The markup order is:

1. welcome
2. `.fab`
3. `main.col`:
   1. panel 1 (curtain, title, calendar, venue)
   2. panel 2 (polaroids, details)
   3. gallery
   4. RSVP
4. script

## Figma integration rules

1. Map Figma color and text variables to the `:root` tokens. Add new tokens there and do not hardcode hex values.
2. Elements that sit on a full-bleed image become `.t` overlays positioned in `%`, with sizes in `cqw`.
3. Export illustrations as inline SVG using `currentColor`. Export raster backgrounds at 1172px wide, then run them through the JPEG pipeline above and embed them.
4. Check every change with a Playwright screenshot at 414×800, and verify it in both the closed and open envelope states.
5. Keep all UI copy in Spanish.
