import { useState } from "react";
import { Container, TextField, Button, Typography, Box, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import useAlert from "../../hooks/useAlert";
import CustomSnackbar from "../../components/ui/Alert";
import authAPI from "../../api/AuthAPI";

const SolicitarRestablecimiento = () => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [correoElectronico, setCorreoElectronico] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(correoElectronico)) {
      showAlert("Por favor, introduce un correo electrónico válido.", "error");
      return;
    }

    try {
      const response = await authAPI.solicitarRestablecimiento(correoElectronico);
      showAlert(response.message, "success")
      setCorreoElectronico("");
    } catch (error) {
      showAlert(error.response?.data?.message || "Error al solicitar restablecimiento", "error");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5",ml:4, mr:4 }}>
        <Container maxWidth="xs" sx={{ textAlign: "center", p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <EmailIcon sx={{ fontSize: 120, color: "#71277a",mb:5 }} />
            <Typography variant="h6" sx={{fontSize:"17px"}}>
              Ingrese el correo electrónico asociado a su cuenta para continuar con el proceso de recuperación
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Correo electrónico"
              type="email"
              variant="outlined"
              value={correoElectronico}
              onChange={(e) => setCorreoElectronico(e.target.value)}
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mt:-1,
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#71277a", color: "white", mt: 1, p: 1.5, borderRadius: "8px", "&:hover": { backgroundColor: "#5e2062" } }}
            >
              Enviar
            </Button>
          </form>
          <Typography mt={2} variant="body2" color="textSecondary">
            ¿Ya no tienes acceso?
          </Typography>
        </Container>
      </Box>

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default SolicitarRestablecimiento;