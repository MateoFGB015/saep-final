import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Interceptor para agregar token en cada petición
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
