import axiosInstance from './AxiosInstance';
import authAPI from './AuthAPI';


// 🔸 Obtener fichas activas
export const obtenerFichas = async () => {
    try {
      const { data } = await axiosInstance.get('/agendamiento/fichas');
      return data;
    } catch (error) {
      console.error("Error al obtener fichas:", error.response?.data || error.message);
      return [];
    }
  };
  
  // 🔸 Obtener aprendices por ficha
  export const obtenerAprendices = async (id_ficha) => {
    try {
      const { data } = await axiosInstance.get(`/agendamiento/aprendices/${id_ficha}`);
      return data;
    } catch (error) {
      console.error("Error al obtener aprendices:", error.response?.data || error.message);
      return [];
    }
  };
  
  // 🔸 Crear agendamiento
  export const crearEvento = async (nuevoEvento) => {
    try {
      const { data } = await axiosInstance.post('/agendamiento/crear', nuevoEvento);
      return data;
    } catch (error) {
      console.error("Error al crear agendamiento:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // 🔸 Obtener agendamientos según rol
  export const obtenerEventos = async () => {
    try {
      const usuario = await authAPI.getUserData();
  
      let url = "";
  
      if (usuario.rol === "Instructor") {
        url = "/agendamiento/instructor";
      } else if (usuario.rol === "aprendiz") {
        url = "/agendamiento/aprendiz";
      } else if (usuario.rol === "Administrador") {
        // Aquí podrías manejar un instructor seleccionado
        console.warn("Administrador necesita ID de instructor para ver agendamientos");
        return [];
      } else {
        throw new Error("Rol no válido para obtener agendamientos");
      }
  
      const { data } = await axiosInstance.get(url);
  
      return data.map(evento => {
        const fechaInicio = new Date(evento.fecha_inicio);
        const horaInicio = fechaInicio.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  
        return {
          id: evento.id_agendamiento,
          title: `Hora: ${horaInicio} - Tipo: ${evento.tipo_visita}`,
          nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
          telefonoAprendiz: evento.ficha_aprendiz?.aprendiz.telefono || "N/A",
          nombreEmpresa: evento.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.razon_social || "Sin empresa",
          direccion: evento.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.direccion || "Sin dirección",
          tipo_visita: evento.tipo_visita,
          enlace_reunion: evento.enlace_reunion,
          start: new Date(evento.fecha_inicio),
          end: new Date(evento.fecha_fin),
          ficha: evento.ficha_aprendiz?.id_ficha,
          estado: evento.estado_visita,
        };
      });
  
    } catch (error) {
      console.error("Error al obtener eventos:", error.response?.data || error.message);
      return [];
    }
  };

  export const obtenerEventosPorInstructor = async (idInstructor) => {
    try {
      const { data } = await axiosInstance.get(`/agendamiento/instructor/${idInstructor}`);
  
      return data.map(evento => {
        const fechaInicio = new Date(evento.fecha_inicio);
        const horaInicio = fechaInicio.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  
        return {
          id: evento.id_agendamiento,
          title: `Hora: ${horaInicio} - Tipo: ${evento.tipo_visita}`,
          nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
          telefonoAprendiz: evento.ficha_aprendiz?.aprendiz.telefono || "N/A",
          nombreEmpresa: evento.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.razon_social || "Sin empresa",
          direccion: evento.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.direccion || "Sin dirección",
          tipo_visita: evento.tipo_visita,
          enlace_reunion: evento.enlace_reunion,
          start: new Date(evento.fecha_inicio),
          end: new Date(evento.fecha_fin),
          ficha: evento.ficha_aprendiz?.id_ficha,
          estado: evento.estado_visita
        };
      });
    } catch (error) {
      console.error("Error al obtener eventos del instructor seleccionado:", error.response?.data || error.message);
      return [];
    }
  };
  
  // 🔸 Modificar agendamiento
  export const actualizarEvento = async (id, datosActualizados) => {
    try {
      const { data } = await axiosInstance.put(`/agendamiento/modificar/${id}`, datosActualizados);
      return data;
    } catch (error) {
      console.error("Error al actualizar evento:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // 🔸 Eliminar agendamiento
  export const eliminarEvento = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/agendamiento/eliminar/${id}`);
      return data;
    } catch (error) {
      console.error("Error al eliminar evento:", error.response?.data || error.message);
      throw error;
    }
  };