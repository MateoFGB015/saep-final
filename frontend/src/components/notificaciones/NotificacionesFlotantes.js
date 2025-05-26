import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Componente `Notificación`
 * Muestra un título, una descripción y un botón para archivarla.
 *
 * @example
 * <Notificacion 
 *   titulo="Nueva actualización"
 *   descripcion="Se ha lanzado una nueva versión del sistema."
 *   onArchivar={() => console.log('Notificación archivada')}
 * />
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.titulo - Título de la notificación, que aparece en la parte superior.
 * @param {string} props.descripcion - Descripción o contenido de la notificación.
 * @param {function} props.onArchivar - Función ejecutada al hacer clic en el botón de cerrar, para archivar o eliminar la notificación.
 *
 * @returns {JSX.Element} Un componente de tarjeta que muestra una notificación con opción de cierre.
 */

const Notificacion = ({ titulo, descripcion, onArchivar }) => {
  return (
    <Card
      elevation={0}
      sx={{
        marginBottom: 2,
        padding: '0.5px',
        borderRadius: 2,
        backgroundColor: 'white',
        border: 'solid 2px #E0E0E0',
        '&:hover': { bgcolor: '#f5f5f5' },
      }}
    >
      <CardContent>
        <Grid
          container
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography fontWeight="600" variant="subtitle2">{titulo}</Typography>
            <IconButton onClick={onArchivar} sx={{ color: '#1C1B1F' }}>
              <CloseIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Grid>
        <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
          {descripcion}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Notificacion;
