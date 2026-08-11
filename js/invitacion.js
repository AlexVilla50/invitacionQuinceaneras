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

/* ===== MÚSICA DE FONDO ===== */
(function initMusic() {
  const audio = document.getElementById('musica');
  const btn = document.getElementById('btn-audio');
  if (!audio) return;

  function reproducirBajoVolumen() {
    audio.volume = 0.2;
    const p = audio.play();
    if (p) p.catch(() => {});
    btn?.classList.remove('muted');
    btn?.setAttribute('aria-pressed', 'true');
  }

  if (btn) {
    btn.addEventListener('click', () => {
      if (audio.paused) {
        reproducirBajoVolumen();
      } else {
        audio.pause();
        btn.classList.add('muted');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Autoplay al entrar (viniendo desde el sobre o visita directa)
  if (sessionStorage.getItem('xv-open') === '1') {
    reproducirBajoVolumen();
  }

  // Fallback: si el navegador bloquea el autoplay, intentar en el primer gesto del usuario
  let reintentado = false;
  const reintentar = () => {
    if (!reintentado && audio.paused) {
      reintentado = true;
      reproducirBajoVolumen();
    }
    window.removeEventListener('pointerdown', reintentar);
    window.removeEventListener('scroll', reintentar);
  };
  window.addEventListener('pointerdown', reintentar);
  window.addEventListener('scroll', reintentar, { passive: true });
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
    <h3>Traje de Gala</h3>
    <div class="dresscode-modal-grid">
      <div class="dresscode-modal-card">
        <svg viewBox="0 0 120 200" fill="none">
          <ellipse cx="60" cy="60" rx="25" ry="30" fill="#B9C6E4" opacity="0.3"/>
          <path d="M60 90 L45 140 L35 140 L30 170 L50 170 L55 145 L60 145 L65 170 L85 170 L80 140 L70 140 L60 90Z" fill="#B9C6E4" opacity="0.5"/>
          <path d="M45 30 C40 40 35 55 40 65 L55 70 L50 55 L55 50 L60 55 L65 50 L70 55 L65 70 L80 65 C85 55 80 40 75 30" fill="#B9C6E4" opacity="0.4"/>
        </svg>
        <h4>Dama</h4>
        <p>Vestido largo de gala, colores formales, tacones elegantes. Puedes usar accesorios brillantes y peinado sofisticado.</p>
      </div>
      <div class="dresscode-modal-card">
        <svg viewBox="0 0 120 200" fill="none">
          <ellipse cx="60" cy="50" rx="22" ry="28" fill="#55639B" opacity="0.3"/>
          <path d="M40 72 L40 80 L35 85 L35 175 L55 175 L55 110 L60 105 L65 110 L65 175 L85 175 L85 85 L80 80 L80 72Z" fill="#55639B" opacity="0.5"/>
          <path d="M38 75 L55 82 L60 78 L65 82 L82 75" stroke="#55639B" stroke-width="2" opacity="0.5"/>
          <rect x="60" y="82" width="3" height="25" fill="#55639B" opacity="0.3"/>
        </svg>
        <h4>Caballero</h4>
        <p>Traje formal oscuro, camisa blanca, corbata o moño. Zapatos de vestir, look pulcro y elegante.</p>
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
        <span><strong>Rappel</strong> — Te sugerimos llegar en transporte privado o coordinar con otros invitados, la finca tiene parqueadero disponible.</span>
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
    <div class="gifts-modal-icon">🧧</div>
    <p>Tu presencia es el mejor regalo que puedo recibir. Sin embargo, si deseas contribuir con mi fiesta, la mesa de regalos estará disponible para una <strong>lluvia de sobres</strong>. Cualquier detalle será recibido con muchísimo cariño y gratitud.</p>
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
function handleRSVP(e) {
  e.preventDefault();
  const name = document.getElementById('rsvp-name').value;
  const phone = document.getElementById('rsvp-phone').value;
  const guests = document.getElementById('rsvp-guests').value;
  const message = document.getElementById('rsvp-message').value;

  const text = `¡Hola Ana Sofia!%0A%0AConfirmo mi asistencia:%0A👤 Nombre: ${encodeURIComponent(name)}%0A📱 Tel: ${encodeURIComponent(phone)}%0A👥 Invitados: ${guests}%0A📝 Mensaje: ${encodeURIComponent(message || 'Ninguno')}`;

  window.open(`https://wa.me/573007698235?text=${text}`, '_blank');

  const btn = document.querySelector('#rsvp-form .btn');
  btn.textContent = '✓ ¡Gracias por confirmar!';
  btn.disabled = true;
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    closeModal();
    btn.textContent = 'Enviar confirmación';
    btn.disabled = false;
    btn.style.pointerEvents = '';
    document.getElementById('rsvp-form').reset();
  }, 2000);
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
