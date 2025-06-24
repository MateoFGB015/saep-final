import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import { useAuth } from "../../context/AuthProvider";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const NotificacionesFlotantes = ({ onClose, setCantidadNoLeidas }) => {
  const { token } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState(0); // 0 = No leídas, 1 = Leídas

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const response = await axios.get(`${API_URL}/notificacion/ver`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotificaciones(response.data.notificaciones);

        // ✅ Calcula cantidad de no leídas para el Badge
        const noLeidas = response.data.notificaciones.filter(n => n.estado === "NoLeida").length;
        setCantidadNoLeidas(noLeidas);

      } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerNotificaciones();
  }, [token, setCantidadNoLeidas]);

  const marcarComoLeida = async (id) => {
    try {
      await axios.put(`${API_URL}/notificacion/marcarLeida/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificacion === id ? { ...n, estado: "Leida" } : n
        )
      );

      // ✅ Actualiza contador al marcar como leída
      setCantidadNoLeidas((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("❌ Error al marcar como leída:", error);
    }
  };

  const notificacionesFiltradas = notificaciones.filter((n) =>
    tabActiva === 0 ? n.estado === "NoLeida" : n.estado === "Leida"
  );

  return (
    <Box
      onClick={onClose} // 🔔 Cerrar al hacer clic fuera del panel
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.2)",
        zIndex: 1400,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()} // ⚠️ Esto evita que al hacer clic dentro se cierre
        sx={{
          position: "fixed",
          top: 80,
          right: 20,
          width: 350,
          height: "80vh",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1501,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Tabs */}
        <Tabs
          value={tabActiva}
          onChange={(_, newValue) => setTabActiva(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#71277a" },
            "& .MuiTab-root": { color: "#333", fontWeight: 500 },
            "& .Mui-selected": { color: "#71277a !important", fontWeight: "bold" },
          }}
        >
          <Tab label="NO LEÍDAS" />
          <Tab label="LEÍDAS" />
        </Tabs>

        {/* Contenido */}
        <Box sx={{ p: 2, overflowY: "auto", flexGrow: 1 }}>
          {loading ? (
            <CircularProgress />
          ) : notificacionesFiltradas.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No hay notificaciones.
            </Typography>
          ) : (
            notificacionesFiltradas.map((n) => (
              <Card
                key={n.id_notificacion}
                sx={{
                  mb: 1,
                  backgroundColor: n.estado === "NoLeida" ? "#f9f9f9" : "#fff",
                }}
              >
                <CardContent sx={{ position: "relative", pr: 5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {n.titulo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {n.mensaje}
                  </Typography>
                  {n.estado === "NoLeida" && (
                    <IconButton
                      onClick={() => marcarComoLeida(n.id_notificacion)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "#71277a",
                      }}
                    >
                      <CheckCircleOutlined sx={{ fontSize: 22 }} />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NotificacionesFlotantes;
