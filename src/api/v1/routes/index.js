const { Router } = require("express");
const router = Router();

//const tramiteInspector = require('./tramiteInspectorRouter');

const ejecucionmc=require('../routes/ejecucionMCRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const usuariosRouter = require("./usuarioRouter");

const rol_permisoRouter = require("./rol_permisoRouter");
const docs=require('./documentoRouter');

const gestorActas = require('./gestorActasRouter');
const digitadorNC = require('./digitadorRouter');
const areaInstructiva = require('./areaInstructivaRouter');
const areaResolutiva1 = require('./areaResolutiva1Router');
const areaResolutiva2 = require('./areaResolutiva2Router');
const areaResolutiva3 = require('./areaResolutiva3Router');
const gerencia = require('./gerenciaRouter');
const analista5 = require('./analista5Router');
const reporte = require('./reporteRouter');
const controlAlmacen = require('./controlAlmacen');
const motorizado = require('./motorizadoRouter');
const plataforma1 = require('./plataforma1')
const plataforma2 = require('./plataforma2')
const areaResolutiva = require('./areaResolutivaRouter')
const resoArchivaReinicia = require('../routes/resoArchivaReinicia')
const docOpcional = require('../routes/plataformaOpcional')
const pdf = require('../routes/pdfRouter')

router.use('/doc-opcional',docOpcional);
router.use('/gestor',gestorActas);
router.use('/digitador',digitadorNC);
router.use('/area-instructiva',areaInstructiva);
router.use('/area-resolutiva1',areaResolutiva1);
router.use('/area-resolutiva2',areaResolutiva2);
router.use('/area-resolutiva3',areaResolutiva3);
router.use('/gerencia',gerencia);
router.use('/analista5',analista5);
router.use('/reporte',reporte);
router.use('/controlAlmacen',controlAlmacen);
router.use('/cargoNotificacion',motorizado);
router.use('/plataforma1', plataforma1)
router.use('/plataforma2', plataforma2)
router.use('/area-resolutiva',areaResolutiva);
router.use('/reso-archiva-reinicia',resoArchivaReinicia);
router.use('/pdf', pdf)

router.use('/ejecucionmc',ejecucionmc);
router.use('/medidacomplementaria',medidacomplementaria);
//router.use('/inspector', tramiteInspector);


router.use('/users', usuariosRouter);
router.use('/auth',rol_permisoRouter);
router.use('/docs',docs)
module.exports = router;    