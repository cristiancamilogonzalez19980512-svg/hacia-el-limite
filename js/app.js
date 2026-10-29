// ============================================
// HACIA EL LÍMITE - SISTEMA DE COMBATE Y PROGRESO
// No modifica el mapa ni el movimiento del personaje.
// ============================================

(() => {
  "use strict";

  const CLAVE_PROGRESO = "haciaLimiteProgreso";
  const CLAVE_PARTIDA = "haciaLimitePartida";
  const VIDAS_INICIALES = 3;

  const niveles = [
    {
      nombre: "El comienzo",
      enemigo: "👹 Guardián del Bosque",
      costo: 50,
      preguntas: [
        {
          texto: "Calcula el límite: lim (x + 2), cuando x → 3",
          opciones: ["4", "5", "6"],
          correcta: 1,
          pista: "Sustituye x por 3 y suma 2."
        },
        {
          texto: "Calcula el límite: lim (2x + 1), cuando x → 2",
          opciones: ["3", "5", "7"],
          correcta: 1,
          pista: "Reemplaza x por 2 en la expresión."
        },
        {
          texto: "Calcula el límite: lim (x² + 3), cuando x → 1",
          opciones: ["3", "4", "5"],
          correcta: 1,
          pista: "Primero calcula 1² y después suma 3."
        }
      ]
    },
    {
      nombre: "Puente antiguo",
      enemigo: "🧌 Troll de la Sustitución",
      costo: 60,
      preguntas: [
        {
          texto: "Calcula lim (x² + 2x), cuando x → 2",
          opciones: ["6", "8", "10"],
          correcta: 1,
          pista: "Sustituye x por 2: 2² + 2(2)."
        },
        {
          texto: "Calcula lim (3x + 4), cuando x → -1",
          opciones: ["-1", "1", "3"],
          correcta: 1,
          pista: "Calcula 3(-1) + 4."
        },
        {
          texto: "Calcula lim (x² - 1), cuando x → 3",
          opciones: ["6", "8", "10"],
          correcta: 1,
          pista: "Calcula 3² - 1."
        }
      ]
    },
    {
      nombre: "Lobo algebraico",
      enemigo: "🐺 Lobo de las Indeterminaciones",
      costo: 70,
      preguntas: [
        {
          texto: "Calcula lim (x² - 4)/(x - 2), cuando x → 2",
          opciones: ["2", "4", "6"],
          correcta: 1,
          pista: "Factoriza x² - 4 como (x - 2)(x + 2)."
        },
        {
          texto: "Calcula lim (x² - 9)/(x - 3), cuando x → 3",
          opciones: ["3", "6", "9"],
          correcta: 1,
          pista: "Factoriza la diferencia de cuadrados."
        },
        {
          texto: "Calcula lim (x² - 1)/(x - 1), cuando x → 1",
          opciones: ["1", "2", "3"],
          correcta: 1,
          pista: "x² - 1 se factoriza como (x - 1)(x + 1)."
        }
      ]
    },
    {
      nombre: "Torre del sabio",
      enemigo: "🧙 Sabio de los Límites Laterales",
      costo: 80,
      preguntas: [
        {
          texto: "Si el límite por la izquierda vale -2 y por la derecha vale 3, ¿existe el límite?",
          opciones: [
            "Sí, vale 0",
            "No, los laterales son distintos",
            "Sí, vale 3"
          ],
          correcta: 1,
          pista: "El límite bilateral existe si ambos límites laterales coinciden."
        },
        {
          texto: "Calcula lim (x + 1), cuando x → 2 por la izquierda",
          opciones: ["2", "3", "4"],
          correcta: 1,
          pista: "La función es continua: sustituye x por 2."
        },
        {
          texto: "Calcula lim (2x - 1), cuando x → 1 por la derecha",
          opciones: ["0", "1", "2"],
          correcta: 1,
          pista: "Sustituye x por 1."
        }
      ]
    },
    {
      nombre: "Ruta secreta",
      enemigo: "🦇 Murciélago del Infinito",
      costo: 90,
      preguntas: [
        {
          texto: "Calcula lim (3x + 1)/x, cuando x → ∞",
          opciones: ["0", "1", "3"],
          correcta: 2,
          pista: "Divide cada término entre x: queda 3 + 1/x."
        },
        {
          texto: "Calcula lim (2x² + 1)/(x² - 4), cuando x → ∞",
          opciones: ["1", "2", "4"],
          correcta: 1,
          pista: "En polinomios del mismo grado, divide los coeficientes principales."
        },
        {
          texto: "Calcula lim 5/x, cuando x → ∞",
          opciones: ["0", "1", "5"],
          correcta: 0,
          pista: "Una constante dividida entre una cantidad que crece sin límite tiende a cero."
        }
      ]
    },
    {
      nombre: "Mina infinita",
      enemigo: "💎 Gólem de la Factorización",
      costo: 100,
      preguntas: [
        {
          texto: "Calcula lim (x² - 16)/(x - 4), cuando x → 4",
          opciones: ["4", "8", "16"],
          correcta: 1,
          pista: "Factoriza x² - 16 como (x - 4)(x + 4)."
        },
        {
          texto: "Calcula lim (x² - 25)/(x - 5), cuando x → 5",
          opciones: ["5", "10", "25"],
          correcta: 1,
          pista: "Cancela el factor común después de factorizar."
        },
        {
          texto: "Calcula lim (x² - 1)/(x + 1), cuando x → -1",
          opciones: ["-2", "0", "2"],
          correcta: 0,
          pista: "Factoriza x² - 1 como (x - 1)(x + 1)."
        }
      ]
    },
    {
      nombre: "Cueva profunda",
      enemigo: "🕷️ Araña de la Continuidad",
      costo: 110,
      preguntas: [
        {
          texto: "Si f(x) = x² para x ≤ 2 y f(x) = 3x - 2 para x > 2, ¿es continua en x = 2?",
          opciones: [
            "Sí, ambos lados valen 4",
            "No, los lados son distintos",
            "No, porque x = 2"
          ],
          correcta: 0,
          pista: "Calcula el valor por la izquierda y el límite por la derecha."
        },
        {
          texto: "Si el límite por la izquierda en x = 1 vale 2 y por la derecha vale 5, ¿es continua allí?",
          opciones: ["Sí", "No", "Solo si f(1) = 2"],
          correcta: 1,
          pista: "Si los límites laterales son diferentes, hay discontinuidad."
        },
        {
          texto: "Si f(x) = (x² - 1)/(x - 1) para x ≠ 1 y f(1) = 2, ¿es continua en x = 1?",
          opciones: ["Sí", "No", "No se puede saber"],
          correcta: 0,
          pista: "Para x distinto de 1, simplifica la fracción a x + 1."
        }
      ]
    },
    {
      nombre: "Dragón del límite",
      enemigo: "🐉 Dragón de las Indeterminaciones",
      costo: 120,
      preguntas: [
        {
          texto: "Calcula lim (x² - 5x + 6)/(x - 2), cuando x → 2",
          opciones: ["-1", "1", "2"],
          correcta: 0,
          pista: "Factoriza el numerador como (x - 2)(x - 3), simplifica y evalúa."
        },
        {
          texto: "Calcula lim (3x² - 12)/(x - 2), cuando x → 2",
          opciones: ["6", "12", "18"],
          correcta: 1,
          pista: "Saca factor común 3 y aplica diferencia de cuadrados."
        },
        {
          texto: "Calcula lim (√(x + 5) - 3)/(x - 4), cuando x → 4",
          opciones: ["1/6", "1/3", "1/9"],
          correcta: 0,
          pista: "Racionaliza multiplicando por el conjugado."
        }
      ]
    },
    {
      nombre: "Cruce misterioso",
      enemigo: "🧟 Espectro de las Funciones",
      costo: 130,
      preguntas: [
        {
          texto: "Calcula la derivada de f(x) = x²",
          opciones: ["x", "2x", "2"],
          correcta: 1,
          pista: "Aplica la regla de la potencia: deriva el exponente y réstale uno."
        },
        {
          texto: "Calcula la derivada de f(x) = 3x + 4",
          opciones: ["3", "4", "3x"],
          correcta: 0,
          pista: "La derivada de ax + b es a."
        },
        {
          texto: "Calcula la derivada de f(x) = x³",
          opciones: ["x²", "2x", "3x²"],
          correcta: 2,
          pista: "Aplica la regla de la potencia."
        }
      ]
    },
    {
      nombre: "Arena matemática",
      enemigo: "⚔️ Gladiador de las Derivadas",
      costo: 140,
      preguntas: [
        {
          texto: "¿Cuál es la derivada de f(x) = x² + 3x?",
          opciones: ["2x + 3", "x + 3", "2x"],
          correcta: 0,
          pista: "Deriva cada término por separado."
        },
        {
          texto: "¿Cuál es la derivada de f(x) = 5x³?",
          opciones: ["5x²", "15x²", "15x³"],
          correcta: 1,
          pista: "Multiplica el coeficiente por el exponente."
        },
        {
          texto: "¿Cuál es la derivada de f(x) = x² - 4x + 1?",
          opciones: ["2x - 4", "2x + 4", "x - 4"],
          correcta: 0,
          pista: "La derivada de una constante es cero."
        }
      ]
    },
    {
      nombre: "Laberinto lógico",
      enemigo: "🧩 Minotauro del Cálculo",
      costo: 150,
      preguntas: [
        {
          texto: "Si f(x) = x², ¿cuánto vale f'(2)?",
          opciones: ["2", "4", "8"],
          correcta: 1,
          pista: "La derivada es 2x; evalúa en x = 2."
        },
        {
          texto: "Si f(x) = x³, ¿cuánto vale f'(2)?",
          opciones: ["6", "8", "12"],
          correcta: 2,
          pista: "La derivada es 3x²."
        },
        {
          texto: "Si f(x) = x² + 2x, ¿cuánto vale f'(1)?",
          opciones: ["2", "3", "4"],
          correcta: 2,
          pista: "Primero deriva: f'(x) = 2x + 2."
        }
      ]
    },
    {
      nombre: "El gran guardián",
      enemigo: "👑 Guardián Supremo del Cálculo",
      costo: 160,
      preguntas: [
        {
          texto: "Calcula lim (x² - 4)/(x - 2), cuando x → 2",
          opciones: ["2", "4", "6"],
          correcta: 1,
          pista: "Factoriza x² - 4 como (x - 2)(x + 2)."
        },
        {
          texto: "Si f(x) = x², ¿cuánto vale f'(4)?",
          opciones: ["4", "8", "16"],
          correcta: 1,
          pista: "La derivada es 2x."
        },
        {
          texto: "Calcula lim (5x² + 1)/(x² + 3), cuando x → ∞",
          opciones: ["3", "5", "∞"],
          correcta: 1,
          pista: "Como los grados son iguales, divide los coeficientes principales."
        }
      ]
    }
  ];

  // Preguntas por zona: se sortean 3 distintas al iniciar cada combate.
  const bancosPreguntas = {
    facil: [
      { texto: "Calcula lim (x + 4), cuando x → 2.", opciones: ["5", "6", "8"], correcta: 1, pista: "Sustituye x por 2 y suma 4." },
      { texto: "Calcula lim (2x + 3), cuando x → 1.", opciones: ["5", "3", "4"], correcta: 0, pista: "Reemplaza x por 1: 2(1) + 3." },
      { texto: "Calcula lim (x² + 1), cuando x → 3.", opciones: ["7", "9", "10"], correcta: 2, pista: "Calcula 3² + 1." },
      { texto: "Calcula lim (3x - 2), cuando x → 2.", opciones: ["2", "4", "6"], correcta: 1, pista: "Sustituye x por 2." },
      { texto: "Calcula lim 7, cuando x → 5.", opciones: ["0", "5", "7"], correcta: 2, pista: "El límite de una constante es la misma constante." },
      { texto: "Calcula lim (x² - 2), cuando x → 2.", opciones: ["2", "4", "6"], correcta: 0, pista: "Calcula 2² - 2." },
      { texto: "Si f(x) = 2x + 1, ¿cuánto vale f(4)?", opciones: ["8", "9", "10"], correcta: 1, pista: "Reemplaza x por 4." },
      { texto: "Calcula lim (x + 5), cuando x → -1.", opciones: ["4", "5", "-4"], correcta: 0, pista: "Sustituye x por -1." },
      { texto: "Calcula lim (4x), cuando x → 3.", opciones: ["7", "12", "16"], correcta: 1, pista: "Multiplica 4 por 3." },
      { texto: "Calcula lim (x²), cuando x → -2.", opciones: ["-4", "2", "4"], correcta: 2, pista: "Elevar -2 al cuadrado da 4." },
      { texto: "¿Cuál es la pendiente de la recta y = 3x + 2?", opciones: ["2", "3", "5"], correcta: 1, pista: "En y = mx + b, la pendiente es el coeficiente m de x." },
      { texto: "Si f(x) = x² + 1, ¿cuánto vale f(2)?", opciones: ["4", "5", "6"], correcta: 1, pista: "Sustituye x por 2: 2² + 1 = 5." },
      { texto: "¿Cuál es el límite de una función constante f(x) = -3?", opciones: ["0", "3", "-3"], correcta: 2, pista: "El límite de una función constante es la propia constante." }
    ],
    intermedio: [
      { texto: "Calcula lim (x² - 9)/(x - 3), cuando x → 3.", opciones: ["3", "6", "9"], correcta: 1, pista: "Factoriza x² - 9 = (x - 3)(x + 3)." },
      { texto: "Calcula lim (x² - 16)/(x - 4), cuando x → 4.", opciones: ["4", "8", "16"], correcta: 1, pista: "Factoriza y simplifica; queda x + 4." },
      { texto: "Calcula lim (x² - 4)/(x + 2), cuando x → -2.", opciones: ["-4", "0", "4"], correcta: 0, pista: "Factoriza la diferencia de cuadrados y simplifica." },
      { texto: "Si los límites laterales valen 2 y 5, ¿existe el límite bilateral?", opciones: ["Sí, vale 3.5", "Sí, vale 5", "No"], correcta: 2, pista: "Los límites laterales deben coincidir." },
      { texto: "Calcula lim (2x² + 1)/(x² + 3), cuando x → ∞.", opciones: ["1", "2", "∞"], correcta: 1, pista: "Los grados son iguales: divide coeficientes principales." },
      { texto: "Calcula lim 6/x, cuando x → ∞.", opciones: ["0", "1", "6"], correcta: 0, pista: "Una constante entre una cantidad que crece sin límite tiende a cero." },
      { texto: "¿Es continua f(x) = x² en x = 2?", opciones: ["Sí", "No", "Solo si x = 0"], correcta: 0, pista: "Los polinomios son continuos en todos los reales." },
      { texto: "Calcula lim (x² - 1)/(x - 1), cuando x → 1.", opciones: ["1", "2", "0"], correcta: 1, pista: "Factoriza y simplifica a x + 1." },
      { texto: "Calcula lim (3x² - 12)/(x - 2), cuando x → 2.", opciones: ["6", "12", "3"], correcta: 1, pista: "Factoriza 3(x² - 4) y simplifica." },
      { texto: "Calcula lim (5x² + 1)/(x² - 4), cuando x → ∞.", opciones: ["1", "5", "∞"], correcta: 1, pista: "Compara los coeficientes principales." },
      { texto: "Si f(x)=x² para x<1 y f(x)=3 para x≥1, ¿es continua en x=1?", opciones: ["Sí, ambos lados valen 1", "No, el límite izquierdo es 1 y el derecho es 3", "Sí, porque está definida"], correcta: 1, pista: "Compara el límite por la izquierda (1) con el valor/límite por la derecha (3)." },
      { texto: "¿Cuál es la derivada de f(x)=4x²?", opciones: ["4x", "8x", "8x²"], correcta: 1, pista: "Multiplica 4 por el exponente 2 y reduce el exponente a 1." },
      { texto: "¿Cuál es la pendiente de la tangente a f(x)=x² en x=3?", opciones: ["3", "6", "9"], correcta: 1, pista: "La derivada es f'(x)=2x; evalúa en x=3." }
    ],
    dificil: [
      { texto: "Calcula la derivada de f(x) = 3x² - 4x + 7.", opciones: ["6x - 4", "3x - 4", "6x + 7"], correcta: 0, pista: "Deriva término a término; la constante deriva a cero." },
      { texto: "Si f(x) = x³ - 2x, ¿cuánto vale f'(2)?", opciones: ["8", "10", "12"], correcta: 1, pista: "f'(x) = 3x² - 2; evalúa en x = 2." },
      { texto: "¿Cuál es la derivada de f(x) = (x + 1)(x²)?", opciones: ["3x² + 2x", "x² + 2x", "3x + 2"], correcta: 0, pista: "Expande: f(x) = x³ + x² y deriva." },
      { texto: "Calcula lim (√(x + 5) - 3)/(x - 4), cuando x → 4.", opciones: ["1/6", "1/3", "1/9"], correcta: 0, pista: "Multiplica por el conjugado para racionalizar." },
      { texto: "Calcula lim (x² - 5x + 6)/(x - 2), cuando x → 2.", opciones: ["-1", "1", "2"], correcta: 0, pista: "Factoriza como (x - 2)(x - 3); queda x - 3." },
      { texto: "Calcula lim (4x³ - x)/(2x³ + 7), cuando x → ∞.", opciones: ["2", "4", "0"], correcta: 0, pista: "Divide los coeficientes de los términos de mayor grado." },
      { texto: "¿Cuál es la derivada de f(x) = 2x⁴ + 3x²?", opciones: ["8x³ + 6x", "8x⁴ + 6x²", "2x³ + 3x"], correcta: 0, pista: "Aplica la regla de la potencia a cada término." },
      { texto: "Si f(x) = (x² + 1)³, ¿cuál es f'(x)?", opciones: ["3(x² + 1)²", "6x(x² + 1)²", "6x(x² + 1)³"], correcta: 1, pista: "Usa la regla de la cadena." },
      { texto: "Calcula lim (x² - 4x + 4)/(x - 2), cuando x → 2.", opciones: ["0", "2", "4"], correcta: 0, pista: "El numerador es (x - 2)²; simplifica y evalúa." },
      { texto: "¿Cuál es la derivada de f(x) = 5/x?", opciones: ["5/x²", "-5/x²", "-5/x"], correcta: 1, pista: "Escribe 5x⁻¹ y aplica la regla de la potencia." },
      { texto: "Calcula lim (√(x + 1) - 2)/(x - 3), cuando x → 3.", opciones: ["1/4", "1/2", "1/3"], correcta: 0, pista: "Racionaliza; queda 1/(√(x + 1) + 2)." },
      { texto: "¿Cuál es la derivada de f(x) = (3x - 1)²?", opciones: ["6(3x - 1)", "2(3x - 1)", "6x - 1"], correcta: 0, pista: "Aplica la regla de la cadena." },
      { texto: "Calcula lim (2x² - 3x + 1)/(x² + 4), cuando x → ∞.", opciones: ["0", "1", "2"], correcta: 2, pista: "Divide numerador y denominador entre x²." },
      { texto: "Si f(x) = x³ + 2x² - x, ¿cuánto vale f'(1)?", opciones: ["4", "6", "8"], correcta: 1, pista: "f'(x) = 3x² + 4x - 1; sustituye x = 1." },
      { texto: "Para f(x)=x²-4, ¿en qué punto la tangente tiene pendiente 4?", opciones: ["x=1", "x=2", "x=4"], correcta: 1, pista: "f'(x)=2x. Resuelve 2x=4, así que x=2." },
      { texto: "¿Es continua f(x)=(x²-1)/(x-1) en x=1 si f(1)=5?", opciones: ["Sí, porque se simplifica", "No, el límite vale 2 y f(1)=5", "Sí, ambos valen 5"], correcta: 1, pista: "Para x≠1 la expresión es x+1, cuyo límite en 1 vale 2; no coincide con f(1)=5." }
    ]
  };

  function mezclarPreguntas(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function seleccionarPreguntas(numeroNivel, tipo = "guardian") {
    const dificultad = numeroNivel <= 4 ? "facil" : numeroNivel <= 8 ? "intermedio" : "dificil";
    const banco = bancosPreguntas[dificultad];

    // Los guardianes usan exclusivamente el banco propio de su nivel.
    // Así, cada puerta introduce retos distintos y la dificultad progresa
    // del bosque (sustitución) a las cuevas (factorización/límites) y la
    // fortaleza (derivadas, continuidad y problemas combinados).
    if (tipo !== "explorador") {
      if (numeroNivel === 12) {
        const finalBoss = [
          { texto: "Calcula lim (x²-4)/(x-2), cuando x→2.", opciones: ["2", "4", "6"], correcta: 1, pista: "Factoriza x²-4=(x-2)(x+2) y simplifica.", tema: "Límites", explicacion: "Factoriza la diferencia de cuadrados: (x−2)(x+2). Para x distinto de 2 se cancela x−2 y queda x+2. Al sustituir x=2, el límite es 4." },
          { texto: "Si f(x)=x² para x<1 y f(x)=3 para x≥1, ¿es continua en x=1?", opciones: ["Sí", "No, los límites laterales difieren", "Solo si f(1)=1"], correcta: 1, pista: "Por la izquierda se aproxima a 1 y por la derecha a 3.", tema: "Continuidad", explicacion: "Para ser continua, los límites laterales deben coincidir y además ser iguales a f(1). Aquí el límite izquierdo es 1 y el derecho es 3; como son distintos, hay discontinuidad." },
          { texto: "Si f(x)=x³−2x, ¿cuánto vale f'(2)?", opciones: ["8", "10", "12"], correcta: 1, pista: "Deriva: f'(x)=3x²−2 y evalúa en 2.", tema: "Derivadas", explicacion: "Con la regla de la potencia, f'(x)=3x²−2. Entonces f'(2)=3(4)−2=10." },
          { texto: "¿Cuál es la pendiente de la tangente a f(x)=x² en x=3?", opciones: ["3", "6", "9"], correcta: 1, pista: "La derivada es 2x; evalúa en 3.", tema: "Pendiente y derivadas", explicacion: "La derivada representa la pendiente de la recta tangente. Para f(x)=x², f'(x)=2x; en x=3 la pendiente es 6." },
          { texto: "Calcula lim (√(x+1)−2)/(x−3), cuando x→3.", opciones: ["1/4", "1/2", "1/3"], correcta: 0, pista: "Multiplica por el conjugado para eliminar la indeterminación.", tema: "Límites indeterminados", explicacion: "Multiplica por √(x+1)+2. Se cancela x−3 y queda 1/(√(x+1)+2); al evaluar x=3 resulta 1/4." }
        ];
        return mezclarPreguntas(finalBoss).map(p => ({ ...p, tema: p.tema || clasificarTema(p), explicacion: p.explicacion || crearExplicacion(p) }));
      }
      const propiasDelNivel = niveles[numeroNivel - 1]?.preguntas || [];
      return mezclarPreguntas(propiasDelNivel).map(p => ({ ...p, tema: p.tema || clasificarTema(p), explicacion: p.explicacion || crearExplicacion(p) }));
    }

    // Los exploradores usan otro banco. Se excluyen las preguntas que ya
    // aparecen en los guardianes para evitar repetir el mismo enunciado.
    const textosGuardianes = new Set(niveles.flatMap(n => n.preguntas.map(p => normalizarTextoPregunta(p.texto))));
    const candidatos = banco.filter(p => !textosGuardianes.has(normalizarTextoPregunta(p.texto)));
    const cantidad = 3;
    let seleccion = mezclarPreguntas(candidatos);
    if (seleccion.length < cantidad) seleccion = mezclarPreguntas(banco);
    return seleccion.slice(0, cantidad).map(p => ({ ...p, tema: p.tema || clasificarTema(p), explicacion: p.explicacion || crearExplicacion(p) }));
  }

  function normalizarTextoPregunta(texto) {
    return String(texto || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
  }

  function clasificarTema(pregunta) {
    const t = pregunta.texto.toLowerCase();
    if (t.includes("continua") || t.includes("continuidad") || t.includes("límites laterales") || t.includes("límite por la izquierda")) return "Continuidad";
    if (t.includes("pendiente")) return "Pendiente y derivadas";
    if (t.includes("derivada") || t.includes("f'")) return "Derivadas";
    if (t.includes("∞") || t.includes("infinito")) return "Límites al infinito";
    if (t.includes("/(x") || t.includes("indeterminación") || t.includes("√")) return "Límites indeterminados";
    return "Límites por sustitución";
  }

  function crearExplicacion(pregunta) {
    const respuesta = pregunta.opciones[pregunta.correcta];
    return `${pregunta.pista} Por tanto, la respuesta correcta es: ${respuesta}. Revisa el procedimiento y fíjate en la regla matemática aplicada.`;
  }

  function registrarRespuesta(pregunta, correcta) {
    if (!estado.aprendizaje) estado.aprendizaje = { respondidas: 0, correctas: 0, porTema: {}, historial: [] };
    if (!estado.aprendizaje.porTema) estado.aprendizaje.porTema = {};
    if (!Array.isArray(estado.aprendizaje.historial)) estado.aprendizaje.historial = [];
    const tema = pregunta.tema || clasificarTema(pregunta);
    estado.aprendizaje.respondidas += 1;
    if (correcta) estado.aprendizaje.correctas += 1;
    const registro = estado.aprendizaje.porTema[tema] || { respondidas: 0, correctas: 0 };
    registro.respondidas += 1;
    if (correcta) registro.correctas += 1;
    estado.aprendizaje.porTema[tema] = registro;
    estado.aprendizaje.historial.unshift({
      fecha: new Date().toLocaleString('es-CO'),
      nivel: combateActual?.numero || 0,
      tipo: combateActual?.tipo || 'desafío',
      tema,
      pregunta: pregunta.texto,
      correcta
    });
    estado.aprendizaje.historial = estado.aprendizaje.historial.slice(0, 40);
    guardarProgreso();
  }

  function mostrarPanelAprendizaje() {
    const a = estado.aprendizaje || { respondidas: 0, correctas: 0, porTema: {}, historial: [] };
    if (!a.porTema) a.porTema = {};
    if (!Array.isArray(a.historial)) a.historial = [];
    const porcentaje = a.respondidas ? Math.round(a.correctas / a.respondidas * 100) : 0;
    const temas = Object.entries(a.porTema || {}).sort((x,y) => {
      const px = x[1].respondidas ? x[1].correctas / x[1].respondidas : 0;
      const py = y[1].respondidas ? y[1].correctas / y[1].respondidas : 0;
      return px - py;
    });
    const detalle = temas.length ? temas.map(([tema, r]) => {
      const pct = r.respondidas ? Math.round(r.correctas / r.respondidas * 100) : 0;
      return `<li><strong>${tema}</strong>: ${r.correctas}/${r.respondidas} aciertos (${pct}%). ${pct >= 80 ? "Tema dominado" : "Conviene reforzar este tema"}</li>`;
    }).join("") : "<li>Aún no hay datos. Responde preguntas para construir tu registro.</li>";
    let panel = document.getElementById("panel-aprendizaje");
    if (!panel) {
      panel = document.createElement("div"); panel.id = "panel-aprendizaje"; panel.className = "panel-aprendizaje";
      panel.innerHTML = `<section class="panel-aprendizaje-contenido" role="dialog" aria-modal="true" aria-labelledby="panel-aprendizaje-titulo"><button type="button" id="cerrar-panel-aprendizaje" class="combate-cerrar" aria-label="Cerrar">✕</button><h2 id="panel-aprendizaje-titulo">Mi aprendizaje</h2><div id="panel-aprendizaje-datos"></div><button type="button" id="cerrar-panel-aprendizaje-abajo">Volver al juego</button></section>`;
      document.body.appendChild(panel);
      const cerrar = () => panel.remove();
      panel.querySelector("#cerrar-panel-aprendizaje").addEventListener("click", cerrar);
      panel.querySelector("#cerrar-panel-aprendizaje-abajo").addEventListener("click", cerrar);
    }
    const progresoNiveles = niveles.map((nivel, indice) => {
      const numero = indice + 1;
      const completado = estado.nivelesCompletados.includes(numero);
      const desbloqueado = estado.nivelesDesbloqueados.includes(numero);
      const simbolo = completado ? "✓" : desbloqueado ? "●" : "🔒";
      const estadoNivel = completado ? "Completado" : desbloqueado ? "Disponible" : "Bloqueado";
      return `<li class="trayectoria-nivel"><span>${simbolo}</span><div><strong>Nivel ${numero}: ${nivel.nombre}</strong><small>${estadoNivel}</small></div></li>`;
    }).join("");
    const historial = a.historial.length ? a.historial.slice(0, 10).map(item => `<li class="trayectoria-respuesta"><span class="trayectoria-resultado ${item.correcta ? "es-correcta" : "es-incorrecta"}">${item.correcta ? "✓" : "✕"}</span><div><strong>${item.tema}</strong><small>Nivel ${item.nivel} · ${item.fecha}</small><p>${item.pregunta}</p></div></li>`).join("") : "<li>Aún no hay respuestas registradas. Completa una pregunta y aquí aparecerá tu actividad.</li>";
    panel.querySelector("#panel-aprendizaje-datos").innerHTML = `<div class="aprendizaje-resumen"><article><strong>${a.respondidas}</strong><span>Respuestas registradas</span></article><article><strong>${a.correctas}</strong><span>Aciertos</span></article><article><strong>${porcentaje}%</strong><span>Precisión</span></article></div><h3>Temas por reforzar y dominar</h3><ul>${detalle}</ul><h3>Trayectoria por niveles</h3><ul class="trayectoria-niveles">${progresoNiveles}</ul><h3>Actividad reciente</h3><ul class="trayectoria-historial">${historial}</ul><p class="aprendizaje-consejo">${temas.length ? "Prioriza los temas con menor porcentaje de aciertos y vuelve a practicar sus desafíos. Tu trayectoria se actualiza automáticamente." : "Tu progreso se guardará automáticamente en este navegador a medida que respondas preguntas."}</p>`;
  }

  const estadoInicial = {
    version: 2,
    monedas: 0,
    experiencia: 0,
    vidas: VIDAS_INICIALES,
    nivelesDesbloqueados: [1],
    nivelesCompletados: [],
     nivelesPagados: [],
    recompensasRecibidas: [],
    aprendizaje: { respondidas: 0, correctas: 0, porTema: {} }
  };

  function cargarProgreso() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_PROGRESO));

      if (!guardado || ![1, 2].includes(guardado.version)) {
        return { ...estadoInicial };
      }

      const migrandoEconomia = guardado.version < 2;
      return {
        ...estadoInicial,
        ...guardado,
        version: 2,
        nivelesDesbloqueados: Array.isArray(guardado.nivelesDesbloqueados)
          ? guardado.nivelesDesbloqueados
          : [1],
        nivelesCompletados: Array.isArray(guardado.nivelesCompletados)
          ? guardado.nivelesCompletados
          : [],
        recompensasRecibidas: Array.isArray(guardado.recompensasRecibidas)
          ? guardado.recompensasRecibidas
          : [],
        aprendizaje: guardado.aprendizaje && typeof guardado.aprendizaje === "object"
          ? { respondidas: Number(guardado.aprendizaje.respondidas) || 0, correctas: Number(guardado.aprendizaje.correctas) || 0, porTema: guardado.aprendizaje.porTema || {}, historial: Array.isArray(guardado.aprendizaje.historial) ? guardado.aprendizaje.historial : [] }
          : { respondidas: 0, correctas: 0, porTema: {} },
          // La versión anterior usaba precios más bajos. Se limpian los pagos
          // antiguos para que las puertas pendientes respeten los nuevos costos.
          nivelesPagados: !migrandoEconomia && Array.isArray(guardado.nivelesPagados)
         ? guardado.nivelesPagados
        : [],
      };
    } catch (error) {
      console.warn("No se pudo cargar el progreso guardado.", error);
      return { ...estadoInicial };
    }
  }

  let estado = cargarProgreso();
  let combateActual = null;

  const pantallaJuego = document.getElementById("pantalla-juego");
  const mapaAventura = document.getElementById("mapa-aventura");
  const monedasCabecera = document.getElementById("monedas");
  const nivelCabecera = document.getElementById("nivel");
  const monedasMapa = document.getElementById("monedas-mapa");
  const vidasMapa = document.getElementById("vidas-jugador");
  const experienciaMapa = document.getElementById("experiencia-mapa");
  const mensajeMapa = document.getElementById("mensaje-mapa");

  if (!pantallaJuego || !mapaAventura) {
    console.error("No se encontró el mapa de Hacia el Límite.");
    return;
  }

  // Crear la pantalla de combate sin modificar el HTML del mapa.
  const capaCombate = document.createElement("div");
  capaCombate.id = "pantalla-combate";
  capaCombate.className = "combate-capa";
  capaCombate.hidden = true;
  capaCombate.innerHTML = `
    <section class="combate-panel" role="dialog" aria-modal="true"
      aria-labelledby="combate-titulo">
      <button type="button" class="combate-cerrar" id="combate-cerrar"
        aria-label="Cerrar combate">✕</button>

      <p class="combate-etiqueta">DESAFÍO MATEMÁTICO</p>
      <h2 id="combate-titulo">Combate</h2>

      <div class="combate-enemigo">
        <div id="combate-enemigo-emoji" class="combate-enemigo-emoji">👹</div>
        <strong id="combate-enemigo-nombre">Guardián</strong>
        <p id="combate-vida-enemigo">❤️❤️❤️</p>
      </div>

      <div class="combate-estado">
        <span>❤️ Tus vidas: <strong id="combate-vidas">3</strong></span>
        <span>🪙 Monedas: <strong id="combate-monedas">100</strong></span>
      </div>

      <div class="combate-pregunta">
        <p id="combate-progreso">Pregunta 1 de 3</p>
        <p id="combate-tema" class="combate-tema">Tema: Límites</p>
        <h3 id="combate-pregunta-texto"></h3>
        <div id="combate-opciones" class="combate-opciones"></div>
      </div>

      <p id="combate-mensaje" class="combate-mensaje" aria-live="polite"></p>
      <section id="combate-retroalimentacion" class="combate-retroalimentacion" aria-live="polite" hidden></section>
      <p id="combate-pista" class="combate-pista" hidden></p>

      <div class="combate-acciones">
        <button type="button" id="combate-btn-pista">💡 Usar pista</button>
        <button type="button" id="combate-btn-aprendizaje">📊 Mi aprendizaje</button>
        <button type="button" id="combate-btn-reintentar" hidden>🔄 Reintentar</button>
        <button type="button" id="combate-btn-volver">Volver al mapa</button>
      </div>
    </section>
  `;

  document.body.appendChild(capaCombate);

  const $ = (selector) => capaCombate.querySelector(selector);

  function guardarProgreso() {
    try {
      localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(estado));
    } catch (error) {
      console.warn("No se pudo guardar el progreso.", error);
    }
  }

  function calcularNivelJugador() {
    return Math.floor(estado.experiencia / 100) + 1;
  }

  function actualizarEstadisticas() {
    const nivelJugador = calcularNivelJugador();

    if (monedasCabecera) monedasCabecera.textContent = estado.monedas;
    if (nivelCabecera) nivelCabecera.textContent = nivelJugador;
    if (monedasMapa) monedasMapa.textContent = estado.monedas;
    if (vidasMapa) vidasMapa.textContent = estado.vidas;
    if (experienciaMapa) {
      experienciaMapa.textContent = `${estado.experiencia} XP`;
    }

    $("#combate-monedas").textContent = estado.monedas;
    $("#combate-vidas").textContent = estado.vidas;
  }

  function mostrarMensajeMapa(texto) {
    if (mensajeMapa) mensajeMapa.textContent = texto;
  }

  function nivelDesbloqueado(numero) {
    return estado.nivelesDesbloqueados.includes(numero);
  }

  function nivelCompletado(numero) {
    return estado.nivelesCompletados.includes(numero);
  }
  
