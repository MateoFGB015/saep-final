//APIS que uso el modulo de login

import axiosInstance from "./AxiosInstance";

const authAPI = {
  login: async (correo_electronico, password) => {
    try {
      const response = await axiosInstance.post("/inicio/login", { correo_electronico, password });
      return response.data;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  },

  getUserData: async (token) => {
    try {
      const response = await axiosInstance.get("/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error);
      throw error;
    }
  },

  solicitarRestablecimiento: async (correo_electronico) => {
    try {
      const response = await axiosInstance.post("/inicio/solicitar-restablecimiento", { correo_electronico });
      return response.data;
    } catch (error) {
      console.error("Error solicitando restablecimiento de contraseña:", error);
      throw error;
    }
  },

  restablecerContrasenia: async (token, nueva_contrasenia) => {
    try {
      const response = await axiosInstance.post(`/inicio/restablecer-contrasenia/${token}`, { nueva_contrasenia });
      return response.data;
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authAPI;
