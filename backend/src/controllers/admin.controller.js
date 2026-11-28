const User = require('../models/User');
const Huerta = require('../models/Huerta');
const Actividad = require('../models/Actividad');
const Guia = require('../models/Guia');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getPagination } = require('../utils/helpers');

// E1. Consultar las estadisticas del panel administrativo
exports.stats = asyncHandler(async (req, res) => {
  const [usuarios, admins, huertas, guias] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'admin' }),
    Huerta.countDocuments(),
    Guia.countDocuments(),
  ]);
  res.json({ ok: true, data: { usuarios, admins, huertas, guias } });
});

// E2. Listar los usuarios
exports.listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, 20);
  const [items, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  res.json({ ok: true, data: items, paginacion: { page, limit, total, paginas: Math.ceil(total / limit) } });
});

// E3. Cambiar el rol de un usuario
exports.setRole = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw new AppError('No puedes cambiar tu propio rol', 400);
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  user.role = req.body.role;
  await user.save();
  res.json({ ok: true, mensaje: 'Rol actualizado', data: user });
});

// E4. Eliminar un usuario (y sus huertas)
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) throw new AppError('No puedes eliminar tu propia cuenta', 400);
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('Usuario no encontrado', 404);
  const huertas = await Huerta.find({ propietario: user._id }).select("_id");
  await Actividad.deleteMany({ $or: [{ huerta: { $in: huertas.map(h => h._id) } }, { autor: user._id }] });
  await Huerta.deleteMany({ propietario: user._id });
  await user.deleteOne();
  res.json({ ok: true, mensaje: 'Usuario eliminado' });
});
