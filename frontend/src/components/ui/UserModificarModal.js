import React, { useState, useEffect } from "react";
import usersAPI from "../../api/UsersAPI";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton as MIconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UserModificarModal = ({ open, onClose, user, token }) => {
  const [formData, setFormData] = useState({ nombre: "", apellido: "", tipo_documento: "", numero_documento: "", telefono: "", correo_electronico: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (user) {
      setFormData({ nombre: user.nombre || "", apellido: user.apellido || "", tipo_documento: user.tipo_documento || "", numero_documento: user.numero_documento || "", telefono: user.telefono || "", correo_electronico: user.correo_electronico || "", password: "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const response = await usersAPI.modificarUsuario({ ...formData, id_usuario: user.id_usuario }, token);
    if (response.success) {
      setSnackbar({ open: true, message: "Datos actualizados correctamente", severity: "success" });
      onClose();
    } else {
      setSnackbar({ open: true, message: response.message, severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (!user) return null;

  return (
    <>
      <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
        <Box sx={{ width: "90%", maxWidth: 500, bgcolor: "white", borderRadius: 2, p: 4, boxShadow: 24, position: "relative" }}>
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}><CloseIcon /></IconButton>
          <Typography variant="h6" textAlign="center" gutterBottom>Editar mis datos</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box component="form" onSubmit={handleSave} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth required />
            <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth required />
            <TextField label="Tipo de documento" name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} fullWidth required />
            <TextField label="Número de documento" name="numero_documento" value={formData.numero_documento} onChange={handleChange} fullWidth required />
            <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth />
            <TextField label="Correo electrónico" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} type="email" fullWidth required />
            <TextField label="Nueva contraseña" name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} fullWidth InputProps={{ endAdornment: (<InputAdornment position="end"><MIconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</MIconButton></InputAdornment>) }} />
            <Typography variant="caption" color="text.secondary">Dejar en blanco si no desea cambiar clave</Typography>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#71277a" }}>Guardar cambios</Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default UserModificarModal;
