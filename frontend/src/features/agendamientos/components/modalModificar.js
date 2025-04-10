import { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { actualizarEvento } from "../../../api/AgendamientoAPI";
import EventosContext from "../../../context/eventosProvider";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../../usuarios/hooks/UserAlert";
import axiosInstance from "../../../api/AxiosInstance";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";

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

  const [formData, setFormData] = useState({
    nombreAprendiz: "",
    telefonoAprendiz: "",
    empresa: "",
    direccion: "",
    tipo: "",
    enlace: "",
    start: "",
    end: "",
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    if (evento) {
      setFormData({
        nombreAprendiz: evento.nombreAprendiz || "",
        telefonoAprendiz: evento.telefonoAprendiz || "",
        empresa: evento.nombreEmpresa || "",
        direccion: evento.direccion || "",
        tipo: evento.tipo_visita || "",
        enlace: evento.enlace_reunion || "",
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
      await actualizarEvento(evento.id, {
        fecha_inicio: formData.start,
        fecha_fin: formData.end,
        tipo_visita: formData.tipo,
        enlace_reunion: formData.enlace,
        estado_visita: formData.estado,
      });

      showAlert("¡Datos actualizados exitosamente!.", "success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      showAlert("¡Hubo un error al actualizar el agendamiento!. Revisa los datos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirm = async () => {
    try {
      await axiosInstance.delete(`/agendamiento/eliminar/${evento.id}`);
      showAlert("¡Agendamiento eliminado correctamente!.", "success");
      setShowConfirmationModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error al eliminar el agendamiento:", error);
      showAlert("¡Hubo un error al eliminar el agendamiento!.", "error");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ flexGrow: 1, textAlign: "center" }}>Información del agendamiento</span>
          <IconButton onClick={onClose} size="small" sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ height: "min-content" }}>
          <Grid container spacing={2} sx={{ mt: -1 }}>
            {[
              { label: "Aprendiz", name: "nombreAprendiz" },
              { label: "Teléfono", name: "telefonoAprendiz" },
              { label: "Empresa", name: "empresa" },
              { label: "Dirección", name: "direccion" },
            ].map((field, index) => (
              <Grid item xs={6} key={index}>
                <TextField
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  fullWidth
                  sx={textFieldStyle}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ))}

            <Grid item xs={6}>
              <TextField
                select
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
              >
                <MenuItem value="virtual">virtual</MenuItem>
                <MenuItem value="presencial">presencial</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Enlace"
                name="enlace"
                value={formData.enlace}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
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
              >
                <MenuItem value="pendiente">pendiente</MenuItem>
                <MenuItem value="realizado">realizado</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 1, ml: 2, mr: 2, gap: 1}}>
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
            sx={{
              width: "100%",
              Color: "white",
              backgroundColor: "red",
              boxShadow: "none",
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
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
