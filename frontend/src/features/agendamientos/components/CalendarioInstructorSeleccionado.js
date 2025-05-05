import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModalModificar from "./modalModificar";
import ModalCrear from "./ModalCrear";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { obtenerEventos } from "../../../api/AgendamientoAPI";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  IconButton,
  Stack,
  Button
} from "@mui/material";
import { isSameDay } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const { idInstructor } = useParams();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nombreInstructor, setNombreInstructor] = useState("");

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const token = localStorage.getItem("token");

        // Corregido: ahora usamos la ruta correcta `/ver/:id`
        const usuarioRes = await axios.get(
          `http://localhost:3000/usuarios/ver/${idInstructor}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const nombreCompleto = `${usuarioRes.data.nombre} ${usuarioRes.data.apellido}`;
        setNombreInstructor(nombreCompleto);

        const eventosRes = await axios.get(
          `http://localhost:3000/agendamiento/instructor/${idInstructor}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const eventosFormateados = eventosRes.data.map((evento) => ({
          id: evento.id_agendamiento,
          title: `Hora: ${moment(evento.fecha_inicio).format("hh:mm A")} - Tipo: ${evento.tipo_visita}`,
          nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
          start: new Date(evento.fecha_inicio),
          end: new Date(evento.fecha_fin),
          estado: evento.estado_visita,
        }));

        setEventos(eventosFormateados);
      } catch (error) {
        console.error("Error al cargar eventos o instructor:", error);
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
    <Box sx={{ px: 2, pt: 1, mt: -2 }}>
      <IconButton onClick={() => navigate("/agendamientos/listaIntructores")}>
        <ArrowBackIcon />
      </IconButton>

      <Typography variant="h5" align="center" gutterBottom>
        Agenda de {nombreInstructor}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexDirection: "row", flexWrap: "wrap" }}>
        <Box sx={{ flex: 3, minWidth: "300px" }}>
        <Button
         onClick={() => navigate(`/reporte/agendamientos/${idInstructor}`)}
      variant="contained"
      sx={{
        backgroundColor: '#792382',  
        borderRadius: '20px',        
        textTransform: 'none',       
        fontWeight: 'bold',
        padding: '6px 16px',
        '&:hover': {
          backgroundColor: '#5e1b65', 
        },
      }}
    >
      Generar reporte de Agendamiento
    </Button>

          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            onSelectSlot={(slot) => setDiaSeleccionado(slot.start)}
            onSelectEvent={handleSelectEvent}
            selectable
            style={{ height: "70vh" }}
            eventPropGetter={(event) => {
              let backgroundColor = "#71277a";
              if (event.estado === "cancelado") backgroundColor = "#d32f2f";
              else if (event.estado === "realizado") backgroundColor = "#388e3c";

              return {
                style: {
                  backgroundColor,
                  color: "white",
                  borderRadius: "8px",
                  padding: "4px",
                  border: "none",
                },
              };
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            backgroundColor: "#fafafa",
            maxHeight: "70vh",
            overflowY: "auto",
            minWidth: "280px",
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
                  <ListItem onClick={() => handleSelectEvent(evento)} sx={{ cursor: "pointer" }}>
                    <Box>
                      <Typography fontWeight="bold">
                        {moment(evento.start).format("hh:mm A")}
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

          <Divider sx={{ mt: 2, mb: 1 }} />

          <Box>
          <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setModalCrearOpen(true)}
                  sx={{
                    backgroundColor: "#71277a",
                    "&:hover": {
                      backgroundColor: "#5a1e61",
                    },
                    color: "white"
                  }}
                >
                  Añadir visita
                </Button>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Estado de visitas:
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 16, height: 16, backgroundColor: "#71277a", borderRadius: "3px" }} />
                <Typography variant="body2">Pendiente</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 16, height: 16, backgroundColor: "#388e3c", borderRadius: "3px" }} />
                <Typography variant="body2">Realizado</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 16, height: 16, backgroundColor: "#d32f2f", borderRadius: "3px" }} />
                <Typography variant="body2">Cancelado</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      {modalOpen && (
        <ModalModificar
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          evento={eventoSeleccionado}
          soloLectura={true}
        />
      )}
       {modalCrearOpen && (
        <ModalCrear
        open={modalCrearOpen}
        onClose={() => setModalCrearOpen(false)}
        fechaSeleccionada={diaSeleccionado}
        idInstructor={idInstructor}
      />
            )}
    </Box>
  );
};

export default CalendarioInstructorSeleccionado;