function actualizarNiebla() {
  const nieblaCuevas = document.getElementById("niebla-cuevas");
  const nieblaFortaleza = document.getElementById("niebla-fortaleza");

  // Las cuevas se revelan al derrotar al guardián del nivel 4.
  const cuevasDesbloqueadas = nivelCompletado(4);

  // La fortaleza se revela al derrotar al guardián del nivel 8.
  const fortalezaDesbloqueada = nivelCompletado(8);

  if (nieblaCuevas) {
    nieblaCuevas.hidden = cuevasDesbloqueadas;
    nieblaCuevas.style.display = cuevasDesbloqueadas ? "none" : "";
  }

  if (nieblaFortaleza) {
    nieblaFortaleza.hidden = fortalezaDesbloqueada;
    nieblaFortaleza.style.display = fortalezaDesbloqueada ? "none" : "";
  }
}

// Actualizar la niebla al cargar la partida guardada.
actualizarNiebla();


  function actualizarPuertas() {
    document.querySelectorAll(".nivel-mundo[data-nivel]").forEach((puerta) => {
      const numero = Number(puerta.dataset.nivel);
      const desbloqueado = nivelDesbloqueado(numero);
      const completado = nivelCompletado(numero);

      // Se habilitan los botones para poder informar el precio o requisito.
      puerta.disabled = false;
      puerta.classList.toggle("disponible", desbloqueado);
      puerta.classList.toggle("bloqueado", !desbloqueado);
      puerta.classList.toggle("completado", completado);

      // Mostrar siempre el precio en la propia puerta, incluso si está bloqueada.
      let etiquetaCosto = puerta.querySelector(".costo-puerta");
      if (!etiquetaCosto) {
        etiquetaCosto = document.createElement("span");
        etiquetaCosto.className = "costo-puerta";
        puerta.appendChild(etiquetaCosto);
      }
      etiquetaCosto.textContent = `🪙 ${niveles[numero - 1].costo}`;
      etiquetaCosto.setAttribute("aria-label", `Cuesta ${niveles[numero - 1].costo} monedas`);

      if (completado) {
        puerta.title = `Nivel ${numero} completado. Puedes volver a practicar.`;
      } else if (desbloqueado) {
        puerta.title = `Entrar al nivel ${numero}.`;
      } else {
        puerta.title = `Nivel ${numero}. Precio: ${niveles[numero - 1].costo} monedas.`;
      }

      puerta.setAttribute(
        "aria-label",
        completado
          ? `Nivel ${numero}, completado`
          : desbloqueado
            ? `Entrar al nivel ${numero}`
            : `Nivel ${numero}, bloqueado`
      );
    });
  }

  
