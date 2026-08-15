const VOLUMEN_MUSICA = 0.3;

/* ===== GENERADOR DE ESTRELLAS ===== */
(function crearCieloEstrellado() {
  const capas = [
    { id: 'stars-1', count: 60, size: [1, 2], rgb: [255, 255, 255] },
    { id: 'stars-2', count: 30, size: [2, 3], rgb: [201, 212, 240] },
    { id: 'stars-3', count: 10, size: [2, 4], rgb: [232, 212, 138] }
  ];

  capas.forEach((capa) => {
    const el = document.getElementById(capa.id);
    if (!el) return;
    for (let i = 0; i < capa.count; i++) {
      const estrella = document.createElement('span');
      estrella.className = 'star';
      estrella.style.top = `${(Math.random() * 100).toFixed(2)}%`;
      estrella.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      const tamano = capa.size[0] + Math.random() * (capa.size[1] - capa.size[0]);
      estrella.style.width = `${tamano}px`;
      estrella.style.height = `${tamano}px`;
      const [r, g, b] = capa.rgb;
      estrella.style.background = `rgba(${r}, ${g}, ${b}, 1)`;
      if (tamano >= 2.5) {
        estrella.style.boxShadow = `0 0 ${tamano * 3}px ${tamano}px rgba(${r}, ${g}, ${b}, 0.6)`;
      }
      estrella.style.animationDuration = `${(2.5 + Math.random() * 4).toFixed(2)}s`;
      estrella.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      el.appendChild(estrella);
    }
  });
})();

/* ===== ESTALLIDO DE PARTÍCULAS ===== */
function estallidoParticulas() {
  const contenedor = document.getElementById('particle-burst');
  if (!contenedor) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const angulo = Math.random() * Math.PI * 2;
    const radio = 70 + Math.random() * 130;
    p.style.setProperty('--dx', `${Math.cos(angulo) * radio}px`);
    p.style.setProperty('--dy', `${Math.sin(angulo) * radio}px`);
    const tamano = 3 + Math.random() * 5;
    p.style.width = `${tamano}px`;
    p.style.height = `${tamano}px`;
    p.style.animationDelay = `${(Math.random() * 0.15).toFixed(2)}s`;
    contenedor.appendChild(p);
  }
  setTimeout(() => {
    contenedor.innerHTML = '';
  }, 1300);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnAbrir = document.getElementById("btn-abrir");
  const contenedorSobre = document.getElementById("contenedor-sobre");
  const audio = document.getElementById("musica");
  const btnAudio = document.getElementById("btn-audio");

  function iniciarMusica() {
    if (!audio) return;
    audio.volume = VOLUMEN_MUSICA;
    audio.play().catch(() => {});
    btnAudio?.classList.remove("muted");
    btnAudio?.setAttribute("aria-pressed", "true");
  }

  // Guardar el tiempo de reproducción para que la invitación continúe
  // la misma canción (sin reiniciarla) al navegar desde el sobre.
  audio.addEventListener("timeupdate", () => {
    if (!audio.paused) {
      sessionStorage.setItem("xv-audio-time", String(audio.currentTime));
    }
  });

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      iniciarMusica();
    } else {
      audio.pause();
      btnAudio?.classList.add("muted");
      btnAudio?.setAttribute("aria-pressed", "false");
    }
  }

  if (btnAudio) btnAudio.addEventListener("click", toggleAudio);

  if (btnAbrir && contenedorSobre) {
    btnAbrir.addEventListener("click", function (e) {
      // 1. Bloquear la redirección instantánea del navegador
      e.preventDefault();

      // 2. Obtener la URL de destino dinámica desde el atributo href
      const urlDestino = this.getAttribute("href");
      const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 3. Inyectar la clase CSS que dispara las transiciones
      contenedorSobre.classList.add("abriendo");

      // 4. Iniciar la música al abrir el sobre
      iniciarMusica();
      sessionStorage.setItem("xv-open", "1");

      // 5. Movimiento reducido: navegar de inmediato sin secuencia
      if (reducirMovimiento) {
        window.location.href = urlDestino;
        return;
      }

      // 6. Secuencia cinematográfica: flash + estallido de partículas
      document.getElementById("flash")?.classList.add("flash-on");
      estallidoParticulas();

      // 7. Fundido hacia la luz antes de la navegación
      setTimeout(() => {
        document.getElementById("fade-out")?.classList.add("on");
      }, 550);

      // 8. Navegar una vez terminada la animación
      setTimeout(() => {
        window.location.href = urlDestino;
      }, 1200);
    });
  }
});