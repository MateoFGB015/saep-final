const app = require('./app');
require('dotenv').config();
require('./models/asociaciones'); // 🔄 Esto conecta todas las relaciones


const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Bienvenido al servidor SAEP');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
