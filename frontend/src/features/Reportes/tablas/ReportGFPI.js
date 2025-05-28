import React, { useEffect, useState } from 'react';
import generarPDF from "../pdfs/reporte_GFPI-F-023";
import axios from 'axios';
import {
  Box, Typography, Grid, TextField, Divider, FormControlLabel,
  Radio, RadioGroup, FormLabel, FormControl, Button
} from '@mui/material';
import { useParams } from 'react-router-dom';

const ReporteGFPI = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const [formularioGFPI, setFormularioGFPI] = useState({
    regional: '',
    centroFormacion: '',
    actividades: '',
    evidencias: '',
    recoleccion: '',
  });

const API_URL = process.env.REACT_APP_BACKEND_API_URL;


  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/reportes/aprendiz/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchReporte();
  }, [id]);

  if (!data) return <Typography>Cargando reporte...</Typography>;

  const renderValoracion = (label) => (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}><Typography>{label}</Typography></Grid>
      <Grid item xs={8}>
        <RadioGroup row>
          <FormControlLabel value="Satisfactorio" control={<Radio />} label="Satisfactorio" />
          <FormControlLabel value="Por mejorar" control={<Radio />} label="Por mejorar" />
        </RadioGroup>
      </Grid>
    </Grid>
  );

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
      <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center">FORMATO PLANEACIÓN, SEGUIMIENTO Y EVALUACIÓN ETAPA PRODUCTIVA</Typography>

        {/* 1. INFORMACIÓN GENERAL */}
        <Box mt={3}>
          <Typography variant="subtitle1">1. INFORMACIÓN GENERAL</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField label="Regional" fullWidth value={formularioGFPI.regional} onChange={(e) => setFormularioGFPI({ ...formularioGFPI, regional: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Centro de Formación" fullWidth value={formularioGFPI.centroFormacion} onChange={(e) => setFormularioGFPI({ ...formularioGFPI, centroFormacion: e.target.value })} />
            </Grid>
            <Grid item xs={6}><TextField label="Programa de Formación" fullWidth value={data.fichasAprendiz[0]?.ficha?.nombre_programa || ''} /></Grid>
            <Grid item xs={6}><TextField label="Número de Ficha" fullWidth value={data.fichasAprendiz[0]?.ficha?.numero_ficha || ''} /></Grid>
          </Grid>

          <Typography variant="body1" mt={3}><strong>Datos del Aprendiz</strong></Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Nombre" fullWidth value={data.nombre} /></Grid>
            <Grid item xs={6}><TextField label="Identificación" fullWidth value={data.numero_documento} /></Grid>
            <Grid item xs={6}><TextField label="Teléfono" fullWidth value={data.telefono} /></Grid>
            <Grid item xs={6}><TextField label="Email" fullWidth value={data.correo_electronico} /></Grid>
            <Grid item xs={12}><TextField label="Alternativa registrada en SOFIA Plus" fullWidth /></Grid>
          </Grid>

          <Typography variant="body1" mt={3}><strong>Ente Conformador</strong></Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Razón social Empresa" fullWidth value={data.detalle_aprendiz?.empresa?.razon_social} /></Grid>
            <Grid item xs={6}><TextField label="Nit" fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Dirección" fullWidth value={data.detalle_aprendiz?.empresa?.direccion} /></Grid>
            <Grid item xs={6}><TextField label="Nombre del Jefe Inmediato" fullWidth value={data.detalle_aprendiz?.jefe_inmediato} /></Grid>
            <Grid item xs={6}><TextField label="Cargo" fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Teléfono Jefe" fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Email Jefe" fullWidth /></Grid>
          </Grid>
        </Box>

        {/* 2. PLANEACIÓN */}
        <Box mt={4}>
          <Typography variant="subtitle1">2. PLANEACIÓN ETAPA PRODUCTIVA</Typography>
          <TextField label="Actividades a desarrollar" fullWidth multiline rows={4} sx={{ my: 2 }} value={formularioGFPI.actividades} onChange={(e) => setFormularioGFPI({ ...formularioGFPI, actividades: e.target.value })} />
          <TextField label="Evidencias de aprendizaje" fullWidth multiline rows={2} sx={{ mb: 2 }} value={formularioGFPI.evidencias} onChange={(e) => setFormularioGFPI({ ...formularioGFPI, evidencias: e.target.value })} />
          <TextField label="Recolección de evidencias (Fecha y lugar)" fullWidth sx={{ mb: 2 }} value={formularioGFPI.recoleccion} onChange={(e) => setFormularioGFPI({ ...formularioGFPI, recoleccion: e.target.value })} />
          <TextField label="Observaciones" fullWidth multiline rows={3} />
        </Box>

        {/* 3. SEGUIMIENTO */}
        <Box mt={4}>
          <Typography variant="subtitle1">3. SEGUIMIENTO ETAPA PRODUCTIVA</Typography>
          <TextField label="Periodo evaluado (Inicio)" fullWidth sx={{ my: 2 }} />
          <TextField label="Periodo evaluado (Final)" fullWidth sx={{ mb: 2 }} />

          <Typography variant="body2" fontWeight="bold" mt={2}>FACTORES ACTITUDINALES Y COMPORTAMENTALES</Typography>
          {['Relaciones interpersonales', 'Trabajo en equipo', 'Solución de problemas', 'Cumplimiento', 'Organización'].map(label => renderValoracion(label))}

          <Typography variant="body2" fontWeight="bold" mt={2}>FACTORES TÉCNICOS</Typography>
          {['Transferencia de conocimiento', 'Mejora continua', 'Fortalecimiento ocupacional', 'Oportunidad y calidad', 'Responsabilidad ambiental', 'Administración de recursos', 'Seguridad ocupacional e industrial', 'Documentación etapa productiva'].map(label => renderValoracion(label))}

          <TextField label="Observaciones del ente Conformador" fullWidth multiline rows={3} sx={{ mt: 2 }} />
          <TextField label="Observaciones del Aprendiz" fullWidth multiline rows={3} sx={{ mt: 2 }} />
        </Box>

        {/* 4. EVALUACIÓN */}
        <Box mt={4}>
          <Typography variant="subtitle1">4. EVALUACIÓN ETAPA PRODUCTIVA</Typography>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Juicio de Evaluación</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="Aprobado" control={<Radio />} label="Aprobado" />
              <FormControlLabel value="No aprobado" control={<Radio />} label="No aprobado" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Reconocimientos especiales</FormLabel>
            <RadioGroup row>
              <FormControlLabel value="Si" control={<Radio />} label="Si" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <TextField label="Especificar cuáles" fullWidth sx={{ mt: 2 }} />
        </Box>

        <Box display="flex" justifyContent="center" mt={4}>
        <Button
  variant="contained"
  sx={{ backgroundColor: '#71277a', borderRadius: '20px' }}
  onClick={() => generarPDF(data, formularioGFPI)}
>
  Guardar PDF
</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReporteGFPI;
