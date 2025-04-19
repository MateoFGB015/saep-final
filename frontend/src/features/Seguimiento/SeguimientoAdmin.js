import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs, Typography, TextField, SpeedDial, SpeedDialAction, SpeedDialIcon
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';
import axios from 'axios';
import { purple } from '@mui/material/colors';


const BitacoraDocumentosApp = () => {
  const [tab, setTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [observacionDialog, setObservacionDialog] = useState(false);
  const [observaciones, setObservaciones] = useState(Array(5).fill(null));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [textoObservacion, setTextoObservacion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedBitacoraId, setSelectedBitacoraId] = useState(null);

  const handleTabChange = (e, newValue) => setTab(newValue);
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
  const guardarObservacion = async () => {
    try {
      const response = await axios.post('http://localhost:3000/observacion/crear', {
        texto: textoObservacion,
        bitacoraId: selectedBitacoraId, // asegúrate de tener este valor definido correctamente
      });
  
      const nuevaObservacion = response.data;
  
      // Actualizar el estado de observaciones si aplica
      setObservaciones((prev) => {
        const newObs = [...prev];
        newObs[selectedIndex] = nuevaObservacion;
        return newObs;
      });
  
      handleCloseObservacionDialog();
    } catch (error) {
      console.error('Error al guardar la observación:', error);
    }
  };
  

  const data = Array(5).fill({});

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
  
    const token = localStorage.getItem("token,SAEP2826772");
  
    try {
      const response = await axios.post('http://localhost:3000/Bitacora/subir', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
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

  return (
    <Box sx={{ p: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Tabs sx={{ color: purple[700] }} value={tab} onChange={handleTabChange}>
        <Tab label="Bitácora" />
        <Tab label="Documento de certificación" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {data.map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              p: 2, my: 1, borderRadius: 2, boxShadow: 2,
              backgroundColor: '#f5f5f5', gap: 2, wordBreak: 'break-word',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold">
                {tab === 0 ? `Bitácora #${index + 1}` : `Documento #${index + 1}`}
              </Typography>
              {tab === 0 && observaciones[index] && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontStyle: 'italic', color: '#616161', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
                >
                  {observaciones[index].fecha}: {observaciones[index].texto}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button size="small"sx={{ color: purple[700] }}>Ver</Button>
              <Button size="small"sx={{ color: purple[700] }}>Modificar</Button>
              {tab === 0 && (
                <Button size="small" onClick={() => handleOpenObservacionDialog(index)} sx={{ color: purple[700] }}>Observaciones</Button>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <SpeedDial
        ariaLabel="Opciones"
        icon={<SpeedDialIcon />}
        direction="up"
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          '& .MuiFab-primary': { backgroundColor: '#6a1b9a', '&:hover': { backgroundColor: '#4a148c' } }
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen={false}
            onClick={() => handleOpenModal(action.name.split(' ')[1])}
            sx={{ backgroundColor: '#8e24aa', color: 'white', '&:hover': { backgroundColor: '#6a1b9a' } }}
          />
        ))}
      </SpeedDial>

      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Subir {modalTipo}
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}
        >
          <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, width: '100%', p: 4, textAlign: 'center', backgroundColor: '#eee' }}>
            <input
              type="file"
              name='bitacora'
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              id="file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span">Seleccionar archivo</Button>
            </label>
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Vista previa:</Typography>
                {previewUrl && selectedFile.type.startsWith('image') && (
                  <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 200 }} />
                )}
                {previewUrl && selectedFile.type === 'application/pdf' && (
                  <iframe src={previewUrl} title="preview" width="100%" height="200px" />
                )}
                {previewUrl && !selectedFile.type.startsWith('image') && selectedFile.type !== 'application/pdf' && (
                  <Typography>{selectedFile.name}</Typography>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!selectedFile}>
            Subir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={observacionDialog} onClose={handleCloseObservacionDialog}>
        <DialogTitle>Agregar Observación</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={textoObservacion}
            onChange={(e) => setTextoObservacion(e.target.value)}
            placeholder="Escribe tu observación aquí..."
            autoFocus
            
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseObservacionDialog}>Cancelar</Button>
          <Button
            onClick={guardarObservacion}
            variant="contained"
            disabled={selectedIndex !== null && observaciones[selectedIndex] !== null}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  
  );
};

export default BitacoraDocumentosApp;


