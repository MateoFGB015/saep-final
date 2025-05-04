import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import ConfirmDialog from "../../components/ui/ModalConfirmacion";
import { useNavigate } from "react-router-dom";
import { 
  Button, TextField, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, 
  DialogTitle, Select, MenuItem, IconButton
} from "@mui/material";
import {BorderColorOutlined, ContentCutOutlined, Add} from '@mui/icons-material';

const FichasTable = () => {
  const [fichas, setFichas] = useState([]);
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
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

  useEffect(() => {
    if(user) {
      fetchFichas();
    }
    
  }, [user]);

  const fetchFichas = async () => {
    try {
      const token = localStorage.getItem("token");
  
      const endpoint =
        user.rol === "Instructor"
          ? "http://localhost:3000/fichas/instructor"
          : "http://localhost:3000/fichas/ver";
  
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
      await axios.delete(`http://localhost:3000/fichas/eliminar/${fichaAEliminar.id_ficha}`);
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
        await axios.put(`http://localhost:3000/fichas/modificar/${formData.id_ficha}`, formData);
      } else {
        await axios.post("http://localhost:3000/fichas", formData);
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
      const response = await axios.get("http://localhost:3000/usuarios/instructores");
      setInstructores(response.data);
    } catch (error) {
      console.error("Error al obtener instructores:", error);
    }
  };

  fetchInstructores();
}, []);

  return (
    <div>
  <TextField
  placeholder="Buscar Número de Ficha"
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
  fullWidth
  margin="normal"
  variant="outlined"  // Aseguramos que se use el variant outlined
  sx={{
    width: "1100px",
    margin: "20px auto",
    borderRadius: "20px",
    backgroundColor: "#f2f2f2",
    // Personalizamos el estilo del contenedor del input
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // Borde negro por defecto
      },
      '&:hover fieldset': {
        borderColor: 'white', // Borde negro al hacer hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'purple', borderRadius:'20px' // Borde morado al enfocar el input
      },
    },
  }}
/>

<Button
      variant="contained"
      sx={{
        backgroundColor: '#792382',  // morado similar al de la imagen
        borderRadius: '20px',        // bordes redondeados
        textTransform: 'none',       // evitar mayúsculas automáticas
        fontWeight: 'bold',
        padding: '6px 16px',
        '&:hover': {
          backgroundColor: '#5e1b65', // tono más oscuro al pasar mouse
        },
      }}
    >
      Generar reporte de ficha
    </Button>
    
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
            <TableRow>
              <TableCell sx={{ backgroundColor:"#f2f2f2"}}>Nombre del Programa</TableCell>
              <TableCell sx={{ backgroundColor:"#f2f2f2"}}>Término del Programa</TableCell>
              <TableCell sx={{ backgroundColor:"#f2f2f2"}}>N° Ficha</TableCell>
              <TableCell sx={{ backgroundColor:"#f2f2f2"}}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ "& .MuiTableCell-root": { textAlign: "center" } }}>
  {fichas.map((ficha, index) => (
    <TableRow 
      key={ficha.id_ficha} 
      sx={{ backgroundColor: index % 2 === 0 ? "white" : "#f2f2f2" }} // Alterna colores
    >
      <TableCell>{ficha.nombre_programa}</TableCell>
      <TableCell>{ficha.termino_programa}</TableCell>
      <TableCell>{ficha.numero_ficha}</TableCell>
      <TableCell>
        <Button
          sx={{ border: "1px solid #71277a", color: "#71277a", fontSize: "10px", borderRadius: "5px" }}
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
                    <ContentCutOutlined sx={{ backgroundColor: "red", p: 1, fontSize: "30px", color: "white", borderRadius: "5px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
</Table>
      </TableContainer>

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
      width: "400px", 
      maxWidth: "90%",
      maxHeight: "96vh", // Un poco más alto, pero no demasiado
      overflow: "hidden",
      borderRadius: "12px"
    },
    "& .MuiBackdrop-root": {
      backdropFilter: "blur(3px)"
    }
  }}
>
<DialogTitle sx={{ textAlign: 'center' }}>
    {isEditing ? "Modificar Ficha" : "Nueva Ficha"}
  </DialogTitle>
  
  <DialogContent 
    sx={{ 
      flexGrow: 1,
      overflowY: "auto",
      paddingBottom: "16px",
      scrollbarWidth: "none",
      "-ms-overflow-style": "none",
      "&::-webkit-scrollbar": { display: "none" }
    }}
  >
    {/*Estilos de los input  */}
    <TextField placeholder="Número de ficha" name="numero_ficha" value={formData.numero_ficha} onChange={handleChange} fullWidth margin="dense" 
      sx={{ 
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          borderColor: "#bdbdbd",
          "&:hover fieldset": { borderColor: "#9c27b0" },
          "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
        }
      }}
    />
    
    <TextField placeholder="Nombre del programa" name="nombre_programa" value={formData.nombre_programa} onChange={handleChange} fullWidth margin="dense" 
      sx={{ 
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          borderColor: "#bdbdbd",
          "&:hover fieldset": { borderColor: "#9c27b0" },
          "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
        }
      }}
    />
    
    <TextField placeholder="Término del programa" name="termino_programa" value={formData.termino_programa} onChange={handleChange} fullWidth margin="dense" 
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
  sx={{
    borderRadius: "12px",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#7b1fa2" }, // 🔹 Morado más oscuro al pasar el mouse
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#9c27b0" } // 🔹 Morado intenso al enfocar
  }}
>
  <MenuItem value="" disabled>¿Archivar?</MenuItem>
  <MenuItem value="no" sx={{ color: "#9c27b0", fontWeight: "bold" }}>No</MenuItem>
  <MenuItem value="si" sx={{ color: "#9c27b0", fontWeight: "bold" }}>Sí</MenuItem>
</Select>

    <TextField type="date" name="inicio_etapa_productiva" value={formData.inicio_etapa_productiva} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }}
      sx={{ 
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          borderColor: "#bdbdbd",
          "&:hover fieldset": { borderColor: "#9c27b0" },
          "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
        }
      }}
    />

    <TextField type="date" name="fin_etapa_productiva" value={formData.fin_etapa_productiva} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }}
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

  <DialogActions sx={{ padding: "16px", justifyContent: "center" }}>
    <Button 
      onClick={handleCloseModal} 
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




      <Button
  variant="contained"
  onClick={() => handleOpenModal()}
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
    </div>
  );
};

export default FichasTable;