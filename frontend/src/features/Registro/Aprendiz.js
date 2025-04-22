import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/imgs/confeccion.jpg";

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
} from "@mui/material";
// import ReCAPTCHA from "react-google-recaptcha";

function FormularioAprendiz() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    programa: "",
    ficha: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    captcha: false,
  });

  const [programas, setProgramas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    setProgramas([
      "Diseño de modas",
      "Confección industrial",
      "Patronaje y moda",
      "Diseño textil",
      "Moda sostenible",
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(form).some((val) => val === "")) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!form.captcha) {
      alert("Debes verificar que no eres un robot");
      return;
    }

    setModalAbierto(true);
  };

  const purpleFocusStyle = {
    '& .MuiOutlinedInput-root.Mui-focused fieldset': {
      borderColor: '#5E35B1',
    },
    '& label.Mui-focused': {
      color: '#5E35B1',
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
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
          zIndex: 0,
        }
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: 500,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
          my: 4,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "#5E35B1",
            fontWeight: "600",
            mb: 4,
            fontSize: "1.75rem"
          }}
        >
          Registro de Aprendiz
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Nombre del aprendiz"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
            <TextField
              label="Apellido del aprendiz"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              select
              label="Tipo de documento"
              name="tipoDocumento"
              value={form.tipoDocumento}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            >
              <MenuItem value="CC">Cédula</MenuItem>
              <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
            </TextField>
            <TextField
              label="Número de documento"
              name="numeroDocumento"
              value={form.numeroDocumento}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          <TextField
            select
            label="Programa de formación"
            name="programa"
            value={form.programa}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            sx={{ mb: 2, ...purpleFocusStyle }}
          >
            {programas.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Ficha"
            name="ficha"
            value={form.ficha}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            sx={{ mb: 2, ...purpleFocusStyle }}
          />

          <TextField
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            sx={{ mb: 2, ...purpleFocusStyle }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Contraseña"
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
            <TextField
              label="Confirmar contraseña"
              name="confirmarContrasena"
              type="password"
              value={form.confirmarContrasena}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={{ flex: 1, ...purpleFocusStyle }}
            />
          </Box>

          <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
            <ReCAPTCHA
              sitekey="TU_CLAVE_REAL"
              onChange={() => setForm((prev) => ({ ...prev, captcha: true }))}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              bgcolor: "#5E35B1",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#4527A0" },
              borderRadius: 1,
              mt: 2,
              mb: 1,
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
            onClick={() => navigate("/login")}
            variant="contained"
            sx={{
              bgcolor: "#5E35B1",
              "&:hover": { bgcolor: "#4527A0" }
            }}
          >
            Ir al login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FormularioAprendiz;
