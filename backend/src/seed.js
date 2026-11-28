// Crea usuarios de prueba (uno por rol) y datos de ejemplo. Es seguro ejecutarlo varias veces.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Huerta = require('./models/Huerta');
const Guia = require('./models/Guia');

async function crearUsuario(datos) {
  let user = await User.findOne({ email: datos.email });
  if (user) {
    console.log(`- ya existía: ${datos.email}`);
  } else {
    user = await User.create(datos);
    console.log(`- creado: ${datos.email} (${datos.role})`);
  }
  return user;
}

(async () => {
  await connectDB();

  const admin = await crearUsuario({
    nombres: 'Admin', apellidos: 'EcoHuertos', username: 'admin',
    email: 'admin@ecohuertos.test', password: process.env.SEED_ADMIN_PASSWORD || 'Admin12345', role: 'admin',
  });
  const usuario = await crearUsuario({
    nombres: 'Vecina', apellidos: 'De Prueba', username: 'vecina',
    email: 'usuario@ecohuertos.test', password: process.env.SEED_USER_PASSWORD || 'Usuario12345', role: 'usuario',
  });

  if ((await Huerta.countDocuments()) === 0) {
    await Huerta.create({
      nombre: 'Huerta La Esperanza', descripcion: 'Huerta comunitaria del barrio.', ciudad: 'Cali',
      barrio: 'San Antonio', tipo: 'comunitaria', cultivos: ['lechuga', 'tomate', 'cilantro'], areaM2: 40,
      propietario: usuario._id,
    });
    console.log('- huerta de ejemplo creada');
  }
  if ((await Guia.countDocuments()) === 0) {
    await Guia.create({
      titulo: 'Cómo preparar el suelo de tu huerta', categoria: 'suelo',
      resumen: 'Pasos básicos para tener una tierra fértil.',
      contenido: 'Retira piedras y malezas, afloja la tierra y mezcla compost maduro antes de sembrar.',
      autor: admin._id,
    });
    console.log('- guía de ejemplo creada');
  }

  await mongoose.disconnect();
  console.log('Seed terminado');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
