const multer = require('multer');
const path = require('path');

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/bitacoras'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombre = `bitacora_${Date.now()}${ext}`;
    cb(null, nombre);
  }
});

// Filtro de archivos 
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /pdf|doc|docx|xls|xlsx/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (tiposPermitidos.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Máx 5MB
});

module.exports = upload;
