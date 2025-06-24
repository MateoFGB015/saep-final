import { Modal, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const SolicitarVisitaModal = ({ open, onClose, token }) => {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEnviar = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(`${API_URL}/notificacion/solicitarVisita`, 
        { mensajePersonalizado: mensaje }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("✅ Solicitud enviada correctamente");
      setMensaje("");
    } catch (error) {
      console.error("❌ Error al solicitar visita:", error);
      setErrorMsg(error?.response?.data?.error || "Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        backgroundColor: "#fff",
        borderRadius: 2,
        p: 3,
        width: "90%",
        maxWidth: 400,
        mx: "auto",
        mt: "10%",
        boxShadow: 24,
      }}>
        <Typography variant="h6" mb={2}>Solicitar visita</Typography>

        <TextField
          label="Mensaje adicional (opcional)"
          multiline
          rows={3}
          fullWidth
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
        />

        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        {successMsg && <Typography color="success.main" mt={2}>{successMsg}</Typography>}
        {errorMsg && <Typography color="error.main" mt={2}>{errorMsg}</Typography>}

        <Button
          onClick={handleEnviar}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, backgroundColor: "#71277a", "&:hover": { backgroundColor: "#5e2065" } }}
        >
          Enviar solicitud
        </Button>
      </Box>
    </Modal>
  );
};

export default SolicitarVisitaModal;
