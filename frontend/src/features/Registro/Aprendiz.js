import React, { useEffect, useState } from "react";
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

function FormularioAprendiz() {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [errors, setErrors] = useState({});
  const [fichas, setFichas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipo_documento: "",
    numero_documento: "",
    telefono: "",
    numero_ficha: "",
    correo_electronico: "",
    password: "",
    confirmarContrasena: ""
  });

    // API URL base
  const API_URL = 'http://localhost:3000';

  const purpleFocusStyle = {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "#5E35B1"
    },
    "& label.Mui-focused": {
      color: "#5E35B1"
    }
  };

  useEffect(() => {
    const obtenerFichas = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/fichas/ver`);
        setFichas(data);
      } catch (error) {
        console.error("Error al obtener fichas:", error);
      }
    };
    obtenerFichas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Actualiza el formulario
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Validación de longitud para "numero_documento"
    if (name === "numero_documento") {
      if (value.length < 5 || value.length > 10) {
        setErrors((prev) => ({
          ...prev,
          numero_documento: "Debe tener entre 5 y 10 caracteres.",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          numero_documento: "",
        }));
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((val) => val === "")) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (form.password !== form.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post(`${API_URL}/usuarios/registroAprendiz`, form);
      setModalAbierto(true);
    } catch (error) {
      alert("Error al registrar aprendiz");
      console.error(error);
    }
  };

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
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 420, 
          padding: 2,
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          zIndex: 1,
          my: 3
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "#5E35B1",
            fontWeight: 600,
            mb: 3,
            fontSize: "1.5rem"
          }}
        >
          Registro de Aprendiz
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
            <TextField
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
              required
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              select
              label="Tipo de documento"
              name="tipo_documento"
              value={form.tipo_documento}
              onChange={handleChange}
              fullWidth
              required
              sx={{ flex: 1, ...purpleFocusStyle }}
            >
              <MenuItem value="CC">Cédula</MenuItem>
              <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
            </TextField>
            <TextField
              label="Número de documento"
              name="numero_documento"
              value={form.numero_documento}
              onChange={handleChange}
              fullWidth
              required
              error={Boolean(errors.numero_documento)}
              helperText={errors.numero_documento}
              inputProps={{ minLength: 5, maxLength: 9 }}
              sx={{ flex: 1, ...purpleFocusStyle }}
            />


          </Box>

          <TextField
            label="Teléfono"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2, ...purpleFocusStyle }}
          />

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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ficha"
                required
                sx={{ mb: 2, ...purpleFocusStyle }}
              />
            )}
          />

          <TextField
            label="Correo electrónico"
            name="correo_electronico"
            type="email"
            value={form.correo_electronico}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2, ...purpleFocusStyle }}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2, ...purpleFocusStyle }}
          />
          <TextField
            label="Confirmar contraseña"
            name="confirmarContrasena"
            type="password"
            value={form.confirmarContrasena}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2, ...purpleFocusStyle }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.3,
              bgcolor: "#5E35B1",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#4527A0" },
              borderRadius: 1,
              mt: 1
            }}
          >
            REGISTRARSE
          </Button>
        </form>
      </Paper>

      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <DialogTitle sx={{ bgcolor: "#5E35B1", color: "white" }}>
          ¡Felicidades!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography>Tu registro ha sido exitoso.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => navigate("/")}
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