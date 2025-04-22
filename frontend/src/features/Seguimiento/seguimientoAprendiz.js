import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs, Typography, TextField, SpeedDial, SpeedDialAction, SpeedDialIcon, Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';

const BitacoraDocumentosApp = () => {
  const [tab, setTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [observacionDialog, setObservacionDialog] = useState(false);
  const [observaciones, setObservaciones] = useState(Array(50).fill(null));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [textoObservacion, setTextoObservacion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  const contentRef = useRef(null);

  const [bitacoras, setBitacoras] = useState([]);

  useEffect(() => {
    const fetchBitacoras = async () => {
      try {
        const response = await fetch('http://localhost:3000/bitacora/ver_bitacoras', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const data = await response.json();
        setBitacoras(data.bitacoras || []); // suponiendo que el backend responde con { bitacoras: [...] }
      } catch (error) {
        console.error('Error al cargar bitácoras:', error);
      }
    };
  
    fetchBitacoras();
  }, []);


  const datosPorPagina = 3;
  const totalPaginas = Math.ceil(bitacoras.length / datosPorPagina);
  const datosPagina = bitacoras.slice(
    (paginaActual - 1) * datosPorPagina,
    paginaActual * datosPorPagina
  );
  

  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPaginaActual(1);
  };

  const handleOpenModal = (tipo) => {
    setModalTipo(tipo);
    setModalOpen(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleOpenObservacionDialog = (index) => {
    setSelectedIndex(index);
    setObservacionDialog(true);
  };
  const handleCloseObservacionDialog = () => {
    setObservacionDialog(false);
    setSelectedIndex(null);
    setTextoObservacion('');
  };

  const guardarObservacion = () => {
    const nueva = { fecha: new Date().toLocaleString(), texto: textoObservacion };
    const copia = [...observaciones];
    const indexGlobal = (paginaActual - 1) * datosPorPagina + selectedIndex;
    copia[indexGlobal] = nueva;
    setObservaciones(copia);
    handleCloseObservacionDialog();
  };

  const actions = [
    ...(tab === 0 ? [{ icon: <NoteAddIcon />, name: 'Subir Bitácora' }] : []),
    { icon: <UploadFileIcon />, name: 'Subir Documento' },
    { icon: <EditNoteIcon />, name: 'Subir Firma' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('bitacora', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/bitacora/subir', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        alert('Archivo subido correctamente');
        handleCloseModal();
      } else {
        alert('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en la subida');
    }
  };

  useEffect(() => {
    const handleWheel = (e) => {
      if (contentRef.current) {
        e.preventDefault();
        contentRef.current.scrollTop += e.deltaY;
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (content) {
        content.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const scrollableStyle = {
    overflowY: 'scroll',
    height: 'calc(100vh - 180px)',
    paddingRight: '20px',
    marginRight: '-20px',
    '&::-webkit-scrollbar': {
      width: '0px',
      background: 'transparent'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    scrollBehavior: 'smooth',
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', overflow: 'hidden' }}>
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 3, position: 'sticky', top: 0, zIndex: 10 }}>
        <Tabs value={tab} onChange={handleTabChange} variant="fullWidth" sx={{
          '.MuiTab-root': { fontWeight: 600 },
          '.Mui-selected': { color: '#6a1b9a !important' },
          '.MuiTabs-indicator': { backgroundColor: '#6a1b9a' }
        }}>
          <Tab label="Bitácora" />
          <Tab label="Documento de certificación" />
        </Tabs>
      </Paper>

      <Box ref={contentRef} sx={scrollableStyle}>
      {datosPagina.map((bitacora, index) => {
  const globalIndex = (paginaActual - 1) * datosPorPagina + index;
  return (
    <Paper
      key={bitacora.id_bitacora}
      elevation={3}
      sx={{
        p: 3, my: 2, borderRadius: 3, display: 'flex',
        flexDirection: 'column', backgroundColor: 'white',
        gap: 1, borderLeft: '6px solid #8e24aa'
      }}
    >
      <Typography variant="h6" fontWeight={700} color="#6a1b9a">
        Bitácora #{bitacora.numero_bitacora}
      </Typography>

      {bitacora.observacion && (
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
          Observación: {bitacora.observacion}
        </Typography>
      )}

      <Typography variant="body2">
        Última actualización: {new Date(bitacora.fecha_ultima_actualizacion).toLocaleString()}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button size="small" variant="outlined" color="secondary">Ver</Button>
        <Button size="small" variant="outlined" color="secondary">Modificar</Button>
        <Button size="small" variant="outlined" color="secondary"
          onClick={() => handleOpenObservacionDialog(index)}>
          Observaciones
        </Button>
      </Box>
    </Paper>
  );
})}

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 3,
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          py: 2,
          zIndex: 100
        }}>
          {paginaActual > 1 && (
            <Button
              variant="contained"
              onClick={() => setPaginaActual(paginaActual - 1)}
              sx={{ backgroundColor: '#8e24aa' }}
            >
              Anterior
            </Button>
          )}
          {paginaActual < totalPaginas && (
            <Button
              variant="contained"
              onClick={() => setPaginaActual(paginaActual + 1)}
              sx={{ backgroundColor: '#8e24aa' }}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Box>

      {/* SpeedDial con color morado */}
      <SpeedDial
        ariaLabel="Acciones"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          '& .MuiFab-primary': {
            backgroundColor: '#6a1b9a',
            color: 'white',
            '&:hover': {
              backgroundColor: '#4a0072'
            }
          }
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleOpenModal(action.name)}
            sx={{
              backgroundColor: '#6a1b9a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#4a0072'
              }
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default BitacoraDocumentosApp;
