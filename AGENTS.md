# AGENTS.md — Invitación XV años

## Contexto del proyecto
- **Celebrante**: Ana Sofía Villa — quinceañera
- **Fecha del evento**: 24 Oct 2026, 7:00 PM
- **Temática**: Noche estrellada — cielo nocturno, estrellas, constelaciones, brillos
- **Colores**: azul oscuro y tonos de noche como base; plateado y dorado como acentos
- **Lugar**: Finca #11, Parcelación El Limonar, Copacabana (Antioquia)

## Stack
- HTML+CSS+JS vanilla (sin frameworks, sin build tools)
- Servidor dev: `lite-server` (BrowserSync)

## Comandos

| Acción | Comando |
|--------|---------|
| Iniciar servidor dev | `npm run dev` |
| Live Server (VS Code) | Puerto 5501 (`.vscode/settings.json`) |

## Estructura

```
html/index.html        → Portada con sobre animado
html/invitacion.html   → Invitación completa (8 secciones)
css/index.css          → Estilos portada (paleta oscura + dorado)
css/invitacion.css     → Estilos invitación (mobile-first)
js/index.js            → Animación de apertura del sobre + redirección
js/invitacion.js       → Countdown, carrusel, modales, GSAP ScrollTrigger
img/                   → Assets gráficos
img/fotoStudio/        → 14 fotos de estudio (Ana1.jpg…Ana14.jpg)
audio/                 → Música de fondo (cancion.mp3)
```

## Flujo de navegación
1. `index.html` muestra un sobre con brillo animado. Al hacer clic, `js/index.js` agrega clase `abriendo` (escala el sobre 3.8x, opacidad 0), y tras 400ms redirige a `invitacion.html`.
2. `invitacion.html` tiene 8 secciones (hero, countdown, ubicación, carrusel, dress code, regalos, confirmación, agradecimiento + fotos). GSAP desde CDN para parallax y efectos scroll.

## Secciones de invitacion.html

| # | Sección | Contenido |
|---|---------|-----------|
| 1 | Hero | Nombre, fecha, mensaje emotivo, parallax bg (Ana1.jpg) |
| 2 | Countdown | Cuenta regresiva al 24 Oct 2026 7:00 PM |
| 3 | Ubicación | Finca #11, Parcelación El Limonar, Copacabana. Modal con mapa + enlaces GMaps/Waze |
| 4 | Carrusel | 5 fotos (Ana1-5) con transiciones, auto-play, swipe táctil |
| 5 | Dress Code | Traje de gala con ilustraciones SVG. Modales: detalle y tips |
| 6 | Regalos | Lluvia de sobres (modal) |
| 7 | Confirmación | Formulario RSVP que abre WhatsApp |
| 8 | Agradecimiento | Mensaje final + 9 fotos restantes (Ana6-14) con efecto cinematic scroll |

## Stack
- HTML+CSS+JS vanilla
- GSAP 3.12.5 + ScrollTrigger (CDN cdnjs)
- Google Fonts: Alex Brush, Playfair Display, Inter
- Sin build tools, sin frameworks

## Diseño
- **Paleta (noche estrellada)**: fondo #1b2b5f (azul noche), superficie #283a7b, texto #E9EEFA, gris azulado #92A3C8, oro #C9A84C, plata #B9C6E4, azul acero #55639B
- **Overlay del fondo**: negro transparente reemplazado por degradados azul noche `rgba(10, 17, 40, ...)`
- **Cielo parallax**: `.parallax-sky` fijo con luna (`.moon`), 3 capas de estrellas (`.star-field.layer-1/2/3`) generadas por JS y 2 estrellas fugaces; se mueven a distinta velocidad con GSAP ScrollTrigger
- **Mobile-first**: base = mobile, @media 768px = tablet, @media 1024px = desktop
- **Modales**: sistema único reutilizable para mapa, dress code, tips, regalos, RSVP

## Pendientes / notas
- `audio/introViolin.mp3`: música de fondo real (portada e invitación la reproducen en loop a volumen bajo; botón `#btn-audio` superior derecha activa/desactiva el sonido)
- Número WhatsApp en RSVP (`js/invitacion.js:handleRSVP`) ya configurado: `573007698235`
- `.claude/settings.json` contiene credenciales; **no commitear**

## Despliegue
- Repo git en `main`, con workflow `.github/workflows/deploy-pages.yml` (GitHub Actions → GitHub Pages)
- El workflow arma la estructura en `_site` (html + css + js + img + audio en raíz) porque las rutas son relativas (`../css`, etc.)
