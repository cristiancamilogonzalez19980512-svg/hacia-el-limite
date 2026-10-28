/* Música por pantalla: selección/historia y mapa. */
(() => {
  "use strict";

  const musicaSeleccion = new Audio("audio/musica_seleccion.wav");
  const musicaMapa = new Audio("audio/musica_mapa.wav");
  const pistas = { seleccion: musicaSeleccion, mapa: musicaMapa };

  musicaSeleccion.loop = true;
  musicaMapa.loop = true;
  musicaSeleccion.preload = "auto";
  musicaMapa.preload = "auto";
  musicaSeleccion.volume = 0.24;
  musicaMapa.volume = 0.24;

  let musicaActual = null;
  let silenciada = false;
  let primerGestor = false;

  const boton = document.createElement("button");
  boton.id = "control-musica";
  boton.type = "button";
  boton.setAttribute("aria-pressed", "false");
  boton.setAttribute("aria-label", "Silenciar música");
  boton.textContent = "🔊 Música: activada";
  document.body.appendChild(boton);

  function actualizarBoton() {
    boton.textContent = silenciada ? "🔇 Música: silenciada" : "🔊 Música: activada";
    boton.setAttribute("aria-pressed", String(silenciada));
    boton.setAttribute("aria-label", silenciada ? "Activar música" : "Silenciar música");
  }

  function pausarTodas() {
    Object.values(pistas).forEach((pista) => {
      pista.pause();
      try { pista.currentTime = 0; } catch (_) {}
    });
  }

  function cambiarMusica(pantalla) {
    const nueva = pistas[pantalla];
    if (!nueva) return;
    if (musicaActual === nueva && !nueva.paused) return;

    // Detener por completo la pista anterior para que nunca se mezclen.
    pausarTodas();
    musicaActual = nueva;

    if (!silenciada) {
      nueva.play().catch(() => {
        // El navegador puede bloquear audio hasta que el jugador interactúe.
      });
    }
  }

  window.cambiarMusicaAventura = cambiarMusica;

  // El navegador exige interacción del usuario antes de reproducir audio.
  // El primer clic en selección/personaje inicia la música ambiental.
  document.addEventListener("click", () => {
    if (primerGestor) return;
    primerGestor = true;
    const seleccionVisible = !document.getElementById("seleccion-aventura")?.hidden;
    const historiaVisible = !document.getElementById("pantalla-historia")?.hidden;
    const mapaVisible = !document.getElementById("pantalla-juego")?.hidden;
    if (seleccionVisible || historiaVisible) cambiarMusica("seleccion");
    else if (mapaVisible) cambiarMusica("mapa");
  }, true);

  window.addEventListener("aventuraIniciada", () => {
    cambiarMusica("mapa");
  });

  document.getElementById("btn-volver-personajes")?.addEventListener("click", () => {
    cambiarMusica("seleccion");
  });

  document.getElementById("btn-volver-seleccion")?.addEventListener("click", () => {
    cambiarMusica("seleccion");
  });

  boton.addEventListener("click", () => {
    silenciada = !silenciada;
    if (silenciada) {
      pausarTodas();
    } else if (musicaActual) {
      musicaActual.play().catch(() => {});
    }
    actualizarBoton();
  });

  actualizarBoton();
})();
