import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {Box, Typography, Paper, Divider, Grid, Button} from '@mui/material';

const ReportAprendiz = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const token = localStorage.getItem('token'); // obtén el token
        const response = await axios.get(`${API_URL}/reportes/aprendiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` // añade el token a la solicitud
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('❌ Error al obtener los datos del aprendiz:', error);
      }
    };
  
    fetchReporte();
  }, [id]);

  if (!data) {
    return <Typography sx={{ mt: 4 }}>Cargando reporte del aprendiz...</Typography>;
  }

  return (
    <Box
  sx={{
    maxHeight: '80vh',
    overflowY: 'auto',
    p: 2,
    backgroundColor: 'white',
    borderRadius: 2,
    boxShadow: 3,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ccc',
      borderRadius: '10px',
    },
  }}
>
  {    <Box sx={{ p: 4 }}>
    {/* Título principal */}
    <Typography variant="h5" textAlign="center" mb={4}>
      Reporte de Aprendiz: {data.nombre} {data.apellido}
    </Typography>
  
    {/* Información de ficha */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Información de ficha</Typography>
      {data.fichasAprendiz?.map((ficha) => (
        <Grid container spacing={2} key={ficha.id_ficha_aprendiz}>
          <Grid item xs={6}><strong>Programa:</strong> {ficha.ficha?.nombre_programa}</Grid>
          <Grid item xs={6}><strong>Nivel:</strong> Tecnólogo</Grid>
          <Grid item xs={6}><strong>Inicio etapa práctica:</strong> {ficha.ficha?.inicio_etapa_productiva}</Grid>
          <Grid item xs={6}><strong>Fin etapa práctica:</strong> {ficha.ficha?.fin_etapa_productiva}</Grid>
          <Grid item xs={12}><strong>Número de ficha:</strong> {ficha.ficha?.numero_ficha}</Grid>
        </Grid>
      ))}
    </Paper>
  
    {/* Información del aprendiz */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Información del aprendiz</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}><strong>Nombre:</strong> {data.nombre}</Grid>
        <Grid item xs={6}><strong>Apellido:</strong> {data.apellido}</Grid>
        <Grid item xs={6}><strong>Tipo de documento:</strong> {data.tipo_documento}</Grid>
        <Grid item xs={6}><strong>Número documento:</strong> {data.numero_documento}</Grid>
        <Grid item xs={6}><strong>Teléfono:</strong> {data.telefono}</Grid>
        <Grid item xs={6}><strong>Correo:</strong> {data.correo_electronico}</Grid>
      </Grid>
    </Paper>
  
    {/* Información de la empresa */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Empresa</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}><strong>Empresa:</strong> {data.detalle_aprendiz?.empresa?.razon_social}</Grid>
        <Grid item xs={6}><strong>Dirección:</strong> {data.detalle_aprendiz?.empresa?.direccion || 'No registrada'}</Grid>
        <Grid item xs={6}><strong>Correo empresa:</strong> {data.detalle_aprendiz?.empresa?.correo_electronico}</Grid>
        <Grid item xs={6}><strong>Teléfono empresa:</strong> {data.detalle_aprendiz?.empresa?.telefono}</Grid>
        <Grid item xs={12}><strong>Nombre del jefe:</strong> {data.detalle_aprendiz?.jefe_inmediato}</Grid>
      </Grid>
    </Paper>
  
    {/* Documentos */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Documentos</Typography>
      {data.fichasAprendiz?.flatMap(f =>
        f.documentos?.map(doc => (
          <Typography key={doc.id_documento}>📎 {doc.nombre_documento} - {doc.descripcion}</Typography>
        ))
      )}
    </Paper>
  
    {/* Bitácoras */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Bitácoras</Typography>
      {data.fichasAprendiz?.flatMap(f =>
        f.bitacoras?.map(bit => (
          <Typography key={bit.id_bitacora}>🗒️ Bitácora #{bit.numero_bitacora} - Estado: {bit.estado_bitacora}</Typography>
        ))
      )}
    </Paper>
  
    {/* Agendamientos */}
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" mb={2}>Agendamientos</Typography>
      {data.fichasAprendiz?.flatMap(f =>
        f.agendamientos?.map(ag => (
          <Typography key={ag.id_agendamiento}>
            📅 Visita: # {ag.numero_visita} - fecha: {new Date(ag.fecha_inicio).toLocaleDateString()} - Estado: {ag.estado_visita}
          </Typography>
        ))
      )}
    </Paper>

    <Button
  variant="contained"
  sx={{
    backgroundColor: '#71277a',
    color: 'white',
    mt: 3,
    borderRadius: '20px',
    px: 3,
    textTransform: 'none'
  }}
  onClick={() => console.log('Generar PDF')}
>
  Generar reporte del aprendiz
</Button>
  </Box>
}
</Box>

  
  );
};

export default ReportAprendiz;
