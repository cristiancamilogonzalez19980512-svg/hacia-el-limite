
 // ==========================================
 // MOVIMIENTO DEL PERSONAJE - HACIA EL LÍMITE
 // ==========================================

const mapaMovimiento = document.querySelector(".mapa-mundo");
const personajeMapa = document.getElementById("personaje-mapa");
const pantallaJuegoMovimiento = document.getElementById("pantalla-juego");

let personajeX = 0;
let personajeY = 0;
let saltando = false;
let movimientoInicializado = false;

function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(valor, maximo));
}

// Seleccionar la imagen mini del personaje elegido
function actualizarAparienciaPersonaje(partida) {
  if (!personajeMapa) return;

  let datos = partida;

  if (!datos) {
    try {
      datos = JSON.parse(localStorage.getItem("haciaLimitePartida"));
    } catch (error) {
      datos = null;
    }
  }

  const elegido = datos?.personaje || "maga";

  const apariencias = {
    maga: {
      imagen: "img/minimaga.png",
      nombre: "Maga del Conocimiento"
    },
    caballero: {
      imagen: "img/minicaballero.png",
      nombre: "Caballero Estratega"
    },
    exploradora: {
      imagen: "img/miniexploradora.png",
      nombre: "Exploradora"
    }
  };

  const apariencia = apariencias[elegido] || apariencias.maga;
  const imagen = document.createElement("img");

  imagen.src = apariencia.imagen;
  imagen.alt = apariencia.nombre;
  imagen.draggable = false;

  personajeMapa.replaceChildren(imagen);
  personajeMapa.setAttribute("aria-label", apariencia.nombre);

  requestAnimationFrame(iniciarMovimiento);
}

// Actualizar posición dentro de los límites del mapa
function actualizarPersonaje() {
  if (!mapaMovimiento || !personajeMapa) return;

  const ancho = mapaMovimiento.clientWidth;
  const alto = mapaMovimiento.clientHeight;

  if (!ancho || !alto) return;

  const margenX = personajeMapa.offsetWidth / 2;
  const margenY = personajeMapa.offsetHeight / 2;

  personajeX = limitar(personajeX, margenX, ancho - margenX);
  personajeY = limitar(personajeY, margenY, alto - margenY);

  personajeMapa.style.left = `${personajeX}px`;
  personajeMapa.style.top = `${personajeY}px`;
}

// Colocar al personaje al iniciar la aventura
function iniciarMovimiento() {
  if (!mapaMovimiento || !personajeMapa) return;

  const ancho = mapaMovimiento.clientWidth;
  const alto = mapaMovimiento.clientHeight;

  if (!ancho || !alto) return;

  if (!movimientoInicializado) {
    // Empezar junto a la primera puerta (coordenadas proporcionales al mapa).
    personajeX = ancho * (130 / 1600);
    personajeY = alto * (180 / 1100);
    movimientoInicializado = true;
  }

  actualizarPersonaje();
}

function obtenerProgresoMovimiento() {
  return typeof window.obtenerProgresoAventura === "function"
    ? window.obtenerProgresoAventura()
    : { nivelesCompletados: [] };
}

// Impide cruzar a las regiones siguientes antes de vencer a sus guardianes.
function puedeMoverseA(x, y) {
  if (!mapaMovimiento) return true;

  const ancho = mapaMovimiento.clientWidth;
  const alto = mapaMovimiento.clientHeight;
  const progreso = obtenerProgresoMovimiento();
  const completados = progreso.nivelesCompletados || [];

  // Las Cuevas Matemáticas se abren tras completar el nivel 4.
  if (!completados.includes(4) && x >= ancho * 0.44 && y < alto * 0.50) {
    return false;
  }

  // La Fortaleza Final se abre tras completar el nivel 8.
  if (!completados.includes(8) && y >= alto * 0.50) {
    return false;
  }

  return true;
}

