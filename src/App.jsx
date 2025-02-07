/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./componentes/PaginaPrincipal";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
};

export default App;

*/
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./componentes/PaginaPrincipal";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<PaginaPrincipal />} />
      </Routes>
    </Router>
  );
};

export default App;
