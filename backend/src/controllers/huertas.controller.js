const Huerta = require('../models/Huerta');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { pick, escapeRegex, getPagination, canManage } = require('../utils/helpers');

const CAMPOS = ['nombre', 'descripcion', 'ciudad', 'barrio', 'direccion', 'tipo', 'cultivos', 'areaM2'];
const POPULATE = ['propietario', 'username nombres apellidos'];

async function buscarHuerta(id) {
  const huerta = await Huerta.findById(id);
  if (!huerta) throw new AppError('Huerta no encontrada', 404);
  return huerta;
}

// A1. Listar las huertas (publico). Filtros: ?q=&ciudad=&tipo=&page=&limit=
exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filtro = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q)), 'i');
    filtro.$or = [{ nombre: rx }, { barrio: rx }, { ciudad: rx }];
  }
  if (req.query.ciudad) filtro.ciudad = new RegExp(`^${escapeRegex(String(req.query.ciudad))}$`, 'i');
  if (req.query.tipo) filtro.tipo = String(req.query.tipo);

  const [items, total] = await Promise.all([
    Huerta.find(filtro).populate(...POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Huerta.countDocuments(filtro),
  ]);
  res.json({ ok: true, data: items, paginacion: { page, limit, total, paginas: Math.ceil(total / limit) } });
});

// C2. Listar solo las huertas del usuario autenticado
exports.mine = asyncHandler(async (req, res) => {
  const items = await Huerta.find({ propietario: req.user._id }).sort({ createdAt: -1 });
  res.json({ ok: true, data: items });
});

// A2. Consultar el detalle de una huerta (publico)
exports.getById = asyncHandler(async (req, res) => {
  const huerta = await Huerta.findById(req.params.id).populate(...POPULATE);
  if (!huerta) throw new AppError('Huerta no encontrada', 404);
  res.json({ ok: true, data: huerta });
});

// A3. Crear una huerta (rol usuario o admin; el propietario sale del token)
exports.create = asyncHandler(async (req, res) => {
  const huerta = await Huerta.create({ ...pick(req.body, CAMPOS), propietario: req.user._id });
  res.status(201).json({ ok: true, mensaje: 'Huerta creada', data: huerta });
});

// A4. Modificar una huerta (solo su propietario o un admin)
exports.update = asyncHandler(async (req, res) => {
  const huerta = await buscarHuerta(req.params.id);
  if (!canManage(req.user, huerta)) throw new AppError('Solo puedes modificar tus propias huertas', 403);
  Object.assign(huerta, pick(req.body, CAMPOS));
  await huerta.save();
  res.json({ ok: true, mensaje: 'Huerta actualizada', data: huerta });
});

// A5. Eliminar una huerta (solo su propietario o un admin)
exports.remove = asyncHandler(async (req, res) => {
  const huerta = await buscarHuerta(req.params.id);
  if (!canManage(req.user, huerta)) throw new AppError('Solo puedes eliminar tus propias huertas', 403);
  await huerta.deleteOne();
  res.json({ ok: true, mensaje: 'Huerta eliminada' });
});
