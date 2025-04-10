import { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventosContext from "../../../context/eventosProvider";
import ModalModificar from "./modalModificar";
import ModalCrear from "./ModalCrear";
import { Box, Typography, List, ListItem, Divider } from "@mui/material";
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

const eventStyleGetter = (event) => {
  let borderColor = "#3788d8";
  if (event.estado === "pendiente") borderColor = "#f39c12";
  else if (event.estado === "realizado") borderColor = "#2ecc71";
  else if (event.estado === "cancelado") borderColor = "#e74c3c";

  return {
    style: {
      borderLeft: `4px solid ${borderColor}`,
      padding: "4px",
      marginBottom: "2px",
      color: "black",
      backgroundColor: "transparent",
      borderRadius: "0px",
      borderTop: "none",
      borderRight: "none",
      borderBottom: "none",
      fontSize: "12px",
    },
  };
};

const Calendario = () => {
  const { eventos } = useContext(EventosContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleSelectEvent = (evento) => {
    setEventoSeleccionado(evento);
    setModalOpen(true);
    setDiaSeleccionado(new Date(evento.start));
  };

  const handleSelectSlot = (slotInfo) => {
    setFechaSeleccionada(slotInfo.start);
    setDiaSeleccionado(slotInfo.start);
    setModalCrearOpen(true);
  };

  const eventosDelDia = eventos.filter((evento) =>
    isSameDay(new Date(evento.start), diaSeleccionado)
  );

  return (
    <>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Calendario */}
        <div style={{ height: "80vh", width: isDesktop ? "80%" : "100%" }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            messages={messages}
            eventPropGetter={eventStyleGetter}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            views={{ month: true, week: true, agenda: true }}
            defaultView="month"
            length={365}
            style={{ height: "100%", width: "100%" }}
          />
        </div>

        {/* Agenda lateral solo en pc */}
        {isDesktop && (
          <Box
            sx={{
              width: "30%",
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              height: "min-content",
              maxHeight:"80vh",
              overflowY: "auto",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                textAlign: "center",
                padding: 1,
                borderBottom: "1px solid #ccc",
              }}
            >
              Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
            </Typography>

            {eventosDelDia.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay visitas para este día.
              </Typography>
            ) : (
              <List>
                {eventosDelDia.map((evento, index) => {
                  const { style } = eventStyleGetter(evento);
                  const borderColor = style.borderLeft.split(" ")[2];

                  return (
                    <div key={index}>
                      <ListItem
                        button
                        onClick={() => {
                          setEventoSeleccionado(evento);
                          setModalOpen(true);
                        }}
                      >
                        <Box sx={{ borderLeft: `3px solid ${borderColor}`, p: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            {evento.tipo_visita}
                          </Typography>
                          <Typography variant="body2">
                            {moment(evento.start).format("HH:mm")} - {moment(evento.end).format("HH:mm")}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aprendiz: {evento.nombreAprendiz}
                          </Typography>
                        </Box>
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
              </List>
            )}
          </Box>
        )}
      </div>

      {/* Modal de Modificación */}
      {modalOpen && (
        <ModalModificar
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          evento={eventoSeleccionado}
        />
      )}

      {/* Modal de Creación */}
      {modalCrearOpen && (
        <ModalCrear
          open={modalCrearOpen}
          onClose={() => setModalCrearOpen(false)}
          fechaSeleccionada={fechaSeleccionada}
        />
      )}
    </>
  );
};

export default Calendario;