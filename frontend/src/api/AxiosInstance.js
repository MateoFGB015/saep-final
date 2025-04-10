//AXIOS general que se usa en todas las llamadas de APIS

import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // etsa es la url general que se usa en back

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Si el backend maneja cookies de autenticación
});

export default axiosInstance;
