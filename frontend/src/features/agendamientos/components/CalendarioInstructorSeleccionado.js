import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModalModificar from "./modalModificar";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Typography, List, ListItem, Divider } from "@mui/material";
import { isSameDay } from "date-fns";

moment.locale("es");
const localizer = momentLocalizer(moment);

const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay visitas programadas",
  showMore: (total) => `(+${total}) visitas`,
};

const CalendarioInstructorSeleccionado = () => {
  const { idInstructor } = useParams();
  const [eventos, setEventos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:3000/agendamiento/instructor/${idInstructor}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const eventosFormateados = data.map((evento) => ({
          id: evento.id_agendamiento,
          title: `Hora: ${moment(evento.fecha_inicio).format("hh:mm A")} - Tipo: ${evento.tipo_visita}`,
          nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
          start: new Date(evento.fecha_inicio),
          end: new Date(evento.fecha_fin),
        }));

        setEventos(eventosFormateados);
      } catch (error) {
        console.error("Error al cargar eventos del instructor:", error);
      }
    };

    if (idInstructor) {
      cargarEventos();
    }
  }, [idInstructor]);

  const handleSelectEvent = (evento) => {
    setEventoSeleccionado(evento);
    setModalOpen(true);
  };
  

  const eventosDelDia = eventos.filter((evento) =>
    isSameDay(new Date(evento.start), diaSeleccionado)
  );

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2 }}>
      <Box sx={{ flex: 3 }}>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          onSelectSlot={(slot) => setDiaSeleccionado(slot.start)}
          onSelectEvent={handleSelectEvent}
          selectable
          style={{ height: "80vh" }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 2,
          backgroundColor: "#fafafa",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" textAlign="center" mb={2}>
          Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
        </Typography>

        {eventosDelDia.length === 0 ? (
          <Typography color="text.secondary">No hay visitas para este día.</Typography>
        ) : (
          <List>
            {eventosDelDia.map((evento, i) => (
              <div key={evento.id || i}>
                <ListItem>
                  <Box>
                    <Typography fontWeight="bold">
                      {evento.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aprendiz: {evento.nombreAprendiz}
                    </Typography>
                  </Box>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </Box>
      {modalOpen && (
  <ModalModificar
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    evento={eventoSeleccionado}
    soloLectura={true} // Esto le indica al modal que solo muestre los datos
  />
)}
    </Box>
  );
};

export default CalendarioInstructorSeleccionado;
