const Guia = require('../models/Guia');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { pick, escapeRegex, getPagination } = require('../utils/helpers');

const CAMPOS = ['titulo', 'resumen', 'contenido', 'categoria'];

// D1. Listar las guias (publico). Filtros: ?q=&categoria=&page=&limit=
exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filtro = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q)), 'i');
    filtro.$or = [{ titulo: rx }, { resumen: rx }];
  }
  if (req.query.categoria) filtro.categoria = String(req.query.categoria);

  const [items, total] = await Promise.all([
    Guia.find(filtro).select('-contenido').populate('autor', 'username').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Guia.countDocuments(filtro),
  ]);
  res.json({ ok: true, data: items, paginacion: { page, limit, total, paginas: Math.ceil(total / limit) } });
});

// D2. Consultar el detalle de una guia (publico)
exports.getById = asyncHandler(async (req, res) => {
  const guia = await Guia.findById(req.params.id).populate('autor', 'username');
  if (!guia) throw new AppError('Guía no encontrada', 404);
  res.json({ ok: true, data: guia });
});

// D3. Crear una guia (solo admin)
exports.create = asyncHandler(async (req, res) => {
  const guia = await Guia.create({ ...pick(req.body, CAMPOS), autor: req.user._id });
  res.status(201).json({ ok: true, mensaje: 'Guía creada', data: guia });
});

// D4. Modificar una guia (solo admin)
exports.update = asyncHandler(async (req, res) => {
  const guia = await Guia.findById(req.params.id);
  if (!guia) throw new AppError('Guía no encontrada', 404);
  Object.assign(guia, pick(req.body, CAMPOS));
  await guia.save();
  res.json({ ok: true, mensaje: 'Guía actualizada', data: guia });
});

// D5. Eliminar una guia (solo admin)
exports.remove = asyncHandler(async (req, res) => {
  const guia = await Guia.findById(req.params.id);
  if (!guia) throw new AppError('Guía no encontrada', 404);
  await guia.deleteOne();
  res.json({ ok: true, mensaje: 'Guía eliminada' });
});