function renderizarEstadoGeneral() {
  actualizarEstadisticas();
  actualizarPuertas();
  actualizarNiebla();
  guardarProgreso();
}


  function leerPersonaje() {
    try {
      const partida = JSON.parse(localStorage.getItem(CLAVE_PARTIDA));
      return partida?.personaje || "maga";
    } catch {
      return "maga";
    }
  }


function ocultarCombate() {
  // Cerrar la pantalla de batalla.
  capaCombate.hidden = true;
  capaCombate.style.display = "none";
  capaCombate.setAttribute("aria-hidden", "true");

  // Mostrar nuevamente el mapa.
  if (pantallaJuego) pantallaJuego.hidden = false;
  if (mapaAventura) mapaAventura.hidden = false;

  const botonAprendizaje = document.getElementById("boton-aprendizaje-mapa");

  if (
    botonAprendizaje &&
    document.body.classList.contains("pantalla-aventura-activa")
  ) {
    botonAprendizaje.hidden = false;
  }

  // Abandonar el combate actual sin otorgar recompensas.
  combateActual = null;

  // Regresar a la música del mapa.
  window.dispatchEvent(new Event("batallaTerminada"));
}



  
function mostrarCombate() {
  capaCombate.hidden = false;
  capaCombate.style.display = "flex";
  capaCombate.setAttribute("aria-hidden", "false");

  // Detener la música del mapa e iniciar la música de batalla.
  window.dispatchEvent(new Event("batallaIniciada"));

  if (typeof window.reproducirEfectoJuego === "function") {
    window.reproducirEfectoJuego("combate");
  }

  actualizarEstadisticas();
}


  function iniciarCombate(numero, reiniciar = false) {
    const datosNivel = niveles[numero - 1];
    if (!datosNivel) return;

    if (
      !reiniciar &&
      combateActual &&
      combateActual.numero === numero &&
      combateActual.estado === "activo"
    ) {
      mostrarCombate();
      renderizarCombate();
      return;
    }

    estado.vidas = VIDAS_INICIALES;

    const preguntasCombate = seleccionarPreguntas(numero, "guardian");

    combateActual = {
      numero,
      preguntas: preguntasCombate,
      pregunta: 0,
      vidaEnemigo: preguntasCombate.length,
      estado: "activo",
      tipo: "guardian",
      respuestasRegistradas: {},
      preguntaResuelta: false,
      pistaUsada: false,
      escudoUsado: false,
      proteccionExploradoraUsada: false
    };

    renderizarEstadoGeneral();
    mostrarCombate();
    renderizarCombate();
  }

 
