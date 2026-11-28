const mongoose = require('mongoose');

const actividadSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ''
    },
    tipo: {
        type: String,
        enum: ['siembra', 'cosecha', 'riego', 'mantenimiento', 'taller'],
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'completada'],
        default: 'pendiente'
    },
    huerta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Huerta',
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Actividad', actividadSchema);
