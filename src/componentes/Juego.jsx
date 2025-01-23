import React, { useState } from "react";
import "../css/Juego.css";

const Juego = ({ nombreUsuario, partida }) => {
  const [preguntaIndex, setPreguntaIndex] = useState(0); // Índice de la pregunta actual
  const [respuestaUsuario, setRespuestaUsuario] = useState(""); // Respuesta del usuario
  const [mensaje, setMensaje] = useState(""); // Mensaje del backend
  const [respondida, setRespondida] = useState(false); // Para saber si la pregunta ya fue respondida

  const token = localStorage.getItem("authToken"); // Obtener el token desde el localStorage

  // Función para manejar la respuesta del usuario
  const responderPregunta = async (respuesta) => {
    if (!partida || !partida.id || !token) {
      setMensaje("No se puede responder la pregunta. Falta información.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/partida/responder/${partida.id}?preguntaId=${partida.preguntas[preguntaIndex].id}&respuestaUsuario=${respuesta}`,
        {
          method: "POST",
          headers: {
            Authorization: token, // Incluye el token en las cabeceras
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text(); // La respuesta es un string
      if (response.ok) {
        setMensaje(data); // Mostrar el mensaje del backend
        setRespondida(true); // Marcar la pregunta como respondida
      } else {
        setMensaje(data || "Error al responder la pregunta.");
      }
    } catch (err) {
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  const siguientePregunta = () => {
    if (partida.preguntas.length > preguntaIndex + 1) {
      setPreguntaIndex(preguntaIndex + 1); // Pasar a la siguiente pregunta
      setRespondida(false); // Restablecer el estado de la respuesta
      setRespuestaUsuario(""); // Borrar la respuesta seleccionada
      setMensaje(""); // Limpiar mensaje
    } else {
      setMensaje("¡Has terminado la partida!"); // Si ya no hay más preguntas
    }
  };

  const preguntaActual = partida.preguntas[preguntaIndex];

  return (
    <div>
      <h2>Pregunta {preguntaIndex + 1}</h2>
      <p>{preguntaActual.pregunta}</p>
      <div className="opciones">
        {preguntaActual.opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => {
              setRespuestaUsuario(opcion); // Establece la respuesta seleccionada
              responderPregunta(opcion);    // Llama a la función para comprobar la respuesta
            }}
            className={respuestaUsuario === opcion ? "opcion-seleccionada" : ""}
          >
            {opcion}
          </button>
        ))}
      </div>
      <p>{mensaje}</p>

      {/* Mostrar el botón "Siguiente Pregunta" solo si la pregunta ha sido respondida */}
      {respondida && (
        <button onClick={siguientePregunta} className="boton-siguiente">
          Siguiente Pregunta
        </button>
      )}
    </div>
  );
};

export default Juego;
