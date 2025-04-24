const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la ruta de la carpeta y asegurar que sea consistente en toda la aplicación
const uploadDir = path.join(__dirname, '../uploads/documentos'); // Elige uno: "documentos" o "Documentos"

// Crear la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Carpeta de uploads creada:', uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB, nota: tu comentario dice 10 MB pero el valor es 20 MB
  }
});

module.exports = upload;