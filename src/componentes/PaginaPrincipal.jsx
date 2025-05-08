import React, { useState, useEffect } from "react";
import "../css/PaginaPrincipal.css"; // Estilos de la página principal
import Nav from "./Nav"; // Importamos el componente de navegación
import Juego from "./Juego"; // Importamos el componente Juego
import DetallePartida from "./DetallePartida"; // Importa el nuevo componente
import logo from "../assets/logo.jpg";


const PaginaPrincipal = () => {
  const [userInfo, setUserInfo] = useState(null); // Guardar la información del usuario
  const [partida, setPartida] = useState(null); // Estado para almacenar la partida
  const [loading, setLoading] = useState(false); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [mostrarBotonComenzar, setMostrarBotonComenzar] = useState(true); // Controlar si se muestra el botón de comenzar

  // Verifica si hay un usuario autenticado al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("authTokenExpiration");
    const userId = localStorage.getItem("authUserId");
    const userName = localStorage.getItem("authUserName");

    console.log("TOKEN en localStorage:", token);
    console.log("Expiración del token:", expirationTime);
    console.log("ID de usuario:", userId);
    console.log("Nombre de usuario:", userName);

    if (token && userId && userName && expirationTime && new Date().getTime() < expirationTime) {
      setUserInfo({ id: userId, name: userName, token });
    } else {
      setUserInfo(null);
    }
  }, []);

  // 🚀 Verificar si el usuario ya jugó una partida hoy al iniciar sesión
  useEffect(() => {
    const obtenerPartidaExistente = async () => {
      if (!userInfo) return;

      // 🚨 Si el usuario es "admin", no verificar la partida del día
      if (userInfo.name.toLowerCase() === "admin") {
        console.log("Admin detectado, no se verifica la partida del día.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/partida/obtenerPorNombreUsuario/${userInfo.name}`,
          {
            method: "GET",
            headers: {
              Authorization: userInfo.token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener la partida del día.");
        }

        const partidas = await response.json();
        const hoy = new Date().toISOString().split("T")[0];

        // Buscar si el jugador ya tiene una partida de hoy
        const partidaDeHoy = partidas.find((partida) => partida.fechaInicio.startsWith(hoy));

        if (partidaDeHoy) {
          setPartida(partidaDeHoy);
          setMostrarBotonComenzar(false);
        }
      } catch (error) {
        console.error("Error al obtener la partida:", error);
      }
    };

    obtenerPartidaExistente();
  }, [userInfo]);

  const handleLoginSuccess = (data) => {
    setUserInfo({ id: data.usuarioId, name: data.nombreUsuario, token: data.token });
  };

  const comenzarJuego = async () => {
    if (!userInfo) return;

    setLoading(true);
    setError(null);

    try {
      const responseVerificacion = await fetch(
        `https://triviaback-latest.onrender.com/api/partida/obtenerPorNombreUsuario/${userInfo.name}`,
        //`http://localhost:8080/api/partida/obtenerPorNombreUsuario/${userInfo.name}`,
        {
          method: "GET",
          headers: {
            Authorization: userInfo.token,
          },
        }
      );

      if (!responseVerificacion.ok) {
        throw new Error("Error al verificar la partida del día.");
      }

      const partidas = await responseVerificacion.json();
      const hoy = new Date().toISOString().split("T")[0]; // Fecha de hoy en formato YYYY-MM-DD

      // Buscar si el jugador ya tiene una partida de hoy
      const partidaDeHoy = partidas.find(partida => partida.fechaInicio.startsWith(hoy));

      if (partidaDeHoy) {
        setError("Ya has jugado una partida hoy.");
        setPartida(partidaDeHoy); // Mostrar detalles de la partida
        setMostrarBotonComenzar(false); // Ocultar el botón
        setLoading(false);
        return; // No permitir que inicie una nueva partida
      }

      // Si no tiene partida, crear una nueva
      const response = await fetch(
        "https://triviaback-latest.onrender.com/api/partida/crear?nombreUsuario=" + userInfo.name,
        //"http://localhost:8080/api/partida/crear?nombreUsuario=" + userInfo.name,
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
        setPartida(data); // Setea la nueva partida
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

  const finalizarJuego = () => {
    // Aquí se va a manejar el fin del juego, y recargamos la página
    console.log("juego dfiasd");
    window.location.reload();
  };

  return (
    <div>
      <Nav onLoginSuccess={handleLoginSuccess} />
      <div className="contenedor-principal">
        <div className="contenedor-logo">
          <img
            src={logo}
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
            {/* Mostrar solo el juego si la partida no está finalizada */}
            {partida && partida.estado !== "FINALIZADA" && (
              <Juego
                nombreUsuario={userInfo.name}
                partida={partida}
                reiniciarJuego={() => {
                  setPartida(null); // Reinicia la partida
                  setMostrarBotonComenzar(true); // Vuelve a mostrar el botón
                }}
              />
            )}

            {/* Mostrar el resumen de las respuestas solo cuando el estado de la partida sea finalizado */}
            {partida && partida.estado === "FINALIZADA" && (
              <DetallePartida partida={partida} finalizarJuego={finalizarJuego} />
            )}

            {/* Si no existe partida, mostrar el botón de comenzar juego */}
            {!partida && mostrarBotonComenzar && (
              <button onClick={comenzarJuego} className="boton-comenzar">
                Comenzar Juego
              </button>
            )}

            {/* Mostrar mensajes de carga o error */}
            {loading ? <p>Cargando la partida...</p> : error ? <p>{error}</p> : null}
          </div>
        ) : (
          <p>Por favor, inicia sesión para comenzar el juego.</p>
        )}
      </div>
    </div>
  );
};

export default PaginaPrincipal;
