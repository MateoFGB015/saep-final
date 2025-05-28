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
} from "@mui/material";
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from "@mui/icons-material";
import UserRow from "./UsersRow";

const useResponsiveRows = () => {
  const [rowsPerPage, setRowsPerPage] = useState(getRowsPerPage());

  function getRowsPerPage() {
    const width = window.innerWidth;
    return width >= 1400 ? 10 : 5;
  }

  useEffect(() => {
    const updateRows = () => {
      setRowsPerPage(getRowsPerPage());
    };

    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  return rowsPerPage;
};

const UsersTable = ({ usuarios, onEdit, onDelete, currentPage, setCurrentPage }) => {
  const rowsPerPage = useResponsiveRows();
  const totalPages = Math.ceil(usuarios.length / rowsPerPage);
  const isMobile = useMediaQuery("(max-width:600px)");

  const visibleRows = usuarios.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
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
          variant={i === currentPage ? "contained" : "text"}
          size="small"
          onClick={() => handleChangePage(null, i)}
          sx={{
            minWidth: 32,
            mx: 0.5,
            color: i === currentPage ? "white" : "#71277a",
            backgroundColor: i === currentPage ? "#71277a" : "transparent",
            "&:hover": {
              backgroundColor: i === currentPage ? "#5e2062" : "#f3e5f5",
            },
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
      <Paper elevation={4} sx={{ borderRadius: 2, border: "1px solid #ddd", overflow: "hidden" }}>
        {isMobile ? (
          // Vista tipo tarjeta para celular
          <Box p={2}>
            {visibleRows.map((usuario, index) => (
              <UserRow
                key={usuario.id_usuario}
                usuario={usuario}
                onEdit={onEdit}
                onDelete={onDelete}
                isMobile
              />
            ))}
          </Box>
        ) : (
          // Vista tabla para pantallas más grandes
          <TableContainer sx={{ overflowX: "auto" }}>
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
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Paginación */}
      <Box
        sx={{
          mt: 2,
          py: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          backgroundColor: "white",
          borderRadius: 2,
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