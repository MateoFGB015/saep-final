import React from "react";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import UserRow from "./UsersRow";

const UsersTable = ({ usuarios, onEdit, onDelete, currentPage, setCurrentPage }) => {
  const rowsPerPage = 6;

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // 🔹 Asegurar que la eliminación actualiza el estado
  const handleDeleteUser = (idUsuario) => {
    if (onDelete) {
      onDelete(idUsuario);
    }
  };

  const visibleRows = usuarios.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ boxShadow: 3, borderRadius: 3, overflow: "hidden", border: "1px solid #ddd" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f0f0" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>N° Documento</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "14px", color: "#333", textAlign: "center" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((usuario, index) => (
              <UserRow
                key={usuario.id_usuario}
                usuario={usuario}
                onEdit={onEdit}
                onDelete={handleDeleteUser} // 🔹 Asegurar que `onDelete` está definido correctamente
                sx={{
                  bgcolor: index % 2 === 0 ? "white" : "#f9f9f9",
                  "&:hover": { bgcolor: "#e1f5fe" },
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={usuarios.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[]}
        sx={{
          bgcolor: "#f8f8f8",
          color: "#555",
          fontSize: "14px",
          borderTop: "1px solid #ddd",
        }}
      />
    </Paper>
  );
};

export default UsersTable;
