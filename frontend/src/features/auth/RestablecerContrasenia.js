import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, InputAdornment } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import useAlert from "../../hooks/useAlert";
import CustomSnackbar from "../../components/ui/Alert";
import authAPI from "../../api/AuthAPI";

const RestablecerContrasenia = () => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const { token } = useParams();
  const navigate = useNavigate();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena.length < 6) {
      showAlert("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      showAlert("Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      const response = await authAPI.restablecerContrasenia(token, nuevaContrasena);
      showAlert(response.message, "success");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      showAlert(error.response?.data?.message || "Error al restablecer contraseña", "error");
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
        <Container maxWidth="xs" sx={{ textAlign: "center", p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <LockIcon sx={{ fontSize: 120, color: "#71277a", mb: 5 }} />
            <Typography variant="h6" sx={{ fontSize: "17px" }}>
              Ingrese una nueva contraseña. Tenga en cuenta que esta debe tener mínimo 6 caracteres
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Nueva contraseña"
              type="password"
              variant="outlined"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
              sx={{
                mt: -1,
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirmar contraseña"
              type="password"
              variant="outlined"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "#71277a", color: "white", mt: 2, p: 1.5, borderRadius: "8px", "&:hover": { backgroundColor: "#5e2062" } }}
            >
              Restablecer
            </Button>
          </form>
        </Container>
      </Box>
      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default RestablecerContrasenia;