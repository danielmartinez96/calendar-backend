/*
    Rutas de Usuario /Auth
    host + /api/auth

*/
const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { createUser, loginUser, revalidateUser } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 characteres').isLength({ min: 6 }),
        validarCampos
    ],
    createUser);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 characteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUser);

router.get('/renew',validarJWT ,revalidateUser);


module.exports = router;