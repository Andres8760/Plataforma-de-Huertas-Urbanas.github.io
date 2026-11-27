const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/threads.controller');
const Thread = require('../models/Thread');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

const idRule = param('id').isMongoId().withMessage('Identificador no válido');

const hiloRules = [
  body('titulo').isString().trim().isLength({ min: 3, max: 150 }).withMessage('El título debe tener entre 3 y 150 caracteres'),
  body('contenido').isString().trim().isLength({ min: 5, max: 2000 }).withMessage('El mensaje debe tener entre 5 y 2000 caracteres'),
  body('categoria').optional().isIn(Thread.CATEGORIAS).withMessage(`La categoría debe ser: ${Thread.CATEGORIAS.join(', ')}`),
];

const respuestaRules = [
  body('mensaje').isString().trim().isLength({ min: 1, max: 1000 }).withMessage('La respuesta debe tener entre 1 y 1000 caracteres'),
];

// Leer el foro es publico; publicar y responder exige sesion; moderar (borrar) es solo del admin
router.get('/', ctrl.list);
router.post('/', protect, restrictTo('usuario', 'admin'), hiloRules, validate, ctrl.create);
router.post('/:id/replies', protect, restrictTo('usuario', 'admin'), idRule, respuestaRules, validate, ctrl.addReply);
router.delete('/:id', protect, restrictTo('admin'), idRule, validate, ctrl.remove);

module.exports = router;
