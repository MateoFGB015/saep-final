//este es el modal de confirmacion de alguna accion y puede ser reutilizable

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';


const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={{ textAlign: "center", "& .MuiDialog-paper": { maxWidth: "350px", width: "90%", p:1, borderRadius:"10px" } }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", textAlign: "center" }}>
        <ErrorOutlineIcon sx={{ fontSize: 70, color: "red" }} />
        <br />
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 1 }}>
      <Button onClick={onConfirm} sx={{ backgroundColor: "#71277a", color: "white"}}>
          Confirmar
        </Button>
        <Button onClick={onClose} sx={{ color: "#71277a",border:"1px solid #71277a"}}>
          Cancelar
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;