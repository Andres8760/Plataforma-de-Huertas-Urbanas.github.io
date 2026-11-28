const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/jwt');
const { pick } = require('../utils/helpers');

// B1. Registrar un usuario (el rol siempre es "usuario"; un admin se asigna desde el panel)
exports.register = asyncHandler(async (req, res) => {
  const datos = pick(req.body, ['nombres', 'apellidos', 'username', 'email', 'password']);
  const user = await User.create({ ...datos, role: 'usuario' });
  res.status(201).json({ ok: true, mensaje: 'Cuenta creada', data: { token: signToken(user), user } });
});

// B2. Iniciar sesion (usuario o correo + contrasena) -> JWT
exports.login = asyncHandler(async (req, res) => {
  const identificador = String(req.body.identificador).trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ email: identificador }, { username: identificador }],
  }).select('+password');

  // Mensaje generico: no revela si existe el usuario
  if (!user || !(await user.comparePassword(String(req.body.password)))) {
    throw new AppError('Credenciales inválidas', 401);
  }
  res.json({ ok: true, mensaje: 'Sesión iniciada', data: { token: signToken(user), user } });
});

// B3. Consultar el perfil del usuario autenticado
exports.me = asyncHandler(async (req, res) => {
  res.json({ ok: true, data: req.user });
});

// B4. Cerrar la sesion. El JWT es sin estado: el servidor confirma y el cliente borra el token.
exports.logout = asyncHandler(async (req, res) => {
  res.json({ ok: true, mensaje: 'Sesión cerrada. Elimina el token del cliente.' });
});
