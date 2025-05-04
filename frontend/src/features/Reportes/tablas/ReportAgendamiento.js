import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthProvider'; // Asegúrate de que la ruta es correcta

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField
} from '@mui/material';

const ReporteAgendamientos = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reporteGenerado, setReporteGenerado] = useState(false);

  const API_URL = 'http://localhost:3000';

  const fetchAgendamientos = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }

    try {
      const token = localStorage.getItem('token');

      let url = `${API_URL}/reportes/agendamientos`;

      if (user?.rol === 'Administrador') {
        const idInstructor = user.id; // o puedes reemplazar esto por el ID seleccionado si lo deseas
        url += `/${idInstructor}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { fechaInicio, fechaFin }
      });

      setData(response.data);
      setReporteGenerado(true);
    } catch (error) {
      console.error('Error al obtener los agendamientos:', error);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6" textAlign="center" fontWeight="bold" mb={2}>
        Reporte de agendamientos por rango de fechas
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="Fecha inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            label="Fecha fin"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={3} display="flex" alignItems="center">
          <Button
            onClick={fetchAgendamientos}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#71277a',
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              py: 1.5
            }}
          >
            Generar reporte
          </Button>
        </Grid>
      </Grid>

      {reporteGenerado && (
        <>
          <Typography variant="subtitle1" textAlign="center" fontWeight="bold" mb={2}>
            Resultados encontrados
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Apellido</strong></TableCell>
                  <TableCell><strong>Documento</strong></TableCell>
                  <TableCell><strong>Fecha Agendamiento</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.apellido}</TableCell>
                    <TableCell>{item.documento}</TableCell>
                    <TableCell>{new Date(item.fecha_inicio).toLocaleDateString()}</TableCell>
                    <TableCell>{item.estado_visita}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography textAlign="center" mt={3} color="gray">
            Fecha de creación del reporte: {new Date().toLocaleDateString()}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ReporteAgendamientos;
