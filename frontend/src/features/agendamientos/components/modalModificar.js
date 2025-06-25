import { useState, useContext, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button,
  DialogActions, IconButton, Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {
  actualizarEvento,
  actualizarEventoComoAdmin,
  eliminarEvento,
  eliminarEventoComoAdmin
} from "../../../api/AgendamientoAPI";
import EventosContext from "../../../context/eventosProvider";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../../usuarios/hooks/UserAlert";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";
import { useAuth } from "../../../context/AuthProvider";

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

const ModalModificar = ({ open, onClose, evento }) => {
  const { alerta, closeAlert, showAlert } = useAlert();
  const { setEventos } = useContext(EventosContext);
  const { user } = useAuth();
  const esAprendiz = user?.rol?.toLowerCase() === "aprendiz";

const [formData, setFormData] = useState({
  nombreAprendiz: "",
  enlace_reunion: "",
  empresa: "",
  direccion: "",
  tipo_visita: "",
  start: "",
  end: "",
  estado: "",
});


  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

useEffect(() => {
  if (evento) {
    console.log("Evento recibido en modal:", evento); // 👈
    setFormData({
      nombreAprendiz: evento.nombreAprendiz || "",
      empresa: evento.nombreEmpresa || "",
      direccion: evento.direccion || "",
      tipo_visita: evento.tipo_visita || "",
      enlace_reunion: evento.enlace_reunion || "",
      start: evento.start ? moment(evento.start).format("YYYY-MM-DDTHH:mm") : "",
      end: evento.end ? moment(evento.end).format("YYYY-MM-DDTHH:mm") : "",
      estado: evento.estado || "",
    });
  }
}, [evento]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!evento?.id) throw new Error("No se pudo identificar el agendamiento.");

      if (moment(formData.end).isBefore(moment(formData.start))) {
        showAlert("La fecha de fin no puede ser anterior a la de inicio", "error");
        setLoading(false);
        return;
      }

      const payload = {
        fecha_inicio: formData.start,
        fecha_fin: formData.end,
        tipo_visita: formData.tipo_visita,
        enlace_reunion: formData.enlace_reunion,
        estado_visita: formData.estado,
      };

      const actualizar = user.rol === 'Administrador' ? actualizarEventoComoAdmin : actualizarEvento;
      await actualizar(evento.id, payload);

      showAlert("¡Datos actualizados exitosamente!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      showAlert("Hubo un error al actualizar el agendamiento", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => setShowConfirmationModal(true);

  const handleConfirm = async () => {
    try {
      if (!evento?.id) throw new Error("No se pudo identificar el agendamiento.");

      const eliminar = user.rol === 'Administrador' ? eliminarEventoComoAdmin : eliminarEvento;
      await eliminar(evento.id);

      showAlert("¡Agendamiento eliminado correctamente!", "success");
      setShowConfirmationModal(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error al eliminar el agendamiento:", error);
      showAlert("Hubo un error al eliminar el agendamiento", "error");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ flexGrow: 1, textAlign: "center" }}>Información del agendamiento</span>
          <IconButton onClick={onClose} size="small" sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Aprendiz"
                name="nombreAprendiz"
                value={formData.nombreAprendiz}
                fullWidth
                sx={textFieldStyle}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                select
                label="Tipo"
                name="tipo_visita"
                value={formData.tipo_visita}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
                InputProps={esAprendiz ? { readOnly: true } : {}}
              >
                <MenuItem value="virtual">Virtual</MenuItem>
                <MenuItem value="presencial">Presencial</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Enlace"
                name="enlace_reunion"
                value={formData.enlace_reunion}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
                InputProps={esAprendiz ? { readOnly: true } : {}}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Fecha y Hora de Inicio"
                type="datetime-local"
                name="start"
                value={formData.start}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
                InputProps={esAprendiz ? { readOnly: true } : {}}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Fecha y Hora de Fin"
                type="datetime-local"
                name="end"
                value={formData.end}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle}
                InputProps={esAprendiz ? { readOnly: true } : {}}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
                InputProps={esAprendiz ? { readOnly: true } : {}}
              >
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="realizado">Realizado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        {!esAprendiz && (
          <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 1, ml: 2, mr: 2, gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ color: "white", backgroundColor: "#71277a", width: "100%" }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button
              variant="contained"
              onClick={handleEliminar}
              sx={{ width: "100%", backgroundColor: "red", color: "white" }}
            >
              Eliminar
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <ConfirmDialog
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirm}
        title="¡Alerta!"
        message="Esta acción eliminará el registro por completo. ¿Desea continuar?"
      />

      <CustomSnackbar alerta={alerta} closeAlert={closeAlert} />
    </>
  );
};

export default ModalModificar;
