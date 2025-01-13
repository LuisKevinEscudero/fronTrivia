import React, { useState, useEffect } from "react";
import IniciarSesion from "./IniciarSesion";
import "../css/Nav.css";

const Nav = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Guardar la información del usuario

  // Verifica si hay un token válido en localStorage al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expirationTime = localStorage.getItem("authTokenExpiration");
    const userId = localStorage.getItem("authUserId");
    const userName = localStorage.getItem("authUserName"); // Recuperamos el nombre del usuario

    // Verificamos si el token no ha expirado y si el userId y userName existen
    if (token && userId && userName && expirationTime && new Date().getTime() < expirationTime) {
      console.log("Token y UserName recuperados correctamente", token, userName);
      setUserInfo({ id: userId, name: userName, token });
    } else {
      console.log("Token o UserName no válidos, limpiando la sesión");
      setUserInfo(null); // Si no hay token o el token ha expirado, limpiar el estado
    }
  }, []);

  const handleLoginSuccess = (data) => {
    console.log("Inicio de sesión exitoso:", data);

    // Guardar el token, el ID y el nombre en localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUserId", data.usuarioId); // Guardamos el ID de usuario (usuarioId)
    localStorage.setItem("authUserName", data.nombreUsuario); // Guardamos el nombre del usuario
    localStorage.setItem("authTokenExpiration", new Date().getTime() + 24 * 60 * 60 * 1000); // Expiración en 1 día

    // Establecemos el estado con la nueva información
    setUserInfo({ id: data.usuarioId, name: data.nombreUsuario, token: data.token });

    setShowLogin(false); // Cerrar el modal de login
  };

  const handleLogout = () => {
    // Eliminar el token de localStorage y limpiar el estado
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUserId");
    localStorage.removeItem("authUserName");
    localStorage.removeItem("authTokenExpiration");
    setUserInfo(null); // Limpiar el estado del usuario
  };

  return (
    <nav className="nav-bar">
      {!userInfo ? (
        <button
          className="boton-iniciar-sesion"
          onClick={() => setShowLogin(true)}
        >
          Iniciar Sesión
        </button>
      ) : (
        <>
          <p>Bienvenido, {userInfo.name}</p> {/* Mostramos el nombre del usuario */}
          <button className="boton-cerrar-sesion" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </>
      )}

      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="cerrar-modal"
              onClick={() => setShowLogin(false)}
            >
              ×
            </button>
            <IniciarSesion onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
