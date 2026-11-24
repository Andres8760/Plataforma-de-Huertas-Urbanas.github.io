const AppError = require('../utils/AppError');

// Autorizacion por rol: restrictTo('admin') o restrictTo('usuario', 'admin')
const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('No tienes permiso para realizar esta acción', 403));
  }
  next();
};

module.exports = { restrictTo };
