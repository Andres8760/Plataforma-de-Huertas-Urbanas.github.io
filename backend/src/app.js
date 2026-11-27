const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY) || process.env.TRUST_PROXY);
const origenesPermitidos = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
app.use('/api/threads', require('./routes/threads.routes'));
  cors({
    origin: (origin, cb) => {
      // Sin "origin" = herramientas como curl/Postman
      if (!origin || origenesPermitidos.includes(origin)) return cb(null, true);
      cb(new AppError('Origen no permitido por CORS', 403));
    },
  })
);
app.use(express.json({ limit: '10kb' }));

// Limita intentos de login/registro por IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, mensaje: 'Demasiados intentos. Intenta de nuevo en unos minutos.' },
});

app.get('/api/health', (req, res) => res.json({ ok: true, mensaje: 'API EcoHuertos activa' }));
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/huertas', require('./routes/huertas.routes'));
app.use('/api/guias', require('./routes/guias.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.use((req, res, next) => next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404)));
app.use(errorHandler);

module.exports = app;
