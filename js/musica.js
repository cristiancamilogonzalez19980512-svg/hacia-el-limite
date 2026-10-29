
/* Audio para Hacia el Límite:
   música de selección, mapa, batalla y efectos procedurales. */
(() => {
  "use strict";

  // =========================
  // MÚSICAS
  // =========================
  const musicaSeleccion = new Audio("audio/musica_seleccion.wav");
  const musicaMapa = new Audio("audio/musica_mapa.wav");
  const musicaBatalla = new Audio("audio/musica_batalla.wav");

  const pistas = {
    seleccion: musicaSeleccion,
    mapa: musicaMapa,
    batalla: musicaBatalla
  };

  Object.values(pistas).forEach(pista => {
    pista.loop = true;
    pista.preload = "auto";
  });

  musicaSeleccion.volume = 0.22;
  musicaMapa.volume = 0.20;
  musicaBatalla.volume = 0.30;

  let musicaActual = null;
  let silenciada = false;
  let audioContext = null;
  let ambiente = null;
  let ruidoFuente = null;
  let cantoTimer = null;
  let pasoUltimo = 0;
  let primerGestoProcesado = false;

  // =========================
  // BOTÓN DE SONIDO
  // =========================
  const boton = document.createElement("button");
  boton.id = "control-musica";
  boton.type = "button";
  boton.setAttribute("aria-pressed", "false");
  boton.textContent = "🔊 Sonido: activado";
  document.body.appendChild(boton);

  // =========================
  // CONTEXTO DE AUDIO
  // =========================
  function contexto() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;

    if (!audioContext) audioContext = new Ctx();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  }

  // =========================
  // EFECTOS PROCEDURALES
  // =========================
  function tono(
    freq,
    duracion,
    forma = "sine",
    volumen = 0.07,
    finalFreq = null
  ) {
    const c = contexto();
    if (!c || silenciada) return;

    const ahora = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.type = forma;
    osc.frequency.setValueAtTime(freq, ahora);

    if (finalFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, finalFreq),
        ahora + duracion
      );
    }

    gain.gain.setValueAtTime(0.0001, ahora);
    gain.gain.exponentialRampToValueAtTime(
      volumen,
      ahora + 0.018
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ahora + duracion
    );

    osc.connect(gain);
    gain.connect(c.destination);

    osc.start(ahora);
    osc.stop(ahora + duracion + 0.03);
  }

  function ruidoCorto(
    duracion = 0.12,
    volumen = 0.04,
    filtro = 900
  ) {
    const c = contexto();
    if (!c || silenciada) return;

    const longitud = Math.max(
      1,
      Math.floor(c.sampleRate * duracion)
    );

    const buffer = c.createBuffer(
      1,
      longitud,
      c.sampleRate
    );

    const datos = buffer.getChannelData(0);

    for (let i = 0; i < longitud; i++) {
      datos[i] =
        (Math.random() * 2 - 1) * (1 - i / longitud);
    }

    const src = c.createBufferSource();
    src.buffer = buffer;

    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = filtro;

    const gain = c.createGain();
    gain.gain.value = volumen;

    src.connect(lp);
    lp.connect(gain);
    gain.connect(c.destination);

    src.start();
  }

  function efecto(tipo) {
    if (silenciada) return;

    switch (tipo) {
      case "seleccion":
        tono(660, 0.09, "sine", 0.075);
        setTimeout(
          () => tono(880, 0.12, "sine", 0.065),
          65
        );
        break;

      case "paso":
        ruidoCorto(0.11, 0.18, 520);
        tono(105, 0.085, "triangle", 0.12, 58);
        break;

      case "puerta":
        ruidoCorto(0.42, 0.12, 500);
        tono(180, 0.48, "triangle", 0.10, 70);
        break;

      case "exito":
        tono(523, 0.16, "sine", 0.085);
        setTimeout(
          () => tono(659, 0.16, "sine", 0.085),
          130
        );
        setTimeout(
          () => tono(784, 0.28, "sine", 0.09),
          260
        );
        break;

      case "error":
        tono(220, 0.18, "triangle", 0.075, 145);
        break;

      case "combate":
        ruidoCorto(0.22, 0.22, 1800);
        tono(420, 0.13, "sawtooth", 0.15, 95);
        setTimeout(
          () => ruidoCorto(0.16, 0.18, 900),
          90
        );
        break;

      case "golpe":
        tono(190, 0.12, "sawtooth", 0.16, 55);
        ruidoCorto(0.13, 0.20, 1500);
        break;

      default:
        tono(520, 0.055, "sine", 0.055);
    }
  }

  // =========================
  // AMBIENTE DEL MAPA
  // =========================
  function iniciarAmbiente() {
    const c = contexto();

    if (!c || ambiente || silenciada) return;

    const longitud = c.sampleRate * 3;
    const buffer = c.createBuffer(
      1,
      longitud,
      c.sampleRate
    );

    const datos = buffer.getChannelData(0);

    for (let i = 0; i < longitud; i++) {
      datos[i] = Math.random() * 2 - 1;
    }

    ruidoFuente = c.createBufferSource();
    ruidoFuente.buffer = buffer;
    ruidoFuente.loop = true;

    const filtro = c.createBiquadFilter();
    filtro.type = "lowpass";
    filtro.frequency.value = 380;
    filtro.Q.value = 0.5;

    const vientoGain = c.createGain();
    vientoGain.gain.value = 0.008;

    ruidoFuente.connect(filtro);
    filtro.connect(vientoGain);
    vientoGain.connect(c.destination);

    ruidoFuente.start();

    ambiente = { filtro, vientoGain };

    // Cantos suaves del bosque, solo en el mapa.
    cantoTimer = window.setInterval(() => {
      if (
        silenciada ||
        musicaActual !== musicaMapa ||
        Math.random() > 0.48
      ) {
        return;
      }

      const base = 1450 + Math.random() * 950;

      tono(
        base,
        0.10 + Math.random() * 0.08,
        "sine",
        0.012,
        base * (1.2 + Math.random() * 0.35)
      );

      if (Math.random() > 0.55) {
        setTimeout(() => {
          tono(
            base * 1.25,
            0.09,
            "sine",
            0.009,
            base * 1.5
          );
        }, 115);
      }
    }, 3200);
  }

  function detenerAmbiente() {
    if (ruidoFuente) {
      try {
        ruidoFuente.stop();
      } catch (_) {}
    }

    ruidoFuente = null;
    ambiente = null;

    if (cantoTimer) {
      clearInterval(cantoTimer);
    }

    cantoTimer = null;
  }

  // =========================
  // CAMBIO DE MÚSICA
  // =========================
  function pausarTodas() {
    Object.values(pistas).forEach(pista => {
      pista.pause();

      try {
        pista.currentTime = 0;
      } catch (_) {}
    });
  }

  function cambiarMusica(pantalla) {
    const nueva = pistas[pantalla];

    if (!nueva) return;

    if (
      musicaActual === nueva &&
      !nueva.paused
    ) {
      return;
    }

    // Detener todas las músicas y el ambiente anterior.
    pausarTodas();
    detenerAmbiente();

    musicaActual = nueva;

    if (silenciada) return;

    nueva.play().catch(error => {
      console.warn(
        "No se pudo reproducir la música:",
        error
      );
    });

    // El ambiente solo se reproduce en el mapa.
    if (pantalla === "mapa") {
      iniciarAmbiente();
    }
  }

  // Funciones accesibles desde el resto del juego.
  window.cambiarMusicaAventura = cambiarMusica;
  window.reproducirEfectoJuego = efecto;

  // =========================
  // EVENTOS DE BATALLA
  // =========================
  window.addEventListener("batallaIniciada", () => {
    cambiarMusica("batalla");
  });

  window.addEventListener("batallaTerminada", () => {
    cambiarMusica("mapa");
  });

  // Compatibilidad con el inicio de la aventura.
  window.addEventListener("aventuraIniciada", () => {
    cambiarMusica("mapa");
  });

  document
    .getElementById("btn-volver-personajes")
    ?.addEventListener("click", () => {
      cambiarMusica("seleccion");
    });

  document
    .getElementById("btn-volver-seleccion")
    ?.addEventListener("click", () => {
      cambiarMusica("seleccion");
    });

  // =========================
  // DETECCIÓN DE INTERACCIONES
  // =========================
  document.addEventListener(
    "click",
    e => {
      if (e.target === boton || boton.contains(e.target)) {
        return;
      }

      contexto();

      if (!primerGestoProcesado) {
        primerGestoProcesado = true;

        const mapa = document.getElementById(
          "pantalla-juego"
        );

        const aventuraVisible =
          document.body.classList.contains(
            "pantalla-aventura-activa"
          ) ||
          (
            mapa &&
            !mapa.hidden &&
            getComputedStyle(mapa).display !== "none"
          );

        cambiarMusica(
          aventuraVisible ? "mapa" : "seleccion"
        );
      }

      const objetivo = e.target.closest(
        "button, a, [role='button'], .personaje, .opcion, .puerta"
      );

      if (objetivo) {
        efecto("seleccion");
      }
    },
    true
  );

  // =========================
  // SONIDO DE PASOS
  // =========================
  document.addEventListener("keydown", e => {
    const mapa = document.getElementById(
      "pantalla-juego"
    );

    const visible =
      mapa &&
      !mapa.hidden &&
      getComputedStyle(mapa).display !== "none";

    const teclasMovimiento = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "a",
      "s",
      "d",
      "W",
      "A",
      "S",
      "D",
      " "
    ];

    if (
      !visible ||
      e.repeat ||
      !teclasMovimiento.includes(e.key)
    ) {
      return;
    }

    const ahora = performance.now();

    if (ahora - pasoUltimo > 180) {
      efecto("paso");
      pasoUltimo = ahora;
    }
  });

  // =========================
  // ACTIVAR / SILENCIAR AUDIO
  // =========================
  function actualizarBoton() {
    boton.textContent = silenciada
      ? "🔇 Sonido: silenciado"
      : "🔊 Sonido: activado";

    boton.setAttribute(
      "aria-pressed",
      String(silenciada)
    );

    boton.setAttribute(
      "aria-label",
      silenciada ? "Activar sonido" : "Silenciar sonido"
    );
  }

  boton.addEventListener("click", () => {
    silenciada = !silenciada;

    if (silenciada) {
      pausarTodas();
      detenerAmbiente();
    } else if (musicaActual) {
      contexto();

      musicaActual.play().catch(() => {});

      if (musicaActual === musicaMapa) {
        iniciarAmbiente();
      }
    }

    actualizarBoton();
  });

  actualizarBoton();
})();
