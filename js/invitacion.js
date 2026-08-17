/* ===== STARRY SKY — generador de estrellas ===== */
(function createStarSky() {
  const layers = [
    { id: 'stars-1', count: 80, size: [1, 2], rgb: [255, 255, 255] },
    { id: 'stars-2', count: 45, size: [2, 3], rgb: [201, 212, 240] },
    { id: 'stars-3', count: 16, size: [2, 4], rgb: [232, 212, 138] }
  ];

  layers.forEach((layer) => {
    const el = document.getElementById(layer.id);
    if (!el) return;

    for (let i = 0; i < layer.count; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      const size = layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      const [r, g, b] = layer.rgb;
      star.style.background = `rgba(${r}, ${g}, ${b}, 1)`;
      if (size >= 2.5) {
        star.style.boxShadow = `0 0 ${size * 3}px ${size}px rgba(${r}, ${g}, ${b}, 0.6)`;
      }
      const duration = (2.5 + Math.random() * 4).toFixed(2);
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      el.appendChild(star);
    }
  });
})();

/* ===== MODAL STARS — campo estrellado de los modales ===== */
(function createModalStars() {
  const sky = document.querySelector('.modal-stars');
  if (!sky) return;

  const layers = [
    { count: 40, size: [1, 2], rgb: [255, 255, 255] },
    { count: 20, size: [2, 3], rgb: [201, 212, 240] },
    { count: 8, size: [2, 3], rgb: [232, 212, 138] }
  ];

  layers.forEach((layer) => {
    for (let i = 0; i < layer.count; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      const size = layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      const [r, g, b] = layer.rgb;
      star.style.background = `rgba(${r}, ${g}, ${b}, 1)`;
      if (size >= 2.2) {
        star.style.boxShadow = `0 0 ${size * 3}px ${size}px rgba(${r}, ${g}, ${b}, 0.55)`;
      }
      star.style.animationDuration = `${(2.5 + Math.random() * 4).toFixed(2)}s`;
      star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      sky.appendChild(star);
    }
  });

  for (let i = 0; i < 2; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top = `${(10 + Math.random() * 35).toFixed(0)}%`;
    s.style.left = `${(15 + Math.random() * 60).toFixed(0)}%`;
    s.style.animationDuration = `${(7 + Math.random() * 5).toFixed(1)}s`;
    s.style.animationDelay = `${(i * 6 + Math.random() * 4).toFixed(1)}s`;
    sky.appendChild(s);
  }
})();

/* ===== MODAL INNER STARS — estrellas dentro del modal ===== */
(function createModalInnerStars() {
  const sky = document.querySelector('.modal-sky');
  if (!sky) return;

  const layers = [
    { count: 22, size: [1, 2], rgb: [255, 255, 255] },
    { count: 10, size: [1.5, 2.5], rgb: [201, 212, 240] },
    { count: 4, size: [1.5, 2.5], rgb: [232, 212, 138] }
  ];

  layers.forEach((layer) => {
    for (let i = 0; i < layer.count; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
      star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      const size = layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]);
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      const [r, g, b] = layer.rgb;
      star.style.background = `rgba(${r}, ${g}, ${b}, 1)`;
      if (size >= 2) {
        star.style.boxShadow = `0 0 ${size * 3}px ${size}px rgba(${r}, ${g}, ${b}, 0.5)`;
      }
      star.style.animationDuration = `${(3 + Math.random() * 4).toFixed(2)}s`;
      star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      sky.appendChild(star);
    }
  });
})();

