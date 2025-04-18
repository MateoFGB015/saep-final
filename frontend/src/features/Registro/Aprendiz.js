import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Paper,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

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
    noSoyRobot: false,
  });
  const [alerta, setAlerta] = useState(false);
  const [programas, setProgramas] = useState([]);

  useEffect(() => {
    // Simulación de petición de programas disponibles
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

    if (Object.values(form).some((val) => val === "" || val === false)) {
      alert("Todos los campos son obligatorios y debes confirmar que no eres un robot");
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setAlerta(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/fondo-textil.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={6} sx={{ p: 4, bgcolor: "rgba(255,255,255,0.95)", borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Registro de Aprendiz
          </Typography>
          <form onSubmit={handleSubmit}>
            {[{
              label: "Nombre del aprendiz",
              name: "nombre",
            }, {
              label: "Apellido del aprendiz",
              name: "apellido",
            }, {
              label: "Número de documento",
              name: "numeroDocumento",
            }, {
              label: "Ficha",
              name: "ficha",
            }, {
              label: "Correo electrónico",
              name: "correo",
              type: "email",
            }, {
              label: "Contraseña",
              name: "contrasena",
              type: "password",
            }, {
              label: "Confirmar contraseña",
              name: "confirmarContrasena",
              type: "password",
            }].map(({ label, name, type = "text" }) => (
              <TextField
                key={name}
                label={label}
                name={name}
                value={form[name]}
                onChange={handleChange}
                type={type}
                fullWidth
                required
                margin="normal"
              />
            ))}

            <TextField
              select
              label="Tipo de documento"
              name="tipoDocumento"
              value={form.tipoDocumento}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              <MenuItem value="CC">Cédula</MenuItem>
              <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
            </TextField>

            <TextField
              label="Programa de formación"
              name="programa"
              value={form.programa}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              list="programas"
            />
            <datalist id="programas">
              {programas.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.noSoyRobot}
                  onChange={handleChange}
                  name="noSoyRobot"
                  required
                />
              }
              label="No soy un robot"
            />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Registrarse
            </Button>
          </form>
        </Paper>
        <Snackbar
          open={alerta}
          message="¡Registro exitoso! Redirigiendo al login..."
          autoHideDuration={2000}
        />
      </motion.div>
    </Box>
  );
}

export default FormularioAprendiz;
