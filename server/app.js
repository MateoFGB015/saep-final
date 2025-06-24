const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const autenticacionRoutes = require('./routes/autenticacionRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const AgendamientoRoutes = require('./routes/AgendamientoRoutes')
const fichasRoutes = require('./routes/fichasRoutes');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
const notificacionRoutes = require('./routes/notificacionRoutes');
const fichasaprendizRoutes = require('./routes/FichaAprendizRoutes');
const ObservacionRoutes = require('./routes/ObservacionRoutes');
const DocumentosRoutes = require('./routes/DocumentosRoutes');
const ReportesRoutes = require('./routes/ReportesRoutes');
const programasRoutes = require('./routes/programas');
const path = require('path');

require('dotenv').config();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

app.use('/inicio', autenticacionRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/fichas', fichasRoutes);
app.use('/agendamiento',AgendamientoRoutes);
app.use('/bitacora', bitacoraRoutes );
app.use('/notificacion', notificacionRoutes);
app.use('/fichasAprendiz', fichasaprendizRoutes);
app.use('/observacion', ObservacionRoutes);
app.use('/documentos', DocumentosRoutes);
app.use('/reportes', ReportesRoutes);
app.use('/programas', programasRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
