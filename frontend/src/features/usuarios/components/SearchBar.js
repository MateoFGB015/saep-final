import React, { useEffect } from "react";
import { TextField, MenuItem, Box } from "@mui/material";

const SearchBar = ({ searchTerm, setSearchTerm, filterType, setFilterType, onSearch }) => {
  // Ejecutar búsqueda automáticamente al cambiar texto o filtro
  useEffect(() => {
    onSearch();
  }, [searchTerm, filterType]);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={2}
      mb={3}
      width="100%"
      maxWidth={800}
    >
      {/* Input de Búsqueda sin lupa */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar usuario..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": { borderColor: "#ccc" },
            "&:hover fieldset": { borderColor: "#ccc" },
            "&.Mui-focused fieldset": { borderColor: "#71277a" },
          },
        }}
      />

      {/* Select de Filtros */}
      <TextField
        select
        label="Filtrar por"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        variant="outlined"
        sx={{
          minWidth: { xs: "100%", sm: 150 },
          backgroundColor: "white",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            "& fieldset": { borderColor: "#ccc" },
            "&:hover fieldset": { borderColor: "#ccc" },
            "&.Mui-focused fieldset": { borderColor: "#71277a" },
          },
          "& .MuiInputLabel-root": { color: "#aaa" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#71277a" },
        }}
      >
        <MenuItem value="nombre">Nombre</MenuItem>
        <MenuItem value="numero_documento">Número de Documento</MenuItem>
        <MenuItem value="rol">Rol</MenuItem>
      </TextField>
    </Box>
  );
};

export default SearchBar;
