const db = require('../config/db');

exports.crearNotificacion = (mensaje, tipo = 'general') => {
    const sql = 'INSERT INTO notificacion (mensaje, tipo) VALUES (?, ?)';
    db.query(sql, [mensaje, tipo], (err, result) => {
        if (err) {
            console.error('Error al guardar notificación:', err);
        } else {
            console.log('Notificación guardada:', mensaje);
        }
    });
};

exports.obtenerNotificaciones = (req, res) => {
    const sql = 'SELECT * FROM notificacion ORDER BY fecha_creacion DESC';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener notificaciones' });
        res.json(results);
    });
};
