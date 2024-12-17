const { Router } = require("express");
const router = Router();

//const tramiteInspector = require('./tramiteInspectorRouter');

const ejecucionmc=require('../routes/ejecucionMCRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const usuariosRouter = require("./usuarioRouter");

const rol_permisoRouter = require("./rol_permisoRouter");
const docs=require('./documentoRouter');

const digitadorNC = require('./digitadorRouter');
const analista1 = require('./analista1Router');
const areaInstructiva = require('./areaInstructivaRouter');
const areaResolutiva1 = require('./areaResolutiva1Router');
const analista2 = require('./analista2Router');
const areaResolutiva2 = require('./areaResolutiva2Router');
const analista3 = require('./analista3Router');
const areaResolutiva3 = require('./areaResolutiva3Router');
const analista4 = require('./analista4Router');
const gerencia = require('./gerenciaRouter');
const analista5 = require('./analista5Router');

router.use('/digitador',digitadorNC);
router.use('/analista1',analista1);
router.use('/area-instructiva',areaInstructiva);
router.use('/area-resolutiva1',areaResolutiva1);
router.use('/analista2',analista2);
router.use('/area-resolutiva2',areaResolutiva2);
router.use('/analista3',analista3);
router.use('/area-resolutiva3',areaResolutiva3);
router.use('/analista4',analista4);
router.use('/gerencia',gerencia);
router.use('/analista5',analista5);


router.use('/ejecucionmc',ejecucionmc);
router.use('/medidacomplementaria',medidacomplementaria);
//router.use('/inspector', tramiteInspector);


router.use('/users', usuariosRouter);
router.use('/auth',rol_permisoRouter);
router.use('/docs',docs)
module.exports = router;    