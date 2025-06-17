
import React from "react";
import { TextField, InputAdornment, MenuItem, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBarFichas = ({ searchTerm, setSearchTerm, filterType, setFilterType, onSearch }) => {
  return (
    <>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#71277a",
          mb: 1,
          textAlign: "center",
        }}
      >
        Lista de Fichas
      </Typography>

      <Box display="flex" justifyContent="center" mb={2} flexWrap="wrap" width="100%">
        <Box display="flex" gap={2} maxWidth={800} width="100%" flexWrap="wrap" justifyContent="center">
          <TextField
            variant="outlined"
            placeholder="Buscar ficha..."
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
                <InputAdornment position="end" sx={{ cursor: "pointer" }} onClick={onSearch}>
                  <SearchIcon sx={{ color: "gray" }} />
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
              minWidth: 180,
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
            <MenuItem value="numero_ficha">Número de Ficha</MenuItem>
            <MenuItem value="nombre_programa">Nombre del Programa</MenuItem>
            <MenuItem value="termino_programa">Término del Programa</MenuItem>
          </TextField>
        </Box>
      </Box>
    </>
  );
};

export default SearchBarFichas;
