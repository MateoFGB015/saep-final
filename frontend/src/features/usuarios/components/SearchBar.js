import React from "react";
import { TextField, InputAdornment, MenuItem, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ searchTerm, setSearchTerm, filterType, setFilterType, onSearch }) => {
  return (
    <>
      {/* 🔥 Título de la lista de usuarios */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#71277a",
          mb: 1,
          textAlign: "center",
        }}
      >
        Lista de Usuarios
      </Typography>

      {/* Barra de búsqueda con filtros */}
      <Box
        display="flex"
        justifyContent="center"    // 👈 Centra horizontalmente
        mb={2}
        flexWrap="wrap"
        width="100%"               // 👈 Asegura que ocupe todo el ancho del contenedor padre
      >
        <Box
          display="flex"
          gap={2}
          maxWidth={800}
          width="100%"
          flexWrap="wrap"
          justifyContent="center" // 👈 Para que el input y el filtro estén centrados entre sí
        >
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
                  sx={{ cursor: "pointer" }}
                  onClick={onSearch}
                >
                  <SearchIcon sx={{ color: "gray" }} />
                </InputAdornment>
              ),
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
              minWidth: 150,
              backgroundColor: "white",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
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
      </Box>
    </>
  );
};

export default SearchBar;
