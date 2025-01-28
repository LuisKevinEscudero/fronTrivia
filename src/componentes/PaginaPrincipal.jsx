import React, { useState, useEffect } from "react";
import "../css/PaginaPrincipal.css"; // Estilos de la página principal
import Nav from "./Nav"; // Importamos el componente de navegación
import Juego from "./Juego"; // Importamos el componente Juego

const PaginaPrincipal = () => {
  const [userInfo, setUserInfo] = useState(null); // Guardar la información del usuario
  const [partida, setPartida] = useState(null); // Estado para almacenar la partida
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [mostrarBotonComenzar, setMostrarBotonComenzar] = useState(true); // Controlar si se muestra el botón de comenzar

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("authTokenExpiration");
    const userId = localStorage.getItem("authUserId");
    const userName = localStorage.getItem("authUserName");

    if (token && userId && userName && expirationTime && new Date().getTime() < expirationTime) {
      setUserInfo({ id: userId, name: userName, token });
    } else {
      setUserInfo(null);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setUserInfo({ id: data.usuarioId, name: data.nombreUsuario, token: data.token });
  };

  const comenzarJuego = async () => {
    if (!userInfo) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/partida/crear?nombreUsuario=" + userInfo.name,
        {
          method: "POST",
          headers: {
            Authorization: userInfo.token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPartida(data);
        setMostrarBotonComenzar(false); // Oculta el botón al comenzar la partida
      } else {
        setError(data.message || "Error al crear la partida.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav onLoginSuccess={handleLoginSuccess} />
      <div className="contenedor-principal">
        <div className="contenedor-logo">
          <img
            src="https://via.placeholder.com/150"
            alt="Logo del juego"
            className="logo"
          />
        </div>
        <div className="mensaje-bienvenida">
          <h1>¡Bienvenido al Trivial de Videojuegos!</h1>
          <p>Demuestra cuánto sabes sobre videojuegos en este divertido juego de trivia.</p>
        </div>

        {userInfo ? (
          <div>
            {/* Solo mostrar el botón si mostrarBotonComenzar es true */}
            {mostrarBotonComenzar && (
              <button onClick={comenzarJuego} className="boton-comenzar">
                Comenzar Juego
              </button>
            )}

            {/* Mostrar el componente Juego o manejar la carga y errores */}
            {partida ? (
              <Juego
                nombreUsuario={userInfo.name}
                partida={partida}
                reiniciarJuego={() => {
                  setPartida(null); // Reinicia la partida
                  setMostrarBotonComenzar(true); // Vuelve a mostrar el botón
                }}
              />
            ) : loading ? (
              <p>Cargando la partida...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : null}
          </div>
        ) : (
          <p>Por favor, inicia sesión para comenzar el juego.</p>
        )}
      </div>
    </div>
  );
};

export default PaginaPrincipal;
