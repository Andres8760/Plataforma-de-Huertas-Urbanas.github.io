const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth');

const registerRules = [
  body('nombres').trim().isLength({ min: 2, max: 60 }).withMessage('Los nombres deben tener entre 2 y 60 caracteres'),
  body('apellidos').trim().isLength({ min: 2, max: 60 }).withMessage('Los apellidos deben tener entre 2 y 60 caracteres'),
  body('username')
    .trim().toLowerCase()
    .matches(/^[a-z0-9_.-]{3,30}$/).withMessage('El usuario debe tener 3-30 caracteres (letras, números, . _ -)'),
  body('email').trim().toLowerCase().isEmail().withMessage('Correo no válido'),
  body('password')
    .isString().isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
    .matches(/[A-Za-z]/).withMessage('La contraseña debe incluir letras')
    .matches(/\d/).withMessage('La contraseña debe incluir números'),
];

const loginRules = [
  body('identificador').isString().trim().notEmpty().withMessage('Indica tu usuario o correo'),
  body('password').isString().notEmpty().withMessage('Indica tu contraseña'),
];

router.post('/register', registerRules, validate, ctrl.register);
router.post('/login', loginRules, validate, ctrl.login);
router.get('/me', protect, ctrl.me);
router.post('/logout', protect, ctrl.logout);

module.exports = router;