/* ===== MÚSICA DE FONDO ===== */
(function initMusic() {
  const audio = document.getElementById('musica');
  const btn = document.getElementById('btn-audio');
  if (!audio) return;

  let comenzada = false;
  let usuarioPauso = false;

  audio.preload = 'auto';
  // Empezar a cargar cuanto antes para que el seek funcione al primer toque
  if (audio.readyState === 0) {
    try { audio.load(); } catch (e) { /* ignorar */ }
  }

  function reproducir() {
    audio.volume = 0.2;
    const p = audio.play();
    if (p) p.catch(() => {});
    btn?.classList.remove('muted');
    btn?.setAttribute('aria-pressed', 'true');
  }

  // Inicia (o reanuda) la reproducción UNA sola vez; nunca reinicia la canción.
  // Si ya está sonando o el usuario la pausó a propósito, no hace nada.
  function reproducirBajoVolumen() {
    if (usuarioPauso) return;
    if (!audio.paused) return;

    // Primera vez: retomar desde donde quedó en el sobre (continuidad, sin reiniciar)
    if (!comenzada) {
      comenzada = true;
      const t = parseFloat(sessionStorage.getItem('xv-audio-time'));
      if (Number.isFinite(t) && t > 0) {
        // iOS ignora currentTime si el audio aún no cargó: esperar al metadato
        // (con respaldo por si loadedmetadata nunca dispara)
        let retomado = false;
        const retomar = () => {
          if (retomado) return;
          retomado = true;
          try { audio.currentTime = t; } catch (e) { /* ignorar */ }
          reproducir();
        };
        if (audio.readyState >= 1) {
          retomar();
        } else {
          audio.addEventListener('loadedmetadata', retomar, { once: true });
          setTimeout(retomar, 1500);
        }
        return;
      }
    }
    reproducir();
  }

  if (btn) {
    btn.addEventListener('click', () => {
      if (audio.paused) {
        usuarioPauso = false;
        reproducirBajoVolumen();
      } else {
        usuarioPauso = true;
        audio.pause();
        btn.classList.add('muted');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Autoplay al entrar (viniendo desde el sobre o visita directa).
  // Espera a que la página cargue por completo y, además, a que el destello
  // blanco de entrada termine de fundirse: la música suena solo cuando ya se
  // ve toda la información.
  const destello = document.getElementById('intro-flash');
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reproducirCuandoListo = () => {
    window.removeEventListener('load', reproducirCuandoListo);
    const desdeSobre = sessionStorage.getItem('xv-open') === '1';
    sessionStorage.removeItem('xv-open');

    // Sin destello (o con movimiento reducido): revelar ya; tocar solo si vino del sobre
    if (!destello || reducirMovimiento) {
      if (desdeSobre) reproducirBajoVolumen();
      return;
    }

    // Revelar la página: el destello blanco se desvanece
    destello.classList.add('on');

    // La música arranca cuando el destello terminó de fundirse (información visible)
    if (desdeSobre) {
      destello.addEventListener('transitionend', () => {
        reproducirBajoVolumen();
      });
      // Respaldo por si transitionend no dispara
      setTimeout(reproducirBajoVolumen, 1400);
    }
  };

  if (document.readyState === 'complete') {
    reproducirCuandoListo();
  } else {
    window.addEventListener('load', reproducirCuandoListo);
  }

  // iOS/móvil: el autoplay se bloquea hasta el primer gesto real del usuario.
  // Se escucha touchstart/pointerdown/click (NO scroll: no cuenta como gesto en
  // iOS Safari) y se remueven los listeners solo cuando ya está sonando.
  const gestos = ['pointerdown', 'touchstart', 'click'];
  const intentarEnGesto = () => {
    if (!audio.paused) {
      gestos.forEach((g) => window.removeEventListener(g, intentarEnGesto));
      return;
    }
    reproducirBajoVolumen();
    if (!audio.paused) {
      gestos.forEach((g) => window.removeEventListener(g, intentarEnGesto));
    }
  };
  gestos.forEach((g) => window.addEventListener(g, intentarEnGesto));
})();

/* ===== COUNTDOWN ===== */
(function initCountdown() {
  const target = new Date('2026-10-24T19:00:00-05:00').getTime();

  function update() {
    const now = Date.now();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

/* ===== CAROUSEL ===== */
(function initCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;
  let autoInterval;

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  updateDots();

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('span');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(() => goTo(current + 1), 4000);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  // Expose for inline onclick
  window.moveCarousel = (dir) => {
    goTo(current + dir);
    startAuto();
  };

  // Touch / swipe support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
    startAuto();
  }, { passive: true });

  // Mouse drag support
  track.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
    stopAuto();
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      goTo(current + (diff > 0 ? 1 : -1));
    }
    track.style.cursor = '';
    startAuto();
  });

  track.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      track.style.cursor = '';
      startAuto();
    }
  });

  startAuto();
})();

