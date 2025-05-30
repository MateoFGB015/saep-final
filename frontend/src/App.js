import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/navbar"; // Importar Navbar
import { AuthProvider } from "./context/AuthProvider";
import { EventosProvider } from "./context/eventosProvider";
import ProtectedRoute from "./components/ProtectedRouter";

// import './index.css'; 
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "./styles/theme"; // Importar el tema

// 🔹 Páginas login
import IniciarSesion from "./features/auth/Login";
import SolicitarRestablecimiento from "./features/auth/RecuperarContrasenia";
import RestablecerContrasenia from "./features/auth/RestablecerContrasenia";

// Página de inicio
import PagInicio from "./features/inicio_pagina/incio";
// 🔹 Páginas usuarios
import UsersPage from "./features/usuarios/UsersPage";

// 🔹 Páginas fichas
import FichasTable from "./features/fichas/fichasPage";
import FichaDetalle from "./features/fichas/VerFicha";

// 🔹 Calendario
import ListaInstructores from "./features/agendamientos/components/listaIntrcutores";
import CalendarioInstructorSeleccionado from "./features/agendamientos/components/CalendarioInstructorSeleccionado";
import Calendario from "./features/agendamientos/components/calendarComponent";


// 🔹 Página no autorizada
import NoAutorizado from "./components/NoAutorizado";

// 🔹 Página de seguimiento
import BitacoraDocumentosApp from "./features/Seguimiento/seguimientoAprendiz";

// 🔹 Reportes 
import ReporteAprendiz from "./features/Reportes/tablas/ReportAprendiz";
import ReporteAgendamientos from './features/Reportes/tablas/ReportAgendamiento';
import ReporteGFPI from './features/Reportes/tablas/ReportGFPI';


// 🔹 Página de creación del aprendiz
import FormularioAprendiz from "./features/Registro/Aprendiz";

function App() {
  return (
    // <ThemeProvider theme={theme}>
    <AuthProvider>
      <EventosProvider>
        <Router >
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<IniciarSesion />} />
            <Route path="/solicitar-restablecimiento" element={<SolicitarRestablecimiento />} />
            <Route path="/restablecer-contrasenia/:token" element={<RestablecerContrasenia />} />
            <Route path="/no-autorizado" element={<NoAutorizado />} />
            <Route path="/registro-aprendiz" element={<FormularioAprendiz />} />

            {/* Rutas protegidas con Navbar */}
            <Route
              path="/*"
              element={
                <Navbar>
                  <Routes>
                    <Route
                      path="/Inicio"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'aprendiz']}>
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
                        <ProtectedRoute allowedRoles={['Instructor', 'aprendiz']}>
                          <Calendario />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agendamientos/listaIntructores"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador']}>
                          < ListaInstructores />
                        </ProtectedRoute>
                      }
                    />           
                     <Route
                    path="/agendamientos/instructor/:idInstructor"
                    element={
                      <ProtectedRoute allowedRoles={['Administrador']}>
                        <CalendarioInstructorSeleccionado />
                      </ProtectedRoute>
                    }
                  />
               <Route path="/reporte/agendamientos/:idInstructor" element={<ProtectedRoute allowedRoles={['Administrador']}> <ReporteAgendamientos /> </ProtectedRoute>} />
               <Route path="/reporte/agendamientos/" element={<ProtectedRoute allowedRoles={['Instructor']}> <ReporteAgendamientos /> </ProtectedRoute>} />


                     <Route
                      path="/seguimiento"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'aprendiz']}>
                          < BitacoraDocumentosApp />
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
                    <Route path="/reporte/aprendiz/:id" element={<ProtectedRoute allowedRoles={['Administrador', 'Instructor']}><ReporteAprendiz /></ProtectedRoute> } />




                    <Route
                      path="/seguimiento"
                      element={
                        <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'Aprendiz']}>
                          <BitacoraDocumentosApp />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/seguimiento/:id_usuario" element={  <ProtectedRoute allowedRoles={['Administrador', 'Instructor', 'Aprendiz']}><BitacoraDocumentosApp /></ProtectedRoute> } />
                  
                 <Route path="/reporte/gfpi/:id" element={ <ProtectedRoute allowedRoles={['Administrador', 'Instructor']}> <ReporteGFPI /> </ProtectedRoute> } />

                  </Routes>
                </Navbar>
              }
            />
          </Routes>
        </Router>
      </EventosProvider>
    </AuthProvider>
    // </ThemeProvider>
  );
}

export default App;
