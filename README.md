# Bet Party GPT

Aplicación para organizar "parties" de apuestas sociales durante eventos o fiestas. A continuación se detalla el flujo de funcionamiento previsto.

## 1. Pantalla inicial
Al abrir la app se muestran dos opciones principales:
- **Crear una Party**
- **Unirse a una Party**

## 2. Crear una Party
Quien crea la party se convierte en **administrador**. Antes de iniciar debe configurar dos horarios clave:
- **Hora de inicio de la fiesta**: límite para que todos los jugadores envíen sus apuestas. Hasta ese momento, cada jugador puede acceder a las preguntas y seleccionar sus predicciones.
- **Hora de fin de partida**: momento en que se cierra definitivamente la partida. El administrador indica qué eventos ocurrieron realmente, se muestran los resultados finales y se calculan los puntos.

Tras definir ambos horarios, la party queda creada y lista para que otros jugadores se unan mediante un código o enlace.

## 3. Creación de apuestas por parte del administrador
Entre la creación de la party y la hora límite, el administrador puede añadir las preguntas/apuestas que deben responder los jugadores. Ejemplos:
- "¿Quién es el más probable que se líe con alguien esta noche?"
- "¿Quién es el más probable que acabe vomitando?"
- "¿Quién perderá primero el móvil?"

Para cada pregunta se muestra la lista de todos los jugadores (excepto uno mismo). Cada participante elige al jugador que considera más probable que cumpla la acción.

## 4. Cierre de votaciones y determinación de los hechos reales
Cuando llega la **hora de fin de partida**, el administrador revisa cada pregunta, selecciona qué eventos ocurrieron realmente y confirma los resultados para toda la partida.

## 5. Sistema de cuotas y cálculo de puntos
La app asigna una **cuota** a cada apuesta según cuántas personas votaron al mismo jugador:
- A menor cantidad de votos para un jugador **X**, mayor será su cuota.
- A mayor cantidad de votos para **X**, menor será su cuota.

Esto premia las apuestas "arriesgadas". Para cada pregunta se genera un bote (de puntos o simbólico). Solo quienes acierten (hayan votado al jugador marcado como hecho real) reciben puntos, repartidos en función de la cuota: mayor cuota implica mayor porcentaje del bote para quienes acertaron.

**Ejemplo:**
- Pregunta: "¿Quién es más probable que se líe con alguien?"
- Votos: Ana → 5, Luis → 2, Marta → 1
- Si finalmente Marta se lía con alguien, solo quienes votaron a Marta ganan. Como su cuota es alta por haber recibido pocos votos, esos jugadores reciben más puntos.

## 6. Resultado final
Al cerrar la partida, la app muestra:
- Clasificación general de jugadores.
- Número total de apuestas acertadas.
- Cuotas ganadas.
- Puntos obtenidos por cada jugador.