/* ===== MODAL SYSTEM ===== */
const modalContents = {
  map: `
    <h3>Cómo llegar</h3>
    <p>Finca #11 — Parcelación El Limonar, Copacabana, Antioquia</p>
    <div class="map-container">
      <iframe
        src="https://maps.google.com/maps?q=Finca+%2311+Parcelaci%C3%B3n+El+Limonar+Copacabana+Antioquia&output=embed"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
    <div class="map-buttons">
      <a class="map-btn gmaps" href="https://maps.app.goo.gl/ZvFWzxfnd5qdKt199" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
        Google Maps
      </a>
      <a class="map-btn waze" href="https://waze.com/ul?q=Finca%20%2311%20Parcelaci%C3%B3n%20El%20Limonar%20Copacabana%20Antioquia" target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
        Waze
      </a>
    </div>
  `,

  dresscode: `
    <h3>Traje formal</h3>
    <div class="dresscode-modal-card dresscode-modal-single">
      <div class="dresscode-figure dresscode-figure--contain">
        <img src="../img/dressCode.png" alt="Traje formal" loading="lazy">
      </div>
    </div>
  `,

  tips: `
    <h3>Tips para la noche</h3>
    <ol class="tips-list">
      <li>
        <span class="tip-icon">1</span>
        <span><strong>Llegada puntual</strong> — La celebración inicia a las 7:00 PM. Te esperamos puntual para no perderte ningún momento especial.</span>
      </li>
      <li>
        <span class="tip-icon">2</span>
        <span><strong>Cómo llegar</strong> — Te sugerimos llegar en transporte privado o coordinar con otros invitados, la finca tiene parqueadero disponible.</span>
      </li>
      <li>
        <span class="tip-icon">3</span>
        <span><strong>Sonríe</strong> — Habrá fotógrafo profesional toda la noche. Prepárate para capturar recuerdos inolvidables.</span>
      </li>
      <li>
        <span class="tip-icon">4</span>
        <span><strong>Clima</strong> — Octubre en Copacabana suele ser fresco. Lleva un abrigo ligero por si la noche se pone fría.</span>
      </li>
      <li>
        <span class="tip-icon">5</span>
        <span><strong>Confirma tu asistencia</strong> — Hazlo antes del 10 de octubre para que podamos organizar todo al detalle.</span>
      </li>
    </ol>
  `,

  gifts: `
    <h3>Lluvia de Sobres</h3>
    <div class="gifts-modal-icon">
      <svg width="128" height="128" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.3" transform="rotate(-16 60 60)">
          <rect x="32" y="44" width="56" height="40" rx="3" fill="#B9C6E4"/>
          <path d="M32 44 L60 66 L88 44 Z" fill="#55639B" opacity="0.6"/>
        </g>
        <rect x="22" y="38" width="76" height="58" rx="4" fill="#B9C6E4"/>
        <path d="M22 38 L98 38 L60 72 Z" fill="#55639B" opacity="0.45"/>
        <path d="M22 96 L60 72" stroke="#55639B" stroke-opacity="0.3" stroke-width="2"/>
        <path d="M98 96 L60 72" stroke="#55639B" stroke-opacity="0.3" stroke-width="2"/>
        <path d="M60 68 C58 65 55 66 55 69 C55 72 60 75.5 60 77 C60 75.5 65 72 65 69 C65 66 62 65 60 68 Z" fill="#C9A84C"/>
        <path d="M108 30 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" fill="#C9A84C"/>
        <path d="M14 74 l1.2 3.2 3.2 1.2 -3.2 1.2 -1.2 3.2 -1.2 -3.2 -3.2 -1.2 3.2 -1.2 Z" fill="#C9A84C"/>
        <path d="M16 26 l1 2.7 2.7 1 -2.7 1 -1 2.7 -1 -2.7 -2.7 -1 2.7 -1 Z" fill="#C9A84C" opacity="0.7"/>
      </svg>
    </div>
  `,

  rsvp: `
    <h3>Confirmar asistencia</h3>
    <p>Por favor confirma antes del <strong>10 de Octubre de 2026</strong></p>
    <form class="rsvp-form" id="rsvp-form" onsubmit="handleRSVP(event)">
      <label for="rsvp-name">Nombre completo</label>
      <input type="text" id="rsvp-name" required placeholder="Tu nombre">

      <label for="rsvp-phone">Teléfono / WhatsApp</label>
      <input type="tel" id="rsvp-phone" required placeholder="300 000 0000">

      <label for="rsvp-guests">Número de invitados</label>
      <input type="number" id="rsvp-guests" min="1" max="10" value="1">

      <label for="rsvp-message">Dejame un mensaje con tus buenos deseos (opcional)</label>
      <textarea id="rsvp-message" placeholder="Tus mejores deseos para este gran día"></textarea>

      <p class="rsvp-status" id="rsvp-status" role="status" aria-live="polite"></p>
      <button type="submit" class="btn btn-primary">Enviar confirmación</button>
    </form>
  `
};

function openModal(type) {
  const overlay = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');
  body.innerHTML = modalContents[type] || '<p>Contenido no disponible</p>';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  spawnShootingStars();
}

