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
  const [rowsPerPage, setRowsPerPage] = useState(16);

    const API_URL = process.env.REACT_APP_BACKEND_API_URL;
  const navigate = useNavigate();
  
  // Solo detectamos mobile
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  // Lógica original para desktop, ajustada solo para mobile
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth <= 768) {
        // Solo para mobile: 2 filas de 2 = 4 items
        setRowsPerPage(4);
      } else {
        // Lógica original para desktop
        if (screenWidth >= 1920) {
          setRowsPerPage(16);
        } else if (screenWidth >= 1600) {
          setRowsPerPage(16);
        } else if (screenWidth >= 1280) {
          setRowsPerPage(8);
        } else {
          setRowsPerPage(6);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtrado original
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
    const maxPages = isMobile ? 3 : totalPages; // Limitar páginas visibles en mobile
    
    let startPage = 0;
    let endPage = totalPages - 1;
    
    if (isMobile && totalPages > 3) {
      startPage = Math.max(0, currentPage - 1);
      endPage = Math.min(totalPages - 1, startPage + 2);
      if (endPage - startPage < 2) {
        startPage = Math.max(0, endPage - 2);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={i === currentPage ? "contained" : "outlined"}
          size={isMobile ? "small" : "small"}
          sx={{
            minWidth: isMobile ? 28 : 32,
            px: isMobile ? 0.5 : 1,
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
      <Box sx={{ 
        p: isMobile ? 2 : 4, 
        backgroundColor: "white", 
        minHeight: '100vh' 
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: 2, 
            color: '#4a0072', 
            textAlign: 'center',
            ...(isMobile && {
              fontSize: '1.75rem',
              mb: 3
            })
          }}
        >
          Lista de Instructores
        </Typography>

        {/* Búsqueda - mantenemos diseño original, solo ajustes mobile */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            justifyContent: 'center',
            alignItems: 'center',
            ...(isMobile && {
              flexDirection: 'column',
              mb: 3,
              px: 1
            })
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
              width: isMobile ? '100%' : 300,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#71277a',
                },
              },
              '& label.Mui-focused': {
                color: '#71277a',
              },
            }}
          />
        </Box>

        {/* Grid - mantenemos original para desktop */}
        <Grid container spacing={3}>
          {paginatedInstructores.map((instructor) => (
            <Grid 
              item 
              xs={isMobile ? 6 : 12} 
              sm={isMobile ? 6 : 6} 
              md={4} 
              lg={3} 
              key={instructor.id_usuario}
            >
              <Paper elevation={4} sx={{
                p: isMobile ? 2 : 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: 3,
                textAlign: 'center',
                transition: '0.3s',
                height: isMobile ? 160 : 'auto', // Altura fija para mobile
                justifyContent: 'space-between',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-4px)',
                }
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: isMobile ? '0.85rem' : 'clamp(0.75rem, 1.2vw, 1.15rem)',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2, // Mismo que desktop
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.4em', // Mismo que desktop
                    mb: isMobile ? 2 : 0,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {`${instructor.nombre} ${instructor.apellido}`}
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => handleVerAgenda(instructor.id_usuario)}
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: "#6a1b9a",
                    color: "white",
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: 2,
                    width: isMobile ? '100%' : 'auto',
                    fontSize: isMobile ? '0.75rem' : 'inherit',
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

        {/* Paginación - diseño original con mejoras mobile */}
        <Box
          sx={{
            mt: { xs: 4, sm: 2 },
            py: 1,
            px: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 1,
            columnGap: { xs: 1, sm: 2 },
            width: '100%',
            maxWidth: '100%',
            mx: 'auto',
            backgroundColor: 'white',
            zIndex: 1,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => handleChangePage(null, 0)}
            disabled={currentPage === 0}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: "#71277a",
              display: isMobile && currentPage <= 1 ? 'none' : 'inline-flex'
            }}
          >
            <FirstPage />
          </IconButton>
          
          <IconButton
            onClick={() => handleChangePage(null, currentPage - 1)}
            disabled={currentPage === 0}
            size={isMobile ? "small" : "medium"}
            sx={{ color: "#71277a" }}
          >
            <KeyboardArrowLeft />
          </IconButton>

          {renderPageNumbers()}

          <IconButton
            onClick={() => handleChangePage(null, currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            size={isMobile ? "small" : "medium"}
            sx={{ color: "#71277a" }}
          >
            <KeyboardArrowRight />
          </IconButton>
          
          <IconButton
            onClick={() => handleChangePage(null, totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: "#71277a",
              display: isMobile && currentPage >= totalPages - 2 ? 'none' : 'inline-flex'
            }}
          >
            <LastPage />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default ListaInstructores;
