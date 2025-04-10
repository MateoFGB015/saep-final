import React, { useState } from "react";
import { TableRow, TableCell, IconButton } from "@mui/material";
import { EditNote, ContentCutOutlined } from "@mui/icons-material";
import usersAPI from "../../../api/UsersAPI";
import useAlert from "../hooks/UserAlert";
import CustomSnackbar from "../../../components/ui/Alert";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";

const UserRow = ({ usuario, onEdit, onDelete }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("No tienes permisos para realizar esta acción.", "error");
        return;
      }

      const response = await usersAPI.eliminarUsuario(usuario.id_usuario, token);
      console.log("Respuesta de la API:", response);

      if (response.message === "Usuario desactivado correctamente") {
        showAlert("Usuario eliminado exitosamente.", "success");

        if (onDelete) {
          onDelete(usuario.id_usuario);
        } else {
          console.warn("onDelete no está definido en UsersTable.");
        }
      } else {
        showAlert(response.message || "Hubo un problema al eliminar el usuario.", "warning");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      const errorMessage = error.response?.data?.message || "Error inesperado al eliminar usuario.";
      showAlert(errorMessage, "error");
    }
  };

  return (
    <>
      <TableRow sx={{ height: "60px", "&:hover": { backgroundColor: "#f5f5f5" } }}>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.nombre}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.apellido}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.rol}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.numero_documento}</TableCell>
        <TableCell align="center" sx={{ padding: "6px" }}>
          <IconButton onClick={() => onEdit(usuario)} sx={{ color: "#71277a" }}>
            <EditNote sx={{ fontSize: 26 }} />
          </IconButton>
          <IconButton size="small" onClick={() => setOpenConfirm(true)} sx={{ color: "red"}}>
            <ContentCutOutlined sx={{backgroundColor:"red", p:1,fontSize:"30px",color:"white",borderRadius:"5px"}}></ContentCutOutlined>
          </IconButton>
        </TableCell>
      </TableRow>

      {/* 🔹 Modal de confirmación */}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          handleDelete();
        }}
        title="¡Alerta!"
        message={`Esta accion deshabilitara a ${usuario.nombre} de la base de datos ¿Desea continuar?`}
      />

      {/* Snackbar para mostrar alertas */}
      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserRow;