

// Todos tienen que pasar por la validacion del JWT
// Obtener events

const {Router} =  require('express');
const router = Router();
const {check} = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const {validarCampos}= require('../middlewares/validar-campos');
const { getEventos,crearEvento,actualizarEvento,eliminarEvento } = require('../controllers/eventsController');
const { isDate } = require('../helpers/isDate');

router.use(validarJWT);
router.get('/',getEventos);

router.post(
    '/',[
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom(isDate),
        check('end','Fecha de finalizacion es obligatoria').custom(isDate),
        validarCampos
    ],
    crearEvento
);

router.put('/:id',actualizarEvento);

router.delete('/:id',eliminarEvento);

module.exports= router;