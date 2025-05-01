import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs, Typography, TextField, SpeedDial, SpeedDialAction, SpeedDialIcon, Paper, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useParams } from 'react-router-dom';


const BitacoraDocumentosApp = () => {
  const [tab, setTab] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null); // Guarda el item actual a eliminar
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState('');
  const [observacionDialog, setObservacionDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [textoObservacion, setTextoObservacion] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bitacoras, setBitacoras] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [currentBitacora, setCurrentBitacora] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const contentRef = useRef(null);
  const datosPorPagina = 5;

  // API URL base
  const API_URL = 'http://localhost:3000';
  
  // Obtener token del almacenamiento local
  const getToken = () => localStorage.getItem('token');

  const getUserRole = () => {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol;
  };
  
  const { id_usuario } = useParams();
  const userRole = getUserRole();
  const isFiltrado = (userRole === 'Administrador' || userRole === 'Instructor') && id_usuario;  
  

  // Cargar datos al iniciar el componente o cambiar tab
  useEffect(() => {
    if (tab === 0) {
      fetchBitacoras();
    } else {
      fetchDocumentos();
    }
  }, [tab]);

  // Función para cargar bitácoras
  const fetchBitacoras = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = isFiltrado ? `/${id_usuario}` : '';
      const response = await fetch(`${API_URL}/bitacora/ver_bitacoras${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('No se pudieron cargar las bitácoras');
      }
  
      const data = await response.json();
      setBitacoras(data.bitacoras || []);
    } catch (error) {
      console.error('Error al cargar bitácoras:', error);
      setError('No se pudieron cargar las bitácoras. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
 // Función para cargar documentos
  const fetchDocumentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = isFiltrado ? `/${id_usuario}` : '';
      const response = await fetch(`${API_URL}/documentos/ver${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('No se pudieron cargar los documentos');
      }
  
      const data = await response.json();
      setDocumentos(data.documentos || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setError('No se pudieron cargar los documentos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  // Función para ver una bitácora específica
  const verBitacora = async (idBitacora) => {
    try {
      const response = await fetch(`${API_URL}/bitacora/ver/${idBitacora}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('No se pudo cargar la bitácora');
      }
      
      const data = await response.json();
      setCurrentBitacora(data.bitacora);
      // Aquí puedes implementar lógica para mostrar la bitácora,
      // como abrir un modal con el PDF o documento
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar la bitácora');
    }
  };

  // Función para modificar una bitácora
  const modificarBitacora = (idBitacora) => {
    // Aquí puedes implementar la lógica para abrir un modal de modificación
    // y luego hacer la solicitud PUT al backend
    alert(`Funcionalidad para modificar bitácora ${idBitacora} en desarrollo`);
  };

  // Función para manejar observaciones
  const handleOpenObservacionDialog = (index, idBitacora) => {
    setSelectedIndex(index);
    setCurrentBitacora(bitacoras[index]);
    setTextoObservacion(bitacoras[index]?.observacion || '');
    setObservacionDialog(true);
  };

  const handleCloseObservacionDialog = () => {
    setObservacionDialog(false);
    setSelectedIndex(null);
    setTextoObservacion('');
    setCurrentBitacora(null);
  };

  // Guardar observación en el backend
  const guardarObservacion = async () => {
    if (!currentBitacora || !textoObservacion.trim()) {
      alert('Por favor ingrese una observación válida');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bitacora/modificar/${currentBitacora.id_bitacora}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observacion: textoObservacion })
      });

      if (!response.ok) {
        throw new Error('No se pudo guardar la observación');
      }

      // Actualizar bitácora en la lista local
      const updatedBitacoras = bitacoras.map(b => 
        b.id_bitacora === currentBitacora.id_bitacora 
          ? { ...b, observacion: textoObservacion, fecha_ultima_actualizacion: new Date() }
          : b
      );
      
      setBitacoras(updatedBitacoras);
      handleCloseObservacionDialog();
      alert('Observación guardada correctamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la observación');
    }
  };

  // Manejar cambio de tab
  const handleTabChange = (e, newValue) => {
    setTab(newValue);
    setPaginaActual(1);
  };

  // Manejar modal para subir archivos
  const handleOpenModal = (tipo) => {
    setModalTipo(tipo);
    setModalOpen(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('');
    setError(null);
  };

  const handleCloseModal = () => setModalOpen(false);

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tamaño según tipo
    const maxSize = modalTipo === 'Subir Bitácora' ? 5 * 1024 * 1024 : 20 * 1024 * 1024; // 5MB o 20MB
    if (file && file.size > maxSize) { 
      setError(`El archivo supera el límite de tamaño permitido (${maxSize/1024/1024} MB).`);
      setSelectedFile(null);
      return;
    }
    
    // Validar tipos de archivo
    if (modalTipo === 'Subir Bitácora') {
      const validTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validTypes.includes(ext)) {
        setError('Tipo de archivo no permitido. Formatos aceptados: PDF, DOC, DOCX, XLS, XLSX');
        setSelectedFile(null);
        return;
      }
    }
  
    setSelectedFile(file);
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
  };
  
  // Subir archivo al backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor seleccione un archivo');
      return;
    }
  
    const formData = new FormData();
    setUploadStatus('Subiendo archivo...');
    
    try {
      let endpoint = '';
      
      if (modalTipo === 'Subir Bitácora') {
        endpoint = '/bitacora/subir';
        formData.append('bitacora', selectedFile); // Nombre del campo debe coincidir con el esperado por multer en el backend
      } else if (modalTipo === 'Subir Documento') {
        endpoint = '/documentos/subir';
        formData.append('documento', selectedFile); // Nombre del campo debe coincidir con el esperado por multer en el backend
      } else if (modalTipo === 'Subir Firma') {
        endpoint = '/firma/subir'; // Si tienes una ruta para subir firmas
        formData.append('firma', selectedFile);
      }
      
      // Si no hay endpoint válido, terminar
      if (!endpoint) {
        setError('Tipo de archivo no reconocido');
        return;
      }
      
      console.log(`Subiendo a: ${API_URL}${endpoint}`);
      setLoading(true);
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
          // No incluir Content-Type con FormData, el navegador lo establece automáticamente con el boundary
        },
        body: formData
      });
      
      // Log para depuración
      console.log('Status de respuesta:', response.status);
      
      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.mensaje || `Error ${response.status}`);
      }
      
      setUploadStatus('¡Archivo subido con éxito!');
      // Recargar los datos después de subir
      if (modalTipo === 'Subir Bitácora') {
        fetchBitacoras();
      } else if (modalTipo === 'Subir Documento') {
        fetchDocumentos();
      }
      
      // Cerrar modal después de un breve retraso
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
      
    } catch (error) {
      console.error('Error en la subida:', error);
      setError(`Error al subir el archivo: ${error.message}`);
      setUploadStatus('');
    } finally {
      setLoading(false);
    }
  };

  // Configurar scroll personalizado
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

  // Acciones disponibles según el tab
  const actions = [
    ...(tab === 0 ? [{ icon: <NoteAddIcon />, name: 'Subir Bitácora' }] : []),
    ...(tab === 1 ? [{ icon: <UploadFileIcon />, name: 'Subir Documento' }] : []),
    { icon: <EditNoteIcon />, name: 'Subir Firma' }
  ];

  // Calcular datos para paginación
  const datos = tab === 0 ? bitacoras : documentos;
  const totalPaginas = Math.ceil(datos.length / datosPorPagina);
  const datosPagina = datos.slice(
    (paginaActual - 1) * datosPorPagina,
    paginaActual * datosPorPagina
  );

  // Estilos
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

      {loading && !modalOpen ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#6a1b9a' }} />
        </Box>
      ) : error && !modalOpen ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2, backgroundColor: '#6a1b9a' }}
            onClick={() => tab === 0 ? fetchBitacoras() : fetchDocumentos()}
          >
            Reintentar
          </Button>
        </Box>
      ) : (
        <Box ref={contentRef} sx={scrollableStyle}>
          {datosPagina.length > 0 ? (
            datosPagina.map((item, index) => {
              const globalIndex = (paginaActual - 1) * datosPorPagina + index;
              const itemId = tab === 0 ? item.id_bitacora : item.id_documento || `doc-${globalIndex}`;
              
              return (
                <Paper
                  key={itemId}
                  elevation={3}
                  sx={{
                    p: 3, my: 2, borderRadius: 3, display: 'flex',
                    flexDirection: 'column', backgroundColor: 'white',
                    gap: 1, borderLeft: '6px solid #8e24aa'
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="#6a1b9a">
                    {tab === 0 
                      ? `Bitácora #${item.numero_bitacora}` 
                      : `Documento: ${item.nombre_documento || `Documento #${globalIndex + 1}`}`
                    }
                  </Typography>
                  
                  {tab === 0 && item.observacion && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                      Observación: {item.observacion}
                    </Typography>
                  )}
                  
                  {tab === 1 && item.descripcion && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                      Descripción: {item.descripcion}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Última actualización: {new Date(item.fecha_ultima_actualizacion).toLocaleString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button 
          size="small" 
          variant="outlined" 
          color="secondary"
          onClick={() => {
            const archivo = tab === 0 ? item.bitacora : item.documento;
            const carpeta = tab === 0 ? 'bitacoras' : 'documentos';
            if (archivo) {
              window.open(`${API_URL}/uploads/${carpeta}/${encodeURIComponent(archivo)}`, '_blank');
            } else {
              alert('Archivo no disponible');
            }
          }}
        >
          Ver
        </Button>

        {/* Modificar: solo aprendiz o admin */}
        {(userRole === 'Administrador' || userRole === 'aprendiz') && (
          <Button 
            size="small" 
            variant="outlined" 
            color="secondary"
            component="label"
          >
            Modificar
            <input 
              type="file" 
              hidden 
              onChange={async (e) => {
                const nuevoArchivo = e.target.files[0];
                if (!nuevoArchivo) return;
                const id = tab === 0 ? item.id_bitacora : item.id_documento;
                const endpoint = tab === 0 ? `/bitacora/modificar/${id}` : `/documentos/modificar/${id}`;
                const campo = tab === 0 ? 'bitacora' : 'documento';
                const formData = new FormData();
                formData.append(campo, nuevoArchivo);

                try {
                  setLoading(true);
                  const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${getToken()}` },
                    body: formData
                  });

                  const result = await response.json();
                  if (!response.ok) throw new Error(result.mensaje || 'Error al modificar');
                  if (tab === 0) fetchBitacoras();
                  else fetchDocumentos();
                  alert('Archivo modificado con éxito');
                } catch (err) {
                  alert('Error al modificar el archivo: ' + err.message);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </Button>
        )}

        {/* Observaciones - según rol y estado */}
        {tab === 0 && (
          (userRole === 'Administrador' || userRole === 'Instructor' || 
           (userRole === 'aprendiz' && item.estado_bitacora !== 1)) && (
            <Button 
              size="small" 
              variant="outlined" 
              color="secondary"
              onClick={() => handleOpenObservacionDialog(index, item.id_bitacora)}
            >
              Observaciones
            </Button>
          )
        )}

        {/* Eliminar: solo admin */}
        {userRole === 'Administrador' && (
          <Button 
          size="small" 
          variant="outlined" 
          color="error"
          onClick={() => {
            const esBitacora = tab === 0;
            setItemAEliminar({
              tipo: esBitacora ? 'bitácora' : 'documento',
              id: esBitacora ? item.id_bitacora : item.id_documento
            });
            setConfirmDialogOpen(true);
          }}
        >
          Eliminar
        </Button>
                    )}
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {tab === 0 
              ? 'No hay bitácoras disponibles' 
              : 'No hay documentos disponibles'
            }
          </Typography>
        </Box>

          )}

          {datos.length > datosPorPagina && (
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
          )}
        </Box>
      )}

      {/* SpeedDial con acciones */}
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

      {/* Modal para subir archivos */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem', pb: 0 }}>
          {modalTipo}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', right: 16, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, py: 4 }}>
          <Typography variant="body1" sx={{ color: '#555' }}>
            Por favor, selecciona un archivo para subir.
            {modalTipo === 'Subir Bitácora' && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX (máximo 5MB)
              </Typography>
            )}
            {modalTipo === 'Subir Documento' && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Máximo 20MB
              </Typography>
            )}
          </Typography>

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          {uploadStatus && (
            <Typography 
              variant="body2" 
              color={uploadStatus.includes('éxito') ? 'success.main' : 'info.main'} 
              sx={{ mt: 1 }}
            >
              {uploadStatus}
            </Typography>
          )}

          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: 'none',
              borderRadius: '16px',
              px: 4,
              py: 1,
              fontWeight: 500,
              borderColor: '#6a1b9a',
              color: '#6a1b9a',
              '&:hover': {
                backgroundColor: '#f3e5f5',
                borderColor: '#6a1b9a'
              }
            }}
          >
            Seleccionar archivo
            <input 
              type="file" 
              hidden 
              onChange={handleFileChange} 
              accept={modalTipo === 'Subir Bitácora' ? '.pdf,.doc,.docx,.xls,.xlsx' : undefined}
            />
          </Button>

          {selectedFile && (
            <Typography variant="caption" sx={{ color: '#777' }}>
              Archivo: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!selectedFile || loading}
            sx={{
              backgroundColor: '#6a1b9a',
              borderRadius: '16px',
              textTransform: 'none',
              px: 4,
              '&:hover': {
                backgroundColor: '#4a0072'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Subir'}
          </Button>
          <Button
            onClick={handleCloseModal}
            sx={{
              textTransform: 'none',
              color: '#6a1b9a',
              borderRadius: '16px'
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para observaciones */}
      <Dialog
        open={observacionDialog}
        onClose={handleCloseObservacionDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem', pb: 0 }}>
          Agregar Observación
          <IconButton
            aria-label="close"
            onClick={handleCloseObservacionDialog}
            sx={{ position: 'absolute', right: 16, top: 12 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {currentBitacora && `Bitácora #${currentBitacora.numero_bitacora}`}
          </Typography>
          
          <textarea
            value={textoObservacion}
            onChange={(e) => setTextoObservacion(e.target.value)}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              resize: 'vertical',
              fontFamily: 'inherit',
              fontSize: '14px'
            }}
            placeholder="Escribe tu observación aquí..."
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button
            onClick={guardarObservacion}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: '#6a1b9a',
              borderRadius: '16px',
              textTransform: 'none',
              px: 4,
              '&:hover': {
                backgroundColor: '#4a0072'
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
          </Button>
          <Button
            onClick={handleCloseObservacionDialog}
            sx={{
              textTransform: 'none',
              color: '#6a1b9a',
              borderRadius: '16px'
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
  open={confirmDialogOpen}
  onClose={() => setConfirmDialogOpen(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      p: 2,
      textAlign: 'center'
    }
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#6a1b9a' }}>
    Confirmar eliminación
  </DialogTitle>

  <DialogContent>
    <Typography sx={{ mb: 2 }}>
      ¿Estás seguro de que deseas eliminar esta <strong>{itemAEliminar?.tipo}</strong>? Esta acción no se puede deshacer.
    </Typography>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
    <Button
      onClick={() => setConfirmDialogOpen(false)}
      variant="outlined"
      sx={{
        textTransform: 'none',
        borderRadius: '16px',
        color: '#6a1b9a',
        borderColor: '#6a1b9a',
        '&:hover': {
          backgroundColor: '#f3e5f5',
          borderColor: '#6a1b9a'
        }
      }}
    >
      Cancelar
    </Button>

    <Button
      onClick={async () => {
        if (!itemAEliminar) return;
        const endpoint = itemAEliminar.tipo === 'bitácora'
          ? `/bitacora/eliminar/${itemAEliminar.id}`
          : `/documentos/eliminar/${itemAEliminar.id}`;

        try {
          setLoading(true);
          const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.mensaje || 'Error al eliminar');

          itemAEliminar.tipo === 'bitácora' ? fetchBitacoras() : fetchDocumentos();

          // Mostrar éxito
          setMensajeExito(`${itemAEliminar.tipo.charAt(0).toUpperCase() + itemAEliminar.tipo.slice(1)} eliminad${itemAEliminar.tipo === 'bitácora' ? 'a' : 'o'} con éxito`);
          setSuccessDialogOpen(true);
          setTimeout(() => setSuccessDialogOpen(false), 2000);

        } catch (err) {
          alert('Error al eliminar: ' + err.message);
        } finally {
          setLoading(false);
          setConfirmDialogOpen(false);
        }
      }}
      variant="contained"
      color="error"
      sx={{
        textTransform: 'none',
        borderRadius: '16px',
        px: 4
      }}
    >
      Eliminar
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={successDialogOpen}
  onClose={() => setSuccessDialogOpen(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4,
      textAlign: 'center',
      py: 4,
      px: 2
    }
  }}
>
  <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'green' }}>
    ¡Éxito!
  </DialogTitle>
  <DialogContent>
    <Typography>{mensajeExito}</Typography>
  </DialogContent>
</Dialog>


    </Box>
  );
};

export default BitacoraDocumentosApp;