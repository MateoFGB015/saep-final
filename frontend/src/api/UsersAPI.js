//APIS que uso el modulo usuarios

import axiosInstance from "./AxiosInstance";

const usersAPI = {

  crearUsuario: async (formData, token) => {
    try {
      const response = await axiosInstance.post("/usuarios/crear", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error en crearUsuario:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear el usuario",
      };
    }
  },



  getUsers: async (token) => {
    const response = await axiosInstance.get("/usuarios/ver", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getUserById: async (id, token) => {
    try {
      const response = await axiosInstance.get(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error en getUserById:", error.response?.data || error.message);
      return null;
    }
  },



  modificarUsuario: async (usuario, token) => {
    try {
      const response = await axiosInstance.put(`/usuarios/modificar/${usuario.id_usuario}`, usuario, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error en modificarUsuario:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Error al actualizar el usuario",
      };
    }
  },

  eliminarUsuario: async (idUsuario, token) => {
    try {
      const response = await axiosInstance.patch(`/usuarios/eliminar/${idUsuario}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      throw error;
    }
  },
};


export default usersAPI;
