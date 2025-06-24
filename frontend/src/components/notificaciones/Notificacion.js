import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Componente que representa una notificación individual.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título de la notificación
 * @param {string} props.descripcion - Contenido/mensaje
 * @param {Function} props.onArchivar - Función que se ejecuta al presionar el botón de cerrar
 */
const Notificacion = ({ titulo, descripcion, onArchivar }) => {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 1,
        backgroundColor: "#fff",
        borderRadius: 2,
        border: "1px solid #ddd",
        "&:hover": { bgcolor: "#f9f9f9" },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight={600}>
            {titulo}
          </Typography>
          <IconButton size="small" onClick={onArchivar} aria-label="archivar notificación">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" mt={0.5}>
          {descripcion}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Notificacion;
