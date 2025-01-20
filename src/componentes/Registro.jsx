import React, { useState } from "react";
import "../css/Registro.css";

const RegistroUsuario = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    email: "",
    password: "",
    tipoCuenta: "TRADICIONAL",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/api/usuario/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nombreUsuario: "",
          email: "",
          password: "",
          tipoCuenta: "TRADICIONAL",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al registrar el usuario.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
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
          <h2>Registro de Usuario</h2>
          <div>
            <label htmlFor="nombreUsuario">Nombre de Usuario:</label>
            <input
              id="nombreUsuario"
              name="nombreUsuario"
              type="text"
              value={formData.nombreUsuario}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="tipoCuenta">Tipo de Cuenta:</label>
            <select
              id="tipoCuenta"
              name="tipoCuenta"
              value={formData.tipoCuenta}
              onChange={handleChange}
            >
              <option value="TRADICIONAL">Tradicional</option>
              <option value="GOOGLE">Google</option>
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">Usuario registrado con éxito.</p>}
          <button type="submit">Registrar</button>
          <button
            type="button"
            className="cerrar-registro"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroUsuario;
