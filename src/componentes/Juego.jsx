import React, { useState } from "react";
import "../css/Juego.css";

const Juego = ({ nombreUsuario, partida, reiniciarJuego }) => {
  const [preguntaIndex, setPreguntaIndex] = useState(0); // Índice de la pregunta actual
  const [respuestaUsuario, setRespuestaUsuario] = useState(""); // Respuesta del usuario
  const [mensaje, setMensaje] = useState(""); // Mensaje del backend
  const [respondida, setRespondida] = useState(false); // Para saber si la pregunta ya fue respondida
  const [preguntasRespondidas, setPreguntasRespondidas] = useState(
    Array(partida.preguntas.length).fill(false)
  ); // Estado para las preguntas respondidas
  const [puntuacion, setPuntuacion] = useState(partida.puntuacion || 0); // Estado para almacenar la puntuación, inicializada desde el backend
  const [partidaFinalizada, setPartidaFinalizada] = useState(false); // Estado para saber si la partida terminó

  const token = localStorage.getItem("authToken"); // Obtener el token desde el localStorage

  // Función para manejar la respuesta del usuario
  const responderPregunta = async (respuesta) => {
    if (!partida || !partida.id || !token) {
      setMensaje("No se puede responder la pregunta. Falta información.");
      return;
    }

    // Determinar si todas las preguntas han sido contestadas
    const todasContestadas =
      preguntasRespondidas.filter((resp) => resp).length ===
      partida.preguntas.length - 1;

    try {
      const response = await fetch(
        `http://localhost:8080/api/partida/responder/${partida.id}?preguntaId=${partida.preguntas[preguntaIndex].id}&respuestaUsuario=${respuesta}&todasContestadas=${todasContestadas}`,
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

        // Marcar la pregunta actual como respondida en el estado
        setPreguntasRespondidas((prev) => {
          const nuevoEstado = [...prev];
          nuevoEstado[preguntaIndex] = true;
          return nuevoEstado;
        });

        // Si la respuesta es correcta, sumar puntos
        if (respuesta === partida.preguntas[preguntaIndex].respuesta) {
          setPuntuacion(puntuacion + partida.preguntas[preguntaIndex].puntos); // Actualiza la puntuación con los puntos de la pregunta
        }

        // Si la partida ha finalizado según el backend
        if (data.includes("La partida ha terminado")) {
          setPartidaFinalizada(true);
        }
      } else {
        setMensaje(data || "Error al responder la pregunta.");
      }
    } catch (err) {
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  const siguientePregunta = () => {
    if (partida.preguntas.length > preguntaIndex + 1) {
      setPreguntaIndex(preguntaIndex + 1);
      setRespondida(false);
      setRespuestaUsuario("");
      setMensaje("");
    } else {
      setPartidaFinalizada(true); // Marcar la partida como finalizada
    }
  };

  const preguntaActual = partida.preguntas[preguntaIndex];

  return (
    <div className="contenedor-juego">
      <h2>Pregunta {preguntaIndex + 1}</h2>
      <p className="pregunta">{preguntaActual.pregunta}</p>

      {/* Mostrar marcador de puntuación */}
      <div className="puntuacion">Puntuación: {puntuacion}</div>

      <div className="opciones">
        {preguntaActual.opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => {
              setRespuestaUsuario(opcion); // Establece la respuesta seleccionada
              responderPregunta(opcion); // Llama a la función para comprobar la respuesta
            }}
            className={respuestaUsuario === opcion ? "opcion-seleccionada" : ""}
          >
            {opcion}
          </button>
        ))}
      </div>

      <p className={ mensaje === "Respuesta correcta" ? "mensaje mensaje-correcto" : "mensaje mensaje-incorrecto"}>
        {mensaje}
      </p>

      {/* Botón para pasar a la siguiente pregunta */}
      {respondida && !partidaFinalizada && (
        <button className="boton-siguiente" onClick={siguientePregunta}>
          Siguiente pregunta
        </button>
      )}


      {/* Ya no mostramos ningún botón cuando la partida ha finalizado */}
      {partidaFinalizada && (
        <div className="mensaje-finalizado">
          <p>¡Juego finalizado! Tu puntuación final es: {puntuacion}</p>
        </div>
      )}
    </div>
  );
};

export default Juego;
