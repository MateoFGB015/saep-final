import axios from "axios";
import { useAuth } from "../auth/AuthProvider"; // Importamos el contexto

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor para incluir token en todas las peticiones
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores global (token expirado, 401, etc.)
axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout(); // Cierra sesión automáticamente si el token no es válido
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
