import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/navbar";
import { AuthProvider } from "./context/AuthProvider";
import { EventosProvider } from "./context/eventosProvider";
import ProtectedRoute from "./components/ProtectedRouter";

// 🔹 Paginas login
import IniciarSesion from "./features/auth/Login";
import SolicitarRestablecimiento from "./features/auth/RecuperarContrasenia";
import RestablecerContrasenia from "./features/auth/RestablecerContrasenia";

// pagina inicio
import PagInicio from "./features/inicio_pagina/incio";
// 🔹 Paginas usuarios
import UsersPage from "./features/usuarios/UsersPage";

// 🔹 Paginas fichas
import FichasTable from "./features/fichas/fichasPage";
import FichaDetalle from "./features/fichas/VerFicha";

// 🔹 Calendario
import Calendario from "./features/agendamientos/components/calendarComponent";

// 🔹 Página no autorizada
import NoAutorizado from "./components/NoAutorizado";

// 🔹 Página de seguimiento
import BitacoraDocumentosApp from "./features/Seguimiento/SeguimientoAdmin";

function App() {
  return (
    <AuthProvider>
      <EventosProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={  <IniciarSesion />} />
            <Route path="/solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />
            <Route path="/restablecer-contrasenia/:token" element={<RestablecerContrasenia />} />
            <Route path="/no-autorizado" element={<NoAutorizado />} />

            {/* Rutas protegidas */}
            <Route
              path="/*"
              element={
                <Navbar>
                  <Routes>
                    <Route 
                    path="/Inicio"
                    element={
                      <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'aprendiz']} >
                        <PagInicio />
                      </ProtectedRoute>
                    }
                    />
                    <Route
                      path="/usuarios"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador']}>
                          <UsersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agendamientos"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'aprendiz']}>
                          <Calendario />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/fichas"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor']}>
                          <FichasTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/fichas/ver/:id"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor']}>
                          <FichaDetalle />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/seguimiento"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor']}>
                          <BitacoraDocumentosApp />
                        </ProtectedRoute>
                      }
                      />
                    
                  </Routes>
                </Navbar>
              }
            />
          </Routes>
        </Router>
      </EventosProvider>
    </AuthProvider>
  );
}

export default App;
