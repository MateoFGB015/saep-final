import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ModalModificar from "./modalModificar";
import ModalCrear from "./ModalCrear";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { obtenerEventos } from "../../../api/AgendamientoAPI";
import "moment/locale/es";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  IconButton,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Fab,
  Collapse,
  Card,
  CardContent,
  Container
} from "@mui/material";
import { isSameDay } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";

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

const API_URL = process.env.REACT_APP_BACKEND_API_URL;


const CalendarioInstructorSeleccionado = () => {
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const { idInstructor } = useParams();
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date());
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [nombreInstructor, setNombreInstructor] = useState("");
  const [expandedEvents, setExpandedEvents] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isSmallTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const token = localStorage.getItem("token");

        const usuarioRes = await axios.get(
          `${API_URL}/usuarios/ver/${idInstructor}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const nombreCompleto = `${usuarioRes.data.nombre} ${usuarioRes.data.apellido}`;
        setNombreInstructor(nombreCompleto);

        const eventosRes = await axios.get(
          `${API_URL}/agendamiento/instructor/${idInstructor}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const eventosFormateados = eventosRes.data.map((evento) => {
          const inicio = new Date(evento.fecha_inicio);
          const finOriginal = new Date(evento.fecha_fin);

          const fin = moment(inicio).isSame(finOriginal, 'day')
            ? finOriginal
            : moment(inicio).add(1, 'hour').toDate();

          return {
            id: evento.id_agendamiento,
            title: `Hora: ${moment(inicio).format("hh:mm A")} - Tipo: ${evento.tipo_visita}`,
            nombreAprendiz: `${evento.ficha_aprendiz?.aprendiz.nombre} ${evento.ficha_aprendiz?.aprendiz.apellido}`,
            start: inicio,
            end: fin,
            estado: evento.estado_visita,
          };
        });

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

  // Estilos responsivos para el calendario
  const getCalendarStyles = () => ({
    height: isMobile ? "50vh" : isTablet ? "55vh" : isSmallTablet ? "60vh" : "70vh",
    backgroundColor: "#ffffff",
    borderRadius: isMobile ? "8px" : "12px",
    padding: isMobile ? "8px" : isTablet ? "12px" : "20px",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e0e0e0",
    fontSize: isMobile ? "0.75rem" : isTablet ? "0.85rem" : "1rem",
    // Estilos específicos para móvil
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
      '& .rbc-date-cell:hover': {
        backgroundColor: 'rgba(113, 39, 122, 0.05)',
      },
      '& .rbc-event': {
        fontSize: '0.6rem',
        padding: '1px 3px',
      },
      '& .rbc-header': {
        fontSize: '0.75rem',
        padding: '4px',
      }
    }),
    // Estilos para tablet
    ...(isTablet && !isMobile && {
      '& .rbc-toolbar button': {
        fontSize: '0.8rem',
        padding: '6px 8px',
      },
      '& .rbc-event': {
        fontSize: '0.7rem',
        padding: '2px 4px',
      },
      '& .rbc-date-cell': {
        cursor: 'pointer',
      },
      '& .rbc-date-cell:hover': {
        backgroundColor: 'rgba(113, 39, 122, 0.05)',
      }
    }),
    // Estilos para desktop
    ...(!isMobile && !isTablet && {
      '& .rbc-date-cell': {
        cursor: 'pointer',
      },
      '& .rbc-date-cell:hover': {
        backgroundColor: 'rgba(113, 39, 122, 0.05)',
      }
    })
  });

  // Función para obtener el breakpoint actual
  const getCurrentBreakpoint = () => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isSmallTablet) return 'smallTablet';
    return 'desktop';
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        px: { xs: 1, sm: 2, md: 3 },
        pt: { xs: 0.5, sm: 1 },
        pb: { xs: 20, sm: 3, md: 2 }, // Aumentado padding bottom para móvil
        maxWidth: '100%',
        width: '100%',
        // Configuración específica para móvil
        ...(isMobile && {
          minHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        })
      }}
    >
      {/* Header con botón de regreso */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: { xs: 1.5, sm: 2 },
        gap: 1
      }}>
        <IconButton 
          onClick={() => navigate("/agendamientos/listaIntructores")}
          sx={{ 
            p: { xs: 0.5, sm: 1 },
            '&:hover': {
              backgroundColor: 'rgba(113, 39, 122, 0.08)'
            }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </IconButton>

        <Typography
          variant={isMobile ? "h6" : isTablet ? "h5" : "h4"}
          sx={{ 
            fontWeight: 'bold', 
            color: '#4a0072',
            fontSize: { 
              xs: '1.1rem', 
              sm: '1.3rem', 
              md: '1.5rem',
              lg: '1.75rem'
            },
            textAlign: { xs: 'left', sm: 'center' },
            flex: 1
          }}
        >
          Agenda de {nombreInstructor}
        </Typography>
      </Box>

      <Box sx={{ 
        display: "flex", 
        gap: { xs: 1.5, sm: 2, md: 2.5 }, 
        flexDirection: { xs: "column", md: "row" },
        height: { xs: 'auto', md: 'calc(100vh - 200px)' },
        minHeight: { xs: 'auto', md: '600px' },
        // Configuración específica para móvil
        ...(isMobile && {
          paddingBottom: '160px', // Espacio para los FABs
        })
      }}>
        
        {/* Panel de eventos del día - Móvil */}
        {isMobile && (
          <Card
            sx={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              borderRadius: 2,
              mb: 2
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, "&:last-child": { pb: { xs: 1.5, sm: 2 } } }}>
              {/* Header colapsable */}
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  cursor: "pointer",
                  mb: expandedEvents ? 1.5 : 0,
                  p: 1,
                  borderRadius: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(113, 39, 122, 0.04)"
                  }
                }}
                onClick={() => setExpandedEvents(!expandedEvents)}
              >
                <Typography variant="subtitle1" sx={{ 
                  fontSize: "1rem", 
                  fontWeight: "bold", 
                  color: "#4a0072" 
                }}>
                  Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
                </Typography>
                <IconButton size="small" sx={{ color: "#71277a", p: 0.5 }}>
                  {expandedEvents ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {/* Contenido colapsable */}
              <Collapse in={expandedEvents}>
                {eventosDelDia.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography color="text.secondary" variant="body2">
                      No hay visitas para este día.
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ py: 0 }}>
                    {eventosDelDia.map((evento, i) => (
                      <div key={evento.id || i}>
                        <ListItem 
                          onClick={() => handleSelectEvent(evento)} 
                          sx={{ 
                            cursor: "pointer",
                            px: 1.5,
                            py: 1,
                            borderRadius: 1.5,
                            mx: 0,
                            "&:hover": {
                              backgroundColor: "rgba(113, 39, 122, 0.08)"
                            }
                          }}
                        >
                          <Box sx={{ width: "100%" }}>
                            <Typography 
                              fontWeight="bold"
                              variant="body2"
                              sx={{ color: "#4a0072", mb: 0.5, fontSize: '0.9rem' }}
                            >
                              {moment(evento.start).format("hh:mm A")}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                wordBreak: "break-word",
                                fontSize: '0.8rem',
                                lineHeight: 1.2
                              }}
                            >
                              Aprendiz: {evento.nombreAprendiz}
                            </Typography>
                          </Box>
                        </ListItem>
                        {i < eventosDelDia.length - 1 && <Divider sx={{ mx: 1 }} />}
                      </div>
                    ))}
                  </List>
                )}

                <Divider sx={{ mt: 1.5, mb: 1.5 }} />

                {/* Leyenda de estados - Móvil */}
                <Box sx={{ px: 0.5 }}>
                  <Typography 
                    variant="caption" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{ color: "#4a0072", mb: 1, display: 'block' }}
                  >
                    Estados de visitas:
                  </Typography>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: "#71277a", 
                        borderRadius: "50%" 
                      }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        Pendiente
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: "#388e3c", 
                        borderRadius: "50%" 
                      }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        Realizado
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        backgroundColor: "#d32f2f", 
                        borderRadius: "50%" 
                      }} />
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        Cancelado
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        )}

        {/* Calendario */}
        <Box sx={{ 
          flex: { xs: 'none', md: 3 }, 
          width: { xs: '100%', md: 'auto' },
          minWidth: { xs: '100%', md: '300px' },
          order: { xs: 2, md: 1 },
          // Configuración específica para móvil
          ...(isMobile && {
            marginBottom: '20px',
            position: 'relative',
            zIndex: 1,
          })
        }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            messages={messages}
            onSelectSlot={(slot) => {
              console.log("Día seleccionado:", slot.start);
              setDiaSeleccionado(slot.start);
            }}
            onSelectEvent={handleSelectEvent}
            onNavigate={(date) => {
              console.log("Navegando a:", date);
              setDiaSeleccionado(date);
            }}
            selectable={true}
            selectType="click"
            step={60}
            timeslots={1}
            style={getCalendarStyles()}
            views={{ month: true, week: true, day: true }}
            defaultView={isMobile ? 'month' : 'month'}
            popup={!isMobile}
            popupOffset={{ x: 10, y: 10 }}
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
                onClick: () => {
                  console.log("Click en día:", date);
                  setDiaSeleccionado(date);
                }
              };
            }}
          />
        </Box>

        {/* Panel de eventos del día - Desktop y Tablet */}
        {!isMobile && (
          <Box
            sx={{
              flex: { md: 1 },
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              p: { sm: 2, md: 3 },
              backgroundColor: "#ffffff",
              maxHeight: { md: "100%" },
              height: { md: 'fit-content' },
              overflowY: "auto",
              minWidth: { sm: "250px", md: "280px" },
              boxShadow: "0 4px 8px rgba(0,0,0,0.04)",
              order: { xs: 1, md: 2 },
            }}
          >
            <Typography 
              variant={isTablet ? "subtitle1" : "h6"} 
              textAlign="center" 
              mb={2}
              sx={{ 
                fontSize: { sm: '1rem', md: '1.1rem' },
                fontWeight: 'bold',
                color: '#4a0072'
              }}
            >
              Visitas del {moment(diaSeleccionado).format("DD [de] MMMM")}
            </Typography>

            {eventosDelDia.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography color="text.secondary" variant="body2">
                  No hay visitas para este día.
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {eventosDelDia.map((evento, i) => (
                  <div key={evento.id || i}>
                    <ListItem 
                      onClick={() => handleSelectEvent(evento)} 
                      sx={{ 
                        cursor: "pointer",
                        px: { sm: 1.5, md: 2 },
                        py: { sm: 1, md: 1.5 },
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "rgba(113, 39, 122, 0.04)"
                        }
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Typography 
                          fontWeight="bold"
                          variant={isTablet ? "body2" : "body1"}
                          sx={{ color: "#4a0072", mb: 0.5 }}
                        >
                          {moment(evento.start).format("hh:mm A")}
                        </Typography>
                        <Typography 
                          variant={isTablet ? "caption" : "body2"}
                          color="text.secondary"
                          sx={{ 
                            wordBreak: "break-word",
                            lineHeight: 1.3
                          }}
                        >
                          Aprendiz: {evento.nombreAprendiz}
                        </Typography>
                      </Box>
                    </ListItem>
                    {i < eventosDelDia.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            )}

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* Botón añadir visita - Desktop y Tablet */}
            <Button
              fullWidth
              variant="contained"
              onClick={() => setModalCrearOpen(true)}
              sx={{
                backgroundColor: "#71277a",
                "&:hover": {
                  backgroundColor: "#5a1e61",
                },
                color: "white",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                mb: 2,
                py: { sm: 1, md: 1.2 },
                fontSize: { sm: '0.8rem', md: '0.875rem' }
              }}
            >
              Añadir visita
            </Button>

            {/* Leyenda de estados - Desktop y Tablet */}
            <Box>
              <Typography 
                variant={isTablet ? "caption" : "subtitle2"}
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  color: "#4a0072",
                  fontSize: { sm: '0.8rem', md: '0.875rem' }
                }}
              >
                Estado de visitas:
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ 
                    width: { sm: 12, md: 14 }, 
                    height: { sm: 12, md: 14 }, 
                    backgroundColor: "#71277a", 
                    borderRadius: "50%" 
                  }} />
                  <Typography variant={isTablet ? "caption" : "body2"}>
                    Pendiente
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ 
                    width: { sm: 12, md: 14 }, 
                    height: { sm: 12, md: 14 }, 
                    backgroundColor: "#388e3c", 
                    borderRadius: "50%" 
                  }} />
                  <Typography variant={isTablet ? "caption" : "body2"}>
                    Realizado
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ 
                    width: { sm: 12, md: 14 }, 
                    height: { sm: 12, md: 14 }, 
                    backgroundColor: "#d32f2f", 
                    borderRadius: "50%" 
                  }} />
                  <Typography variant={isTablet ? "caption" : "body2"}>
                    Cancelado
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>

      {/* Modales */}
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

      {/* FABs para móvil - Posicionamiento mejorado */}
      {isMobile && (
        <Box sx={{ 
          position: "fixed", 
          bottom: 20, 
          right: 16, 
          zIndex: 1400,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          alignItems: 'flex-end'
        }}>
          {/* FAB Añadir visita */}
          <Fab
            color="primary"
            onClick={() => setModalCrearOpen(true)}
            sx={{
              backgroundColor: "#71277a",
              "&:hover": {
                backgroundColor: "#5a1e61",
              },
              width: 56,
              height: 56,
              boxShadow: "0 8px 20px rgba(113, 39, 122, 0.4)",
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: "#5a1e61",
              }
            }}
          >
            <AddIcon sx={{ fontSize: '1.5rem' }} />
          </Fab>

          {/* FAB Reporte */}
          <Fab
            onClick={() => navigate(`/reporte/agendamientos/${idInstructor}`)}
            sx={{
              backgroundColor: "#71277a",
              "&:hover": {
                backgroundColor: "#5a1e61",
              },
              width: 56,
              height: 56,
              boxShadow: "0 8px 20px rgba(113, 39, 122, 0.4)",
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: "#5a1e61",
              }
            }}
          >
            <PictureAsPdfIcon sx={{ fontSize: '1.3rem', color: 'white' }} />
          </Fab>
        </Box>
      )}

      {/* Botón reporte para desktop y tablet */}
      {!isMobile && (
        <Button
          onClick={() => navigate(`/reporte/agendamientos/${idInstructor}`)}
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
            boxShadow: 4,
            px: { sm: 2, md: 3 },
            py: { sm: 1, md: 1.5 },
            zIndex: 1300,
            fontSize: { sm: '0.8rem', md: '0.875rem' },
            '&:hover': {
              backgroundColor: '#5e1b65',
            },
          }}
        >
          Reporte
        </Button>
      )}
    </Container>
  );
};

export default CalendarioInstructorSeleccionado;