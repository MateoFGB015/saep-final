//esta es una alerta general que puede ser reutilizable

import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ alerta, onClose }) => {
  return (
    <Snackbar
      open={alerta.open}
      autoHideDuration={3000}
      onClose={(_, reason) => {
        if (reason !== "clickaway") onClose();
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={alerta.severity} sx={{ width: "100%" }}>
        {alerta.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;