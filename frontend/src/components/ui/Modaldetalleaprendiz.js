import React, { useEffect, useState } from "react";
import {
  Modal, Box, Typography, TextField, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import usersAPI from "../../api/UsersAPI";

const ModalDetalleAprendiz = ({ open, onClose, aprendiz }) => {
  const [aprendizDetalle, setAprendizDetalle] = useState(null);

useEffect(() => {
  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem("token");

      if (aprendiz?.id_usuario) {
        const usuario = await usersAPI.getUserById(aprendiz.id_usuario, token);
        console.log("📦 Datos cargados del aprendiz:", usuario); // 👈 este log
        setAprendizDetalle(usuario);
      }
    } catch (err) {
      console.error("❌ Error al cargar datos del aprendiz:", err);
    }
  };

  if (open) {
    cargarDatos();
  } else {
    setAprendizDetalle(null);
  }
}, [open, aprendiz]);


  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 450,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" mb={2}>Detalles del Aprendiz</Typography>

        <TextField
          fullWidth margin="dense"
          label="Nombre completo"
          value={`${aprendizDetalle?.nombre || ""} ${aprendizDetalle?.apellido || ""}`}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth margin="dense"
          label="Tipo Documento"
          value={aprendizDetalle?.tipo_documento || ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth margin="dense"
          label="Documento"
          value={aprendizDetalle?.numero_documento || ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth margin="dense"
          label="Correo"
          value={aprendizDetalle?.correo_electronico || ""}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth margin="dense"
          label="Teléfono"
          value={aprendizDetalle?.telefono || ""}
          InputProps={{ readOnly: true }}
        />
      </Box>
    </Modal>
  );
};

export default ModalDetalleAprendiz;
