const Thread = require('../models/Thread');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { pick, getPagination } = require('../utils/helpers');

// F3. Listar los hilos del foro (publico)
exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 20);
  const [items, total] = await Promise.all([
    Thread.find().sort({ fechaCreacion: -1 }).skip(skip).limit(limit),
    Thread.countDocuments(),
  ]);
  res.json({ ok: true, data: items, paginacion: { page, limit, total, paginas: Math.ceil(total / limit) } });
});

// F3. Publicar un hilo (usuario o admin). El autor sale del token: no se puede suplantar.
exports.create = asyncHandler(async (req, res) => {
  const hilo = await Thread.create({
    ...pick(req.body, ['titulo', 'categoria', 'contenido']),
    autor: req.user.username,
    autorId: req.user._id,
  });
  res.status(201).json({ ok: true, mensaje: 'Hilo publicado', data: hilo });
});

// F3. Responder a un hilo (usuario o admin)
exports.addReply = asyncHandler(async (req, res) => {
  const hilo = await Thread.findById(req.params.id);
  if (!hilo) throw new AppError('Hilo no encontrado', 404);
  hilo.respuestas.push({ autor: req.user.username, autorId: req.user._id, mensaje: req.body.mensaje });
  await hilo.save();
  res.status(201).json({ ok: true, mensaje: 'Respuesta publicada', data: hilo });
});

// Moderacion: solo el admin elimina hilos
exports.remove = asyncHandler(async (req, res) => {
  const hilo = await Thread.findById(req.params.id);
  if (!hilo) throw new AppError('Hilo no encontrado', 404);
  await hilo.deleteOne();
  res.json({ ok: true, mensaje: 'Hilo eliminado' });
});
