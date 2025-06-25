import React, { useEffect, useState, useCallback } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/imgs/confeccion.jpg";

    // API URL base
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const TIPOS_DOCUMENTO = [
  { value: "CC", label: "Cédula" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CE", label: "Cédula de Extranjería" }
];

const INITIAL_FORM_STATE = {
  nombre: "",
  apellido: "",
  tipo_documento: "",
  numero_documento: "",
  telefono: "",
  numero_ficha: "",
  correo_electronico: "",
  password: "",
  confirmarContrasena: ""
};

// Estilos
const purpleFocusStyle = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#5E35B1"
  },
  "& label.Mui-focused": {
    color: "#5E35B1"
  }
};

function FormularioAprendiz() {
  // Hooks
  const navigate = useNavigate();
  
  // Estados
  const [modalAbierto, setModalAbierto] = useState(false);
  const [errors, setErrors] = useState({});
  const [fichas, setFichas] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  // Funciones de utilidad
  const mostrarAlerta = (tipo, titulo, texto) => {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: texto,
      confirmButtonColor: '#5E35B1'
    });
  };

  const validarDocumento = (numeroDocumento) => {
    if (numeroDocumento.length < 5 || numeroDocumento.length > 10) {
      return "Debe tener entre 5 y 10 caracteres.";
    }
    return "";
  };

  const validarFormulario = () => {
    // Verificar campos vacíos
    if (Object.values(form).some((val) => val === "")) {
      mostrarAlerta('warning', 'Campos incompletos', 'Todos los campos son obligatorios');
      return false;
    }

    // Verificar contraseñas
    if (form.password !== form.confirmarContrasena) {
      mostrarAlerta('error', 'Contraseñas no coinciden', 'Por favor verifica que ambas contraseñas coincidan');
      return false;
    }

    // Verificar errores existentes
    if (Object.values(errors).some(error => error !== "")) {
      mostrarAlerta('error', 'Errores en el formulario', 'Por favor corrige los errores antes de continuar');
      return false;
    }

    return true;
  };

  // Funciones de API
  const obtenerFichas = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/fichas/ver`);
      setFichas(data);
    } catch (error) {
      console.error("Error al obtener fichas:", error);
      mostrarAlerta('error', 'Error', 'No se pudieron cargar las fichas disponibles');
    }
  }, []);

  const registrarAprendiz = async (datosFormulario) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/usuarios/registroAprendiz`, datosFormulario);
      
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente',
        confirmButtonColor: '#5E35B1'
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error en registro:", error);
      mostrarAlerta('error', 'Error', 'No se pudo registrar el aprendiz. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Actualizar formulario
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Validación específica para número de documento
    if (name === "numero_documento") {
      const errorDocumento = validarDocumento(value);
      setErrors((prev) => ({
        ...prev,
        numero_documento: errorDocumento,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    await registrarAprendiz(form);
  };

  const handleCloseModal = () => {
    setModalAbierto(false);
    navigate("/");
  };

  // Efecto para cargar fichas
  useEffect(() => {
    obtenerFichas();
  }, [obtenerFichas]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          zIndex: 0
        }
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "90%",
          maxWidth: 350,
          padding: 2,
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(15px)",
          zIndex: 1,
          my: 2,
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(94, 53, 177, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: "#5E35B1",
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1.2rem", sm: "1.3rem" },
            textShadow: '0 2px 4px rgba(94, 53, 177, 0.1)'
          }}
        >
          Registro de Aprendiz
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Fila 1: Nombre y Apellido */}
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          {/* Fila 2: Tipo y Número de documento */}
          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              select
              label="Tipo de documento"
              name="tipo_documento"
              value={form.tipo_documento}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              sx={{ flex: 1, ...purpleFocusStyle }}
            >
              {TIPOS_DOCUMENTO.map((tipo) => (
                <MenuItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Número de documento"
              name="numero_documento"
              value={form.numero_documento}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              error={Boolean(errors.numero_documento)}
              helperText={errors.numero_documento}
              inputProps={{ minLength: 5, maxLength: 10 }}
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          {/* Teléfono */}
          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mb: 1.5, ...purpleFocusStyle }}
          />

          {/* Ficha */}
          <Autocomplete
            options={fichas}
            getOptionLabel={(ficha) =>
              `${ficha.numero_ficha} - ${ficha.nombre_programa}`
            }
            onChange={(e, value) =>
              setForm((prev) => ({
                ...prev,
                numero_ficha: value ? value.numero_ficha : ""
              }))
            }
            size="small"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ficha"
                required
                size="small"
                sx={{ mb: 1.5, ...purpleFocusStyle }}
              />
            )}
          />

          {/* Correo electrónico */}
          <TextField
            label="Correo electrónico"
            name="correo_electronico"
            type="email"
            value={form.correo_electronico}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mb: 1.5, ...purpleFocusStyle }}
          />

          {/* Contraseñas */}
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mb: 1.5, ...purpleFocusStyle }}
          />
          <TextField
            label="Confirmar contraseña"
            name="confirmarContrasena"
            type="password"
            value={form.confirmarContrasena}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            sx={{ mb: 2, ...purpleFocusStyle }}
          />

          {/* Botón de registro */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1,
              bgcolor: "#5E35B1",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
              "&:hover": { bgcolor: "#4527A0" },
              "&:disabled": { bgcolor: "#9E9E9E" },
              borderRadius: 2,
              textTransform: "none",
              boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)'
            }}
          >
            {loading ? "Registrando..." : "REGISTRARSE"}
          </Button>
        </form>
      </Paper>

      {/* Modal de confirmación */}
      <Dialog open={modalAbierto} onClose={handleCloseModal}>
        <DialogTitle sx={{ bgcolor: "#5E35B1", color: "white" }}>
          ¡Felicidades!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>Tu registro ha sido exitoso.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{ bgcolor: "#5E35B1", "&:hover": { bgcolor: "#4527A0" } }}
          >
            Ir al login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormularioAprendiz;