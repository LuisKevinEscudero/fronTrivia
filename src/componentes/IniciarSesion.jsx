import React, { useState } from "react";
import "../css/IniciarSesion.css";

const IniciarSesion = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
          {error && <p className="error">{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default IniciarSesion;
