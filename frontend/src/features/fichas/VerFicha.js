import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserInfoModal from '../../components/ui/UserInfoModal';
import ConfirmDialog from '../../components/ui/ModalConfirmacion';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import usersAPI from '../../api/UsersAPI';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { generarReporteFicha } from '../Reportes/pdfs/reporteFicha';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {BorderColorOutlined, ContentCutOutlined, Add, Close} from '@mui/icons-material';
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
  Stack,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Chip
} from '@mui/material';

const FichaDetalle = () => {
  const { id } = useParams();
  const [fichas, setFicha] = useState(null);
  const [aprendices, setAprendices] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [aprendizAEliminar, setAprendizAEliminar] = useState(null);
  
  // Estados para el formulario de registro de aprendiz
  const [openRegistroModal, setOpenRegistroModal] = useState(false);
  const [nuevoAprendiz, setNuevoAprendiz] = useState({
    nombre: '',
    apellido: '',
    tipo_documento: 'CC',
    numero_documento: '',
    correo_electronico: '',
    telefono: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const handleVerUsuario = async (usuario) => {
    try {
        const token = localStorage.getItem('token'); // o desde useAuth si manejas contexto
        const usuarioCompleto = await usersAPI.getUserById(usuario.id_usuario, token);
        setSelectedUser(usuarioCompleto);
        setOpenUserModal(true);
    } catch (error) {
        console.error('Error al obtener usuario completo:', error);
    }
};

  const navigate = useNavigate();

  const handleConfirmarEliminar = (aprendiz) => {
    setAprendizAEliminar(aprendiz);
    setOpenConfirm(true);
  };

  const eliminarAprendiz = async () => {
  try {
    await axios.delete(`${API_URL}/fichasAprendiz/eliminar_aprendiz/${id}/${aprendizAEliminar.id_usuario}`);

    setAprendices(aprendices.filter(a => a.id_usuario !== aprendizAEliminar.id_usuario));
    setOpenConfirm(false);
    setAprendizAEliminar(null);
  } catch (error) {
    console.error('❌ Error al eliminar el aprendiz:', error);
  }
};

  // Funciones para el formulario de registro
  const handleOpenRegistroModal = () => {
    setOpenRegistroModal(true);
  };

  const handleCloseRegistroModal = () => {
    setOpenRegistroModal(false);
    // Resetear el formulario
    setNuevoAprendiz({
      nombre: '',
      apellido: '',
      tipo_documento: 'CC',
      numero_documento: '',
      correo_electronico: '',
      telefono: ''
    });
     setPassword('');
  };

  const formatearTextoNombre = (texto) => {
  return texto
    .toLowerCase()
    .replace(/\b\w/g, (letra) => letra.toUpperCase())  // primera letra de cada palabra en mayúscula
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, ''); // quitar caracteres especiales y números
};


const handleInputChange = (e) => {
  const { name, value } = e.target;

  const camposConFormato = ['nombre', 'apellido'];
  const nuevoValor = camposConFormato.includes(name)
    ? formatearTextoNombre(value)
    : value;

  setNuevoAprendiz((prev) => ({
    ...prev,
    [name]: nuevoValor,
  }));
};

const esContrasenaSegura = (password) => {
  const longitudValida = password.length >= 8 && password.length <= 15;
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneCaracterEspecial = /[\W_]/.test(password);
  const numeros = password.match(/\d/g); // encuentra todos los dígitos
  const tieneMinimoDosNumeros = numeros && numeros.length >= 2;

  return (
    longitudValida &&
    tieneMayuscula &&
    tieneMinuscula &&
    tieneCaracterEspecial &&
    tieneMinimoDosNumeros
  );
};


const handleRegistrarAprendiz = async (e) => {
  e.preventDefault();
  try {
    setIsLoading(true);

    // Validar longitud del documento
   if (nuevoAprendiz.numero_documento.length > 11 || nuevoAprendiz.numero_documento.length < 5) {
 
      Swal.fire({
        icon: 'warning',
        title: 'Número de documento inválido',
        text: 'El número de documento no puede exceder los 11 dígitos.',
        confirmButtonColor: '#71277a'
      });
      setIsLoading(false);
      return;
    }

    // Validar seguridad de la contraseña
    if (!esContrasenaSegura(password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña insegura',
        text: 'La contraseña debe tener entre 8 y 15 caracteres, incluir una mayúscula, una minúscula, al menos 2 números y un carácter especial.',
        confirmButtonColor: '#71277a'
      });
      setIsLoading(false);
      return;
    }

    // Registrar el aprendiz
    const response = await axios.post(`${API_URL}/usuarios/registroAprendiz`, {
      ...nuevoAprendiz,
      password: password || nuevoAprendiz.numero_documento,
      rol: 'aprendiz',
      numero_ficha: fichas.numero_ficha 
    });

    if (response.data && response.data.aprendiz) {
      const aprendizRegistrado = response.data.aprendiz;

      setAprendices([...aprendices, aprendizRegistrado]);

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: `Aprendiz registrado exitosamente`,
        confirmButtonColor: '#71277a'
      });

      handleCloseRegistroModal();
    }
  } catch (error) {
    console.error('❌ Error al registrar el aprendiz:', error);
    console.error('Detalles del error:', error.response?.data || error.message);

    Swal.fire({
      icon: 'error',
      title: 'Error al registrar',
      text: error.response?.data?.mensaje || error.message,
      confirmButtonColor: '#71277a',
      didOpen: () => {
        const swalContainer = document.querySelector('.swal2-container');
        if (swalContainer) swalContainer.style.zIndex = '14000';
      }
    });
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    const obtenerFicha = async () => {
      try {
        const response = await axios.get(`${API_URL}/fichas/ver/${id}`);
        setFicha(response.data.ficha);
        setAprendices(response.data.aprendices);
      } catch (error) {
        console.error('Error al obtener la ficha:', error);
      }
    };

    obtenerFicha();
  }, [id]);

  if (!fichas) {
    return <Typography sx={{ mt: 4 }}>Cargando...</Typography>;
  }

  return (
     <Box sx={{ 
    position: 'relative', 
  height: { xs: 'auto', md: '100vh' }, // Auto en móvil, fijo en laptop
  minHeight: { xs: '100vh', md: 'auto' }, // minHeight en móvil, auto en laptop
  display: 'flex',
  flexDirection: 'column',
  overflow: { xs: 'visible', md: 'hidden' } 
    }}>
      {/* Header con navegación y acciones - Responsivo */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
        gap: { xs: 2, sm: 0 }
      }}>
        {/* Lado izquierdo: Botón de volver */}
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: '#71277a',
            textTransform: 'none',
            fontWeight: 'medium',
            alignSelf: { xs: 'flex-start', sm: 'center' },
            minWidth: 'auto',
            '&:hover': {
              backgroundColor: 'rgba(113, 39, 122, 0.08)',
            },
          }}
        >
          Volver
        </Button>

        {/* Centro: Título */}
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          color: '#71277a',
          textAlign: { xs: 'left', sm: 'center' },
          flex: { xs: 'none', sm: 1 },
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Detalle de Ficha
        </Typography>

        {/* Lado derecho: Botón de generar reporte */}
        <Button
          onClick={() => generarReporteFicha(fichas, aprendices)}
          startIcon={<DescriptionIcon />}
          variant="contained"
          sx={{
            backgroundColor: '#71277a',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 'medium',
            padding: '8px 16px',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            '&:hover': {
              backgroundColor: '#5e1b65',
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Generar Reporte
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
            Reporte
          </Box>
        </Button>
      </Box>

      {/* Contenido principal con scroll */}
      <Box sx={{
         flexGrow: 1,
  padding: { xs: '15px', sm: '20px' },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // Scroll solo en laptop/desktop
  overflowY: { xs: 'visible', md: 'auto' },
  overflowX: 'hidden',
  paddingBottom: { xs: '12px', sm: '100px' },
  // Altura fija solo en laptop
  height: { 
    xs: 'auto', // Auto en móvil - scroll natural
    md: 'calc(100vh - 80px)' // Fijo en laptop - scroll interno
  },
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#71277a',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#5e1b65',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#71277a #f1f1f1',
      }}>
        {/* Información de la ficha - Responsiva */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900, 
          mb: 4,
          borderRadius: '10px',
        }}>
          {/* Vista de escritorio */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <TableContainer 
              component={Paper} 
  elevation={3}
  sx={{
    maxHeight: { 
      xs: 300, 
      sm: 350, 
      md: 500,  // Más altura en laptop para aprovechar el scroll interno
      lg: 600 
    },
    overflowY: 'auto',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f1f1f1',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#71277a',
      borderRadius: '3px',
      '&:hover': {
        backgroundColor: '#5e1b65',
      },
    },
    scrollbarWidth: 'thin',
    scrollbarColor: '#71277a #f1f1f1',
  }}
            >
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><Typography fontWeight="bold">Nombre del programa</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">N° Ficha</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Nivel</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{fichas.nombre_programa}</TableCell>
                    <TableCell>
                      <Chip 
                        label={fichas.numero_ficha} 
                        sx={{ 
                          backgroundColor: '#71277a', 
                          color: 'white',
                          fontWeight: 'bold'
                        }} 
                      />
                    </TableCell>
                    <TableCell>{fichas.nivel || 'Tecnólogo'}</TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                    <TableCell><Typography fontWeight="bold">Fecha inicio</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Fecha fin</Typography></TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>{fichas.fecha_inicio || '01/06/2025'}</TableCell>
                    <TableCell>{fichas.fecha_fin || '31/12/2025'}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Vista móvil - Card */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '10px' }}>
              {/* Título del programa */}
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                color: '#71277a',
                mb: 2,
                fontSize: '1.1rem'
              }}>
                {fichas.nombre_programa}
              </Typography>
              
              {/* Información principal */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#666' }}>
                    N° Ficha:
                  </Typography>
                  <Chip 
                    label={fichas.numero_ficha} 
                    sx={{ 
                      backgroundColor: '#71277a', 
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.875rem'
                    }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#666' }}>
                    Nivel:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {fichas.nivel || 'Tecnólogo'}
                  </Typography>
                </Box>
              </Box>
              
              {/* Fechas */}
              <Box sx={{ 
                backgroundColor: '#f9f9f9', 
                p: 2, 
                borderRadius: '8px',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 'bold', 
                  color: '#71277a',
                  mb: 1
                }}>
                  Fechas del programa
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#666' }}>
                    Inicio:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {fichas.fecha_inicio || '01/06/2025'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#666' }}>
                    Fin:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {fichas.fecha_fin || '31/12/2025'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Título de la sección de aprendices */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900, 
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: '#71277a',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Lista de Aprendices ({aprendices.length})
          </Typography>
        </Box>

        {/* Tabla de aprendices - Responsiva */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 900,
          borderRadius: '10px',
        }}>
          {aprendices.length > 0 ? (
            <>
              {/* Vista de escritorio - Tabla normal */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <TableContainer 
                  component={Paper} 
                  elevation={3}
                  sx={{
                    maxHeight: 400,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#71277a',
                      borderRadius: '3px',
                      '&:hover': {
                        backgroundColor: '#5e1b65',
                      },
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#71277a #f1f1f1',
                  }}
                >
                  <Table sx={{ minWidth: 600 }} stickyHeader>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell align="center" sx={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
                          <Typography fontWeight="bold">Nombre</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
                          <Typography fontWeight="bold">Apellido</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
                          <Typography fontWeight="bold">N° Documento</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ position: 'sticky', top: 0, backgroundColor: '#f5f5f5', zIndex: 1 }}>
                          <Typography fontWeight="bold">Acciones</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {aprendices.map((aprendiz, index) => (
                        <TableRow 
                          key={aprendiz.id_usuario}
                          sx={{ 
                            backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                            '&:hover': {
                              backgroundColor: '#f0f0f0'
                            }
                          }}
                        >
                          <TableCell align="center">{aprendiz.nombre}</TableCell>
                          <TableCell align="center">{aprendiz.apellido}</TableCell>
                          <TableCell align="center">{aprendiz.numero_documento}</TableCell>
                          <TableCell align="center">
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                              <Button 
                                onClick={() => handleVerUsuario(aprendiz)} 
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: "#71277a", 
                                  color: "#71277a", 
                                  fontSize: "10px", 
                                  borderRadius: "6px",
                                  textTransform: 'none',
                                  '&:hover': {
                                    borderColor: '#5e1b65',
                                    color: '#5e1b65'
                                  }
                                }}
                              >
                                Ver usuario
                              </Button>
                              <Button 
                                onClick={() => navigate(`/seguimiento/${aprendiz.id_usuario}`)} 
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  borderColor: "#71277a", 
                                  color: "#71277a", 
                                  fontSize: "10px", 
                                  borderRadius: "6px",
                                  textTransform: 'none',
                                  '&:hover': {
                                    borderColor: '#5e1b65',
                                    color: '#5e1b65'
                                  }
                                }}
                              >
                                Seguimiento
                              </Button>
                              <IconButton 
                                onClick={() => handleConfirmarEliminar(aprendiz)} 
                                size="small"
                                sx={{ 
                                  backgroundColor: "#d32f2f", 
                                  color: "white", 
                                  '&:hover': {
                                    backgroundColor: '#b71c1c'
                                  }
                                }}
                              >
                                <ContentCutIcon fontSize="small" />
                              </IconButton>
                              <IconButton  
                                onClick={() => navigate(`/reporte/aprendiz/${aprendiz.id_usuario}`)} 
                                size="small"
                                sx={{  
                                  backgroundColor: '#71277a',  
                                  color: 'white', 
                                  '&:hover': {
                                    backgroundColor: '#5e1b65'
                                  } 
                                }}
                              >
                                <InfoOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Vista móvil - Cards responsivas */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{
                  maxHeight: 400,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#71277a',
                    borderRadius: '3px',
                    '&:hover': {
                      backgroundColor: '#5e1b65',
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#71277a #f1f1f1',
                }}>
                  <Stack spacing={2}>
                    {aprendices.map((aprendiz, index) => (
                      <Paper 
                        key={aprendiz.id_usuario}
                        elevation={2}
                        sx={{
                          p: 2,
                          backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                      >
                        {/* Información del aprendiz */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 'bold', 
                            color: '#71277a',
                            fontSize: '1.1rem',
                            mb: 1
                          }}>
                            {aprendiz.nombre} {aprendiz.apellido}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 'medium',
                              color: '#666',
                              minWidth: '120px'
                            }}>
                              N° Documento:
                            </Typography>
                            <Chip 
                              label={aprendiz.numero_documento}
                              size="small"
                              sx={{ 
                                backgroundColor: '#71277a',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Acciones en móvil */}
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          gap: 1
                        }}>
                          {/* Primera fila de botones */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                              onClick={() => handleVerUsuario(aprendiz)} 
                              size="small"
                              variant="outlined"
                              fullWidth
                              sx={{ 
                                borderColor: "#71277a", 
                                color: "#71277a", 
                                fontSize: "12px", 
                                borderRadius: "6px",
                                textTransform: 'none',
                                py: 1,
                                '&:hover': {
                                  borderColor: '#5e1b65',
                                  color: '#5e1b65'
                                }
                              }}
                            >
                              Ver usuario
                            </Button>
                            <Button 
                              onClick={() => navigate(`/seguimiento/${aprendiz.id_usuario}`)} 
                              size="small"
                              variant="outlined"
                              fullWidth
                              sx={{ 
                                borderColor: "#71277a", 
                                color: "#71277a", 
                                fontSize: "12px", 
                                borderRadius: "6px",
                                textTransform: 'none',
                                py: 1,
                                '&:hover': {
                                  borderColor: '#5e1b65',
                                  color: '#5e1b65'
                                }
                              }}
                            >
                              Seguimiento
                            </Button>
                          </Box>
                          
                          {/* Segunda fila de botones */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              onClick={() => navigate(`/reporte/aprendiz/${aprendiz.id_usuario}`)}
                              size="small"
                              variant="contained"
                              fullWidth
                              sx={{
                                backgroundColor: '#71277a',
                                color: 'white',
                                fontSize: "12px",
                                borderRadius: "6px",
                                textTransform: 'none',
                                py: 1,
                                '&:hover': {
                                  backgroundColor: '#5e1b65'
                                }
                              }}
                            >
                              <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                              Reporte
                            </Button>
                            <Button
                              onClick={() => handleConfirmarEliminar(aprendiz)}
                              size="small"
                              variant="contained"
                              fullWidth
                              sx={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                fontSize: "12px",
                                borderRadius: "6px",
                                textTransform: 'none',
                                py: 1,
                                '&:hover': {
                                  backgroundColor: '#b71c1c'
                                }
                              }}
                            >
                              <ContentCutIcon fontSize="small" sx={{ mr: 1 }} />
                              Eliminar
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No hay aprendices registrados en esta ficha
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Utiliza el botón "+" para agregar un nuevo aprendiz
              </Typography>
            </Paper>
          )}
        </Box>
        {/* Modal Info Usuario */}
        <UserInfoModal
         open={openUserModal}
         onClose={() => setOpenUserModal(false)}
         user={selectedUser}
         onGenerarGFPI={() => console.log("Generar reporte GFPI de", selectedUser)}
         mostrarBotonGFPI={true}
        />

        {/* Modal Confirmación */}
        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={eliminarAprendiz}
          title="¿Eliminar aprendiz?"
          message={`¿Estás seguro que deseas eliminar a ${aprendizAEliminar?.nombre} de esta ficha?`}
        />

        {/* Modal para registrar nuevo aprendiz */}
        <Modal
          open={openRegistroModal}
          onClose={handleCloseRegistroModal}
          aria-labelledby="modal-registro-aprendiz"
          aria-describedby="modal-para-registrar-nuevo-aprendiz"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: '90vh',
            overflowY: 'auto',
            // Scrollbar personalizada para el modal
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#71277a',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#5e1b65',
              },
            },
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="modal-registro-aprendiz" variant="h6" component="h2">Registrar Nuevo Aprendiz</Typography>
              <IconButton onClick={handleCloseRegistroModal}>
                <Close />
              </IconButton>
            </Box>
            
            <form onSubmit={handleRegistrarAprendiz} >
              
              <TextField
                fullWidth
                margin="normal"
                label="Nombre"
                name="nombre"
                value={nuevoAprendiz.nombre}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                margin="normal"
                label="Apellido"
                name="apellido"
                value={nuevoAprendiz.apellido}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                <Select
                  labelId="tipo-documento-label"
                  id="tipo-documento"
                  name="tipo_documento"
                  value={nuevoAprendiz.tipo_documento}
                  label="Tipo de Documento"
                  onChange={handleInputChange}
                >
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                  <MenuItem value="PAS">Pasaporte</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Número de Documento"
                name="numero_documento"
                value={nuevoAprendiz.numero_documento}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,11}$/.test(value)) { 
                    handleInputChange(e);
                  }
                }}
                inputProps={{
                  minLength: 5,
                  maxLength: 11,
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                required
                variant="outlined"
                size="small"
                helperText="Máximo 11 dígitos numéricos"
              />
              
              <TextField
                fullWidth
                margin="normal"
                label="Correo Electrónico"
                name="correo_electronico"
                type="email"
                value={nuevoAprendiz.correo_electronico}
                onChange={handleInputChange}
                required
                variant="outlined"
                size="small"
              />
              <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              variant="outlined"
              inputProps={{
                pattern: "(?=.*[0-9])(?=.*[A-Z]).{8,}",
                title: "Mínimo 8 caracteres, al menos un número, una mayúscula"
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
              <TextField
                fullWidth
                margin="normal"
                label="Teléfono"
                name="telefono"
                value={nuevoAprendiz.telefono}
                onChange={handleInputChange}
                variant="outlined"
                size="small"
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  onClick={handleCloseRegistroModal} 
                  variant="outlined"
                  sx={{ 
                    color: '#71277a',
                    borderColor: '#71277a',
                    '&:hover': { borderColor: '#5e1b65', color: '#5e1b65' }
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={isLoading}
                  sx={{ 
                    backgroundColor: '#71277a',
                    '&:hover': { backgroundColor: '#5e1b65' }
                  }}
                >
                  {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Botón flotante para agregar aprendiz */}
        <Button
          variant="contained"
          onClick={handleOpenRegistroModal}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#71277a",
            color: "white",
            "&:hover": { backgroundColor: "#5a1e61" },
            borderRadius: "50%",
            width: 56,
            height: 56,
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "auto",
            zIndex: 1000 // Asegura que esté por encima del contenido
          }}
        >
          <Add sx={{ fontSize: 30 }} />
        </Button>
      </Box>
    </Box>
  );
};

export default FichaDetalle;