function abrirNivel(numero) {
  const datosNivel = niveles[numero - 1];
  if (!datosNivel) return;

  // Si ya venciste al guardián, puedes volver a practicar gratis.
  if (nivelCompletado(numero)) {
    iniciarCombate(numero);
    return;
  }

  // No puedes desafiar un guardián si no venciste al anterior.
  if (numero > 1 && !nivelCompletado(numero - 1)) {
    mostrarMensajeMapa(
      `Primero debes derrotar al guardián del nivel ${numero - 1}.`
    );
    return;
  }

  // Cada puerta se paga como máximo una vez por partida.
  if (!estado.nivelesPagados.includes(numero)) {
    if (estado.monedas < datosNivel.costo) {
      mostrarMensajeMapa(
        `Esta puerta cuesta ${datosNivel.costo} monedas. La experiencia no sirve para pagarla. Tienes ${estado.monedas} monedas; derrota exploradores para conseguir 20 monedas por cada uno.`
      );
      return;
    }

    estado.monedas -= datosNivel.costo;
    estado.nivelesPagados.push(numero);

    mostrarMensajeMapa(
      `Pagaste ${datosNivel.costo} monedas para abrir la puerta. ¡Derrota al guardián para desbloquear la siguiente zona!`
    );
  } else {
    mostrarMensajeMapa(
      `Esta puerta ya fue pagada. Puedes volver a intentar el desafío del nivel ${numero} sin pagar otra vez.`
    );
  }

  renderizarEstadoGeneral();
  iniciarCombate(numero, true);
}


  function renderizarCombate() {
    if (!combateActual) return;

    const numero = combateActual.numero;
    const datosNivel = niveles[numero - 1];
    const personaje = leerPersonaje();

    $("#combate-titulo").textContent =
      `Nivel ${numero}: ${datosNivel.nombre}`;
    
const nombreEnemigo = $("#combate-enemigo-nombre");
const imagenEnemigo = $("#combate-enemigo-emoji");

if (combateActual.tipo === "explorador") {
  nombreEnemigo.textContent = combateActual.nombreEnemigo;

  const imagen = document.createElement("img");
  imagen.src = combateActual.imagenEnemigo;
  imagen.alt = combateActual.nombreEnemigo;
  imagen.draggable = false;

  imagen.onerror = () => {
    imagen.replaceWith(
      document.createTextNode("👾")
    );
  };

  imagenEnemigo.replaceChildren(imagen);
} 
else {
  nombreEnemigo.textContent = datosNivel.enemigo;

  const imagenesGuardianes = {
    orco: "img/orco.png",
    hechicero: "img/hechizero.png",
    dragon: "img/dragon.png"
  };

  const tipoGuardian =
    numero <= 4 ? "orco" :
    numero <= 8 ? "hechicero" : "dragon";

  const imagen = document.createElement("img");
  imagen.src = imagenesGuardianes[tipoGuardian];
  imagen.alt = tipoGuardian;
  imagen.draggable = false;

  imagen.onerror = () => {
    imagen.replaceWith(
      document.createTextNode(datosNivel.enemigo.split(" ")[0])
    );
  };

  imagenEnemigo.replaceChildren(imagen);
}

    $("#combate-vida-enemigo").textContent =
      "❤️".repeat(Math.max(0, combateActual.vidaEnemigo)) ||
      "Sin vida";

    $("#combate-vidas").textContent = estado.vidas;
    $("#combate-monedas").textContent = estado.monedas;

    const opciones = $("#combate-opciones");
    opciones.replaceChildren();
    const retro = $("#combate-retroalimentacion");
    retro.hidden = true;
    retro.replaceChildren();

    $("#combate-pista").hidden = true;
    $("#combate-pista").textContent = "";
    $("#combate-btn-pista").hidden =
      personaje !== "maga" ||
      combateActual.estado !== "activo" ||
      combateActual.pistaUsada;

    $("#combate-btn-reintentar").hidden =
      combateActual.estado !== "derrota";

    if (combateActual.estado === "victoria") {
      $("#combate-progreso").textContent = "¡Enemigo derrotado!";
      $("#combate-pregunta-texto").textContent =
        "Has superado el desafío matemático.";
      $("#combate-mensaje").textContent =
        combateActual.recompensaNueva
          ? `¡Victoria! Ganaste ${combateActual.xpGanada} XP. Los guardianes no entregan monedas.`
          : "¡Victoria! Ya habías recibido la recompensa de este nivel.";
      $("#combate-btn-volver").textContent = "Volver al mapa";
      return;
    }

    if (combateActual.estado === "derrota") {
      $("#combate-progreso").textContent = "Combate perdido";
      $("#combate-pregunta-texto").textContent =
        "Te has quedado sin vidas. Conservas tus monedas.";
      $("#combate-mensaje").textContent =
        "Puedes reintentar el combate o volver al mapa.";
      $("#combate-btn-volver").textContent = "Volver al mapa";
      return;
    }

    const pregunta = combateActual.preguntas[combateActual.pregunta];

    $("#combate-progreso").textContent =
      `Pregunta ${combateActual.pregunta + 1} de ${combateActual.preguntas.length}`;
    $("#combate-pregunta-texto").textContent = pregunta.texto;
    $("#combate-tema").textContent = `Tema: ${pregunta.tema || clasificarTema(pregunta)}`;
    $("#combate-mensaje").textContent = "";

    if (combateActual.preguntaResuelta) {
      const retroTexto = document.createElement("p");
      retroTexto.textContent = combateActual.ultimaCorrecta ? "¡Correcto!" : "Respuesta incorrecta.";
      retro.appendChild(retroTexto);
      const explicacion = document.createElement("p");
      explicacion.textContent = pregunta.explicacion || crearExplicacion(pregunta);
      retro.appendChild(explicacion);
      retro.hidden = false;
      const continuar = document.createElement("button");
      continuar.type = "button"; continuar.className = "combate-continuar";
      continuar.textContent = combateActual.ultimaCorrecta ? "Continuar" : (estado.vidas <= 0 ? "Ver resultado" : "Entendido, continuar");
      continuar.addEventListener("click", avanzarTrasRespuesta);
      opciones.appendChild(continuar);
      return;
    }

    pregunta.opciones.forEach((opcion, indice) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "combate-opcion";
      boton.textContent = opcion;
      boton.addEventListener("click", () => responderPregunta(indice));
      opciones.appendChild(boton);
    });

    $("#combate-btn-volver").textContent = "Volver al mapa";
  }

  function responderPregunta(indiceElegido) {
    if (!combateActual || combateActual.estado !== "activo" || combateActual.preguntaResuelta) return;
    const pregunta = combateActual.preguntas[combateActual.pregunta];
    const personaje = leerPersonaje();
    const correcta = indiceElegido === pregunta.correcta;
    registrarRespuesta(pregunta, correcta);
    combateActual.preguntaResuelta = true;
    if (typeof window.reproducirEfectoJuego === "function") window.reproducirEfectoJuego(correcta ? "golpe" : "error");
    combateActual.ultimaCorrecta = correcta;
    combateActual.respuestasRegistradas[combateActual.pregunta] = correcta;

    if (correcta) {
      combateActual.vidaEnemigo -= 1;
      combateActual.pregunta += 1;
      // La pregunta resuelta se mantiene visible hasta que el estudiante lea la explicación.
      combateActual.pregunta -= 1;
      combateActual.ultimaSiguiente = true;
    } else {
      // Habilidades de personaje: el primer error puede estar protegido.
      if (personaje === "caballero" && !combateActual.escudoUsado) {
        combateActual.escudoUsado = true;
        combateActual.errorProtegido = true;
      } else if (personaje === "exploradora" && !combateActual.proteccionExploradoraUsada) {
        combateActual.proteccionExploradoraUsada = true;
        combateActual.errorProtegido = true;
      } else {
        estado.vidas = Math.max(0, estado.vidas - 1);
        combateActual.errorProtegido = false;
      }
      renderizarEstadoGeneral();
      if (estado.vidas <= 0) combateActual.derrotaPendiente = true;
    }
    guardarProgreso();
    renderizarCombate();
    if (!correcta) {
      $("#combate-mensaje").textContent = combateActual.errorProtegido
        ? "Tu habilidad especial te protege de este error. Lee la explicación y vuelve a intentarlo."
        : `Pierdes una vida. Lee la explicación antes de continuar. Vidas restantes: ${estado.vidas}.`;
    }
  }

  function avanzarTrasRespuesta() {
    if (!combateActual || !combateActual.preguntaResuelta) return;
    if (!combateActual.ultimaCorrecta) {
      if (combateActual.derrotaPendiente || estado.vidas <= 0) {
        combateActual.estado = "derrota";
        combateActual.preguntaResuelta = false;
        renderizarCombate(); guardarProgreso(); return;
      }
      // Un error no avanza de pregunta: se puede volver a intentar con la explicación ya vista.
      combateActual.preguntaResuelta = false;
      combateActual.derrotaPendiente = false;
      combateActual.errorProtegido = false;
      renderizarCombate();
      return;
    }
    const eraUltima = combateActual.pregunta === combateActual.preguntas.length - 1;
    combateActual.preguntaResuelta = false;
    if (eraUltima) { finalizarVictoria(); return; }
    combateActual.pregunta += 1;
    renderizarCombate();
  }

  function finalizarVictoria() {
    const numero = combateActual.numero;
    const yaRecibioRecompensa =
      estado.recompensasRecibidas.includes(numero);

    combateActual.estado = "victoria";
    if (typeof window.reproducirEfectoJuego === "function") window.reproducirEfectoJuego("exito");
    if (combateActual.tipo === "explorador") {
  const recompensaId = `enemigo-${combateActual.idEnemigo}`;

  combateActual.estado = "victoria";

  if (!estado.recompensasRecibidas.includes(recompensaId)) {
    const monedasGanadas = combateActual.recompensaMonedas;

    estado.monedas += monedasGanadas;
    estado.experiencia += 10;
    estado.recompensasRecibidas.push(recompensaId);

    combateActual.recompensaNueva = true;
    combateActual.monedasGanadas = monedasGanadas;
    combateActual.xpGanada = 10;
  } else {
    combateActual.recompensaNueva = false;
    combateActual.monedasGanadas = 0;
    combateActual.xpGanada = 0;
  }

  // Cada enemigo derrotado reaparece como un nuevo encuentro en una posición aleatoria.
  // Su nuevo ID permite que la recompensa se entregue una sola vez por aparición.
  reaparecerEnemigo(combateActual.idEnemigo);

  renderizarEstadoGeneral();
  renderizarCombate();
  crearEnemigosMapa();

  mostrarMensajeMapa(
    `¡Enemigo derrotado! Recompensa: ${combateActual.monedasGanadas} monedas. ¡Otro enemigo ha aparecido en la zona!`
  );

  return;
}

    if (!estado.nivelesCompletados.includes(numero)) {
      estado.nivelesCompletados.push(numero);
    }

    if (!yaRecibioRecompensa) {
  const xpGanada = 35 + numero * 5;

  // Los guardianes solo entregan experiencia, nunca monedas.
  estado.experiencia += xpGanada;
  estado.recompensasRecibidas.push(numero);

  combateActual.recompensaNueva = true;
  combateActual.monedasGanadas = 0;
  combateActual.xpGanada = xpGanada;
} else {
  combateActual.recompensaNueva = false;
  combateActual.monedasGanadas = 0;
  combateActual.xpGanada = 0;
}

    
if (
  numero < niveles.length &&
  !estado.nivelesDesbloqueados.includes(numero + 1)
) {
  estado.nivelesDesbloqueados.push(numero + 1);
}
crearEnemigosMapa();

renderizarEstadoGeneral();

mostrarMensajeMapa(
  `¡Nivel ${numero} completado. ${
    numero < niveles.length
      ? `¡La zona ${numero + 1} ya está desbloqueada!`
      : "¡Has conquistado el reino!"
  }`
);

    

    renderizarCombate();
    guardarProgreso();
  }

  function usarPista() {
    if (
      !combateActual ||
      combateActual.estado !== "activo" ||
      combateActual.pistaUsada
    ) {
      return;
    }

    const pregunta = combateActual.preguntas[combateActual.pregunta];

    combateActual.pistaUsada = true;
    $("#combate-pista").textContent = `Pista: ${pregunta.pista}`;
    $("#combate-pista").hidden = false;
    $("#combate-btn-pista").hidden = true;
  }

  // Conectar los 12 botones del mapa.
  document.querySelectorAll(".nivel-mundo[data-nivel]").forEach((puerta) => {
    puerta.addEventListener("click", () => {
      abrirNivel(Number(puerta.dataset.nivel));
    });
  });

  $("#combate-cerrar").addEventListener("click", ocultarCombate);
  $("#combate-btn-volver").addEventListener("click", ocultarCombate);
  $("#combate-btn-pista").addEventListener("click", usarPista);
  $("#combate-btn-aprendizaje").addEventListener("click", mostrarPanelAprendizaje);

  $("#combate-btn-reintentar").addEventListener("click", () => {
    if (combateActual) iniciarCombate(combateActual.numero, true);
  });

  // Cerrar con Escape sin borrar el progreso del combate.
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && !capaCombate.hidden) {
      ocultarCombate();
    }
  });

  // Al iniciar la aventura, actualiza la apariencia y las estadísticas.
  window.addEventListener("aventuraIniciada", () => {
    renderizarEstadoGeneral();
    const botonAprendizaje = document.getElementById("boton-aprendizaje-mapa");
    if (botonAprendizaje) botonAprendizaje.hidden = false;
  });

  renderizarEstadoGeneral();
  const botonAprendizajeMapa = document.createElement("button");
  botonAprendizajeMapa.type = "button";
  botonAprendizajeMapa.id = "boton-aprendizaje-mapa";
  botonAprendizajeMapa.className = "boton-aprendizaje-mapa";
  botonAprendizajeMapa.textContent = "📊 Mi aprendizaje";
  botonAprendizajeMapa.hidden = !document.body.classList.contains("pantalla-aventura-activa");
  botonAprendizajeMapa.addEventListener("click", mostrarPanelAprendizaje);
  document.body.appendChild(botonAprendizajeMapa);
  mostrarMensajeMapa(
    "Tu misión te espera. Selecciona el Nivel 1 para comenzar."
  );

  console.log("Hacia el Límite: sistema de combate inicializado.");
  // ============================================
