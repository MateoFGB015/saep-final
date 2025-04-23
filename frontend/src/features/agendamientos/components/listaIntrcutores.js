import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, Divider } from '@mui/material';
import axios from 'axios'; // Usamos axios directamente
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
        Lista de Instructores
      </Typography>
      <List>
        {instructores.map((instructor) => (
          <div key={instructor.id_usuario}>
            <ListItem
              secondaryAction={
                <Button
                  variant="contained"
                  onClick={() => handleVerAgenda(instructor.id_usuario)}
                  sx={{ backgroundColor: "#6a1b9a", "&:hover": { backgroundColor: "#4a0072" } }}
                >
                  Ver agenda
                </Button>
              }
            >
              {instructor.nombre} {instructor.apellido}
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );
};

export default ListaInstructores;
