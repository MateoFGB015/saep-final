import React from "react";
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const UserInfoModal = ({ open, onClose, user, mostrarBotonGFPI = false, onGenerarGFPI  }) => {
  const navigate = useNavigate();
  if (!user) return null;

  // Función auxiliar para manejar valores vacíos
  const displayValue = (value) => value ?? "";

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(5px)",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 500,
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" textAlign="center" gutterBottom>
          Detalles de usuario
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nombre"
            value={displayValue(user.nombre)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={displayValue(user.apellido)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Tipo de documento"
            value={displayValue(user.tipo_documento)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Número documento"
            value={displayValue(user.numero_documento)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={displayValue(user.telefono)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Correo electrónico"
            value={displayValue(user.correo_electronico)}
            InputProps={{ readOnly: true }}
            fullWidth
          />

{mostrarBotonGFPI && (
  <Box sx={{ textAlign: 'center' }}>
    <button
      onClick={() => navigate(`/reporte/gfpi/${user.id_usuario}`)}
      style={{
        backgroundColor: '#71277a',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '8px 16px',
        marginTop: '12px',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      Generar reporte GFPI
    </button>
  </Box>
)};

        </Box>
      </Box>
    </Modal>
  );
};

export default UserInfoModal;
