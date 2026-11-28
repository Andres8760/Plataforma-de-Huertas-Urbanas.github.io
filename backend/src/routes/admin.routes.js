const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/admin.controller');
const User = require('../models/User');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/role');

// Todo el panel administrativo es exclusivo del rol admin
router.use(protect, restrictTo('admin'));

const idRule = param('id').isMongoId().withMessage('Identificador no válido');

router.get('/stats', ctrl.stats);
router.get('/users', ctrl.listUsers);
router.patch(
  '/users/:id/role',
  idRule,
  body('role').isIn(User.ROLES).withMessage(`El rol debe ser: ${User.ROLES.join(', ')}`),
  validate,
  ctrl.setRole
);
router.delete('/users/:id', idRule, validate, ctrl.deleteUser);

module.exports = router;
