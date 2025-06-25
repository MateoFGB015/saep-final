//este es el modal (recuadro) que se muestra el quere editar un usuario.

import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import usersAPI from "../../../api/UsersAPI";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../hooks/UserAlert";

const UserModal = ({ open, onClose, user, onSave }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [formData, setFormData] = useState({
    nombre: "", apellido: "", rol: "", tipo_documento: "", numero_documento: "", telefono: "", correo_electronico: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "", apellido: user.apellido || "",
        rol: ["aprendiz", "Instructor"].includes(user.rol) ? user.rol : "aprendiz",
        tipo_documento: user.tipo_documento ? user.tipo_documento.toUpperCase() : "CC",
        numero_documento: user.numero_documento || "", telefono: user.telefono || "",
        correo_electronico: user.correo_electronico || "",
      });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSave = async () => {
  const { nombre, apellido, numero_documento, telefono, correo_electronico, rol, tipo_documento } = formData;

  // Validar campos vacíos
  if (!nombre || !apellido || !numero_documento || !telefono || !correo_electronico || !rol || !tipo_documento) {
    showAlert("Por favor, completa todos los campos obligatorios.", "error");
    return;
  }

  // Validar correo
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo_electronico)) {
    showAlert("El correo electrónico no es válido.", "error");
    return;
  }

  // Validar teléfono
  if (!/^\d+$/.test(telefono)) {
    showAlert("El teléfono solo debe contener números.", "error");
    return;
  }

  // Validar documento (máximo 11 dígitos)
  if (!/^\d{1,11}$/.test(numero_documento)) {
    showAlert("El número de documento debe tener máximo 11 dígitos numéricos.", "error");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await usersAPI.modificarUsuario({ ...user, ...formData }, token);

    if (response && (response.success || response.updated)) {
      showAlert("¡Usuario actualizado con éxito!", "success");
      setTimeout(() => {
        onSave();
        onClose();
      }, 1500);
    } else {
      showAlert(response?.message || "Hubo un problema al guardar los cambios.", "error");
    }
  } catch (error) {
    showAlert("Hubo un problema al guardar los cambios.", "error");
  }
};


  const inputStyles = {
    "& label": { color: "rgba(0,0,0,0.5)" },
    "& label.Mui-focused": { color: "#71277a" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(0,0,0,0.3)"},
      "&:hover fieldset": { borderColor: "rgba(0,0,0,0.5)" },
      "&.Mui-focused fieldset": { borderColor: "#71277a" },
    },
  };

  const selectStyles = {
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.3)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.5)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#71277a" },
  };

  return (
    <>
      <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
        <Box sx={{ position: "relative", width: "90%", maxWidth: 500, maxHeight: "100%", bgcolor: "white", p: 3, borderRadius: 2, overflowY: "auto", boxShadow: 24 }}>
          
          {/* Botón "X" en la esquina superior derecha */}
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "rgba(0,0,0,0.6)" }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2} sx={{ color: "#444", textAlign:"center" }}>Detalles de usuario</Typography>

          {["nombre", "apellido", "numero_documento", "telefono", "correo_electronico"].map((name) => (
            <TextField key={name} fullWidth margin="dense" label={name.replace("_", " ")} name={name} value={formData[name]} onChange={handleChange} sx={inputStyles} />
          ))}

          <Typography variant="body2" sx={{ mt: 2, color: "#444" }}>Rol</Typography>
          <Select fullWidth name="rol" value={formData.rol} onChange={handleChange} sx={selectStyles}>
            <MenuItem value="Aprendiz">Aprendiz</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
          </Select>

          <Typography variant="body2" sx={{ mt: 2, color: "#444" }}>Tipo de documento</Typography>
          <Select fullWidth name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} sx={selectStyles}>
            <MenuItem value="CC">CC</MenuItem>
            <MenuItem value="TI">TI</MenuItem>
            <MenuItem value="PPT">PPT</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
          </Select>

          <Button variant="contained" sx={{p:1.5 ,width:"100%  ", mt: 2, backgroundColor: "#71277a", "&:hover": { backgroundColor: "#71278a" } }} onClick={handleSave}>Guardar</Button>
        </Box>
      </Modal>

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserModal;
