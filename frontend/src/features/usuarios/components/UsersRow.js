import React, { useState } from "react";
import { TableRow, TableCell, IconButton} from "@mui/material";
import { ContentCutOutlined } from "@mui/icons-material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import useAlert from "../hooks/UserAlert";
import CustomSnackbar from "../../../components/ui/Alert";
import ConfirmDialog from "../../../components/ui/ModalConfirmacion";

const UserRow = ({ usuario, onEdit, onDelete }) => {
  const { alerta, showAlert, closeAlert } = useAlert();
  const [openConfirm, setOpenConfirm] = useState(false);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = () => {
    if (onDelete) {
      onDelete(usuario.id_usuario); // ✅ Ahora el padre controla la eliminación
    } else {
      showAlert("No se pudo eliminar el usuario. Acción no disponible.", "error");
    }
  };

  return (
    <>
      <TableRow sx={{ 
        height: { xs: "50px", sm: "60px" }, 
        "&:hover": { backgroundColor: "#f5f5f5" } 
      }}>
        <TableCell sx={{ 
          padding: { xs: "4px", sm: "6px" }, 
          textAlign: "center",
          fontSize: { xs: "11px", sm: "14px" },
          minWidth: { xs: "70px", sm: "auto" }
        }}>
          {usuario.nombre}
        </TableCell>
        <TableCell sx={{ 
          padding: { xs: "4px", sm: "6px" }, 
          textAlign: "center",
          fontSize: { xs: "11px", sm: "14px" },
          minWidth: { xs: "70px", sm: "auto" }
        }}>
          {usuario.apellido}
        </TableCell>
        <TableCell sx={{ 
          padding: { xs: "2px", sm: "6px" }, 
          textAlign: "center",
          fontSize: { xs: "10px", sm: "14px" },
          minWidth: { xs: "50px", sm: "auto" }
        }}>
          {usuario.rol}
        </TableCell>
        <TableCell sx={{ 
          padding: { xs: "2px", sm: "6px" }, 
          textAlign: "center",
          fontSize: { xs: "10px", sm: "14px" },
          minWidth: { xs: "90px", sm: "auto" }
        }}>
          {usuario.numero_documento}
        </TableCell>
        <TableCell align="center" sx={{ 
          padding: { xs: "2px", sm: "6px" },
          minWidth: { xs: "100px", sm: "auto" }
        }}>
          <IconButton 
            onClick={() => onEdit(usuario)} 
            sx={{ 
              color: "#71277a",
              p: { xs: 0.3, sm: 1 },
              mr: { xs: 0.5, sm: 1 }
            }}
            size="small"
          >
            <BorderColorOutlinedIcon sx={{ 
              fontSize: { xs: 20, sm: 30 }, 
              backgroundColor: "#71277a",
              p: { xs: 0.4, sm: 1 }, 
              color: "white",
              borderRadius: "5px" 
            }} />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setOpenConfirm(true)} 
            sx={{ 
              color: "red",
              p: { xs: 0.3, sm: 1 }
            }}
          >
            <ContentCutOutlined sx={{
              backgroundColor:"red", 
              p: { xs: 0.4, sm: 1 },
              fontSize: { xs: "20px", sm: "30px" },
              color:"white",
              borderRadius:"5px"
            }} />
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
        message={`Esta acción deshabilitará a ${usuario.nombre} de la base de datos. ¿Desea continuar?`}
      />

      {/* Snackbar para mostrar alertas */}
      <CustomSnackbar alerta={alerta} onClose={closeAlert} />
    </>
  );
};

export default UserRow;
