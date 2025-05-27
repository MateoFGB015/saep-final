//este es el login de que muestra al inicio cuando se ingresa al sistema

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Link,
  Box,
  Paper,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuthActions } from "../../api/useAuthActions";
import backgroundImage from "../../assets/imgs/Portada3.jpg";
import sideImage from "../../assets/imgs/Portada3.jpg";
import saepLogo from "../../assets/imgs/SAEP2.png";


const IniciarSesion = () => {
  const { login } = useAuthActions();
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (loading) return; // Evita múltiples envíos
    setLoading(true); // Activa la carga antes de la petición
  
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula el tiempo de respuesta
      await login(correoElectronico, password);
      navigate("/inicio");
    } catch (error) {
      setError(error.message || "Error en el inicio de sesión");
    } finally {
      setLoading(false); // Asegura que el loader se apague
    }
  };
  

  return (
    <Grid container sx={{ height: "100vh", overflowY: "hidden", position: "relative" }}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -2,
        }}
      />
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(113, 39, 122, 0.4)",
          zIndex: -1,
        }}
      />
      <Grid item xs={12} md={6} display="flex" justifyContent="center" alignItems="center">
        <Paper
          elevation={6}
          sx={{
            m:2,
            p: 6,
            width: { xs: "90%", sm: "350px" },
            borderRadius: "20px",
            border: "1px solid lightgray",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            sx={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}
          >
            Iniciar Sesión
          </Typography>


          <form onSubmit={handleSubmit}>
          <TextField
          fullWidth
          margin="normal"
          label="Correo electrónico"
          type="email"
          variant="outlined"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          required
          autoComplete="new-password" // Evita autofill sin romper validaciones
          InputProps={{
            endAdornment: (
            <InputAdornment position="end">
              <Email color="action" />
            </InputAdornment>
            ),
          }}

          sx={{
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
        }}
        />

            <TextField
            fullWidth
            margin="normal"
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </InputAdornment>
              ),
            }}
            sx={{
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
            }}
          />

            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Box textAlign="right" sx={{ mt: 1 }}>
              <Link href="/solicitar-restablecimiento" sx={{ textDecoration: "none", fontSize: "13px", color:"inherit", fontFamily:"" }}>
                ¿Olvidaste la contraseña?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
               mb: -2,
              mt: 4,
              borderRadius: "8px",
              height: "45px",
              bgcolor: "#71277a",
              transition: "background-color 0.3s ease",
              "&:hover": { bgcolor: "#5a1f63" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "INGRESAR"}
            </Button>
          </form>
        </Paper>
      </Grid>
       <Grid
    item
    xs={12}
    md={6}
    sx={{
      display: { xs: "none", md: "block" },
      backgroundImage: `linear-gradient(to left, rgba(113, 39, 122, 0.6), rgba(0,0,0,0.4)), url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderTopLeftRadius: "50px",
      borderBottomLeftRadius: "50px",
    }}
  />

  <Box
  component="img"
  src={saepLogo}
  alt="Logo SAEP"
  sx={{
    position: "fixed",
    bottom: 16,
    right: 16,
    width: { xs: "150px", sm: "150px" },
    zIndex: 1,
  }}
/>


</Grid>
  );
};

export default IniciarSesion;