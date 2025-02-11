import React from "react";
import "../css/DetallePartida.css"; // Estilos para la pantalla de detalles

const DetallePartida = ({ partida, respuestasUsuario = [], puntuacion }) => {
  if (!partida) return <p>No hay datos de la partida disponibles.</p>;

  const nombreUsuario = partida.usuario.nombreUsuario;

  // 🔹 Recuperar respuestas y puntuación usando claves únicas por usuario
  const claveRespuestas = `respuestasUsuario_${nombreUsuario}`;
  const clavePuntuacion = `puntuacion_${nombreUsuario}`;

  // 🔹 Recuperar respuestas guardadas en localStorage si no hay respuestas en props
  const respuestasGuardadas = JSON.parse(localStorage.getItem(claveRespuestas)) || [];
  respuestasUsuario = respuestasUsuario.length ? respuestasUsuario : respuestasGuardadas;

  // 🔹 Recuperar la puntuación de localStorage si no viene en props
  const puntuacionGuardada = parseInt(localStorage.getItem(clavePuntuacion), 10) || 0;
  puntuacion = puntuacion !== undefined ? puntuacion : puntuacionGuardada;

  return (
    <div className="detalle-partida">
      <h2>📜 Datos de la Partida</h2>
      <p><strong>Jugador:</strong> {partida?.usuario?.nombreUsuario || "Desconocido"}</p>
      <p><strong>Estado:</strong> {partida?.estado || "No disponible"}</p>
      <p><strong>Fecha de Inicio:</strong> {partida?.fechaInicio ? new Date(partida.fechaInicio).toLocaleString() : "No disponible"}</p>
      <p><strong>Tiempo Total:</strong> {partida?.tiempoTotal ? `${partida.tiempoTotal} segundos` : "En curso..."}</p>
      <p><strong>Puntuación Final:</strong> {puntuacion}</p>

      <h3>📌 Resumen de Preguntas</h3>
      {respuestasUsuario.length > 0 ? (
        <ul>
          {respuestasUsuario.map((respuesta, index) => (
            <li key={index}>
              <strong>{respuesta.pregunta}</strong>
              <p>
                <span className={respuesta.esCorrecta ? "respuesta-correcta" : "respuesta-incorrecta"}>
                  Tu respuesta: {respuesta.respuestaUsuario}
                </span>
              </p>
              <p><strong>Respuesta correcta:</strong> {respuesta.respuestaCorrecta}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron respuestas para esta partida</p>
      )}
    </div>
  );
};

export default DetallePartida;
