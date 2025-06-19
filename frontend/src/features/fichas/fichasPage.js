import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import ConfirmDialog from "../../components/ui/ModalConfirmacion";
import { useNavigate } from "react-router-dom";
import SearchBarFichas from "../fichas/SearchBarFichas";

import {
  Button, TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, IconButton, Box, Card, CardContent,
  Typography, useMediaQuery, useTheme
} from "@mui/material";
import {
  BorderColorOutlined, ContentCutOutlined, Add,
  FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage
} from "@mui/icons-material";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

const FichasTable = () => {
  const [fichas, setFichas] = useState([]);
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("numero_ficha");
  const [fichaAEliminar, setFichaAEliminar] = useState(null);
  const [formData, setFormData] = useState({
    numero_ficha: "",
    nombre_programa: "",
    termino_programa: "",
    archivar: "no",
    inicio_etapa_productiva: "",
    fin_etapa_productiva: "",
    id_instructor: "",
  });

  // Hook para detectar pantallas móviles
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if(user) {
      fetchFichas();
    }
  }, [user]);
  
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      setFilteredFichas([]);
      return;
    }

    const filtradas = fichas.filter((f) => {
      const valor = f[filterType]?.toString().toLowerCase();
      return valor?.includes(term);
    });

    setFilteredFichas(filtradas);
    setCurrentPage(0);
  }, [searchTerm, filterType, fichas]);

  const fetchFichas = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const endpoint =
        user.rol === "Instructor"
          ? `${API_URL}/fichas/instructor`
          : `${API_URL}/fichas/ver`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setFichas(response.data);
    } catch (error) {
      console.error("Error al obtener las fichas:", error);
    }
  };
  
  const onSearch = () => {
    const term = searchTerm.toLowerCase();

    if (term.trim() === "") {
      setFilteredFichas([]);
      return;
    }

    const filtradas = fichas.filter((f) => {
      const valor = f[filterType]?.toString().toLowerCase();
      return valor?.includes(term);
    });

    setFilteredFichas(filtradas);
    setCurrentPage(0);
  };

  const [filteredFichas, setFilteredFichas] = useState([]);
  const navigate = useNavigate();

  const handleVerFicha = (id) => {
    navigate(`/fichas/ver/${id}`);
  };

  const confirmarEliminacion = (ficha) => {
    setFichaAEliminar(ficha);
    setDialogOpen(true);
  };

  const eliminarFichaConfirmada = async () => {
    try {
      await axios.delete(`${API_URL}/fichas/eliminar/${fichaAEliminar.id_ficha}`);
      setFichas(fichas.filter(f => f.id_ficha !== fichaAEliminar.id_ficha));
      setDialogOpen(false);
      setFichaAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar la ficha:", error);
    }
  };

  const handleOpenModal = (ficha = null) => {
    setIsEditing(!!ficha);
    setFormData(
      ficha || {
        numero_ficha: "",
        nombre_programa: "",
        termino_programa: "",
        archivar: "no",
        inicio_etapa_productiva: "",
        fin_etapa_productiva: "",
        id_instructor: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/fichas/modificar/${formData.id_ficha}`, formData);
      } else {
        await axios.post(`${API_URL}/fichas`, formData);
      }
      fetchFichas();
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
    }
  };

  const [instructores, setInstructores] = useState([]);

  useEffect(() => {
    const fetchInstructores = async () => {
      try {
        const response = await axios.get(`${API_URL}/usuarios/instructores`);
        setInstructores(response.data);
      } catch (error) {
        console.error("Error al obtener instructores:", error);
      }
    };

    fetchInstructores();
  }, []);

  // PAGINACIÓN + SOPORTE PARA BÚSQUEDA
  const [currentPage, setCurrentPage] = useState(0);

  const rowsPerPage = useResponsiveRows(setCurrentPage);

  const visibleRows = (filteredFichas.length ? filteredFichas : fichas).slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(
    (filteredFichas.length ? filteredFichas.length : fichas.length) / rowsPerPage
  );

  function useResponsiveRows(setCurrentPage) {
    const [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage());

    function getRowsPerPage() {
      const width = window.innerWidth;
      if (width < 768) return 3; // Móvil: menos filas
      return width >= 1400 ? 10 : 5;
    }

    useEffect(() => {
      const updateRows = () => {
        const newRows = getRowsPerPage();
        setRowsPerPage((prev) => {
          if (prev !== newRows) {
            setCurrentPage(0);
          }
          return newRows;
        });
      };

      window.addEventListener("resize", updateRows);
      return () => window.removeEventListener("resize", updateRows);
    }, [setCurrentPage]);

    return rowsPerPage;
  }

  // Componente de vista móvil (tarjetas)
  const MobileView = () => (
    <Box sx={{ px: 1 }}>
      {visibleRows.map((ficha, index) => (
        <Card
          key={ficha.id_ficha}
          elevation={2}
          sx={{
            mb: 2,
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#71277a',
                  mb: 1,
                  lineHeight: 1.2
                }}
              >
                {ficha.nombre_programa}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Ficha N°:</strong> {ficha.numero_ficha}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Término:</strong> {ficha.termino_programa}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                size="small"
                sx={{
                  border: "1px solid #71277a",
                  color: "#71277a",
                  fontSize: "11px",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.5,
                  flex: 1,
                  minWidth: '80px'
                }}
                onClick={() => handleVerFicha(ficha.id_ficha)}
              >
                Ver listado
              </Button>
              
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton 
                  size="small"
                  onClick={() => handleOpenModal(ficha)}
                  sx={{ p: 0.5 }}
                >
                  <BorderColorOutlined
                    sx={{
                      backgroundColor: "#71277a",
                      p: 0.8,
                      fontSize: "20px",
                      color: "white",
                      borderRadius: "6px",
                    }}
                  />
                </IconButton>
                <IconButton 
                  size="small"
                  onClick={() => confirmarEliminacion(ficha)}
                  sx={{ p: 0.5 }}
                >
                  <ContentCutOutlined
                    sx={{
                      backgroundColor: "red",
                      p: 0.8,
                      fontSize: "20px",
                      color: "white",
                      borderRadius: "6px",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Componente de vista desktop (tabla)
  const DesktopView = () => (
    <TableContainer 
      component={Paper}
      elevation={4}
      sx={{
        borderRadius: 4,
        border: "1px solid #ddd",
        overflow: "hidden",
        mt: 2
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>
              Nombre del Programa
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>
              Término del Programa
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>
              N° Ficha
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((ficha, index) => (
            <TableRow
              key={ficha.id_ficha}
              sx={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <TableCell align="center">{ficha.nombre_programa}</TableCell>
              <TableCell align="center">{ficha.termino_programa}</TableCell>
              <TableCell align="center">{ficha.numero_ficha}</TableCell>
              <TableCell align="center">
                <Button
                  sx={{
                    border: "1px solid #71277a",
                    color: "#71277a",
                    fontSize: "10px",
                    borderRadius: "5px",
                    mr: 1,
                  }}
                  onClick={() => handleVerFicha(ficha.id_ficha)}
                >
                  Ver listado
                </Button>
                <IconButton onClick={() => handleOpenModal(ficha)}>
                  <BorderColorOutlined
                    sx={{
                      backgroundColor: "#71277a",
                      p: 1,
                      fontSize: "30px",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  />
                </IconButton>
                <IconButton onClick={() => confirmarEliminacion(ficha)}>
                  <ContentCutOutlined
                    sx={{
                      backgroundColor: "red",
                      p: 1,
                      fontSize: "30px",
                      color: "white",
                      borderRadius: "5px",
                    }}
                  />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div>
      <SearchBarFichas
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        onSearch={onSearch}
      />

      {/* Renderizado condicional según el tamaño de pantalla */}
      {isMobile ? <MobileView /> : <DesktopView />}

      <ConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={eliminarFichaConfirmada}
        title="¿Estás seguro?"
        message={`¿Deseas eliminar la ficha N° ${fichaAEliminar?.numero_ficha}? Esta acción no se puede deshacer.`}
      />

      <Dialog
        open={isModalVisible}
        onClose={handleCloseModal}
        sx={{
          "& .MuiDialog-paper": { 
            width: isMobile ? "95%" : "400px", 
            maxWidth: isMobile ? "95%" : "90%",
            maxHeight: "96vh",
            overflow: "hidden",
            borderRadius: "12px",
            margin: isMobile ? "16px" : "32px"
          },
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(3px)"
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: isMobile ? '18px' : '20px' }}>
          {isEditing ? "Modificar Ficha" : "Nueva Ficha"}
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            flexGrow: 1,
            overflowY: "auto",
            paddingBottom: "16px",
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: isMobile ? 2 : 3
          }}
        >
          <TextField 
            placeholder="Número de ficha" 
            name="numero_ficha" 
            value={formData.numero_ficha} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                borderColor: "#bdbdbd",
                "&:hover fieldset": { borderColor: "#9c27b0" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              }
            }}
          />
          
          <TextField 
            placeholder="Nombre del programa" 
            name="nombre_programa" 
            value={formData.nombre_programa} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                borderColor: "#bdbdbd",
                "&:hover fieldset": { borderColor: "#9c27b0" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              }
            }}
          />
          
          <TextField 
            placeholder="Término del programa" 
            name="termino_programa" 
            value={formData.termino_programa} 
            onChange={handleChange} 
            fullWidth 
            margin="dense"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                borderColor: "#bdbdbd",
                "&:hover fieldset": { borderColor: "#9c27b0" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              }
            }}
          />

          <Select 
            name="archivar" 
            value={formData.archivar} 
            onChange={handleChange} 
            fullWidth 
            displayEmpty
            size={isMobile ? "small" : "medium"}
            sx={{
              borderRadius: "12px",
              mt: 1,
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7b1fa2" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9c27b0" }
            }}
          >
            <MenuItem value="" disabled>¿Archivar?</MenuItem>
            <MenuItem value="no" sx={{ color: "#9c27b0", fontWeight: "bold" }}>No</MenuItem>
            <MenuItem value="si" sx={{ color: "#9c27b0", fontWeight: "bold" }}>Sí</MenuItem>
          </Select>

          <TextField 
            type="date" 
            name="inicio_etapa_productiva" 
            value={formData.inicio_etapa_productiva} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
            InputLabelProps={{ shrink: true }}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                borderColor: "#bdbdbd",
                "&:hover fieldset": { borderColor: "#9c27b0" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              }
            }}
          />

          <TextField 
            type="date" 
            name="fin_etapa_productiva" 
            value={formData.fin_etapa_productiva} 
            onChange={handleChange} 
            fullWidth 
            margin="dense" 
            InputLabelProps={{ shrink: true }}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                borderColor: "#bdbdbd",
                "&:hover fieldset": { borderColor: "#9c27b0" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              }
            }}
          />

          <Select
            name="id_instructor"
            value={formData.id_instructor}
            onChange={handleChange}
            fullWidth
            displayEmpty
            size={isMobile ? "small" : "medium"}
            sx={{
              borderRadius: "12px",
              mt: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9c27b0" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9c27b0" }
            }}
          >
            <MenuItem value="" disabled>Selecciona un instructor</MenuItem>
            {instructores.map((inst) => (
              <MenuItem key={inst.id_usuario} value={inst.id_usuario}>
                {inst.nombre} {inst.apellido}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions sx={{ 
          padding: "16px", 
          justifyContent: "center",
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 0
        }}>
          <Button 
            onClick={handleCloseModal}
            fullWidth={isMobile}
            sx={{ 
              borderRadius: "12px", 
              color: "white",
              background: "linear-gradient(to right, #6a1b9a, #9c27b0, #6a1b9a)", 
              "&:hover": { background: "linear-gradient(to right, #4a0072, #7b1fa2, #4a0072)" },
              "&:active": { backgroundColor: "#4a0072" }
            }}
          >
            Cancelar
          </Button>

          <Button 
            onClick={handleSubmit} 
            variant="contained"
            fullWidth={isMobile}
            sx={{ 
              borderRadius: "12px", 
              color: "white",
              background: "linear-gradient(to right, #6a1b9a, #9c27b0, #6a1b9a)", 
              "&:hover": { background: "linear-gradient(to right, #4a0072, #7b1fa2, #4a0072)" },
              "&:active": { backgroundColor: "#4a0072" }
            }}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PAGINACIÓN RESPONSIVE */}
      <Box
        sx={{
          mt: 2,
          py: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? 0.5 : 1,
          backgroundColor: "white",
          borderRadius: 2,
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          px: isMobile ? 1 : 2
        }}
      >
        <IconButton 
          onClick={() => setCurrentPage(0)} 
          disabled={currentPage === 0} 
          sx={{ color: "#71277a" }}
          size={isMobile ? "small" : "medium"}
        >
          <FirstPage />
        </IconButton>
        <IconButton 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} 
          disabled={currentPage === 0} 
          sx={{ color: "#71277a" }}
          size={isMobile ? "small" : "medium"}
        >
          <KeyboardArrowLeft />
        </IconButton>

        {[...Array(totalPages)].map((_, i) => {
          // En móvil, mostrar solo página actual y adyacentes
          const showButton = isMobile 
            ? i >= currentPage - 1 && i <= currentPage + 1
            : i >= currentPage - 2 && i <= currentPage + 2;
            
          return showButton ? (
            <Button
              key={i}
              onClick={() => setCurrentPage(i)}
              variant={i === currentPage ? "contained" : "outlined"}
              size="small"
              sx={{
                minWidth: isMobile ? 28 : 32,
                px: isMobile ? 0.5 : 1,
                fontSize: isMobile ? '12px' : '14px',
                color: i === currentPage ? "white" : "#71277a",
                backgroundColor: i === currentPage ? "#71277a" : "transparent",
                borderColor: "#71277a",
                "&:hover": {
                  backgroundColor: "#71277a",
                  color: "white",
                },
              }}
            >
              {i + 1}
            </Button>
          ) : null
        })}

        <IconButton 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} 
          disabled={currentPage >= totalPages - 1} 
          sx={{ color: "#71277a" }}
          size={isMobile ? "small" : "medium"}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton 
          onClick={() => setCurrentPage(totalPages - 1)} 
          disabled={currentPage >= totalPages - 1} 
          sx={{ color: "#71277a" }}
          size={isMobile ? "small" : "medium"}
        >
          <LastPage />
        </IconButton>
      </Box>

      {/* BOTÓN FLOTANTE RESPONSIVE */}
      <Button
        variant="contained"
        onClick={() => handleOpenModal()}
        sx={{
          position: "fixed",
          bottom: isMobile ? 16 : 20,
          right: isMobile ? 16 : 20,
          backgroundColor: "#71277a",
          color: "white",
          "&:hover": { backgroundColor: "#5a1e61" },
          borderRadius: "50%",
          width: isMobile ? 50 : 56,
          height: isMobile ? 50 : 56,
          boxShadow: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "auto",
          zIndex: 1000
        }}
      >
        <Add sx={{ fontSize: isMobile ? 24 : 30 }} />
      </Button>
    </div>
  );
};

export default FichasTable;