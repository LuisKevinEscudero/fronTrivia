import React, { useState, useEffect } from "react";
import IniciarSesion from "./IniciarSesion";
import Registro from "./Registro"; // Importamos el componente de registro
import "../css/Nav.css";

const Nav = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Estado para mostrar el registro
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
      if (!userInfo || userInfo.id !== userId) { // Solo actualizar si el usuario es diferente
        setUserInfo({ id: userId, name: userName, token });
        if (onLoginSuccess) {
          onLoginSuccess(userName); // Llamamos al callback para propagar el nombre de usuario
        }
      }
    } else {
      console.log("Token o UserName no válidos, limpiando la sesión");
      if (userInfo) {
        setUserInfo(null); // Limpiar el estado si el token es inválido
      }
    }
  }, [userInfo, onLoginSuccess]); // Asegúrate de que 'userInfo' sea parte de las dependencias

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
    if (onLoginSuccess) {
      onLoginSuccess(data.nombreUsuario); // Pasar el nombre de usuario a la página principal
    }
  };

  const handleLogout = () => {
    // Eliminar el token de localStorage y limpiar el estado
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUserId");
    localStorage.removeItem("authUserName");
    localStorage.removeItem("authTokenExpiration");
    setUserInfo(null); // Limpiar el estado del usuario
  };

  const handleCloseModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    document.body.style.overflow = "auto"; // Permitir el desplazamiento del body
  };

  const openLoginModal = () => {
    setShowLogin(true);
    setShowRegister(false);
    document.body.style.overflow = "hidden"; // Evitar que se desplace el body
  };

  const openRegisterModal = () => {
    setShowRegister(true);
    setShowLogin(false);
    document.body.style.overflow = "hidden"; // Evitar que se desplace el body
  };

  return (
    <nav className="nav-bar">
      {!userInfo ? (
        <>
          <button
            className="boton-iniciar-sesion"
            onClick={openLoginModal}
          >
            Iniciar Sesión
          </button>
          <button
            className="boton-registrarse"
            onClick={openRegisterModal} // Abre el modal de registro
          >
            Registrarse
          </button>
        </>
      ) : (
        <>
          <span className="nombre-usuario">{userInfo.name}</span> {/* Mostramos el nombre del usuario */}
          <button className="boton-cerrar-sesion" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </>
      )}

      {showLogin && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} >
            <button
              className="cerrar-modal"
              onClick={handleCloseModals}
            >
              ×
            </button>
            <IniciarSesion onLoginSuccess={handleLoginSuccess} onClose={handleCloseModals} />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="cerrar-modal"
              onClick={handleCloseModals}
            >
              ×
            </button>
            <Registro onClose={handleCloseModals} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