// ENEMIGOS EXPLORADORES DEL MAPA
// ============================================


const enemigosMapa = [
  // Zona 1: cuatro enemigos iniciales
  { id: "arana-1", zona: 1, nombre: "Araña matemática", imagen: "img/araña.png", monedas: 20, x: 25, y: 22 },
  { id: "esqueleto-1", zona: 1, nombre: "Esqueleto algebraico", imagen: "img/esqueleto.png", monedas: 20, x: 34, y: 35 },
  { id: "fantasma-1", zona: 1, nombre: "Fantasma de los límites", imagen: "img/fantasma.png", monedas: 20, x: 18, y: 40 },
  { id: "ogro-1", zona: 1, nombre: "Ogro de las ecuaciones", imagen: "img/ogro.png", monedas: 20, x: 40, y: 22 },

  // Zona 2: dos enemigos adicionales
  { id: "arana-2", zona: 2, nombre: "Araña de la continuidad", imagen: "img/araña.png", monedas: 20, x: 59, y: 25 },
  { id: "esqueleto-2", zona: 2, nombre: "Esqueleto algebraico", imagen: "img/esqueleto.png", monedas: 20, x: 72, y: 39 },

  // Zona 3: dos enemigos adicionales
  { id: "fantasma-2", zona: 3, nombre: "Fantasma del infinito", imagen: "img/fantasma.png", monedas: 20, x: 55, y: 68 },
  { id: "ogro-2", zona: 3, nombre: "Ogro del cálculo", imagen: "img/ogro.png", monedas: 20, x: 76, y: 76 }
 ];

