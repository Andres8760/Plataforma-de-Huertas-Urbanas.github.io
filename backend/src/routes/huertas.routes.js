const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/huertas.controller');
const Huerta = require('../models/Huerta');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

const idRule = param('id').isMongoId().withMessage('Identificador no válido');

// En la creacion nombre y ciudad son obligatorios; en la modificacion todos los campos son opcionales
function huertaRules(isUpdate) {
  const campo = (name) => (isUpdate ? body(name).optional() : body(name));
  return [
    campo('nombre').trim().isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    campo('ciudad').trim().isLength({ min: 1, max: 80 }).withMessage('La ciudad es obligatoria (máx. 80 caracteres)'),
    body('descripcion').optional().isString().trim().isLength({ max: 1000 }).withMessage('La descripción admite máximo 1000 caracteres'),
    body('barrio').optional().isString().trim().isLength({ max: 80 }).withMessage('El barrio admite máximo 80 caracteres'),
    body('direccion').optional().isString().trim().isLength({ max: 150 }).withMessage('La dirección admite máximo 150 caracteres'),
    body('tipo').optional().isIn(Huerta.TIPOS).withMessage(`El tipo debe ser: ${Huerta.TIPOS.join(', ')}`),
    body('cultivos').optional().isArray({ max: 30 }).withMessage('Los cultivos deben ser una lista (máx. 30)'),
    body('cultivos.*').isString().trim().isLength({ min: 1, max: 50 }).withMessage('Cada cultivo debe tener entre 1 y 50 caracteres'),
    body('areaM2').optional().isFloat({ min: 1 }).withMessage('El área debe ser un número mayor a 0').toFloat(),
  ];
}

router.get('/', ctrl.list);
router.get('/mias', protect, ctrl.mine);
router.get('/:id', idRule, validate, ctrl.getById);

// C1: solo roles autorizados crean, modifican y eliminan. C2: la propiedad se verifica en el controlador.
router.post('/', protect, restrictTo('usuario', 'admin'), huertaRules(false), validate, ctrl.create);
router.put('/:id', protect, restrictTo('usuario', 'admin'), idRule, huertaRules(true), validate, ctrl.update);
router.delete('/:id', protect, restrictTo('usuario', 'admin'), idRule, validate, ctrl.remove);

module.exports = router;
