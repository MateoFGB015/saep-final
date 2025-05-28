import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserInfoModal from '../../components/ui/UserInfoModal';
import ConfirmDialog from '../../components/ui/ModalConfirmacion';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  InputAdornment // ✅ Agregado aquí
} from '@mui/material';
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

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
    correo_electronico: '', // Nombre correcto del campo según la API
    telefono: ''
  });
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga

  const handleVerUsuario = (usuario) => {
    setSelectedUser(usuario);
    setOpenUserModal(true);
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAprendiz({
      ...nuevoAprendiz,
      [name]: value
    });
  };

  const handleRegistrarAprendiz = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // Validación adicional antes de enviar
      if (nuevoAprendiz.numero_documento.length > 9) {
        Swal.fire({
          icon: 'warning',
          title: 'Número de documento inválido',
          text: 'El número de documento no puede exceder los 9 dígitos.',
          confirmButtonColor: '#71277a'
        });
        setIsLoading(false);
        return;
      }
      
      
      // Paso 1: Registrar el aprendiz
      const response = await axios.post(`${API_URL}/usuarios/registroAprendiz`, {
        ...nuevoAprendiz,
        password: password || nuevoAprendiz.numero_documento, // Usar la contraseña ingresada o el número de documento como fallback
        rol: 'aprendiz',
        numero_ficha: fichas.numero_ficha 
      });
      
      if (response.data && response.data.aprendiz) {
        const aprendizRegistrado = response.data.aprendiz;
        
        // Actualizar la lista de aprendices en la UI
        setAprendices([...aprendices, aprendizRegistrado]);
        
        // Mostrar mensaje de éxito con las credenciales
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
        confirmButtonColor: '#71277a'
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
  <Button
  onClick={() => generarReporteFicha(fichas, aprendices)}
        variant="contained"
        sx={{
          backgroundColor: '#792382',  
          borderRadius: '20px',        
          textTransform: 'none',      
          fontWeight: 'bold',
          padding: '6px 16px',
          '&:hover': {
            backgroundColor: '#5e1b65', 
          },
        }}
      >
        Generar reporte de ficha
      </Button>
  {    <Box
      sx={{
        flexGrow: 1,
        padding: '20px',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        borderRadius: '30px',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {/* Información de la ficha */}
      <Box sx={{ width: '100%', maxWidth: 900, mb: 4, overflowX: 'auto',borderRadius: '10px', textAlign: 'center' }}>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                <TableCell><Typography fontWeight="bold">Nombre del programa</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">N° Ficha</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Nivel</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{fichas.nombre_programa}</TableCell>
                <TableCell>{fichas.numero_ficha}</TableCell>
                <TableCell>{fichas.nivel || 'Tecnólogo'}</TableCell>
              </TableRow>
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
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

      {/* Tabla de aprendices */}
      <Box sx={{ width: '100%', maxWidth: 900, overflowX: 'auto', borderRadius: '10px' }}>
        {aprendices.length > 0 ? (
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                  <TableCell><Typography fontWeight="bold">Nombre</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Apellido</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">N° Documento</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Acciones</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aprendices.map((aprendiz) => (
                  <TableRow key={aprendiz.id_usuario}>
                    <TableCell>{aprendiz.nombre}</TableCell>
                    <TableCell>{aprendiz.apellido}</TableCell>
                    <TableCell>{aprendiz.numero_documento}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button onClick={() => handleVerUsuario(aprendiz)} sx={{ border: "1px solid #71277a", color: "#71277a", fontSize: "10px", borderRadius: "5px" }}>
                          Ver usuario
                        </Button>
                        <Button 
                          onClick={() => navigate(`/seguimiento/${aprendiz.id_usuario}`)} 
                          sx={{ border: "1px solid #71277a", color: "#71277a", fontSize: "10px", borderRadius: "5px" }}
                        >
                          Hacer seguimiento
                        </Button>
                        <Button onClick={() => handleConfirmarEliminar(aprendiz)} sx={{ backgroundColor: "red", p: 1, fontSize: "30px", color: "white", borderRadius: "5px" }}>
                          <ContentCutIcon />
                        </Button>
                        <Button  onClick={() => navigate(`/reporte/aprendiz/${aprendiz.id_usuario}`)} sx={{  backgroundColor: '#71277a',  minWidth: '36px', height: '36px', borderRadius: '50%', padding: '6px', color: 'white', '&:hover': {backgroundColor: '#5e1b65'} 
                          }}>
                         <InfoOutlinedIcon fontSize="small" />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No hay aprendices registrados en esta ficha.</Typography>
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
          overflowY: 'auto'
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
    // Limitamos a máximo 9 dígitos para evitar error de rango en la base de datos
    if (/^\d{0,11}$/.test(value)) { 
      handleInputChange(e);
    }
  }}
  inputProps={{
    minLength: 5,
    maxLength: 11, // Cambiado de 10 a 11
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
          "&:hover": { backgroundColor: "#5a1e61" }, // Color más oscuro al pasar el mouse
          borderRadius: "50%", // Hace que el botón sea redondo
          width: 56,
          height: 56,
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "auto"
        }}
      >
        <Add sx={{ fontSize: 30 }} />
      </Button>

    </Box>}
</Box>
  );
};

export default FichaDetalle;