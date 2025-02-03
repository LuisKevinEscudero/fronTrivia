import React, { useState, useEffect } from "react";
import "../css/Juego.css";
import DetallePartida from "./DetallePartida"; // Importamos el resumen

const Juego = ({ nombreUsuario, partida, reiniciarJuego }) => {
  const [preguntaIndex, setPreguntaIndex] = useState(0);
  const [opcionesAleatorias, setOpcionesAleatorias] = useState([]);
  const [respuestaUsuario, setRespuestaUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [respondida, setRespondida] = useState(false);
  const [preguntasRespondidas, setPreguntasRespondidas] = useState(
    Array(partida.preguntas.length).fill(false)
  );
  const [puntuacion, setPuntuacion] = useState(partida.puntuacion || 0);
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);
  const [respuestasUsuario, setRespuestasUsuario] = useState([]); // Estado independiente

  const token = localStorage.getItem("authToken");
  const preguntaActual = partida.preguntas[preguntaIndex];

  const mezclarOpciones = (opciones) => {
    return [...opciones].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (preguntaActual) {
      setOpcionesAleatorias(mezclarOpciones(preguntaActual.opciones));
    }
  }, [preguntaIndex]);

  const responderPregunta = async (respuesta) => {
    if (!partida || !partida.id || !token) {
      setMensaje("No se puede responder la pregunta. Falta información.");
      return;
    }

    const todasContestadas =
      preguntasRespondidas.filter((resp) => resp).length ===
      partida.preguntas.length - 1;

    try {
      const response = await fetch(
        `https://triviaback-latest.onrender.com/api/partida/responder/${partida.id}?preguntaId=${preguntaActual.id}&respuestaUsuario=${respuesta}&todasContestadas=${todasContestadas}`,
        //`http://localhost:8080/api/partida/responder/${partida.id}?preguntaId=${preguntaActual.id}&respuestaUsuario=${respuesta}&todasContestadas=${todasContestadas}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.text();
      if (response.ok) {
        setMensaje(data);
        setRespondida(true);

        setPreguntasRespondidas((prev) => {
          const nuevoEstado = [...prev];
          nuevoEstado[preguntaIndex] = true;
          return nuevoEstado;
        });

        const esCorrecta = respuesta === preguntaActual.respuesta;

        // 🔹 Guardamos la respuesta del usuario en un estado independiente
        setRespuestasUsuario((prev) => [
          ...prev,
          {
            pregunta: preguntaActual.pregunta,
            respuestaUsuario: respuesta,
            respuestaCorrecta: preguntaActual.respuesta,
            esCorrecta,
          },
        ]);

        if (esCorrecta) {
          setPuntuacion(puntuacion + preguntaActual.puntos);
        }

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
      setPartidaFinalizada(true);
    }
  };

  return (
    <div className="contenedor-juego">
      {!partidaFinalizada ? (
        <>
          <h2>Pregunta {preguntaIndex + 1}</h2>
          <p className="pregunta">{preguntaActual.pregunta}</p>

          <div className="puntuacion">Puntuación: {puntuacion}</div>

          <div className="opciones">
            {opcionesAleatorias.map((opcion, index) => (
              <button
                key={index}
                onClick={() => {
                  setRespuestaUsuario(opcion);
                  responderPregunta(opcion);
                }}
                className={respuestaUsuario === opcion ? "opcion-seleccionada" : ""}
                disabled={respondida}
              >
                {opcion}
              </button>
            ))}
          </div>

          <p
            className={
              mensaje.startsWith("Respuesta correcta")
                ? "mensaje mensaje-correcto"
                : mensaje.startsWith("Respuesta incorrecta")
                ? "mensaje mensaje-incorrecto"
                : ""
            }
          >
            {mensaje}
          </p>

          {respondida && !partidaFinalizada && (
            <button className="boton-siguiente" onClick={siguientePregunta}>
              Siguiente pregunta
            </button>
          )}
        </>
      ) : (
        // 🔹 Cuando termina la partida, mostramos el resumen
        <DetallePartida partida={partida} respuestasUsuario={respuestasUsuario} puntuacion={puntuacion} />
      )}
    </div>
  );
};

export default Juego;
