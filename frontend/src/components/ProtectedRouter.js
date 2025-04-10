import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  // Mientras carga el usuario, no renderices nada (o puedes mostrar un spinner)
  if (loading) {
    return <div>Cargando...</div>; // o un componente <Spinner />
  }

  // Si no hay usuario, redirige al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay restricción de roles, verifica
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;
