module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  let status = err.statusCode || 500;
  let mensaje = err.message;
  let detalles = err.details;

  if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    mensaje = 'Datos inválidos';
    detalles = Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message }));
  } else if (err.name === 'CastError') {
    status = 400;
    mensaje = 'Identificador inválido';
  } else if (err.code === 11000) {
    status = 409;
    const campo = Object.keys(err.keyValue || {})[0] || 'dato';
    mensaje = `Ya existe un registro con ese ${campo}`;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    mensaje = 'El cuerpo de la petición no es un JSON válido';
  }

  if (status >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') mensaje = 'Error interno del servidor';
  }

  res.status(status).json({ ok: false, mensaje, ...(detalles && { detalles }) });
};