let contadorReapariciones = 0;

// Busca un punto aleatorio dentro de la zona del enemigo, evitando puertas,
// al personaje y a otros exploradores para reducir los solapamientos.
function obtenerPosicionAleatoria(zona, idIgnorado) {
  const mapa = document.querySelector(".mapa-mundo");
  if (!mapa) return { x: 25, y: 22 };

  const rectMapa = mapa.getBoundingClientRect();
  const personaje = document.getElementById("personaje-mapa");
  const rectPersonaje = personaje ? personaje.getBoundingClientRect() : null;

  const limites = zona === 1
    ? { minX: 12, maxX: 42, minY: 12, maxY: 45 }
    : zona === 2
      ? { minX: 50, maxX: 91, minY: 12, maxY: 45 }
      : { minX: 12, maxX: 91, minY: 57, maxY: 88 };

  const puertas = [...mapa.querySelectorAll(".nivel-mundo[data-nivel]")];
  const otros = [...mapa.querySelectorAll(".enemigo-explorador")]
    .filter((e) => e.dataset.enemigoId !== idIgnorado);

  for (let intento = 0; intento < 100; intento++) {
    const x = limites.minX + Math.random() * (limites.maxX - limites.minX);
    const y = limites.minY + Math.random() * (limites.maxY - limites.minY);
    const px = rectMapa.left + rectMapa.width * x / 100;
    const py = rectMapa.top + rectMapa.height * y / 100;

    const cercaDePuerta = puertas.some((puerta) => {
      const r = puerta.getBoundingClientRect();
      return px > r.left - 34 && px < r.right + 34 &&
             py > r.top - 34 && py < r.bottom + 34;
    });
    if (cercaDePuerta) continue;

    if (rectPersonaje &&
        px > rectPersonaje.left - 55 && px < rectPersonaje.right + 55 &&
        py > rectPersonaje.top - 55 && py < rectPersonaje.bottom + 55) {
      continue;
    }

    const cercaDeOtroEnemigo = otros.some((otro) => {
      const r = otro.getBoundingClientRect();
      return px > r.left - 48 && px < r.right + 48 &&
             py > r.top - 48 && py < r.bottom + 48;
    });
    if (cercaDeOtroEnemigo) continue;

    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  }

  return {
    x: Number(((limites.minX + limites.maxX) / 2).toFixed(2)),
    y: Number(((limites.minY + limites.maxY) / 2).toFixed(2))
  };
}

