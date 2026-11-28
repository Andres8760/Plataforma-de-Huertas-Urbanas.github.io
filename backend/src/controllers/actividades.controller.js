const Actividad = require('../models/Actividad');
const Huerta = require('../models/Huerta');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

async function comprobarHuerta(id, usuario) {
    const huerta = await Huerta.findById(id);

    if (!huerta) {
        throw new AppError('Huerta no encontrada', 404);
    }

    if (usuario.role !== 'admin' &&
        String(huerta.propietario) !== String(usuario._id)) {
        throw new AppError('No tienes permiso sobre esta huerta', 403);
    }

    return huerta;
}

exports.list = asyncHandler(async (req, res) => {
    const actividades = await Actividad.find()
        .populate('huerta', 'nombre propietario')
        .populate('autor', 'username')
        .sort({ fecha: 1 });

    res.json({
        ok: true,
        data: actividades.filter(a => a.huerta)
    });
});

exports.create = asyncHandler(async (req, res) => {
    await comprobarHuerta(req.body.huerta, req.user);

    const actividad = await Actividad.create({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        fecha: req.body.fecha,
        huerta: req.body.huerta,
        autor: req.user._id
    });

    res.status(201).json({
        ok: true,
        mensaje: 'Actividad registrada',
        data: actividad
    });
});

exports.update = asyncHandler(async (req, res) => {
    const actividad = await Actividad.findById(req.params.id);

    if (!actividad) {
        throw new AppError('Actividad no encontrada', 404);
    }

    await comprobarHuerta(actividad.huerta, req.user);

    const campos = [
        'titulo', 'descripcion', 'tipo', 'fecha', 'estado'
    ];

    campos.forEach(campo => {
        if (req.body[campo] !== undefined) {
            actividad[campo] = req.body[campo];
        }
    });

    await actividad.save();

    res.json({
        ok: true,
        mensaje: 'Actividad actualizada',
        data: actividad
    });
});

exports.remove = asyncHandler(async (req, res) => {
    const actividad = await Actividad.findById(req.params.id);

    if (!actividad) {
        throw new AppError('Actividad no encontrada', 404);
    }

    await comprobarHuerta(actividad.huerta, req.user);
    await actividad.deleteOne();

    res.json({
        ok: true,
        mensaje: 'Actividad eliminada'
    });
});
