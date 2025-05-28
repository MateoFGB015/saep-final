import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  Tab, Tabs, Typography, TextField, SpeedDial, SpeedDialAction, SpeedDialIcon, Paper, CircularProgress,List, ListItem, ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCutIcon from '@mui/icons-material/ContentCut';
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
  const [observaciones, setObservaciones] = useState([]);
  const [bitacorasRecientementeActualizadas, setBitacorasRecientementeActualizadas] = useState([]);

  
  const contentRef = useRef(null);
  const datosPorPagina = 5;

  // API URL base
const API_URL = process.env.REACT_APP_BACKEND_API_URL;

  
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
      
      // Almacenar bitácoras
      const bitacorasData = data.bitacoras || [];
      
      // Para cada bitácora, obtener sus observaciones
      const bitacorasConObservaciones = await Promise.all(
        bitacorasData.map(async (bitacora) => {
          try {
            const obsResponse = await fetch(`${API_URL}/observacion/bitacora/${bitacora.id_bitacora}`, {
              headers: {
                'Authorization': `Bearer ${getToken()}`,
              },
            });
            
            if (obsResponse.ok) {
              const obsData = await obsResponse.json();
              return {
                ...bitacora,
                observacionesLista: obsData.observaciones || []
              };
            }
            return bitacora;
          } catch (err) {
            console.error(`Error al cargar observaciones para bitácora ${bitacora.id_bitacora}:`, err);
            return bitacora;
          }
        })
      );
      
      setBitacoras(bitacorasConObservaciones);
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
  const fetchObservaciones = async (idBitacora) => {
    try {
      console.log(`Obteniendo observaciones para bitácora ${idBitacora}`);
      const response = await fetch(`${API_URL}/observacion/bitacora/${idBitacora}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Observaciones recibidas:', data);
      
      const observacionesData = data.observaciones || [];
      setObservaciones(observacionesData);
      
      return observacionesData; // Retornar las observaciones
    } catch (err) {
      console.error('Error al obtener observaciones:', err);
      setObservaciones([]);
      return [];
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
  const handleOpenObservacionDialog = async (index, idBitacora) => {
    setSelectedIndex(index);
    setCurrentBitacora(bitacoras[index]);
    setTextoObservacion('');
    await fetchObservaciones(idBitacora);
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
      const response = await fetch(`${API_URL}/observacion/bitacora/${currentBitacora.id_bitacora}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ observacion: textoObservacion, mostrar_observacion: true })
      });
    
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error('Respuesta inesperada del servidor:\n' + errorText);
      }
    
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje);
    
      setTextoObservacion('');
      
      // Actualizar observaciones en el estado actual
      let nuevasObservaciones = await fetchObservaciones(currentBitacora.id_bitacora);

              // Guardar ID de bitácora recién actualizada
        setBitacorasRecientementeActualizadas(prev => [...prev, currentBitacora.id_bitacora]);

        // Eliminarlo después de 5 segundos
        setTimeout(() => {
          setBitacorasRecientementeActualizadas(prev =>
            prev.filter(id => id !== currentBitacora.id_bitacora)
          );
        }, 5000);



      
      // Actualizar la bitácora específica en el estado de bitácoras
      if (selectedIndex !== null) {
        setBitacoras(prevBitacoras => {
          const nuevasBitacoras = [...prevBitacoras];
      
          // Ordenar las nuevas observaciones aquí mismo
          const observacionesOrdenadas = [...nuevasObservaciones].sort(
            (a, b) => new Date(b.fecha_ultima_actualizacion) - new Date(a.fecha_ultima_actualizacion)
          );
      
          nuevasBitacoras[selectedIndex] = {
            ...nuevasBitacoras[selectedIndex],
            observacionesLista: observacionesOrdenadas,
            observacion: observacionesOrdenadas[0]?.observacion || ''
          };
      
          return nuevasBitacoras;
        });
      }
      
      
      // Mostrar confirmación de éxito
      setMensajeExito('Observación guardada con éxito');
      setSuccessDialogOpen(true);
      
      // Recargar toda la lista de bitácoras (con observaciones y fechas nuevas)
      await new Promise(resolve => setTimeout(resolve, 300));
      await fetchBitacoras()
      
      setTimeout(() => {
        setSuccessDialogOpen(false);
        handleCloseObservacionDialog(); // También cierra el modal
      }, 2000);
      
    } catch (err) {
      console.error('Error al guardar observación:', err);
      alert('Error al guardar la observación: ' + err.message);
    }
  };
  
  const eliminarObservacion = async (idObs) => {
    if (!window.confirm('¿Estás seguro de eliminar esta observación?')) return;
    try {
      // Verificar que el ID sea válido
      if (!idObs) {
        console.error("ID de observación inválido:", idObs);
        alert("Error: ID de observación inválido");
        return;
      }

      console.log("Intentando eliminar observación con ID:", idObs);
      
      // Usar la ruta correcta según el archivo ObservacionRoutes.js
      const response = await fetch(`${API_URL}/observacion/${idObs}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      // Depuración para ver la respuesta completa
      console.log("Respuesta del servidor - status:", response.status);
      
      // Esperar la respuesta como texto primero para ver si hay un error
      const responseText = await response.text();
      console.log("Respuesta del servidor (texto):", responseText);
      
      let data;
      try {
        // Intentar parsear como JSON si es posible
        data = responseText ? JSON.parse(responseText) : {};
      } catch(e) {
        console.error("Error al parsear respuesta:", e);
        data = { mensaje: responseText };
      }
      
      if (!response.ok) {
        throw new Error(data.mensaje || `Error ${response.status}`);
      }
      
      // Actualizar observaciones
      setObservaciones(prev => prev.filter(o => o.id_observacion !== idObs));
      // Actualizar también la lista principal de bitácoras si es necesario
      if (currentBitacora && selectedIndex !== null) {
        setBitacoras(prevBitacoras => {
          const nuevasBitacoras = [...prevBitacoras];
          if (nuevasBitacoras[selectedIndex]?.observacionesLista) {
            nuevasBitacoras[selectedIndex].observacionesLista = 
              nuevasBitacoras[selectedIndex].observacionesLista.filter(o => o.id_observacion !== idObs);
          }
          return nuevasBitacoras;
        });
      }
      
      setMensajeExito('Observación eliminada con éxito');
      setSuccessDialogOpen(true);
      setTimeout(() => setSuccessDialogOpen(false), 2000);
    } catch (err) {
      console.error('Error al eliminar observación:', err);
      alert('Error al eliminar observación: ' + err.message);
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

  const actions = userRole === 'aprendiz' ? [
    ...(tab === 0 ? [{ icon: <NoteAddIcon />, name: 'Subir Bitácora' }] : []),
    ...(tab === 1 ? [{ icon: <UploadFileIcon />, name: 'Subir Documento' }] : []),
  ] : [];
  

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
                
                {tab === 0 && (
                  <>
                    
                    {/* Mostrar lista de observaciones si existen */}
                    {item.observacionesLista && item.observacionesLista.length > 0 && (
                      <Box sx={{ mt: 1, mb: 1, pl: 2, borderLeft: '2px solid #e0e0e0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Todas las observaciones:
                        </Typography>
                        {item.observacionesLista.slice(0, 2).map((obs, idx) => (
                          <Typography key={idx} variant="body2" sx={{ fontSize: '0.9rem', color: '#555', mb: 0.5 }}>
                            • {obs.observacion} <span style={{ fontSize: '0.8rem', color: '#777' }}>
                              ({obs.usuarioCreador?.nombre || 'Usuario'} {obs.usuarioCreador?.apellido || ''})
                            </span>
                          </Typography>
                        ))}
                        {item.observacionesLista.length > 2 && (
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#6a1b9a', cursor: 'pointer' }}
                            onClick={() => handleOpenObservacionDialog(index, item.id_bitacora)}>
                            Ver todas las observaciones ({item.observacionesLista.length})
                          </Typography>
                        )}
                      </Box>
                    )}
                  </>
                )}
                
                {tab === 1 && item.descripcion && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555' }}>
                    Descripción: {item.descripcion}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary">
                {item.observacionesLista?.[0]?.fecha_ultima_actualizacion ? (
                  <>
                    Última actualización:{" "}
                    {new Date(item.observacionesLista[0].fecha_ultima_actualizacion).toLocaleString("es-CO", {
                      dateStyle: "medium",
                      timeStyle: "short",
                        timeZone: 'America/Bogota'
                    })}
                    {bitacorasRecientementeActualizadas.includes(item.id_bitacora) && (
                      <span style={{ color: "#4caf50", fontWeight: 500 }}> — Actualizado hace un momento</span>
                    )}
                  </>
                ) : (
                  "Sin observaciones registradas"
                )}
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
      {userRole === 'aprendiz' && (
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
)}


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
                Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX (máximo 20MB)
              </Typography>
            )}
            {modalTipo === 'Subir Documento' && (
             <Typography variant="caption" display="block" sx={{ mt: 1 }}>
             Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX (máximo 20MB)
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

  {observaciones.length === 0 ? (
    <Typography variant="body2" color="textSecondary">
      No hay observaciones registradas.
    </Typography>
  ) : (
    <List sx={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
      {observaciones.map((obs, idx) => (
        <ListItem 
          key={obs.id_observacion || idx} 
          alignItems="flex-start" 
          divider={idx < observaciones.length - 1}
          secondaryAction={
            userRole === 'Administrador' && (
              <ContentCutIcon edge="end" onClick={() => eliminarObservacion(obs.id_observacion)}>
                <DeleteIcon color="red" />
              </ContentCutIcon>
            )
          }
        >
          <ListItemText
            primary={
              <Typography variant="subtitle2">
                {obs.usuarioCreador?.nombre || 'Usuario'} {obs.usuarioCreador?.apellido || ''} 
                <span style={{ fontWeight: 'normal', fontSize: '0.8rem', marginLeft: '8px' }}>
                  ({obs.rol_usuario || 'N/A'})
                </span>
              </Typography>
            }
            secondary={
              <>
                <Typography variant="body2" color="text.primary" sx={{ mt: 0.5, mb: 0.5 }}>
                  {obs.observacion}
                </Typography>
                {obs.fecha_creacion && (
                  <Typography variant="caption" color="text.secondary">
                    {new Date(obs.fecha_creacion).toLocaleString()}
                  </Typography>
                )}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  )}

<TextField
    label="Nueva observación"
    multiline
    fullWidth
    minRows={4}
    value={textoObservacion}
    onChange={(e) => setTextoObservacion(e.target.value)}
    sx={{ mt: 2 }}
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