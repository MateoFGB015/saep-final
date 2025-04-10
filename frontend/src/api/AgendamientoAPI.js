import axiosInstance from './AxiosInstance';



// esto es para seleccionar un aprendiz en el select con una ficha seleccionada tambien del select
export const obtenerFichas = async () => {
  try {
    const { data } = await axiosInstance.get("/agendamiento/ver-fichas");
    return data;
  } catch (error) {
    console.error("Error al obtener fichas:", error.response?.data || error.message);
    return [];
  }
};

// Obtener aprendices de una ficha específica
export const obtenerAprendices = async (idFicha) => {
  try {
    const { data } = await axiosInstance.get(`/agendamiento/ver-aprendiz/${idFicha}`);
    return data;
  } catch (error) {
    console.error("Error al obtener aprendices:", error.response?.data || error.message);
    return [];
  }
};
//-------------------------------------------------------------------------------------------------------


// Crear un nuevo agendamiento (evento)
export const crearEvento = async (nuevoEvento) => {
    try {
        const { data } = await axiosInstance.post("/agendamiento/crear", nuevoEvento);

        return {
            title: `Hora: ${new Date(data.fecha_inicio).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })} - Tipo: ${data.tipo_visita}`,
            nombreAprendiz: `${data.ficha_aprendiz?.aprendiz.nombre} ${data.ficha_aprendiz?.aprendiz.apellido}`,
            telefonoAprendiz: data.ficha_aprendiz?.aprendiz.telefono || "N/A",
            nombreEmpresa: data.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.razon_social || "Sin empresa",
            direccion: data.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.direccion || "Sin dirección",
            tipo_visita: data.tipo_visita,
            enlace_reunion: data.enlace_reunion,
            start: new Date(data.fecha_inicio),
            end: new Date(data.fecha_fin),
            ficha: data.ficha_aprendiz?.id_ficha,
            estado: data.estado_visita
        };
    } catch (error) {
        console.error("Error al crear el evento:", error.response?.data || error.message);
        throw error;
    }
};



export const obtenerEventos = async () => {
    try {
        const { data } = await axiosInstance.get("/agendamiento/ver");

        return data.map(evento => {
            const fechaInicio = new Date(evento.fecha_inicio);
            const horaInicio = fechaInicio.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // AM Y PM
            });

            return {
                id: evento.id_agendamiento,
                title: ` Hora: ${horaInicio} - Tipo: ${evento.tipo_visita}`,
                nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
                telefonoAprendiz:`${evento.ficha_aprendiz?.aprendiz.telefono}`,
                nombreEmpresa:`${evento.ficha_aprendiz?.aprendiz.detalle_aprendiz.empresa.razon_social}`,
                direccion: `${evento.ficha_aprendiz?.aprendiz.detalle_aprendiz.empresa.direccion}`,
                tipo_visita:evento.tipo_visita,
                enlace_reunion: evento.enlace_reunion,
                start: fechaInicio,
                end: new Date(evento.fecha_fin),
                // instructor: `${evento.instructor?.nombre} ${evento.instructor?.apellido}`,
                ficha: evento.ficha_aprendiz?.id_ficha,
                estado: evento.estado_visita
            };
        });
    } catch (error) {
        console.error("Error al obtener eventos:", error.response?.data || error.message);
        return [];
    }
};


// Actualizar un agendamiento (evento)
export const actualizarEvento = async (id, datosActualizados) => {
    try {
        const { data } = await axiosInstance.put(`/agendamiento/modificar/${id}`, datosActualizados);

        return {
            id: data.id_agendamiento,
            title: `Hora: ${new Date(data.fecha_inicio).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })} - Tipo: ${data.tipo_visita}`,
            nombreAprendiz: `${data.ficha_aprendiz?.aprendiz.nombre} ${data.ficha_aprendiz?.aprendiz.apellido}`,
            telefonoAprendiz: data.ficha_aprendiz?.aprendiz.telefono || "N/A",
            nombreEmpresa: data.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.razon_social || "Sin empresa",
            direccion: data.ficha_aprendiz?.aprendiz.detalle_aprendiz?.empresa?.direccion || "Sin dirección",
            tipo_visita: data.tipo_visita,
            enlace_reunion: data.enlace_reunion,
            start: new Date(data.fecha_inicio),
            end: new Date(data.fecha_fin),
            ficha: data.ficha_aprendiz?.id_ficha,
            estado: data.estado_visita
        };
    } catch (error) {
        console.error("Error al actualizar el evento:", error.response?.data || error.message);
        throw error;
    }
};


export const eliminarEvento = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/agendamiento/eliminar/${id}`);
        return data;    
    } catch (error) {
        console.error("Error al eliminar el evento:", error.response?.data || error.message);
        throw error;
    }
};