// Movimiento con flechas o WASD
document.addEventListener("keydown", (evento) => {
  if (
    !mapaMovimiento ||
    !personajeMapa ||
    !pantallaJuegoMovimiento ||
    pantallaJuegoMovimiento.hidden ||
    !document.body.classList.contains("pantalla-aventura-activa")
  ) {
    return;
  }

  const tecla = evento.key.toLowerCase();

  const teclasMovimiento = [
    "arrowup", "arrowdown", "arrowleft", "arrowright",
    "w", "a", "s", "d", " "
  ];

  if (!teclasMovimiento.includes(tecla)) return;

  evento.preventDefault();

  if (!movimientoInicializado) iniciarMovimiento();

  const paso = evento.shiftKey ? 30 : 15;
  const posicionAnteriorX = personajeX;
  const posicionAnteriorY = personajeY;

  switch (tecla) {
    case "arrowup":
    case "w":
      personajeY -= paso;
      break;

    case "arrowdown":
    case "s":
      personajeY += paso;
      break;

    case "arrowleft":
    case "a":
      personajeX -= paso;
      personajeMapa.classList.add("direccion-izquierda");
      break;

    case "arrowright":
    case "d":
      personajeX += paso;
      personajeMapa.classList.remove("direccion-izquierda");
      break;

    case " ":
      if (!saltando) {
        saltando = true;
        personajeMapa.classList.add("saltando");

        setTimeout(() => {
          personajeMapa.classList.remove("saltando");
          saltando = false;
        }, 250);
      }
      break;
  }
  // Si el movimiento invade una región bloqueada, se conserva la posición anterior.
  if (!puedeMoverseA(personajeX, personajeY)) {
    personajeX = posicionAnteriorX;
    personajeY = posicionAnteriorY;
  }

  actualizarPersonaje();
  comprobarContactoPuertas();

});

window.addEventListener("resize", actualizarPersonaje);

window.addEventListener("aventuraIniciada", (evento) => {
  actualizarAparienciaPersonaje(evento.detail);
});

/* ==========================================
   ENEMIGOS EXPLORADORES EN MOVIMIENTO
   HACIA EL LÍMITE
========================================== */

let ultimoTiempoEnemigos = 0;
let combateContactoActivo = false;

