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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const UserModificarModal = ({ open, onClose, user, token }) => {
  const initialForm = {
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    correo_electronico: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (user && open) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        tipo_documento: user.tipo_documento || "",
        numero_documento: user.numero_documento || "",
        telefono: user.telefono || "",
        correo_electronico: user.correo_electronico || "",
        password: "",
      });
      setAlertMessage("");
    }
    if (!open) {
      // Limpiar al cerrar
      setFormData(initialForm);
      setAlertMessage("");
    }
  }, [user, open]);

  const validate = () => {
    if (formData.numero_documento.length < 9) {
      setAlertMessage("El número de documento debe tener mínimo 9 dígitos.");
      return false;
    }
    if (formData.telefono.length !== 10) {
      setAlertMessage("El teléfono debe tener exactamente 10 dígitos.");
      return false;
    }
    if (formData.password) {
      if (formData.password.length < 8 || formData.password.length > 15) {
        setAlertMessage("La contraseña debe tener entre 8 y 15 caracteres.");
        return false;
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
        setAlertMessage("La contraseña debe tener mayúsculas y minúsculas.");
        return false;
      }
      if (!/^[A-Za-z0-9@#!*+]+$/.test(formData.password)) {
        setAlertMessage("La contraseña solo permite letras, números y @, #, !, *, +.");
        return false;
      }
    }
    setAlertMessage("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;
    if (name === "numero_documento") {
      filteredValue = value.replace(/\\D/g, "").slice(0, 11);
    }
    if (name === "telefono") {
      filteredValue = value.replace(/\\D/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const response = await usersAPI.modificarUsuario(
      { ...formData, id_usuario: user.id_usuario },
      token
    );
    if (response.success) {
      setSnackbar({
        open: true,
        message: "Datos actualizados correctamente",
        severity: "success",
      });
      onClose();
    } else {
      setSnackbar({
        open: true,
        message: response.message,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    setFormData(initialForm);
    setAlertMessage("");
    onClose();
  };

  if (!user) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseModal}
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
            maxWidth: 420,
            bgcolor: "white",
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Detalles de usuario
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {alertMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {alertMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSave}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
            }}
          >
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ inputMode: "numeric" }}
            />
            <TextField
              label="Correo electrónico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              type="email"
              fullWidth
              required
            />
            <TextField
              label="Tipo de documento"
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Número de documento"
              name="numero_documento"
              value={formData.numero_documento}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ inputMode: "numeric" }}
            />
            <TextField
              label="Nueva contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={{ gridColumn: "1 / -1" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: "#71277a",
                ":hover": { backgroundColor: "#5c2163" },
                gridColumn: "1 / -1",
              }}
            >
              GUARDAR
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserModificarModal;
