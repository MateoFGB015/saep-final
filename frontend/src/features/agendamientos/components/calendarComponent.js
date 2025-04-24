import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { obtenerEventos } from "../../../api/AgendamientoAPI";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../../../context/AuthProvider";
import ModalModificar from "./modalModificar";
import ModalCrear from "./ModalCrear";
import { Box, Typography, List, ListItem, Divider, Button } from "@mui/material";
import { isSameDay } from "date-fns";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const { user } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const datos = await obtenerEventos();
        setEventos(datos);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };
    if (user?.rol) cargarEventos();
  }, [user?.rol]);

  const handleSelectEvent = (evento) => {
    setEventoSeleccionado(evento);
    setModalOpen(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setDiaSeleccionado(slotInfo.start);
  };

  const eventosDelDia = eventos.filter((evento) =>
    isSameDay(new Date(evento.start), diaSeleccionado)
  );

  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ height: "80vh", width: isDesktop ? "75%" : "100%" }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            onSelectSlot={(slot) => setDiaSeleccionado(slot.start)}
            onSelectEvent={handleSelectEvent}
            selectable
            views={{ month: true, week: true, day: true, agenda: true }}
            defaultView="month"
            style={{ height: "100%", width: "100%" }}
            eventPropGetter={(event) => {
              let backgroundColor = "#71277a"; // morado por defecto
              if (event.estado === "cancelado") {
                backgroundColor = "#d32f2f";
              } else if (event.estado === "realizado") {
                backgroundColor = "#388e3c";
              }
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
        </div>

        {isDesktop && (
          <Box
            sx={{
              width: "25%",
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              height: "min-content",
              maxHeight: "80vh",
              overflowY: "auto",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="h6" textAlign="center" mb={2}>
              Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
            </Typography>

            {eventosDelDia.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay visitas para este día.
              </Typography>
            ) : (
              <List>
                {eventosDelDia.map((evento, i) => (
                  <div key={evento.id || i}>
                    <ListItem
                      button
                      onClick={() => {
                        setEventoSeleccionado(evento);
                        setModalOpen(true);
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {evento.tipo_visita === "virtual" ? "🖥️ Virtual" : "🏢 Presencial"}
                        </Typography>
                        <Typography variant="body2">
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

            {user?.rol === "Instructor" && (
              <Box textAlign="center" mt={2}>
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
              </Box>
            )}

<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    mt: 2,
    flexWrap: "wrap",
  }}
>
  {[
    { color: "white", label: "Sin visitas", border: "1px solid #ccc" },
    { color: "#71277a", label: "Pendiente" },
    { color: "#388e3c", label: "Realizada" },
    { color: "#d32f2f", label: "Cancelada" },
  ].map(({ color, label, border }) => (
    <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 20,
          height: 20,
          backgroundColor: color,
          borderRadius: "4px",
          border: border || "none",
        }}
      />
      <Typography variant="body2">{label}</Typography>
    </Box>
  ))}
</Box>
          </Box>

          
        )}
      </div>

      {modalOpen && (
        <ModalModificar
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          evento={eventoSeleccionado}
        />
      )}

      {modalCrearOpen && (
        <ModalCrear
          open={modalCrearOpen}
          onClose={() => setModalCrearOpen(false)}
          fechaSeleccionada={diaSeleccionado}
        />
      )}
    </>
  );
};

export default Calendario;
