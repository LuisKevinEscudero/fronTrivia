import React, { useEffect, useState } from "react";
import "../css/Votacion.css";

const Votacion = ({ nombreUsuario }) => {
  const [videojuegos, setVideojuegos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/votacion/candidatos", {
          headers: {
            Authorization: token,
          },
        });
        const data = await res.json();
        setVideojuegos(data);
      } catch (err) {
        console.error("Error al obtener candidatos", err);
      }
    };

    fetchCandidatos();
  }, []);

  const votar = async () => {
    if (!seleccionado) {
      setMensaje("Selecciona un videojuego para votar.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/votacion/votar?videojuegoId=${seleccionado}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.text();
      setMensaje(data);
    } catch (err) {
      setMensaje("Error al enviar el voto.");
    }
  };

  return (
    <div className="contenedor-votacion">
      <h2>Votación del día</h2>
      <p className="mensaje-info">Selecciona el videojuego que quieres para mañana:</p>
      <div className="lista-candidatos">
        {videojuegos.map((juego) => (
          <button
            key={juego.id}
            onClick={() => setSeleccionado(juego.id)}
            className={seleccionado === juego.id ? "candidato seleccionado" : "candidato"}
          >
            {juego.nombre}
          </button>
        ))}
      </div>
      <button className="boton-votar" onClick={votar}>
        Votar
      </button>
      {mensaje && <p className="mensaje-votacion">{mensaje}</p>}
    </div>
  );
};

export default Votacion;
