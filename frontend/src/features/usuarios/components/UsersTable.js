import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Box,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  ContentCutOutlined,
} from "@mui/icons-material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import UserRow from "./UsersRow";

// Hook responsive con reinicio de página
const useResponsiveRows = (setCurrentPage) => {
  const [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage());

  function getRowsPerPage() {
    const width = window.innerWidth;
    if (width < 600) return 5; // Móvil: 5 tarjetas
    if (width < 950) return 8; // Tablet: 8 filas
    if( width < 1400) return 5; // Pantallas medianas: 5 filas
    return 10; // PC: 10 filas
  }

  useEffect(() => {
    const updateRows = () => {
      const newRows = getRowsPerPage();
      setRowsPerPage((prev) => {
        if (prev !== newRows) {
          setCurrentPage(0); // Reiniciar a página 0 si cambia
        }
        return newRows;
      });
    };

    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, [setCurrentPage]);

  return rowsPerPage;
};

// Componente de tarjeta para móvil
const UserCard = ({ usuario, onEdit, onDelete }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(usuario.id_usuario);
    }
  };

  return (
    <Card sx={{ 
      mb: 2, 
      borderRadius: 3,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e0e0e0'
    }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ 
          color: '#71277a', 
          fontWeight: 'bold',
          fontSize: '16px',
          mb: 1
        }}>
          {usuario.nombre} {usuario.apellido}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
            <strong>Rol:</strong> {usuario.rol}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            <strong>N° Documento:</strong> {usuario.numero_documento}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 1,
          pt: 1,
          borderTop: '1px solid #f0f0f0'
        }}>
          <IconButton 
            onClick={() => onEdit(usuario)} 
            sx={{ 
              color: "#71277a",
              p: 0.5
            }}
            size="small"
          >
            <BorderColorOutlinedIcon sx={{ 
              fontSize: 24, 
              backgroundColor: "#71277a",
              p: 0.7, 
              color: "white",
              borderRadius: "6px" 
            }} />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={() => onDelete(usuario.id_usuario)}
            sx={{ 
              color: "red",
              p: 0.5
            }}
          >
            <ContentCutOutlined sx={{
              backgroundColor:"red", 
              p: 0.7,
              fontSize: "24px",
              color:"white",
              borderRadius:"6px"
            }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const UsersTable = ({ usuarios, onEdit, onDelete, currentPage, setCurrentPage }) => {
  const rowsPerPage = useResponsiveRows(setCurrentPage);
  const totalPages = Math.ceil(usuarios.length / rowsPerPage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const visibleRows = usuarios.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleDeleteUser = (idUsuario) => {
    if (onDelete) {
      onDelete(idUsuario);
    }
  };

  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisible = isMobile ? 3 : 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(0, endPage - maxVisible);
    }

    for (let i = startPage; i < endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          onClick={() => setCurrentPage(i)}
          variant={i === currentPage ? "contained" : "outlined"}
          size={isMobile ? "small" : "medium"}
          sx={{
            minWidth: { xs: 32, sm: 36 },
            px: { xs: 0.5, sm: 1 },
            fontSize: { xs: "13px", sm: "14px" },
            color: i === currentPage ? 'white' : '#71277a',
            backgroundColor: i === currentPage ? '#71277a' : 'transparent',
            borderColor: '#71277a',
            '&:hover': {
              backgroundColor: '#71277a',
              color: 'white'
            }
          }}
        >
          {i + 1}
        </Button>
      );
    }

    return pageButtons;
  };

  // Vista móvil con tarjetas
  if (isMobile) {
    return (
      <>
        <Box sx={{ px: 1 }}>
          {visibleRows.map((usuario) => (
            <UserCard
              key={usuario.id_usuario}
              usuario={usuario}
              onEdit={onEdit}
              onDelete={handleDeleteUser}
            />
          ))}
        </Box>

        {/* Paginación para móvil */}
        <Box
          sx={{
            mt: 2,
            py: 1,
            px: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.5,
            backgroundColor: "white",
            borderRadius: 2,
            flexWrap: 'wrap',
            width: '100%',
            margin: '16px auto 0',
          }}
        >
          <IconButton
            onClick={() => handleChangePage(null, 0)}
            disabled={currentPage === 0}
            sx={{ color: "#71277a", p: 0.5 }}
            size="small"
          >
            <FirstPage fontSize="small" />
          </IconButton>
          
          <IconButton
            onClick={() => handleChangePage(null, currentPage - 1)}
            disabled={currentPage === 0}
            sx={{ color: "#71277a", p: 0.5 }}
            size="small"
          >
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          <Box sx={{ 
            display: 'flex', 
            gap: 0.25,
            alignItems: 'center',
            flexWrap: 'nowrap',
          }}>
            {renderPageNumbers()}
          </Box>

          <IconButton
            onClick={() => handleChangePage(null, currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            sx={{ color: "#71277a", p: 0.5 }}
            size="small"
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>
          
          <IconButton
            onClick={() => handleChangePage(null, totalPages - 1)}
            disabled={currentPage >= totalPages - 1}
            sx={{ color: "#71277a", p: 0.5 }}
            size="small"
          >
            <LastPage fontSize="small" />
          </IconButton>
        </Box>
      </>
    );
  }

  // Vista de escritorio con tabla (sin cambios)
  return (
    <>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          border: "1px solid #ddd",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f0f0f0" }}>
                <TableCell sx={headerStyle}>Nombre</TableCell>
                <TableCell sx={headerStyle}>Apellido</TableCell>
                <TableCell sx={headerStyle}>Rol</TableCell>
                <TableCell sx={headerStyle}>N° Documento</TableCell>
                <TableCell sx={headerStyle}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((usuario, index) => (
                <UserRow
                  key={usuario.id_usuario}
                  usuario={usuario}
                  onEdit={onEdit}
                  onDelete={handleDeleteUser}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Paginación de escritorio */}
      <Box
        sx={{
          mt: 1,
          py: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "white",
          borderRadius: 2,
          flexWrap: 'wrap',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <IconButton
          onClick={() => handleChangePage(null, 0)}
          disabled={currentPage === 0}
          sx={{ color: "#71277a" }}
        >
          <FirstPage />
        </IconButton>
        
        <IconButton
          onClick={() => handleChangePage(null, currentPage - 1)}
          disabled={currentPage === 0}
          sx={{ color: "#71277a" }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <Box sx={{ 
          display: 'flex', 
          gap: 0.5,
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}>
          {renderPageNumbers()}
        </Box>

        <IconButton
          onClick={() => handleChangePage(null, currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          sx={{ color: "#71277a" }}
        >
          <KeyboardArrowRight />
        </IconButton>
        
        <IconButton
          onClick={() => handleChangePage(null, totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          sx={{ color: "#71277a" }}
        >
          <LastPage />
        </IconButton>
      </Box>
    </>
  );
};

const headerStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  color: "#333",
  textAlign: "center",
};

export default UsersTable;
