import React, { useState } from "react";
import {
  Box, Button, TextField, MenuItem, Select, FormControl, Typography,
  IconButton, Modal, Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import usersAPI from "../../../api/UsersAPI";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";
import useAlert from "../hooks/UserAlert";
import CustomSnackbar from "../../../components/ui/Alert";

const token = localStorage.getItem("token");

// Funciones auxiliares
const validarNombre = (valor) => {
  return valor
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
};

const contieneMayusculasInternas = (valor) => {
  return valor.split(" ").some(p => /[A-Z]/.test(p.slice(1)));
};

const validarContrasena = (valor) => {
  const longitudValida = valor.length >= 8 && valor.length <= 15;
  const contieneMinuscula = /[a-z]/.test(valor);
  const contieneMayuscula = /[A-Z]/.test(valor);
  const contieneEspecial = /[@#!*+]/.test(valor);
  const noRepetida = !/^([a-zA-Z])\1*$/.test(valor);

  return (
    longitudValida &&
    contieneMinuscula &&
    contieneMayuscula &&
    contieneEspecial &&
    noRepetida
  );
};

const ModalCrearUsuario = ({ onClose }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [formData, setFormData] = useState({
    rol: "",
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    correo_electronico: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  let nuevoValor = value;

  if (name === "nombre" || name === "apellido") {
    if (contieneMayusculasInternas(value)) {
      setErrorMessage("Cada palabra debe comenzar con mayúscula y seguir en minúscula.");
    } else {
      setErrorMessage("");
    }
    nuevoValor = validarNombre(value);
  }

  if (name === "password") {
    if (!validarContrasena(value)) {
      setErrorMessage("La contraseña debe tener entre 8 y 15 caracteres, incluir mayúsculas, minúsculas y un carácter especial (@, #, !, *, +). No puede contener letras repetidas.");
    } else {
      setErrorMessage("");
    }
  }

  if (name === "telefono") {
    const soloNumeros = value.replace(/\\D/g, "").slice(0, 10);
    nuevoValor = soloNumeros;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: nuevoValor,
  }));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const requiredFields = [
      "rol", "nombre", "apellido", "tipo_documento",
      "numero_documento", "telefono", "correo_electronico", "password"
    ];

    const errors = requiredFields.filter((field) => !formData[field]);

    if (errors.length > 0) {
      setErrorMessage(`Los siguientes campos son obligatorios: ${errors.join(", ")}`);
      return;
    }

    if (!/^\d{1,11}$/.test(formData.numero_documento)) {
      setErrorMessage("El número de documento debe tener máximo 11 dígitos numéricos.");
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(formData.correo_electronico)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!/^\d+$/.test(formData.telefono)) {
      setErrorMessage("El teléfono solo debe contener números.");
      return;
    }

    if (contieneMayusculasInternas(formData.nombre) || contieneMayusculasInternas(formData.apellido)) {
      setErrorMessage("Nombre y apellido deben tener solo la primera letra en mayúscula.");
      return;
    }

    if (!validarContrasena(formData.password)) {
      setErrorMessage("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    const response = await usersAPI.crearUsuario(formData, token);

    try {
      if (response.success) {
        showAlert('Usuario creado exitosamente', "success");
        setTimeout(() => onClose(), 2000);
      } else {
        showAlert(response.message || "Hubo un error al crear el usuario.", "error");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      showAlert("Error inesperado al crear el usuario.", "error");
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
      <Modal open onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)" }}>
        <Box sx={{ position: "relative", width: "90%", maxWidth: 600, bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24 }}>
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "rgba(0,0,0,0.6)" }}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" mb={2} sx={{ color: "#444", textAlign: "center" }}>Crear usuario</Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "regular", mb: 1 }}>Información Básica</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Nombre*" name="nombre" value={formData.nombre} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Apellido*" name="apellido" value={formData.apellido} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={getSelectStyle("tipo_documento")}>
                <Select name="tipo_documento" value={formData.tipo_documento} onChange={handleInputChange} displayEmpty>
                  <MenuItem value="" disabled>Tipo de documento*</MenuItem>
                  <MenuItem value="cc">CC</MenuItem>
                  <MenuItem value="ti">TI</MenuItem>
                  <MenuItem value="ce">CE</MenuItem>
                  <MenuItem value="ppt">PPT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Número de documento*"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={(e) => {
                  const valor = e.target.value;
                  if (/^\d{0,11}$/.test(valor)) handleInputChange(e);
                }}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={getSelectStyle("rol")}>
                <Select name="rol" value={formData.rol} onChange={handleInputChange} displayEmpty>
                  <MenuItem value="" disabled>Rol*</MenuItem>
                  <MenuItem value="Aprendiz">Aprendiz</MenuItem>
                  <MenuItem value="Instructor">Instructor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contraseña*"
                name="password"
                type={mostrarPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setMostrarPassword(!mostrarPassword)} edge="end">
                      {mostrarPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ fontWeight: "regular", mt: 3, mb: 1 }}>Información de Contacto</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Teléfono*" name="telefono" value={formData.telefono} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Correo electrónico*" name="correo_electronico" value={formData.correo_electronico} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
          </Grid>

          {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}

          <Button
            variant="contained"
            fullWidth
            sx={{ p: 1.5, borderRadius: "8px", mt: 3, backgroundColor: "#71277a", "&:hover": { backgroundColor: "#5e2062" } }}
            onClick={handleSubmit}
          >
            Crear
          </Button>
        </Box>
      </Modal>

      <ConfirmDialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirm}
        title="¡Alerta!"
        message="Esta acción creará un nuevo usuario en la base de datos. ¿Desea continuar?"
      />

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default ModalCrearUsuario;
