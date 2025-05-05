import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import generarReporteAprendizPDF from '../pdfs/reporteAprendiz';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';

const ReportAprendiz = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/reportes/aprendiz/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
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
          width: '6px'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ccc',
          borderRadius: '10px'
        }
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" textAlign="center" mb={4} fontWeight="bold">
          Reporte De Aprendiz
        </Typography>

        {/* Información de ficha */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Información de ficha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.fichasAprendiz?.map((ficha) => (
                <React.Fragment key={ficha.id_ficha_aprendiz}>
                  <TableRow>
                    <TableCell>Nombre del programa:</TableCell>
                    <TableCell>{ficha.ficha?.nombre_programa}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nivel del programa:</TableCell>
                    <TableCell>Tecnólogo</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fecha inicio etapa práctica:</TableCell>
                    <TableCell>{ficha.ficha?.inicio_etapa_productiva}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fecha fin etapa práctica:</TableCell>
                    <TableCell>{ficha.ficha?.fin_etapa_productiva}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Número de ficha:</TableCell>
                    <TableCell>{ficha.ficha?.numero_ficha}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Información del aprendiz */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Información del aprendiz</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>Nombre:</TableCell><TableCell>{data.nombre}</TableCell></TableRow>
              <TableRow><TableCell>Apellido:</TableCell><TableCell>{data.apellido}</TableCell></TableRow>
              <TableRow><TableCell>Tipo de documento:</TableCell><TableCell>{data.tipo_documento}</TableCell></TableRow>
              <TableRow><TableCell>Número documento:</TableCell><TableCell>{data.numero_documento}</TableCell></TableRow>
              <TableRow><TableCell>Teléfono:</TableCell><TableCell>{data.telefono}</TableCell></TableRow>
              <TableRow><TableCell>Correo:</TableCell><TableCell>{data.correo_electronico}</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Información de la empresa */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Información de la empresa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow><TableCell>Empresa:</TableCell><TableCell>{data.detalle_aprendiz?.empresa?.razon_social}</TableCell></TableRow>
              <TableRow><TableCell>Dirección:</TableCell><TableCell>{data.detalle_aprendiz?.empresa?.direccion || 'No registrada'}</TableCell></TableRow>
              <TableRow><TableCell>Correo empresa:</TableCell><TableCell>{data.detalle_aprendiz?.empresa?.correo_electronico}</TableCell></TableRow>
              <TableRow><TableCell>Teléfono empresa:</TableCell><TableCell>{data.detalle_aprendiz?.empresa?.telefono}</TableCell></TableRow>
              <TableRow><TableCell>Nombre del jefe:</TableCell><TableCell>{data.detalle_aprendiz?.jefe_inmediato}</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Documentos */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Documentos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.fichasAprendiz?.flatMap(f =>
                f.documentos?.map(doc => (
                  <TableRow key={doc.id_documento}>
                    <TableCell>📎 {doc.nombre_documento}</TableCell>
                    <TableCell>{doc.descripcion}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bitácoras */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Bitácoras</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.fichasAprendiz?.flatMap(f =>
                f.bitacoras?.map(bit => (
                  <TableRow key={bit.id_bitacora}>
                    <TableCell>🗒️ Bitácora #{bit.numero_bitacora}</TableCell>
                    <TableCell>Estado: {bit.estado_bitacora}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Agendamientos */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Agendamientos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.fichasAprendiz?.flatMap(f =>
                f.agendamientos?.map(ag => (
                  <TableRow key={ag.id_agendamiento}>
                    <TableCell>📅 Visita #{ag.numero_visita}</TableCell>
                    <TableCell>Fecha: {new Date(ag.fecha_inicio).toLocaleDateString()} - Estado: {ag.estado_visita}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box textAlign="center">
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
            onClick={() => generarReporteAprendizPDF(data)}
          >
            Generar reporte del aprendiz
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportAprendiz;
