
const pantallaSeleccion = document.getElementById("seleccion-aventura");
const pantallaJuego = document.getElementById("pantalla-juego");
const resumenEleccion = document.getElementById("resumen-eleccion");

let campanaElegida = "fantasia";
let personajeElegido = "maga";

const pantallaHistoria = document.getElementById("pantalla-historia");

const historiasPersonajes = {
  maga: {
    titulo: "El secreto de los límites",
    nombre: "La Maga del Conocimiento",
    emoji: "🧙",
    texto: `Hace mil años, los sabios del Reino Infinito descubrieron
una fuerza capaz de revelar lo que parecía imposible de alcanzar.
La llamaron el Poder del Límite.

Una noche, una sombra destruyó el Gran Archivo y dispersó sus
conocimientos por doce santuarios. Desde entonces, la magia
comenzó a desaparecer y el reino quedó atrapado en el caos.

Una joven maga encuentra un antiguo libro que solo puede leerse
resolviendo enigmas matemáticos. En sus páginas descubre una
profecía: únicamente quien comprenda los límites podrá restaurar
el equilibrio.

Tu misión es recuperar los doce fragmentos del conocimiento
y descubrir quién destruyó el Gran Archivo.`
  },

  caballero: {
    titulo: "La última defensa del reino",
    nombre: "El Caballero Estratega",
    emoji: "🛡️",
    texto: `El Reino Infinito está a punto de caer. Las murallas se
agrietan, los puentes se derrumban y las rutas que abastecen
a las fortalezas han sido destruidas.

El caballero recibe una misión del rey: recorrer los doce
santuarios que protegían el reino. En cada uno encontrará
mecanismos antiguos que solo responden a quien comprende
sus patrones y las leyes que los gobiernan.

Su espada puede derrotar monstruos, pero no puede resolver
los enigmas que protegen las fortalezas. Para salvar a su
pueblo, deberá aprender a pensar como un verdadero estratega.

Tu misión es restaurar las defensas del reino y descubrir
qué fuerza está destruyendo sus antiguas estructuras.`
  },

  exploradora: {
    titulo: "El mapa de lo imposible",
    nombre: "La Exploradora",
    emoji: "🧭",
    texto: `Una exploradora descubre un mapa que cambia cada vez que
alguien intenta seguirlo. Los caminos aparecen y desaparecen,
los ríos se interrumpen y las montañas esconden lugares
que no deberían existir.

Al investigar su origen, encuentra doce marcas que señalan
antiguos santuarios. Cada marca contiene una pista matemática
capaz de revelar los secretos de aquel mundo.

Armada con su brújula y su ingenio, decide seguir el mapa.
Pronto descubre que no está explorando un reino cualquiera:
está recorriendo los límites de una realidad que alguien
intenta borrar.

Tu misión es descifrar el mapa, encontrar los doce santuarios
y descubrir qué existe más allá del último camino.`
  }
};

function mostrarHistoriaPersonaje() {
  const historia = historiasPersonajes[personajeElegido];
  if (!historia) return;

  document.getElementById("historia-titulo").textContent = historia.titulo;
  document.getElementById("historia-nombre-personaje").textContent = historia.nombre;
  document.getElementById("historia-texto").textContent = historia.texto;

  const retratos = {
    maga: {
      archivo: "img/maga.png",
      nombre: "Maga del Conocimiento"
    },
    caballero: {
      archivo: "img/caballero.png",
      nombre: "Caballero Estratega"
    },
    exploradora: {
      archivo: "img/exploradora.png",
      nombre: "Exploradora"
    }
  };

  const retrato = retratos[personajeElegido] || retratos.maga;
  const contenedor = document.getElementById("historia-personaje");

  contenedor.replaceChildren();

  const imagen = document.createElement("img");
  imagen.src = retrato.archivo;
  imagen.alt = retrato.nombre;

  contenedor.appendChild(imagen);
}


function actualizarEleccion() {
  const nombres = {
    maga: "Maga del Conocimiento",
    caballero: "Caballero Estratega",
    exploradora: "Exploradora"
  };

  resumenEleccion.textContent =
    `Campaña: Reino Infinito · Personaje: ${
      nombres[personajeElegido] || "Maga del Conocimiento"
    }`;
}



document.querySelectorAll(".tarjeta-campana").forEach((tarjeta) => {
  tarjeta.addEventListener("click", () => {
    campanaElegida = tarjeta.dataset.campana;

    document.querySelectorAll(".tarjeta-campana").forEach((otra) => {
      otra.classList.toggle("seleccionada", otra === tarjeta);
    });

    actualizarEleccion();
  });
});

document.querySelectorAll(".tarjeta-personaje").forEach((tarjeta) => {
  tarjeta.addEventListener("click", () => {
    personajeElegido = tarjeta.dataset.personaje;

    document.querySelectorAll(".tarjeta-personaje").forEach((otro) => {
      otro.classList.toggle("seleccionada", otro === tarjeta);
    });

    actualizarEleccion();
  });
});


document.getElementById("btn-iniciar-aventura").addEventListener("click", () => {
  const partida = {
    campana: campanaElegida,
    personaje: personajeElegido
  };

  try {
    localStorage.setItem("haciaLimitePartida", JSON.stringify(partida));
  } catch (error) {
    console.warn("No se pudo guardar la partida.", error);
  }

  actualizarEleccion();
  mostrarHistoriaPersonaje();

  pantallaSeleccion.hidden = true;
  pantallaHistoria.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("btn-volver-personajes").addEventListener("click", () => {
  pantallaHistoria.hidden = true;
  pantallaSeleccion.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("btn-comenzar-aventura").addEventListener("click", () => {
  pantallaHistoria.hidden = true;
  pantallaJuego.hidden = false;

  document.body.classList.add("pantalla-aventura-activa");

  const partida = {
    campana: campanaElegida,
    personaje: personajeElegido
  };

  window.dispatchEvent(
    new CustomEvent("aventuraIniciada", { detail: partida })
  );

  window.scrollTo({ top: 0, behavior: "smooth" });
});


actualizarEleccion();

document.getElementById("btn-volver-seleccion").addEventListener("click", () => {
  pantallaJuego.hidden = true;
  pantallaSeleccion.hidden = false;

  document.body.classList.remove("pantalla-aventura-activa");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
