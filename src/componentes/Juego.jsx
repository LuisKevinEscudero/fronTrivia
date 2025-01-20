import React, { useState, useEffect } from "react";
import "../css/Juego.css"; // Estilos del juego

const Juego = ({ nombreUsuario, partida }) => {
  const [preguntaIndex, setPreguntaIndex] = useState(0); // Para llevar el índice de las preguntas
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(null); // Para la respuesta correcta

  // Función para manejar la respuesta del jugador
  const manejarRespuesta = (respuesta) => {
    const pregunta = partida.preguntas[preguntaIndex];
    if (respuesta === pregunta.respuestaCorrecta) {
      setRespuestaCorrecta(true);
    } else {
      setRespuestaCorrecta(false);
    }

    // Avanzar a la siguiente pregunta
    if (preguntaIndex < partida.preguntas.length - 1) {
      setPreguntaIndex(preguntaIndex + 1);
    } else {
      setPreguntaIndex(0); // Reiniciar el juego si ya no hay más preguntas
    }
  };

  useEffect(() => {
    // Reiniciar respuestaCorrecta cuando la pregunta cambia
    setRespuestaCorrecta(null);
  }, [preguntaIndex]);

  return (
    <div className="contenedor-juego">
      <div className="juego-en-curso">
        <h2>Partida en curso</h2>
        <p>¡Buena suerte! Responde correctamente a las preguntas.</p>

        {/* Mostrar la pregunta actual */}
        <div className="pregunta">
          <h3>{partida.preguntas[preguntaIndex].preguntaTexto}</h3>
          <div className="opciones">
            {partida.preguntas[preguntaIndex].opciones.map((opcion, index) => (
              <button key={index} onClick={() => manejarRespuesta(opcion)}>
                {opcion}
              </button>
            ))}
          </div>
          {respuestaCorrecta !== null && (
            <p>
              {respuestaCorrecta ? "Respuesta Correcta!" : "Respuesta Incorrecta."}
            </p>
          )}
        </div>

        {/* Mostrar el puntaje */}
        <h3>Puntuación: {partida.puntuacion}</h3>

        {/* Mostrar el estado */}
        <h4>Estado: {partida.estado}</h4>
        <p>Tiempo total: {partida.tiempoTotal} ms</p>
      </div>
    </div>
  );
};

export default Juego;
