---
name: testing
description: Use when validating functionality, responsiveness, or UX of the XV años invitation site (invitacionQuiceanieras). Covers JS/CSS/HTML syntax checks, serving with lite-server, smoke tests via curl, and device/browser UX checks for the 80% section snap, modals, carousel, audio, fixed background, and envelope intro. Trigger words: pruebas, testing, validar, verificar, comprobar, test, smoke, snapp, desplegar y probar.
---

# Testing del sitio de invitación XV años

Skill para validar el funcionamiento y la experiencia de usuario del sitio estático
(HTML+CSS+JS vanilla + GSAP) de la invitación de Ana Sofía Villa. Complementa a
`frontend-design` (revisión estética) y al contexto de `AGENTS.md`.

## Contexto rápido

- Servidor dev: `npm run dev` → `http://localhost:3000` (lite-server/BrowserSync,
  baseDir `./html`, rutas mapeadas `/css /js /img`).
- Página principal: `index.html` (sobre animado) → redirige a `invitacion.html`.
- Deploy: push a `main` → GitHub Actions "Deploy a GitHub Pages" → verificar con
  `gh run list --limit 1` o `gh run watch <id> --exit-status`.

## Restricción de herramienta (importante)

En este WSL **no hay `node` en el PATH**. Solo existe el binario Windows:

```
NODE="/mnt/c/Program Files/nodejs/node.exe"
```

Toda invocación de node/acorn/npx debe usar `"$NODE"` y convertir rutas con
`wslpath -w`. `acorn` está instalado en `node_modules/acorn/bin/acorn`.

## 1. Validación estática (siempre, antes de desplegar)

```bash
NODE="/mnt/c/Program Files/nodejs/node.exe"

# Sintaxis JS (invitacion.js e index.js)
"$NODE" "$(wslpath -w node_modules/acorn/bin/acorn)" --ecma2020 \
  "$(wslpath -w js/invitacion.js)" > /dev/null && echo "invitacion.js OK"
"$NODE" "$(wslpath -w node_modules/acorn/bin/acorn)" --ecma2020 \
  "$(wslpath -w js/index.js)" > /dev/null && echo "index.js OK"

# Balance de llaves CSS
CSS=css/invitacion.css
O=$(tr -cd '{' < "$CSS" | wc -c); C=$(tr -cd '}' < "$CSS" | wc -c)
[ "$O" = "$C" ] && echo "css OK ($O)"

# Parseo de HTML (con acorn se puede usar el script de validación; si no, revisar
# que las etiquetas críticas existan: section id, modal-overlay, photo-strip-shimmer)
```

Si existe un validador de HTML local (p. ej. `html-validate`) se usa igual con
`"$NODE"`.

## 2. Smoke test con lite-server

```bash
npm run dev > /tmp/opencode/lite.log 2>&1 &
sleep 6
curl -s -o /dev/null -w "index        -> %{http_code}\n" http://localhost:3000/index.html
curl -s -o /dev/null -w "invitacion   -> %{http_code}\n" http://localhost:3000/invitacion.html
curl -s -o /dev/null -w "js           -> %{http_code}\n" http://localhost:3000/js/invitacion.js
curl -s -o /dev/null -w "css          -> %{http_code}\n" http://localhost:3000/css/invitacion.css
curl -s -o /dev/null -w "img hero     -> %{http_code}\n" http://localhost:3000/img/fotoStudio/Ana1.jpg
curl -s -o /dev/null -w "audio        -> %{http_code}\n" http://localhost:3000/audio/introViolin.mp3
kill %1
```

Respuestas esperadas: 200 en todos. 404 indica ruta rota (recordar que baseDir es
`./html`, así que la página vive en `/invitacion.html`, no en `/html/invitacion.html`).
Repetir contra la URL de GitHub Pages tras el deploy.

## 3. Checks de UX y funcionalidad (lista de verificación)

Verificar en **escritorio** y en **móvil Android e iOS** (dispositivo real o DevTools):

### Navegación y snap de secciones
- [ ] Abrir `index.html`: el sobre se abre al clic/tap, brilla y redirige a `invitacion.html`.
- [ ] Snap: al bajar más del **80%** de una sección y soltar, la siguiente se alinea
      suave al tope y llena la pantalla (`min-height: 100dvh`).
- [ ] Snap hacia arriba: al subir más del 80%, regresa a la sección anterior.
- [ ] El snap no dispara mientras hay un modal abierto.
- [ ] Las 8 secciones tienen `min-height` de pantalla y contenido centrado.

### Fondo fijo y destello
- [ ] El fondo (`fixed-bg`, Ana1.jpg) NO se mueve ni tiembla al animarse el destello
      dorado del collage (regresión de iOS: capa propia `translateZ(0)`).
- [ ] El destello barre solo dentro del collage y se desvanece al primer toque o ~9s.

### Modales
- [ ] Mapa (GMaps/Waze), dress code (contenido/imagen sin recorte), tips, regalos
      y RSVP abren/cierran con overlay, Escape y clic fuera.

### Carousel y collage táctil
- [ ] Carrusel: auto-play, swipe táctil y dots funcionan en iOS y Android.
- [ ] Collage: el tilt/parallax responde igual con mouse y con el dedo; no bloquea
      el scroll fuera del strip.

### Audio y countdown
- [ ] Botón `#btn-audio` activa/desactiva la música en ambas páginas.
- [ ] Countdown apunta al 24 Oct 2026 7:00 PM y avanza cada segundo.

## 4. Pruebas E2E automatizadas (opcional, Playwright)

El stack no incluye tests. Para pruebas de navegador automatizadas se puede instalar
Playwright. Nota: al no haber node en PATH de WSL, ejecutar los binarios de npm con
`"$NODE"`/`npx.cmd` y los navegadores se instalan para la plataforma Windows
(`npx.cmd playwright install chromium`). Casos sugeridos:

- Cargar `index.html`, click en sobre, esperar redirección a `invitacion.html`.
- Scroll programático pasando el 80% de una sección y comprobar que `window.scrollY`
  termina alineado al tope de la siguiente sección (±2px).
- Abrir/cerrar cada modal y comprobar `.active` en `#modal-overlay`.
- Simular swipe en el carrusel (touch) y verificar el índice del slide.
- Comprobar que `.fixed-bg` no cambie `transform` durante la animación del destello.

## 5. Verificación final del deploy

```bash
git add -A && git commit -m "..." && git push origin main
sleep 25
gh run list --limit 1          # debe salir "success" en "Deploy a GitHub Pages"
```

Tras el deploy, repetir el smoke test de la sección 2 contra la URL de Pages
(`https://<user>.github.io/invitacionQuinceaneras/...`) para confirmar rutas relativas.