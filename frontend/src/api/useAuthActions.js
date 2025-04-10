import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/AuthAPI";

export function useAuthActions() {
  const { setUser, fetchUser } = useAuth(); // Se obtiene `fetchUser`
  const navigate = useNavigate();

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem("token", data.token);
      
      // Obtener los datos completos del usuario después del login
      await fetchUser();

      navigate("/usuarios");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error en el inicio de sesión");
    }
  };

  // Función para cerrar sesión

  const logout = () => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("token"); // 🔹 Eliminar token
    setUser(null); // 🔹 Resetear usuario
    window.location.href = "/"; // 🔹 Forzar redirección al login
  };



  return { login, logout };
}