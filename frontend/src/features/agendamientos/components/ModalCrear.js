import { useState, useContext, useEffect } from "react";
import { useAuth } from "../../../context/AuthProvider";
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
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {
  crearEvento,
  obtenerFichas,
  crearEventoComoAdmin,
  obtenerAprendices,
  obtenerVisitasPorFichaAprendiz,
} from "../../../api/AgendamientoAPI";
import EventosContext from "../../../context/eventosProvider";
import CustomSnackbar from "../../../components/ui/Alert";
import useAlert from "../../usuarios/hooks/UserAlert";

const textFieldStyle = {
  "& label": { color: "gray" },
  "& label.Mui-focused": { color: "#71277a" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "lightgray" },
    "&:hover fieldset": { borderColor: "lightgray" },
    "&.Mui-focused fieldset": { borderColor: "#71277a" },
    backgroundColor: "white !important",
  },
};

const ModalCrear = ({ open, onClose, fechaSeleccionada, idInstructor }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const { setEventos } = useContext(EventosContext);
  const { user } = useAuth();
  const [fichas, setFichas] = useState([]);
  const [aprendices, setAprendices] = useState([]);
  const [visitasDisponibles, setVisitasDisponibles] = useState([1, 2, 3]);
  const [formData, setFormData] = useState({
    tipo: "",
    enlace: "",
    start: "",
    end: "",
    estado: "pendiente",
    id_ficha: "",
    id_aprendiz: "",
    id_ficha_aprendiz: "",
    id_instructor: "1",
    herramienta_reunion: "",
    numero_visita: "",
  });

  useEffect(() => {
    if (fechaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        start: moment(fechaSeleccionada).format("YYYY-MM-DDTHH:mm"),
      }));
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    const cargarFichas = async () => {
      const data = await obtenerFichas();
      setFichas(data);
    };
    cargarFichas();
  }, []);

  useEffect(() => {
    if (formData.id_ficha) {
      const cargarAprendices = async () => {
        const data = await obtenerAprendices(formData.id_ficha);
        setAprendices(data);
      };
      cargarAprendices();
    } else {
      setAprendices([]);
    }
  }, [formData.id_ficha]);

  useEffect(() => {
    if (formData.tipo === "presencial") {
      setFormData((prev) => ({
        ...prev,
        herramienta_reunion: "No aplica",
        enlace: "No aplica",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        herramienta_reunion: "",
        enlace: "",
      }));
    }
  }, [formData.tipo]);

  useEffect(() => {
    const cargarVisitas = async () => {
      if (formData.id_ficha_aprendiz) {
        const visitas = await obtenerVisitasPorFichaAprendiz(formData.id_ficha_aprendiz);
        const usadas = visitas;
        const disponibles = [1, 2, 3].filter((v) => !usadas.includes(v));
        setVisitasDisponibles(disponibles);
      } else {
        setVisitasDisponibles([1, 2, 3]);
      }
    };
    cargarVisitas();
  }, [formData.id_ficha_aprendiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_ficha") {
      setFormData((prev) => ({
        ...prev,
        id_ficha: value,
        id_aprendiz: "",
        id_ficha_aprendiz: "",
      }));
      return;
    }

    if (name === "id_aprendiz") {
      const aprendizSeleccionado = aprendices.find((a) => a.id_aprendiz === value);
      setFormData((prev) => ({
        ...prev,
        id_aprendiz: value,
        id_ficha_aprendiz: aprendizSeleccionado?.id_ficha_aprendiz || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (moment(formData.end).isBefore(moment(formData.start))) {
      showAlert("¡La fecha de finalización debe ser posterior a la fecha de inicio!", "error");
      return;
    }

    const payload = {
      id_ficha_aprendiz: formData.id_ficha_aprendiz,
      herramienta_reunion: formData.herramienta_reunion,
      enlace_reunion: formData.enlace,
      fecha_inicio: formData.start,
      fecha_fin: formData.end,
      estado_visita: formData.estado,
      tipo_visita: formData.tipo,
      numero_visita: formData.numero_visita,
    };

    try {
      let nuevoEvento;
      if (user.rol === "Administrador") {
        if (!idInstructor) {
          showAlert("No se ha seleccionado un instructor.", "error");
          return;
        }
        nuevoEvento = await crearEventoComoAdmin(idInstructor, payload);
      } else {
        nuevoEvento = await crearEvento(payload);
      }

      setEventos((prev) => [...prev, nuevoEvento]);
      showAlert("¡Agendamiento registrado exitosamente!", "success");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const mensaje = error?.response?.data?.mensaje;

      if (mensaje?.includes("ya tiene una visita")) {
        showAlert("Ese aprendiz ya tiene una visita en ese horario.", "error");
      } else if (mensaje?.includes("instructor ya tiene una visita")) {
        showAlert("Este instructor ya tiene otra visita programada en ese mismo horario.", "error");
      } else {
        showAlert("¡Hubo un error al guardar el agendamiento!", "error");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ flexGrow: 1, textAlign: "center" }}>Crear Agendamiento</span>
          <IconButton onClick={onClose} size="small" sx={{ color: "gray" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: -1 }}>
            <Grid item xs={6}>
              <TextField select label="Ficha" name="id_ficha" value={formData.id_ficha} onChange={handleChange} fullWidth sx={textFieldStyle}>
                {fichas.map((ficha) => (
                  <MenuItem key={ficha.id_ficha} value={ficha.id_ficha}>
                    {ficha.numero_ficha} - {ficha.nombre_programa}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Aprendiz" name="id_aprendiz" value={formData.id_aprendiz} onChange={handleChange} fullWidth disabled={!formData.id_ficha} sx={textFieldStyle}>
                {aprendices.map((aprendiz) => (
                  <MenuItem key={aprendiz.id_aprendiz} value={aprendiz.id_aprendiz}>
                    {aprendiz.nombre} {aprendiz.apellido}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} fullWidth sx={textFieldStyle}>
                <MenuItem value="virtual">Virtual</MenuItem>
                <MenuItem value="presencial">Presencial</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Herramienta" name="herramienta_reunion" value={formData.herramienta_reunion} onChange={handleChange} fullWidth sx={textFieldStyle} disabled={formData.tipo === "presencial"}>
                <MenuItem value="Meet">Google Meet</MenuItem>
                <MenuItem value="Teams">Microsoft Teams</MenuItem>
                <MenuItem value="Zoom">Zoom</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField select label="Visita #" name="numero_visita" value={formData.numero_visita} onChange={handleChange} fullWidth sx={textFieldStyle} disabled={visitasDisponibles.length === 0}>
                {visitasDisponibles.map((num) => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </TextField>
              {visitasDisponibles.length === 0 && (
                <Typography variant="caption" color="error">
                  Este aprendiz ya tiene asignadas las 3 visitas.
                </Typography>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField label="Enlace" name="enlace" value={formData.enlace} onChange={handleChange} fullWidth sx={textFieldStyle} disabled={formData.tipo === "presencial"} />
            </Grid>

            <Grid item xs={6}>
              <TextField label="Fecha Inicio" type="datetime-local" name="start" value={formData.start} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={textFieldStyle} />
            </Grid>

            <Grid item xs={6}>
              <TextField label="Fecha Fin" type="datetime-local" name="end" value={formData.end} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} sx={textFieldStyle} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Button variant="contained" color="primary" sx={{ color: "white", backgroundColor: "#71277a", width: "95%" }} onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default ModalCrear;
