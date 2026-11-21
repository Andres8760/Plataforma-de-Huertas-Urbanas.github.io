const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  autor: { type: String, required: true, trim: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

const threadSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  autor: { type: String, required: true, trim: true },
  categoria: { 
    type: String, 
    enum: ['Compostaje', 'Control de Plagas', 'Siembra Urbana', 'Riego', 'General'],
    default: 'General'
  },
  contenido: { type: String, required: true },
  respuestas: [replySchema],
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Thread', threadSchema);
