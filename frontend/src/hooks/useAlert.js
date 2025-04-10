import { useState } from "react";

const useAlert = () => {
  const [alerta, setAlerta] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setAlerta({
      open: true,
      message,
      severity,
    });
  };

  const closeAlert = () => {
    setAlerta((prev) => ({ ...prev, open: false }));
  };

  return { alerta, showAlert, closeAlert };
};

export default useAlert;