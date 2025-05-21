import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListaInstructores = () => {
  const [instructores, setInstructores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarInstructores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/usuarios/instructores", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInstructores(response.data);
      } catch (error) {
        console.error("Error al obtener instructores:", error);
      }
    };
    cargarInstructores();
  }, []);

  const handleVerAgenda = (idInstructor) => {
    navigate(`/agendamientos/instructor/${idInstructor}`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Instructores
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
            <TableRow>
              <TableCell><strong>Nombre Instructor</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructores.map((instructor) => (
              <TableRow key={instructor.id_usuario}>
                <TableCell>{`${instructor.nombre} ${instructor.apellido}`}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleVerAgenda(instructor.id_usuario)}
                    sx={{ backgroundColor: "#6a1b9a", color: "white", "&:hover": { backgroundColor: "#4a0072" } }}
                  >
                    Ver agenda
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaInstructores;
