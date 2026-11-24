const { Schema, model } = require('mongoose');

const TIPOS = ['comunitaria', 'escolar', 'familiar', 'institucional'];

const huertaSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true, minlength: 2, maxlength: 100 },
    descripcion: { type: String, trim: true, maxlength: 1000, default: '' },
    ciudad: { type: String, required: [true, 'La ciudad es obligatoria'], trim: true, maxlength: 80 },
    barrio: { type: String, trim: true, maxlength: 80, default: '' },
    direccion: { type: String, trim: true, maxlength: 150, default: '' },
    tipo: { type: String, enum: { values: TIPOS, message: 'Tipo de huerta no válido' }, default: 'comunitaria' },
    cultivos: { type: [String], default: [] },
    areaM2: { type: Number, min: [1, 'El área debe ser mayor a 0'] },
    propietario: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

const Huerta = model('Huerta', huertaSchema);
Huerta.TIPOS = TIPOS;
module.exports = Huerta;
