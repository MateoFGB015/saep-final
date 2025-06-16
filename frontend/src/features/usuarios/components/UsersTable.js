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
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import UserRow from "./UsersRow";

// Hook responsive con reinicio de página
const useResponsiveRows = (setCurrentPage) => {
  const [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage());

  function getRowsPerPage() {
    const width = window.innerWidth;
    return width >= 1400 ? 10 : 5; // PC: 10, Laptop/celular: 5
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

const UsersTable = ({ usuarios, onEdit, onDelete, currentPage, setCurrentPage }) => {
  const rowsPerPage = useResponsiveRows(setCurrentPage);
  const totalPages = Math.ceil(usuarios.length / rowsPerPage);

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
    const maxVisible = 5;
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
                 size="small"
                 sx={{
                   minWidth: 32,
                   px: 1,
                   color: i === currentPage ? 'white' : '#71277a',
                   backgroundColor: i === currentPage ? '#71277a' : 'transparent',
                   borderColor: '#71277a',
                   '&:hover': {
                     backgroundColor: '#71277a',
                   }
                 }}
               >
                 {i + 1}
               </Button>
      );
    }

    return pageButtons;
  };

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
          <Table>
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

      {/* Paginación afuera de la tabla */}
      <Box
        sx={{
          mt: { xs: 1, sm: 1 },       // menos margen en pantallas pequeñas
          py: { xs: 1, sm: 1 },       // menos padding vertical
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "white",
          borderRadius: 2,
          flexWrap: 'wrap',
          width: '100%',              // ajusta al ancho del contenedor
          maxWidth: '900px',          // opcional: evita que se estire demasiado
          margin: '0 auto'  
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
        
                  {renderPageNumbers()}
        
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
