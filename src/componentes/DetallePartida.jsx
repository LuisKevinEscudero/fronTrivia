import React from "react";
import "../css/DetallePartida.css";

const DetallePartida = ({ partida, respuestasUsuario = [], puntuacion }) => {
  if (!partida) return <p>No hay datos de la partida disponibles.</p>;

  const nombreUsuario = partida.usuario.nombreUsuario;
  const claveRespuestas = `respuestasUsuario_${nombreUsuario}_partida_${partida.id}`;
  const clavePuntuacion = `puntuacion_${nombreUsuario}_partida_${partida.id}`;

  const respuestasGuardadas = JSON.parse(localStorage.getItem(claveRespuestas)) || [];
  respuestasUsuario = respuestasUsuario.length ? respuestasUsuario : respuestasGuardadas;

  const puntuacionGuardada = parseInt(localStorage.getItem(clavePuntuacion), 10) || 0;
  puntuacion = puntuacion !== undefined ? puntuacion : puntuacionGuardada;

  return (
    <div className="detalle-partida">
      <h2>📜 Datos de la Partida</h2>
      <p><strong>Puntuación Final:</strong> {puntuacion}</p>

      <h3>📌 Resumen de Preguntas</h3>
      <div className="contenedor-preguntas">
        {respuestasUsuario.length > 0 ? (
          respuestasUsuario.map((respuesta, index) => (
            <div key={index} className="tarjeta-pregunta">
              <h4>❓ Pregunta {index + 1}</h4>
              <p className="texto-pregunta">{respuesta.pregunta}</p>
              <p className={respuesta.esCorrecta ? "respuesta-correcta" : "respuesta-incorrecta"}>
                <strong>Tu respuesta:</strong> {respuesta.respuestaUsuario}
              </p>
              <p><strong>✅ Respuesta correcta:</strong> {respuesta.respuestaCorrecta}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron respuestas para esta partida</p>
        )}
      </div>
    </div>
  );
};

export default DetallePartida;
