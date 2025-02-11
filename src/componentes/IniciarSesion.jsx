import React, { useState, useEffect } from "react";
import "../css/IniciarSesion.css";

const IniciarSesion = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Estado para el checkbox "Recordar"
  const [error, setError] = useState("");

  // Recuperar las credenciales guardadas en localStorage si existe "rememberMe"
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    const storedRememberMe = localStorage.getItem("rememberMe");

    if (storedRememberMe === "true") {
      setEmail(storedEmail || "");
      setPassword(storedPassword || "");
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //const response = await fetch("https://triviaback-latest.onrender.com/api/autenticacion/login", {
      const response = await fetch("http://localhost:8080/api/autenticacion/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data);

        // Si "Recordar usuario y contraseña" está marcado, guardamos las credenciales
        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
          localStorage.setItem("rememberMe", true);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.setItem("rememberMe", false);
        }

        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="contenedor-iniciar-sesion">
        <button className="cerrar-modal" onClick={onClose}>
          &times;
        </button>
        <form className="formulario-iniciar-sesion" onSubmit={handleSubmit}>
          <h2>Iniciar Sesión</h2>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Recordar usuario y contraseña</label>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
