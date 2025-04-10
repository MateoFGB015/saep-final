//aqui esta especificamente la barra de busqueda con el apartado de filtros

import React from "react";
import { TextField, InputAdornment, MenuItem, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, setSearchTerm, filterType, setFilterType, onSearch }) => {
  return (
    <Box display="flex" gap={2} mb={3} maxWidth={800}>

      {/* Input de Búsqueda */}
      <TextField
      variant="outlined"
      placeholder="Buscar usuario..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        flexGrow: 1,
        borderRadius: "10px",
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#ccc" },
          "&:hover fieldset": { borderColor: "#ccc" },
          "&.Mui-focused fieldset": { borderColor: "#71277a" },
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              cursor: "pointer",
            }}
            onClick={onSearch}
          >
            <SearchIcon sx={{ color: "#gray" }} />
          </InputAdornment>
        ),
      }}
    />


<TextField
  select
  label="Filtrar por"
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  variant="outlined"
  sx={{
    minWidth: 150,
    backgroundColor: "white",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ccc" }, // Borde normal
      "&:hover fieldset": { borderColor: "#ccc" }, // Borde al pasar el mouse
      "&.Mui-focused fieldset": { borderColor: "#71277a" }, // Borde morado al seleccionar
    },
    "& .MuiInputLabel-root": { color: "#aaa" }, // Color del label por defecto
    "& .MuiInputLabel-root.Mui-focused": { color: "#71277a" }, // Label morado al seleccionar
  }}
>
  <MenuItem value="nombre">Nombre</MenuItem>
  <MenuItem value="numero_documento">Número de Documento</MenuItem>
  <MenuItem value="rol">Rol</MenuItem>
</TextField>




      {/* Botón de Buscar */}
      {/* <Button
        variant="contained"
        color="#71277a"
        onClick={onSearch}
        sx={{ borderRadius: "10px", textTransform: "none" }}
      >
        Buscar
      </Button> */}
    </Box>
  );
};

export default SearchBar;
