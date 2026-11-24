const { Schema, model } = require('mongoose');

const CATEGORIAS = ['suelo', 'siembra', 'riego', 'plagas', 'compostaje', 'cosecha', 'general'];

const guiaSchema = new Schema(
  {
    titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true, minlength: 3, maxlength: 120 },
    resumen: { type: String, trim: true, maxlength: 300, default: '' },
    contenido: { type: String, required: [true, 'El contenido es obligatorio'], trim: true, maxlength: 10000 },
    categoria: { type: String, enum: { values: CATEGORIAS, message: 'Categoría no válida' }, default: 'general' },
    autor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Guia = model('Guia', guiaSchema);
Guia.CATEGORIAS = CATEGORIAS;
module.exports = Guia;
