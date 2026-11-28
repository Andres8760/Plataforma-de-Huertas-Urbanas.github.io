const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/actividades.controller');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');
const validate = require('../middlewares/validate');

const tipos = [
    'siembra', 'cosecha', 'riego', 'mantenimiento', 'taller'
];

const idRule = param('id').isMongoId();

function reglas(actualizar = false) {
    const campo = nombre => actualizar
        ? body(nombre).optional()
        : body(nombre);

    return [
        campo('titulo').isString().trim().isLength({ min: 3, max: 100 }),
        body('descripcion').optional().isString().trim().isLength({ max: 1000 }),
        campo('tipo').isIn(tipos),
        campo('fecha').isISO8601({ strict: true }),
        body('estado').optional().isIn(['pendiente', 'completada'])
    ];
}

router.get('/', ctrl.list);

router.post(
    '/',
    protect,
    restrictTo('usuario', 'admin'),
    reglas(),
    body('huerta').isMongoId(),
    validate,
    ctrl.create
);

router.patch(
    '/:id',
    protect,
    restrictTo('usuario', 'admin'),
    idRule,
    reglas(true),
    validate,
    ctrl.update
);

router.delete(
    '/:id',
    protect,
    restrictTo('usuario', 'admin'),
    idRule,
    validate,
    ctrl.remove
);

module.exports = router;
