const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const detalles = errors.array().map((e) => ({ campo: e.path, mensaje: e.msg }));
  next(new AppError('Datos inválidos', 400, detalles));
};
