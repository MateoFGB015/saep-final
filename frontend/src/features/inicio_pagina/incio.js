import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';

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
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none', // Chrome
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Encabezado */}
        <Paper elevation={3} sx={{ p: 4, backgroundColor: '#e3f2fd', mb: 4 }}>
          <Typography variant="h3" color="primary" gutterBottom align="center">
            Bienvenid@ a tu Plataforma de Seguimiento de Aprendices
          </Typography>
          <Typography variant="h6" align="center">
            Una herramienta para gestionar, monitorear y acompañar tu proceso formativo.
          </Typography>
        </Paper>

        {/* Instrucciones */}
        <Paper elevation={2} sx={{ p: 3, mb: 5 }}>
          <Typography variant="h5" color="secondary" gutterBottom>
            ¿Cómo usar la plataforma?
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="🔹 Instructores"
                secondary="Pueden registrar fichas, asignar aprendices y hacer seguimiento individual o grupal."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="🔹 Aprendices"
                secondary="Visualizan su ficha, verifican asistencia, seguimiento académico y observaciones realizadas."
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="🔹 Administradores"
                secondary="Gestionan usuarios, roles, fichas y control general del sistema."
              />
            </ListItem>
          </List>
        </Paper>

        {/* Tendencias */}
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
                    <Typography variant="body2">{item.descripcion}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Beneficios */}
        <Paper elevation={1} sx={{ p: 3, backgroundColor: '#f9fbe7' }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Beneficios de esta herramienta
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">✅ Registro organizado de fichas y usuarios</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">✅ Seguimiento en tiempo real del aprendizaje</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body1">✅ Comunicación clara entre instructores y aprendices</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer*/}
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