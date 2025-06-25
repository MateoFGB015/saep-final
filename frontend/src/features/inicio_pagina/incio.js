import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import imagenInicio from '../../assets/imgs/imageninicio.jpg'; // AJUSTA esta ruta si es necesario

const tendencias = [
  {
    titulo: 'Inteligencia Artificial',
    descripcion: 'Cada vez más programas formativos incluyen fundamentos de IA para preparar a los aprendices para el futuro.',
  },
  {
    titulo: 'Desarrollo Web Full Stack',
    descripcion: 'Con alta demanda en el mercado, es una de las rutas formativas más completas y populares.',
  },
  {
    titulo: 'Ciberseguridad',
    descripcion: 'Protección de datos y sistemas informáticos: una prioridad para las organizaciones modernas.',
  },
];

const Inicio = () => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: '100vh',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
          <Box
            component="img"
            src={imagenInicio}
            alt="Imagen de Confección"
            sx={{
              width: '100%',
              height: { xs: 250, sm: 300, md: 400 },
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Paper>
 {/* Sección de Tendencias */}
        <Paper elevation={2} sx={{ p: 3, mb: 5 }}>
          <Typography variant="h5" color="secondary" gutterBottom>
            📚 Últimas Tendencias Formativas
          </Typography>
          <Grid container spacing={3}>
            {tendencias.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {item.titulo}
                    </Typography>
                    <Typography variant="body2">
                      {item.descripcion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Sección de Beneficios */}
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f9fbe7' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Beneficios de esta herramienta
          </Typography>
          <Grid container spacing={3}>
            {[
              '✅ Registro organizado de fichas y usuarios',
              '✅ Seguimiento en tiempo real del aprendizaje',
              '✅ Comunicación clara entre instructores y aprendices',
            ].map((beneficio, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Typography variant="body1">{beneficio}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; 2025 Sistema de Seguimiento de Aprendices – Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
     

export default Inicio;
