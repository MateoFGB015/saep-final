const app = require('./app');
require('dotenv').config();
require('./models/asociaciones'); // 🔄 Esto conecta todas las relaciones


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