function prepararMovimientoEnemigos() {
  if (!mapaMovimiento) return;

  mapaMovimiento.querySelectorAll(".enemigo-explorador").forEach((enemigo) => {
    if (enemigo.dataset.movimientoPreparado === "true") return;

    enemigo.dataset.movimientoPreparado = "true";

    // Velocidad y dirección propias para cada enemigo.
    enemigo.dataset.velocidadX =
      (Math.random() * 2 + 1.5) * (Math.random() < 0.5 ? -1 : 1);

    enemigo.dataset.velocidadY =
      (Math.random() * 1.2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
  });
}

function comprobarContactoEnemigos() {
  if (
    !mapaMovimiento ||
    !personajeMapa ||
    !pantallaJuegoMovimiento ||
    pantallaJuegoMovimiento.hidden ||
    !document.body.classList.contains("pantalla-aventura-activa")
  ) {
    return;
  }

  const pantallaCombate = document.getElementById("pantalla-combate");

  // No iniciar otro combate mientras uno esté abierto.
  if (pantallaCombate && !pantallaCombate.hidden) {
    combateContactoActivo = true;
    return;
  }

  // Permitir un nuevo encuentro cuando se cierre el combate anterior.
  combateContactoActivo = false;

  const rectPersonaje = personajeMapa.getBoundingClientRect();

  for (const enemigo of mapaMovimiento.querySelectorAll(".enemigo-explorador")) {
    if (enemigo.classList.contains("enemigo-derrotado")) continue;

    const rectEnemigo = enemigo.getBoundingClientRect();

    const hayContacto =
      rectPersonaje.left < rectEnemigo.right &&
      rectPersonaje.right > rectEnemigo.left &&
      rectPersonaje.top < rectEnemigo.bottom &&
      rectPersonaje.bottom > rectEnemigo.top;

    if (hayContacto) {
      const idEnemigo = enemigo.dataset.enemigoId;

      if (
        idEnemigo &&
        typeof window.iniciarCombatePorContacto === "function"
      ) {
        combateContactoActivo = true;
        window.iniciarCombatePorContacto(idEnemigo);
      }

      break;
    }
  }
}

function animarEnemigos(tiempoActual) {
  requestAnimationFrame(animarEnemigos);

  if (!mapaMovimiento) return;

  // Evitar saltos grandes después de cambiar de pestaña.
  const delta = ultimoTiempoEnemigos
    ? Math.min((tiempoActual - ultimoTiempoEnemigos) / 1000, 0.05)
    : 0;

  ultimoTiempoEnemigos = tiempoActual;

  const pantallaCombate = document.getElementById("pantalla-combate");

  if (
    !pantallaJuegoMovimiento ||
    pantallaJuegoMovimiento.hidden ||
    !document.body.classList.contains("pantalla-aventura-activa") ||
    (pantallaCombate && !pantallaCombate.hidden)
  ) {
    return;
  }

  prepararMovimientoEnemigos();

  const anchoMapa = mapaMovimiento.clientWidth;
  const altoMapa = mapaMovimiento.clientHeight;

  if (!anchoMapa || !altoMapa) return;

  mapaMovimiento.querySelectorAll(".enemigo-explorador").forEach((enemigo) => {
    if (enemigo.classList.contains("enemigo-derrotado")) return;

    let x = parseFloat(enemigo.style.left);
    let y = parseFloat(enemigo.style.top);

    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    let velocidadX = Number(enemigo.dataset.velocidadX) || 0;
    let velocidadY = Number(enemigo.dataset.velocidadY) || 0;

    // Desplazamiento suave por el mapa.
    x += (velocidadX * delta * 100) / anchoMapa;
    y += (velocidadY * delta * 100) / altoMapa;

    // Cambiar de dirección al llegar a los bordes.
    if (x < 5 || x > 92) {
      velocidadX *= -1;
      x = limitar(x, 5, 92);
    }

    if (y < 8 || y > 88) {
      velocidadY *= -1;
      y = limitar(y, 8, 88);
    }

    enemigo.style.left = `${x}%`;
    enemigo.style.top = `${y}%`;

    enemigo.dataset.velocidadX = velocidadX;
    enemigo.dataset.velocidadY = velocidadY;
  });

  comprobarContactoEnemigos();
}

// Comenzar la animación continua.
requestAnimationFrame(animarEnemigos);

// Comprobar también el contacto después de mover al personaje.
document.addEventListener("keyup", comprobarContactoEnemigos);

window.addEventListener("resize", () => {
  prepararMovimientoEnemigos();
});

/* ==========================================
   INTERACCIÓN DEL PERSONAJE CON LAS PUERTAS
   HACIA EL LÍMITE
========================================== */

let ultimaPuertaActivada = null;
let tiempoUltimaPuerta = 0;

function comprobarContactoPuertas() {
  if (
    !mapaMovimiento ||
    !personajeMapa ||
    !pantallaJuegoMovimiento ||
    pantallaJuegoMovimiento.hidden ||
    !document.body.classList.contains("pantalla-aventura-activa")
  ) {
    return;
  }

  const pantallaCombate = document.getElementById("pantalla-combate");

  // No activar puertas mientras se está combatiendo.
  if (pantallaCombate && !pantallaCombate.hidden) return;

  const rectPersonaje = personajeMapa.getBoundingClientRect();
  const puertas = mapaMovimiento.querySelectorAll(".nivel-mundo[data-nivel]");

  for (const puerta of puertas) {
    const rectPuerta = puerta.getBoundingClientRect();

    const hayContacto =
      rectPersonaje.left < rectPuerta.right &&
      rectPersonaje.right > rectPuerta.left &&
      rectPersonaje.top < rectPuerta.bottom &&
      rectPersonaje.bottom > rectPuerta.top;

    
if (!hayContacto) continue;

// Consultar el progreso real del juego
const progreso =
  typeof window.obtenerProgresoAventura === "function"
    ? window.obtenerProgresoAventura()
    : null;

const numeroNivel = Number(puerta.dataset.nivel);

// Si ya venciste al guardián de este nivel,
// no volver a activar su puerta por contacto.
if (progreso?.nivelesCompletados?.includes(numeroNivel)) {
  ultimaPuertaActivada = null;
  continue;
}

const ahora = Date.now();

    // Evita que el mismo contacto active la puerta repetidamente.
    if (
      ultimaPuertaActivada === puerta &&
      ahora - tiempoUltimaPuerta < 1500
    ) {
      return;
    }

    ultimaPuertaActivada = puerta;
    tiempoUltimaPuerta = ahora;

    // Usar el clic existente para conservar costos y desbloqueos.
    puerta.click();

    return;
  }

  // Al alejarse, queda habilitado el siguiente contacto.
  ultimaPuertaActivada = null;
}

// Comprobar el contacto después de cada movimiento del personaje.
const comprobarPuertasTrasMovimiento = comprobarContactoPuertas;

document.addEventListener("keyup", comprobarPuertasTrasMovimiento);
