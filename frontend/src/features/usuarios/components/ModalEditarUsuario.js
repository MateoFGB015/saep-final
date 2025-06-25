import React, { useState, useEffect } from "react";
import {
  Modal, Box, TextField, Button, Typography, Select, MenuItem, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import usersAPI from "../../../api/UsersAPI";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../hooks/UserAlert";

const UserModal = ({ open, onClose, user, onSave }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [password, setPassword] = useState("");

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

    // Validaciones
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

  const inputStyles = {
    "& label": { color: "rgba(0,0,0,0.5)" },
    "& label.Mui-focused": { color: "#71277a" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(0,0,0,0.3)" },
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
      <Modal open={open} onClose={onClose} sx={{
        display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)"
      }}>
        <Box sx={{
          position: "relative", width: "90%", maxWidth: 500, maxHeight: "100%",
          bgcolor: "white", p: 3, borderRadius: 2, overflowY: "auto", boxShadow: 24
        }}>
          <IconButton onClick={onClose} sx={{
            position: "absolute", top: 8, right: 8, color: "rgba(0,0,0,0.6)"
          }}>
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2} sx={{ color: "#444", textAlign: "center" }}>
            Detalles de usuario
          </Typography>

          {["nombre", "apellido", "numero_documento", "telefono", "correo_electronico"].map((name) => (
            <TextField
              key={name}
              fullWidth
              margin="dense"
              label={name.replace("_", " ")}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              sx={inputStyles}
            />
          ))}

          <Typography variant="body2" sx={{ mt: 2, color: "#444" }}>Rol</Typography>
          <Select
            fullWidth
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            sx={selectStyles}
            displayEmpty
          >
            <MenuItem value="">-- Rol actual --</MenuItem>
            <MenuItem value="Aprendiz">Aprendiz</MenuItem>
            <MenuItem value="Instructor">Instructor</MenuItem>
          </Select>

          <Typography variant="body2" sx={{ mt: 2, color: "#444" }}>Tipo de documento</Typography>
          <Select
            fullWidth
            name="tipo_documento"
            value={formData.tipo_documento}
            onChange={handleChange}
            sx={selectStyles}
          >
            <MenuItem value="CC">CC</MenuItem>
            <MenuItem value="TI">TI</MenuItem>
            <MenuItem value="PPT">PPT</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
          </Select>

          <Typography variant="body2" sx={{ mt: 2, color: "#444" }}>Nueva contraseña (opcional)</Typography>
          <TextField
            fullWidth
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 1, ...inputStyles }}
            placeholder="Dejar en blanco si no desea cambiarla"
          />

          <Button
            variant="contained"
            sx={{
              p: 1.5, width: "100%", mt: 2,
              backgroundColor: "#71277a", "&:hover": { backgroundColor: "#71278a" }
            }}
            onClick={handleSave}
          >
            Guardar
          </Button>
        </Box>
      </Modal>

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserModal;
