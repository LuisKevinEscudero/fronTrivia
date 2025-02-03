import React from "react";
import "../css/DetallePartida.css"; // Estilos para la pantalla de detalles

const DetallePartida = ({ partida }) => {
  if (!partida) return <p>No hay datos de la partida disponibles.</p>;

  // Verificamos si la propiedad 'preguntas' existe y es un arreglo
  if (!Array.isArray(partida.preguntas) || partida.preguntas.length === 0) {
    return <p>No hay preguntas disponibles para esta partida.</p>;
  }

  return (
    <div className="detalle-partida">
      <h2>📜 Datos de la Partida</h2>
      <p><strong>Jugador:</strong> {partida.usuario.nombreUsuario}</p>
      <p><strong>Estado:</strong> {partida.estado}</p>
      <p><strong>Fecha de Inicio:</strong> {new Date(partida.fechaInicio).toLocaleString()}</p>
      <p><strong>Tiempo Total:</strong> {partida.tiempoTotal ? `${partida.tiempoTotal} segundos` : "En curso..."}</p>

      <h3>Preguntas:</h3>
      {/* Verificamos si las preguntas existen y las mostramos */}
      {partida.preguntas && partida.preguntas.length > 0 ? (
        <ul>
          {partida.preguntas.map((pregunta, index) => (
            <li key={index}>
              {/* Accedemos correctamente a la propiedad 'pregunta' */}
              <strong>{pregunta.pregunta}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron preguntas para esta partida.</p>
      )}
    </div>
  );
};

export default DetallePartida;
