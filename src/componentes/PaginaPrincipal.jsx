import React from "react";
import "../css/PaginaPrincipal.css"; // Estilos de la página principal
import Nav from "./Nav"; // Importamos el componente de navegación

const PaginaPrincipal = () => {
  return (
    <div>
      <Nav /> {/* Aquí agregamos el componente de nav */}
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
      </div>
    </div>
  );
};

export default PaginaPrincipal;
