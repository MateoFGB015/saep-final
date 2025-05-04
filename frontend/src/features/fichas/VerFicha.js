import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserInfoModal from '../../components/ui/UserInfoModal';
import ConfirmDialog from '../../components/ui/ModalConfirmacion';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {BorderColorOutlined, ContentCutOutlined, Add} from '@mui/icons-material';
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
  Stack
} from '@mui/material';

const FichaDetalle = () => {
  const { id } = useParams();
  const [fichas, setFicha] = useState(null);
  const [aprendices, setAprendices] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserModal, setOpenUserModal] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [aprendizAEliminar, setAprendizAEliminar] = useState(null);

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
      await axios.delete(`http://localhost:3000/ficha-aprendiz/eliminar`, {
        data: {
          id_usuario: aprendizAEliminar.id_usuario,
          id_ficha: id,
        },
      });

      setAprendices(aprendices.filter(a => a.id_usuario !== aprendizAEliminar.id_usuario));
      setOpenConfirm(false);
      setAprendizAEliminar(null);
    } catch (error) {
      console.error('❌ Error al eliminar el aprendiz:', error);
    }
  };

  useEffect(() => {
    const obtenerFicha = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/fichas/ver/${id}`);
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

<Button
  variant="contained"
  // onClick={() => handleOpenModal()}
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