/* Estrellas fugaces de un solo disparo al abrir cada modal */
function spawnShootingStars() {
  const sky = document.querySelector('.modal-stars');
  if (!sky) return;
  const count = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'shooting-star';
    s.style.top = `${(8 + Math.random() * 40).toFixed(0)}%`;
    s.style.left = `${(10 + Math.random() * 65).toFixed(0)}%`;
    s.style.animationDuration = `${(1.1 + Math.random() * 0.7).toFixed(2)}s`;
    s.style.animationDelay = `${(i * 0.25 + Math.random() * 0.3).toFixed(2)}s`;
    s.style.animationIterationCount = '1';
    s.addEventListener('animationend', () => s.remove());
    setTimeout(() => s.remove(), 5000);
    sky.appendChild(s);
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === e.currentTarget) {
    closeModal();
  }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ===== RSVP FORM ===== */
const WA_NUMBER = '573007698235';

function handleRSVP(e) {
  e.preventDefault();
  const form = document.getElementById('rsvp-form');
  const name = document.getElementById('rsvp-name').value.trim();
  const phone = document.getElementById('rsvp-phone').value.trim();
  const guests = document.getElementById('rsvp-guests').value;
  const message = document.getElementById('rsvp-message').value.trim();
  const btn = form.querySelector('.btn');
  const status = document.getElementById('rsvp-status');

  function abrirWhatsApp() {
    const text = `¡Hola Ana Sofia!%0A%0AConfirmo mi asistencia:%0A👤 Nombre: ${encodeURIComponent(name)}%0A📱 Tel: ${encodeURIComponent(phone)}%0A👥 Invitados: ${guests}%0A📝 Mensaje: ${encodeURIComponent(message || 'Ninguno')}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
  }

  function finalizar(mensaje, clase) {
    btn.textContent = '✓ ¡Gracias por confirmar!';
    btn.disabled = true;
    btn.style.pointerEvents = 'none';
    if (status) {
      status.textContent = mensaje;
      status.className = `rsvp-status ${clase}`;
    }
    setTimeout(() => {
      closeModal();
      btn.textContent = 'Enviar confirmación';
      btn.disabled = false;
      btn.style.pointerEvents = '';
      form.reset();
    }, clase === 'success' ? 2200 : 3500);
  }

  btn.textContent = 'Enviando…';
  btn.disabled = true;
  if (status) {
    status.textContent = '';
    status.className = 'rsvp-status';
  }

  fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, guests, message })
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw data;
      return data;
    })
    .then(() => {
      abrirWhatsApp();
      finalizar('Tu confirmación se guardó. ¡Gracias!', 'success');
    })
    .catch(() => {
      abrirWhatsApp();
      finalizar('Confirmado por WhatsApp. No pudimos guardarlo en la lista, pero recibimos tu confirmación.', 'warning');
    });
}

/* ===== GSAP SCROLLTRIGGER ===== */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // 1. Fixed bg subtle breathing effect (scale in/out on scroll)
  gsap.fromTo('.fixed-bg', {
    scale: 1
  }, {
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2
    }
  });

  // 1b. Parallax del cielo estrellado (estrellas a distinta velocidad + luna)
  const skyLayers = [
    { sel: '.layer-1', depth: 8 },
    { sel: '.layer-2', depth: 16 },
    { sel: '.layer-3', depth: 26 }
  ];

  skyLayers.forEach((layer) => {
    gsap.to(layer.sel, {
      yPercent: -layer.depth,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2
      }
    });
  });

  gsap.to('.moon', {
    y: () => window.innerHeight * 0.12,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2
    }
  });

  // 2. Hero content fade-out on scroll
  gsap.to('.hero-content', {
    opacity: 0,
    y: -60,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  });

  // 3. Reveal sections on scroll (fade + up)
  const sections = document.querySelectorAll(
    '.countdown, .location, .carousel-section, .dresscode, .gifts, .rsvp'
  );
  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // 4. Countdown number animation (stagger)
  gsap.from('.countdown-number', {
    opacity: 0,
    y: 40,
    stagger: 0.15,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '#countdown',
      start: 'top 80%'
    }
  });

  // 5. Photo collage reveal (staggered fade-in only — no transforms to avoid conflicts with inline rotate)
  gsap.utils.toArray('.photo-strip-item').forEach((item) => {
    gsap.fromTo(item, 
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 6. Carousel section fade
  gsap.from('.carousel', {
    opacity: 0,
    scale: 0.92,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#carousel',
      start: 'top 80%'
    }
  });

  ScrollTrigger.refresh();
})();

/* ===== MAGNETIC COLLAGE — ELASTIC WARP ===== */
(function initMagneticCollage() {
  const strip = document.getElementById('photo-strip');
  const items = strip ? strip.querySelectorAll('.photo-strip-item') : [];
  if (!items.length) return;

  let activeItem = null;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function activate(item, xRatio, yRatio) {
    if (activeItem && activeItem !== item) {
      deactivate(activeItem, true);
    }
    activeItem = item;

    const clip = item.querySelector('.photo-clip');
    const img = clip ? clip.querySelector('img') : null;
    const baseRotate = parseFloat(item.dataset.rotate) || 0;

    item.classList.add('active');
    item.style.zIndex = 20;
    items.forEach(sibling => {
      if (sibling !== item) sibling.classList.add('has-active');
    });

    if (xRatio !== undefined && yRatio !== undefined && !isTouchDevice) {
      const tiltX = -((yRatio - 0.5) * 2) * 12;
      const tiltY = ((xRatio - 0.5) * 2) * 12;
      const dist = Math.sqrt(
        Math.pow((xRatio - 0.5) * 2, 2) +
        Math.pow((yRatio - 0.5) * 2, 2)
      );
      const magScale = 1 + Math.max(0, 1 - dist) * 0.15;

      gsap.to(clip, {
        rotateX: tiltX,
        rotateY: tiltY,
        scale: magScale,
        transformPerspective: 900,
        duration: 0.5,
        ease: 'back.out(1.7)',
        overwrite: 'auto'
      });

      if (img) {
        const imgX = ((xRatio - 0.5) * 2) * 10;
        const imgY = ((yRatio - 0.5) * 2) * 10;
        gsap.to(img, {
          x: imgX,
          y: imgY,
          scale: 1.08,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    } else {
      gsap.to(clip, {
        scale: 1.25,
        transformPerspective: 900,
        duration: 0.5,
        ease: 'back.out(1.7)',
        overwrite: 'auto'
      });
      if (img) {
        gsap.to(img, {
          scale: 1.04,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    }
  }

  function deactivate(item, quiet) {
    if (!item) return;
    item.classList.remove('active');
    item.style.zIndex = item.dataset.origZ || parseInt(item.style.zIndex) || 3;

    const clip = item.querySelector('.photo-clip');
    const img = clip ? clip.querySelector('img') : null;

    gsap.to(clip, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: quiet ? 0.3 : 0.6,
      ease: quiet ? 'power2.out' : 'back.inOut(1.7)',
      overwrite: 'auto'
    });
    if (img) {
      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: quiet ? 0.3 : 0.6,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (activeItem === item) {
      activeItem = null;
      items.forEach(sibling => sibling.classList.remove('has-active'));
    }
  }

  // --- MOUSE (desktop) ---
  items.forEach(item => {
    item.dataset.origZ = item.style.zIndex || '3';

    item.addEventListener('mouseenter', () => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const xRatio = (cx - rect.left) / rect.width;
      const yRatio = (cy - rect.top) / rect.height;
      activate(item, 0.5, 0.5);
    });

    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;
      activate(item, xRatio, yRatio);
    });

    item.addEventListener('mouseleave', () => {
      deactivate(item, false);
    });
  });

  // --- TOUCH (mobile / tablet) ---
  if (isTouchDevice) {
    items.forEach(item => {
      let touchActive = false;

      item.addEventListener('touchstart', (e) => {
        if (touchActive) {
          deactivate(item, false);
          touchActive = false;
          return;
        }
        e.preventDefault();
        const touch = e.changedTouches[0];
        const rect = item.getBoundingClientRect();
        const xRatio = (touch.clientX - rect.left) / rect.width;
        const yRatio = (touch.clientY - rect.top) / rect.height;
        activate(item, xRatio, yRatio);
        touchActive = true;
      }, { passive: false });

      item.addEventListener('touchmove', (e) => {
        if (!touchActive) return;
        e.preventDefault();
        const touch = e.changedTouches[0];
        const rect = item.getBoundingClientRect();
        const xRatio = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
        const yRatio = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));
        activate(item, xRatio, yRatio);
      }, { passive: false });

      item.addEventListener('touchend', (e) => {
        if (!touchActive) return;
        e.preventDefault();
        touchActive = false;
        deactivate(item, false);
      });

      item.addEventListener('touchcancel', () => {
        if (!touchActive) return;
        touchActive = false;
        deactivate(item, false);
      });
    });
  }

  // Deactivate on scroll
  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      if (activeItem) deactivate(activeItem, true);
    }, 150);
  }, { passive: true });

  // Deactivate on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeItem) deactivate(activeItem, true);
  });

  // Fix initial z-index persistence after GSAP
  gsap.config({ nullTargets: true });
})();
