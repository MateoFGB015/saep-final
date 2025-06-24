import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../../../context/AuthProvider";
import ModalModificar from "./modalModificar";
import SolicitarVisitaModal from "../../../components/ui/SolicitarVisitaModal";
import ModalCrear from "./ModalCrear";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  Container,
  Fab,
  Stack
} from "@mui/material";
import { isSameDay } from "date-fns";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddIcon from "@mui/icons-material/Add";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { obtenerEventos } from "../../../api/AgendamientoAPI";


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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const { token } = useAuth();
    const [openModal, setOpenModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const datos = await obtenerEventos();
        const eventosNormalizados = datos.map(ev => {
          const inicio = new Date(ev.start);
          const finOriginal = new Date(ev.end);
          const fin = moment(inicio).isSame(finOriginal, 'day')
            ? finOriginal
            : moment(inicio).add(1, 'hour').toDate();

          return {
            ...ev,
            start: inicio,
            end: fin,
            estado: ev.estado?.toLowerCase() || "pendiente"
          };
        });
        setEventos(eventosNormalizados);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };

    if (user?.rol) cargarEventos();
  }, [user?.rol]);

  const eventosDelDia = eventos.filter((evento) =>
    isSameDay(new Date(evento.start), diaSeleccionado)
  );

  const getCalendarStyles = () => ({
    height: isMobile ? "50vh" : isTablet ? "55vh" : isSmallTablet ? "60vh" : "70vh",
    backgroundColor: "#ffffff",
    borderRadius: isMobile ? "8px" : "12px",
    padding: isMobile ? "8px" : isTablet ? "12px" : "20px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e0e0",
    fontSize: isMobile ? "0.75rem" : isTablet ? "0.85rem" : "1rem",
    ...(isMobile && {
      '& .rbc-toolbar': {
        flexWrap: 'wrap',
        gap: '4px',
        marginBottom: '8px',
      },
      '& .rbc-toolbar button': {
        fontSize: '0.7rem',
        padding: '4px 6px',
        minWidth: 'auto',
      },
      '& .rbc-toolbar-label': {
        fontSize: '0.85rem',
        fontWeight: 'bold',
      },
      '& .rbc-month-view': {
        fontSize: '0.7rem',
      },
      '& .rbc-date-cell': {
        padding: '2px',
        minHeight: '30px',
        cursor: 'pointer',
      },
      '& .rbc-event': {
        fontSize: '0.6rem',
        padding: '1px 3px',
      },
      '& .rbc-header': {
        fontSize: '0.75rem',
        padding: '4px',
      }
    })
  });

  const handleSelectEvent = (evento) => {
    setEventoSeleccionado(evento);
    setModalOpen(true);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 2, pb: 5 }}>
      <Box sx={{
        display: "flex",
        gap: { xs: 2, md: 3 },
        flexDirection: { xs: "column", md: "row" },
        height: { xs: 'auto', md: 'calc(100vh - 200px)' },
      }}>
        <Box sx={{
          flex: { xs: "none", md: 3 },
          width: { xs: "100%", md: "auto" },
          minWidth: { xs: "100%", md: "300px" },
        }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            onSelectSlot={(slot) => setDiaSeleccionado(slot.start)}
            onSelectEvent={handleSelectEvent}
            onNavigate={(date) => setDiaSeleccionado(date)}
            selectable
            views={{ month: true, week: true, day: true }}
            defaultView="month"
            popup={!isMobile}
            popupOffset={{ x: 10, y: 10 }}
            style={getCalendarStyles()}
            eventPropGetter={(event) => {
              let backgroundColor = "#71277a";
              if (event.estado === "cancelado") backgroundColor = "#d32f2f";
              else if (event.estado === "realizado") backgroundColor = "#388e3c";

              return {
                style: {
                  backgroundColor,
                  color: "white",
                  borderRadius: isMobile ? "4px" : "8px",
                  padding: isMobile ? "2px 4px" : isTablet ? "3px 5px" : "4px 6px",
                  border: "none",
                  fontSize: isMobile ? "0.6rem" : isTablet ? "0.7rem" : "0.8rem",
                  fontWeight: "500",
                  lineHeight: isMobile ? 1.1 : 1.2,
                },
              };
            }}
            dayPropGetter={(date) => {
              const isSelected = isSameDay(date, diaSeleccionado);
              return {
                style: {
                  backgroundColor: isSelected ? 'rgba(113, 39, 122, 0.15)' : undefined,
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #71277a' : undefined,
                  borderRadius: isSelected ? '4px' : undefined,
                },
                onClick: () => setDiaSeleccionado(date),
              };
            }}
          />
        </Box>

        <Box sx={{
          flex: { md: 1 },
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: { sm: 2, md: 3 },
          backgroundColor: "#ffffff",
          overflowY: "auto",
          minWidth: { sm: "250px", md: "280px" },
          boxShadow: "0 4px 8px rgba(0,0,0,0.04)",
        }}>
          <Typography
            variant={isTablet ? "subtitle1" : "h6"}
            textAlign="center"
            mb={2}
            sx={{
              fontWeight: "bold",
              color: "#4a0072"
            }}
          >
            Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
          </Typography>

          {eventosDelDia.length === 0 ? (
            <Typography textAlign="center" color="text.secondary" variant="body2">
              No hay visitas para este día.
            </Typography>
          ) : (
            <List>
              {eventosDelDia.map((evento, i) => (
                <div key={i}>
                  <ListItem button onClick={() => handleSelectEvent(evento)}>
                    <Box>
                      <Typography fontWeight="bold" sx={{ color: "#4a0072", mb: 0.5 }}>
                        {moment(evento.start).format("hh:mm A")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Aprendiz: {evento.nombreAprendiz}
                      </Typography>
                    </Box>
                  </ListItem>
                  {i < eventosDelDia.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={() => setModalCrearOpen(true)}
            sx={{
              backgroundColor: "#71277a",
              mt: 2,
              "&:hover": { backgroundColor: "#5a1e61" },
              color: "white",
              fontWeight: "bold",
            }}
          >
            Añadir visita
          </Button>

          <Stack spacing={1} mt={3}>
            {[
              { color: "#71277a", label: "Pendiente" },
              { color: "#388e3c", label: "Realizado" },
              { color: "#d32f2f", label: "Cancelado" },
            ].map(({ color, label }) => (
              <Box key={label} display="flex" alignItems="center" gap={1}>
                <Box sx={{ width: 12, height: 12, backgroundColor: color, borderRadius: "50%" }} />
                <Typography variant="body2">{label}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      {isMobile && (
        <Box sx={{ position: "fixed", bottom: 20, right: 16, zIndex: 1400 }}>
          <Fab
            color="primary"
            onClick={() => setModalCrearOpen(true)}
            sx={{
              backgroundColor: "#71277a",
              "&:hover": { backgroundColor: "#5a1e61" }
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

{!isMobile && user?.rol === "Instructor" && (
  <Button
    onClick={() => navigate('/reporte/agendamientos')}
    variant="contained"
    startIcon={<PictureAsPdfIcon />}
    sx={{
      position: "fixed",
      bottom: 24,
      right: 24,
      backgroundColor: "#71277a",
      borderRadius: "30px",
      textTransform: "none",
      fontWeight: "bold",
      '&:hover': { backgroundColor: '#5e1b65' }
    }}
  >
    Generar reporte
  </Button>
)}

{!isMobile && user?.rol === "aprendiz" && (
  <>
    <Button
      variant="contained"
      onClick={() => setOpenModal(true)}
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        backgroundColor: "#71277a",
        borderRadius: "30px",
        textTransform: "none",
        fontWeight: "bold",
        '&:hover': { backgroundColor: '#5e1b65' }
      }}
    >
      Solicitar visita
    </Button>

    <SolicitarVisitaModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      token={token}
    />
  </>
)}



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
    </Container>
  );
};

export default Calendario;
