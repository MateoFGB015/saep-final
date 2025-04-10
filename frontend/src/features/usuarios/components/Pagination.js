import React from "react";
import { Box, IconButton, TablePagination } from "@mui/material";
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@mui/icons-material";

const Pagination = ({ total, currentPage, onPageChange, pageSize }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
      <TablePagination
        rowsPerPageOptions={[]} // 👈 Evita cambiar el número de filas por página
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={(event, newPage) => onPageChange(newPage)}
        ActionsComponent={() => (
          <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={() => onPageChange(0)} disabled={currentPage === 0}>
              <FirstPage />
            </IconButton>
            <IconButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(total / pageSize) - 1}
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              onClick={() => onPageChange(Math.max(0, Math.ceil(total / pageSize) - 1))}
              disabled={currentPage >= Math.ceil(total / pageSize) - 1}
            >
              <LastPage />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

export default Pagination;
