const VOLUMEN_MUSICA = 0.3;

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

            // 3. Inyectar la clase CSS que dispara las transiciones
            contenedorSobre.classList.add("abriendo");

            // 4. Iniciar la música al abrir el sobre
            iniciarMusica();
            sessionStorage.setItem("xv-open", "1");

            // 5. Retrasar la navegación hasta que termine la animación de CSS
            setTimeout(() => {
                window.location.href = urlDestino;
            }, 400);
        });
    }
});