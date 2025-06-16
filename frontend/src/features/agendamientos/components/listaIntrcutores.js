import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  useMediaQuery,
  MenuItem,
} from '@mui/material';
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarMonth as CalendarMonthIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListaInstructores = () => {
  const [instructores, setInstructores] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [letraFiltro, setLetraFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const API_URL = process.env.REACT_APP_BACKEND_API_URL;


  const navigate = useNavigate();
 
const isSmallScreen = useMediaQuery('(max-width: 767px)');
const isMediumScreen = useMediaQuery('(min-width: 768px) and (max-width: 1279px)');
const isLargeScreen = useMediaQuery('(min-width: 1280px)');

const [rowsPerPage, setRowsPerPage] = useState(16);



  useEffect(() => {
    const cargarInstructores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/usuarios/instructores`, {
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


useEffect(() => {
  const handleResize = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1280) {
      setRowsPerPage(8);   // 2 filas de 4
    } else if (screenWidth >= 768) {
      setRowsPerPage(6);   // 2 filas de 3
    } else {
      setRowsPerPage(4);   // 2 filas de 2
    }
  };

  handleResize(); // Ejecuta al montar

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  
  // Filtrado por búsqueda y letra
  const instructoresFiltrados = instructores.filter((instructor) => {
    const nombreCompleto = `${instructor.nombre} ${instructor.apellido}`.toLowerCase();
    const coincideBusqueda = nombreCompleto.includes(searchText.toLowerCase());
    const coincideLetra = letraFiltro ? instructor.nombre.toLowerCase().startsWith(letraFiltro.toLowerCase()) : true;
    return coincideBusqueda && coincideLetra;
  });

  const totalPages = Math.ceil(instructoresFiltrados.length / rowsPerPage);

  const handleChangePage = (_, newPage) => {
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={i === currentPage ? "contained" : "outlined"}
          size="small"
          sx={{
            minWidth: 32,
            px: 1,
            color: i === currentPage ? 'white' : '#71277a',
            backgroundColor: i === currentPage ? '#71277a' : 'transparent',
            borderColor: '#71277a',
            '&:hover': {
              backgroundColor: '#71277a22',
            }
          }}
        >
          {i + 1}
        </Button>
      );
    }
    return pages;
  };

  const paginatedInstructores = instructoresFiltrados.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ p: 4, backgroundColor: "white", minHeight: '100vh' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: '#4a0072', textAlign: 'center' }}>
          Lista de Instructores
        </Typography>

        {/* Búsqueda y filtro */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
          placeholder="Buscar por nombre o apellido"
          variant="outlined"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#71277a' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 300,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#71277a', // cambia el borde a morado
              },
            },
            '& label.Mui-focused': {
              color: '#71277a', // cambia el label a morado
            },
          }}
        />

        
        </Box>

        {/* Lista de instructores */}
        <Grid container spacing={3}>
          {paginatedInstructores.map((instructor) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={instructor.id_usuario}>
              <Paper elevation={4} sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 3,
                textAlign: 'center',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                }
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {instructor.nombre} {instructor.apellido}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => handleVerAgenda(instructor.id_usuario)}
                  sx={{
                    backgroundColor: "#6a1b9a",
                    color: "white",
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "#4a0072",
                    },
                  }}
                >
                  Ver agenda
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Paginación */}
        <Box
          sx={{
           mt: { xs: 2, sm: 3 },       // menos margen en pantallas pequeñas
          py: { xs: 1, sm: 2 },       // menos padding vertical
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "white",
          borderRadius: 2,
          flexWrap: 'wrap',
          width: '100%',              // ajusta al ancho del contenedor
          maxWidth: '900px',          // opcional: evita que se estire demasiado
          margin: '0 auto'  
          }}
        >
          <IconButton
            onClick={() => handleChangePage(null, 0)}
            disabled={currentPage === 0}
            sx={{ color: "#71277a" }}
          >
            <FirstPage />
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(null, currentPage - 1)}
            disabled={currentPage === 0}
            sx={{ color: "#71277a" }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          {renderPageNumbers()}

          <IconButton
            onClick={() => handleChangePage(null, currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            sx={{ color: "#71277a" }}
          >
            <KeyboardArrowRight />
          </IconButton>
          <IconButton
            onClick={() => handleChangePage(null, totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            sx={{ color: "#71277a" }}
          >
            <LastPage />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default ListaInstructores;