function reaparecerEnemigo(idAnterior) {
  const enemigo = enemigosMapa.find((item) => item.id === idAnterior);
  if (!enemigo) return;

  const posicion = obtenerPosicionAleatoria(enemigo.zona, idAnterior);
  contadorReapariciones += 1;
  enemigo.id = `${enemigo.id.split("-")[0]}-reaparicion-${Date.now()}-${contadorReapariciones}`;
  enemigo.x = posicion.x;
  enemigo.y = posicion.y;
}


function crearEnemigosMapa() {
  const mapa = document.querySelector(".mapa-mundo");
  if (!mapa) return;

  // Si el jugador recarga la página, los encuentros ya cobrados se convierten
  // en nuevas apariciones para que siempre haya exploradores activos.
  enemigosMapa.forEach((enemigo) => {
    if (!estado.recompensasRecibidas.includes(`enemigo-${enemigo.id}`)) return;
    contadorReapariciones += 1;
    enemigo.id = `${enemigo.id.split("-")[0]}-reaparicion-${Date.now()}-${contadorReapariciones}`;
    const limites = enemigo.zona === 1
      ? { minX: 12, maxX: 42, minY: 12, maxY: 45 }
      : enemigo.zona === 2
        ? { minX: 50, maxX: 91, minY: 12, maxY: 45 }
        : { minX: 12, maxX: 91, minY: 57, maxY: 88 };
    enemigo.x = Number((limites.minX + Math.random() * (limites.maxX - limites.minX)).toFixed(2));
    enemigo.y = Number((limites.minY + Math.random() * (limites.maxY - limites.minY)).toFixed(2));
  });

  mapa.querySelectorAll(".enemigo-explorador").forEach(e => e.remove());
const nivelMaximoDesbloqueado = Math.max(
  ...estado.nivelesDesbloqueados
);

const zonaActiva =
  nivelMaximoDesbloqueado <= 4 ? 1 :
  nivelMaximoDesbloqueado <= 8 ? 2 : 3;
  enemigosMapa
  .filter(datos => datos.zona <= zonaActiva)
  .forEach((datos, indice) => {
    const enemigo = document.createElement("button");
    enemigo.type = "button";
    enemigo.className = "enemigo-explorador";
    enemigo.dataset.enemigoId = datos.id;
    enemigo.dataset.indice = indice;
    enemigo.setAttribute("aria-label", datos.nombre);
    enemigo.title = `${datos.nombre} · Recompensa: ${datos.monedas} monedas`;

    const imagen = document.createElement("img");
    imagen.src = datos.imagen;
    imagen.alt = datos.nombre;
    imagen.draggable = false;

    imagen.onerror = () => {
      enemigo.textContent = ["🕷️", "💀", "👻", "👹"][indice];
    };

    enemigo.appendChild(imagen);
    enemigo.style.left = `${datos.x}%`;
    enemigo.style.top = `${datos.y}%`;

    enemigo.addEventListener("click", () => {
      const recompensaId = `enemigo-${datos.id}`;

      if (estado.recompensasRecibidas.includes(recompensaId)) {
        mostrarMensajeMapa("Ya derrotaste a este enemigo y recibiste su recompensa.");
        enemigo.classList.add("enemigo-derrotado");
        return;
      }

      iniciarCombateEnemigo(datos);
    });

    mapa.appendChild(enemigo);

    if (estado.recompensasRecibidas.includes(`enemigo-${datos.id}`)) {
      enemigo.classList.add("enemigo-derrotado");
    }
  });
}

