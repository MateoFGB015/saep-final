//este es el modal (recuadro) que se muestra el querer crear un usuario 

import React, { useState } from "react";
import { 
  Box, Button,TextField, MenuItem, Select, FormControl, Typography, 
  IconButton, Modal, Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import usersAPI from "../../../api/UsersAPI"; // Importar API de usuarios
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";
import useAlert from "../hooks/UserAlert";
import CustomSnackbar from "../../../components/ui/Alert";


const token = localStorage.getItem("token");

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    const response = await usersAPI.crearUsuario(formData, token);

    try {
      if (response.success) {
        showAlert('Usuario creado exitosamente', "success");
        setTimeout(() => {
          onClose();
        }, 2000);
      }else {
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
      "& fieldset": { borderColor: "lightgray"},
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

          {/* Información Básica */}
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
              <TextField type="number" fullWidth label="Número de documento*" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} sx={textFieldStyle} />
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
              <TextField fullWidth label="Contraseña*" name="password" type="password" value={formData.password} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
          </Grid>

          {/* Información de Contacto */}
          <Typography variant="subtitle1" sx={{ fontWeight: "regular", mt: 3, mb: 1 }}>Información de Contacto</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Teléfono*" name="telefono" value={formData.telefono} onChange={handleInputChange} sx={textFieldStyle} />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                label="Correo electrónico*" 
                name="correo_electronico" 
                value={formData.correo_electronico} 
                onChange={handleInputChange} 
                sx={textFieldStyle} 
              />
            </Grid>
          </Grid>

          {errorMessage && <Typography color="error" mt={2}>{errorMessage}</Typography>}
          <Button variant="contained" fullWidth sx={{p:1.5, borderRadius:"8px", mt: 3, backgroundColor: "#71277a", "&:hover": { backgroundColor: "#5e2062" } }} onClick={handleSubmit}>
            Crear
          </Button>
        </Box>
      </Modal>

      {/* Modal de Confirmación */}
      <ConfirmDialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirm}
        title="¡Alerta!"
        message="Esta accion creara un nuevo registro de usuario en la base de datos ¿Desea continuar?"
      />

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
</>
  );
};

export default ModalCrearUsuario;