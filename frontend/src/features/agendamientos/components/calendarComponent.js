import { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventosContext from "../../../context/eventosProvider";
import ModalModificar from "./modalModificar";
import ModalCrear from "./ModalCrear";
import { Box, Typography, List, ListItem, Divider, Button } from "@mui/material";
import { isSameDay } from "date-fns";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  const { eventos } = useContext(EventosContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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

  
  // Celdas del calendario coloreadas según visitas
  const dateCellWrapper = ({ value, children }) => {
    const fechaActual = new Date(value);
    const hayEventos = eventos.some((evento) =>
      isSameDay(new Date(evento.start), fechaActual)
    );
  
    return (
      <div
        style={{
          backgroundColor: hayEventos ? "#a084dc" : "transparent",
          borderRadius: "6px",
          padding: "2px",
          minHeight: "100%", // para que ocupe bien la celda
        }}
      >
        {children}
      </div>
    );
  };
  
  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ height: "80vh", width: isDesktop ? "75%" : "100%" }}>
          <Calendar
            localizer={localizer}
            events={[]} // no mostrar eventos dentro del calendario
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            messages={messages}
            components={{ dateCellWrapper }}
            views={{ month: true }}
            defaultView="month"
            style={{ height: "100%", width: "100%" }}
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
                  <div key={evento.id_agendamiento || i}>
                    <ListItem
                      button
                      onClick={() => {
                        setEventoSeleccionado(evento);
                        setModalOpen(true);
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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

            <Box textAlign="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setModalCrearOpen(true)}
              >
                Añadir visita
              </Button>
            </Box>
          </Box>
        )}
      </div>

      {/* Modales */}
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
