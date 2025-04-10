import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

const NotificacionesFlotantes = ({ onClose }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const ref = useRef();

  useEffect(() => {
    axios.get("http://localhost:3000/notificacion")
      .then((res) => {
        setNotificaciones(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener notificaciones:", err);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose(); // Cierra si el clic fue fuera del contenedor
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <Paper
      ref={ref}
      elevation={3}
      sx={{
        position: "absolute",
        top: 60,
        right: 20,
        width: 300,
        maxHeight: 300,
        overflowY: "auto",
        backgroundColor: "white",
        zIndex: 9999,
        borderRadius: "10px",
        p: 1,
      }}
    >
      <Typography variant="h6" sx={{ p: 1 }}>Notificaciones</Typography>
      <List>
        {notificaciones.length === 0 ? (
          <ListItem>
            <ListItemText primary="No hay notificaciones" />
          </ListItem>
        ) : (
          notificaciones.map((noti) => (
            <ListItem key={noti.id}>
              <ListItemText primary={noti.mensaje} secondary={noti.fecha} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotificacionesFlotantes;