function iniciarCombateEnemigo(datos) {
  iniciarCombate(1, true);

  // Los enemigos exploradores también respetan la dificultad de su zona.
  const nivelDificultad = datos.zona === 1 ? 1 : datos.zona === 2 ? 5 : 9;
  combateActual.preguntas = seleccionarPreguntas(nivelDificultad, "explorador");
  combateActual.vidaEnemigo = combateActual.preguntas.length;
  combateActual.respuestasRegistradas = {};
  combateActual.preguntaResuelta = false;

  combateActual.tipo = "explorador";
  combateActual.idEnemigo = datos.id;
  combateActual.nombreEnemigo = datos.nombre;
  combateActual.imagenEnemigo = datos.imagen;
  combateActual.recompensaMonedas = datos.monedas;

  renderizarCombate();
}

// Permite que movimiento.js consulte el progreso guardado.
window.obtenerProgresoAventura = () => ({
  nivelesDesbloqueados: [...estado.nivelesDesbloqueados],
  nivelesCompletados: [...estado.nivelesCompletados],
  nivelesPagados: [...estado.nivelesPagados]
});

// Permite que movimiento.js inicie un combate por contacto.
window.iniciarCombatePorContacto = (id) => {
  const datos = enemigosMapa.find(e => e.id === id);
  if (!datos) return;

  const recompensaId = `enemigo-${datos.id}`;
  if (estado.recompensasRecibidas.includes(recompensaId)) return;

  iniciarCombateEnemigo(datos);
};

crearEnemigosMapa();
})();