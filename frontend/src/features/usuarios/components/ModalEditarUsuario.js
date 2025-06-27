import React, { useState, useEffect } from "react";
import {
  Modal, Box, TextField, Button, Typography, MenuItem, IconButton, Grid, FormControl, Select
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import usersAPI from "../../../api/UsersAPI";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../hooks/UserAlert";

const UserModal = ({ open, onClose, user, onSave }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "", apellido: "", rol: "", tipo_documento: "",
    numero_documento: "", telefono: "", correo_electronico: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        rol: ["Aprendiz", "Instructor"].includes(user.rol) ? user.rol : "Aprendiz",
        tipo_documento: user.tipo_documento ? user.tipo_documento.toUpperCase() : "CC",
        numero_documento: user.numero_documento || "",
        telefono: user.telefono || "",
        correo_electronico: user.correo_electronico || "",
      });
      setPassword("");
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const {
      nombre, apellido, numero_documento,
      telefono, correo_electronico, rol, tipo_documento
    } = formData;

    if (!nombre || !apellido || !numero_documento || !telefono || !correo_electronico || !rol || !tipo_documento) {
      showAlert("Por favor, completa todos los campos obligatorios.", "error");
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo_electronico)) {
      showAlert("El correo electrónico no es válido.", "error");
      return;
    }

    if (!/^\d+$/.test(telefono)) {
      showAlert("El teléfono solo debe contener números.", "error");
      return;
    }

    if (!/^\d{1,11}$/.test(numero_documento)) {
      showAlert("El número de documento debe tener máximo 11 dígitos numéricos.", "error");
      return;
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[@#!*+])[A-Za-z\d@#!*+]{8,15}$/;
      if (!passwordRegex.test(password)) {
        showAlert("La contraseña debe tener entre 8 y 15 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un símbolo (@#!*+).", "error");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const payload = { ...user, ...formData };
      if (password) payload.password = password;
      const response = await usersAPI.modificarUsuario(payload, token);

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

  const textFieldStyle = {
    "& label": { color: "gray" },
    "& label.Mui-focused": { color: "#71277a" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "lightgray" },
      "&:hover fieldset": { borderColor: "lightgray" },
      "&.Mui-focused fieldset": { borderColor: "#71277a" },
      backgroundColor: "white !important",
    },
    "& input": {
      backgroundColor: "white !important",
      color: "black",
      caretColor: "#71277a",
      WebkitBoxShadow: "0 0 0px 1000px white inset !important",
    },
  };

  const getSelectStyle = (field) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "lightgray" },
      "&:hover fieldset": { borderColor: "lightgray" },
      "&.Mui-focused fieldset": { borderColor: "#71277a" },
      backgroundColor: "white !important",
    },
    "& .MuiSelect-select": {
      backgroundColor: "white !important",
      color: formData[field] ? "black" : "gray",
    },
  });

  return (
    <>
      <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
        <Box sx={{ position: "relative", width: "90%", maxWidth: 500, bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 24 }}>
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "rgba(0,0,0,0.6)" }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" mb={2} sx={{ color: "#444", textAlign: "center" }}>Detalles de usuario</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} fullWidth sx={textFieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} fullWidth sx={textFieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} fullWidth sx={textFieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo electrónico" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} fullWidth sx={textFieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={getSelectStyle("rol")}>
                <Select name="rol" value={formData.rol} onChange={handleChange} displayEmpty>
                  <MenuItem value="" disabled>Rol</MenuItem>
                  <MenuItem value="Aprendiz">Aprendiz</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={getSelectStyle("tipo_documento")}>
                <Select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} displayEmpty>
                  <MenuItem value="" disabled>Tipo de documento</MenuItem>
                  <MenuItem value="CC">CC</MenuItem>
                  <MenuItem value="TI">TI</MenuItem>
                  <MenuItem value="PPT">PPT</MenuItem>
                  <MenuItem value="CE">CE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Número de documento" name="numero_documento" value={formData.numero_documento} onChange={handleChange} fullWidth sx={textFieldStyle} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nueva contraseña"
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={textFieldStyle}
                placeholder="Dejar en blanco si no deseas cambiarla"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setMostrarPassword(!mostrarPassword)} edge="end">
                      {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth sx={{ p: 1.5, mt: 2, borderRadius: 1.5, backgroundColor: "#71277a", "&:hover": { backgroundColor: "#5e2062" } }} onClick={handleSave}>
                GUARDAR
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserModal;
