const { Schema, model } = require('mongoose');

const CATEGORIAS = ['Compostaje', 'Control de Plagas', 'Siembra Urbana', 'Riego', 'General'];

const respuestaSchema = new Schema({
  autor: { type: String, required: true, trim: true },
  autorId: { type: Schema.Types.ObjectId, ref: 'User' },
  mensaje: { type: String, required: [true, 'El mensaje es obligatorio'], trim: true, maxlength: 1000 },
  fecha: { type: Date, default: Date.now },
});

const threadSchema = new Schema({
  titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true, minlength: 3, maxlength: 150 },
  // "autor" es el username (se toma del token, nunca del cuerpo de la petición)
  autor: { type: String, required: true, trim: true },
  autorId: { type: Schema.Types.ObjectId, ref: 'User' },
  categoria: { type: String, enum: { values: CATEGORIAS, message: 'Categoría no válida' }, default: 'General' },
  contenido: { type: String, required: [true, 'El mensaje es obligatorio'], trim: true, minlength: 5, maxlength: 2000 },
  respuestas: [respuestaSchema],
  fechaCreacion: { type: Date, default: Date.now },
});

const Thread = model('Thread', threadSchema);
Thread.CATEGORIAS = CATEGORIAS;
module.exports = Thread;
