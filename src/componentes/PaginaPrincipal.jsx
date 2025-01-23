import React, { useState, useEffect } from "react";
import "../css/PaginaPrincipal.css"; // Estilos de la página principal
import Nav from "./Nav"; // Importamos el componente de navegación
import Juego from "./Juego"; // Importamos el componente Juego

const PaginaPrincipal = () => {
  const [userInfo, setUserInfo] = useState(null); // Guardar la información del usuario
  const [partida, setPartida] = useState(null); // Estado para almacenar la partida
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // Verifica si el usuario está logueado al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("authTokenExpiration");
    const userId = localStorage.getItem("authUserId");
    const userName = localStorage.getItem("authUserName");
    // Verifica si el token es válido
    if (token && userId && userName && expirationTime && new Date().getTime() < expirationTime) {
      setUserInfo({ id: userId, name: userName, token });
    } else {
      setUserInfo(null); // Si no está logueado, aseguramos que no se muestre el botón de jugar
    }
  }, []); // Este useEffect solo corre una vez, al cargar la página

  const handleLoginSuccess = (data) => {
    // Al hacer login, guardar la información del usuario
    setUserInfo({ id: data.usuarioId, name: data.nombreUsuario, token: data.token });
  };

  // Función para crear la partida
  const comenzarJuego = async () => {
    if (!userInfo) return;
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch("http://localhost:8080/api/partida/crear?nombreUsuario=" + userInfo.name, {
        method: "POST",
        headers: {
          Authorization: userInfo.token, // Aquí va el token del usuario
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        setPartida(data);
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
      <Nav onLoginSuccess={handleLoginSuccess} /> {/* Se pasa el callback al componente Nav */}
      <div className="contenedor-principal">
        <div className="contenedor-logo">
          <img
            src="https://via.placeholder.com/150" // Cambia esto por el enlace a tu logo
            alt="Logo del juego"
            className="logo"
          />
        </div>
        <div className="mensaje-bienvenida">
          <h1>¡Bienvenido al Trivial de Videojuegos!</h1>
          <p>Demuestra cuánto sabes sobre videojuegos en este divertido juego de trivia.</p>
        </div>
  
        {/* Mostrar el botón de comenzar juego solo si el usuario está logueado */}
        {userInfo ? (
          <div>
            <button onClick={comenzarJuego} className="boton-comenzar">
              Comenzar Juego
            </button>
  
            {/* Mostrar el componente Juego o manejar la carga y errores */}
            {partida ? (
              <Juego nombreUsuario={userInfo.name} partida={partida} />
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
