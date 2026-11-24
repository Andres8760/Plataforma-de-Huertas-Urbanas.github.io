const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/jwt');

// Autenticacion: exige un JWT valido en "Authorization: Bearer <token>"
const protect = asyncHandler(async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError('Debes iniciar sesión', 401);

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new AppError('Token inválido o expirado', 401);
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new AppError('El usuario de este token ya no existe', 401);

  req.user = user;
  next();
});

module.exports = { protect };
