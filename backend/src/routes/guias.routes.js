const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/guias.controller');
const Guia = require('../models/Guia');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

const idRule = param('id').isMongoId().withMessage('Identificador no válido');

function guiaRules(isUpdate) {
  const campo = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    campo('titulo').trim().isLength({ min: 3, max: 120 }).withMessage('El título debe tener entre 3 y 120 caracteres'),
    campo('contenido').trim().isLength({ min: 10, max: 10000 }).withMessage('El contenido debe tener entre 10 y 10000 caracteres'),
    body('resumen').optional().isString().trim().isLength({ max: 300 }).withMessage('El resumen admite máximo 300 caracteres'),
    body('categoria').optional().isIn(Guia.CATEGORIAS).withMessage(`La categoría debe ser: ${Guia.CATEGORIAS.join(', ')}`),
  ];
}

router.get('/', ctrl.list);
router.get('/:id', idRule, validate, ctrl.getById);

// C1: solo el admin crea, modifica y elimina guias
router.post('/', protect, restrictTo('admin'), guiaRules(false), validate, ctrl.create);
router.put('/:id', protect, restrictTo('admin'), idRule, guiaRules(true), validate, ctrl.update);
router.delete('/:id', protect, restrictTo('admin'), idRule, validate, ctrl.remove);

module.exports = router;
