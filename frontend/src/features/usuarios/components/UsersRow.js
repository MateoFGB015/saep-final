import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Paper,
  useMediaQuery,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { ContentCutOutlined } from "@mui/icons-material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import usersAPI from "../../../api/UsersAPI";
import useAlert from "../hooks/UserAlert";
import CustomSnackbar from "../../../components/ui/Alert";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";

const UserRow = ({ usuario, onEdit, onDelete }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [openConfirm, setOpenConfirm] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("No tienes permisos para realizar esta acción.", "error");
        return;
      }

      const response = await usersAPI.eliminarUsuario(usuario.id_usuario, token);
      if (response.message === "Usuario desactivado correctamente") {
        showAlert("Usuario eliminado exitosamente.", "success");
        if (onDelete) onDelete(usuario.id_usuario);
      } else {
        showAlert(response.message || "Hubo un problema al eliminar el usuario.", "warning");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error inesperado al eliminar usuario.";
      showAlert(errorMessage, "error");
    }
  };

  // 📱 MODO TARJETA EN MÓVIL
  if (isMobile) {
    return (
      <>
        <Paper
          elevation={3}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 3,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Nombre: <span style={{ fontWeight: 400 }}>{usuario.nombre}</span>
          </Typography>
          <Typography variant="body2">
            <strong>Apellido:</strong> {usuario.apellido}
          </Typography>
          <Typography variant="body2">
            <strong>Rol:</strong> {usuario.rol}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>N° Documento:</strong> {usuario.numero_documento}
          </Typography>

          <Stack direction="row" spacing={1} mt={2}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<BorderColorOutlinedIcon />}
              onClick={() => onEdit(usuario)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<ContentCutOutlined />}
              onClick={() => setOpenConfirm(true)}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Eliminar
            </Button>
          </Stack>
        </Paper>

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={() => {
            setOpenConfirm(false);
            handleDelete();
          }}
          title="¡Alerta!"
          message={`Esta acción deshabilitará a ${usuario.nombre} de la base de datos. ¿Desea continuar?`}
        />

        <CustomSnackbar alerta={alerta} onClose={closeAlert} />
      </>
    );
  }

  // 🖥️ MODO TABLA EN ESCRITORIO
  return (
    <>
      <TableRow sx={{ height: "60px", "&:hover": { backgroundColor: "#f5f5f5" } }}>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.nombre}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.apellido}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.rol}</TableCell>
        <TableCell sx={{ padding: "6px", textAlign: "center" }}>{usuario.numero_documento}</TableCell>
        <TableCell align="center" sx={{ padding: "6px" }}>
          <Tooltip title="Modificar" arrow>
            <IconButton onClick={() => onEdit(usuario)} sx={{ color: "#71277a" }}>
              <BorderColorOutlinedIcon
                sx={{
                  fontSize: 30,
                  backgroundColor: "#71277a",
                  p: 1,
                  color: "white",
                  borderRadius: "5px",
                }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar" arrow >
            <IconButton
              size="small"
              onClick={() => setOpenConfirm(true)}
              sx={{ color: "red", ml: 1 }}
            >
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
          </Tooltip>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          handleDelete();
        }}
        title="¡Alerta!"
        message={`Esta acción deshabilitará a ${usuario.nombre} de la base de datos. ¿Desea continuar?`}
      />

      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserRow;