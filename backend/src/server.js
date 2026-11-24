require('dotenv').config();
const connectDB = require('./config/db');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('Define JWT_SECRET (mínimo 16 caracteres) en el archivo .env');
  process.exit(1);
}

const app = require('./app');
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`API EcoHuertos en http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  });
