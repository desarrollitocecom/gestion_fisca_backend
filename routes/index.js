const { Router } = require("express");
const router = Router();

const TipoDocumentoIdentidad = require('../routes/tipoDocumentoIdentidadRouter');
const ejecucionmc=require('../routes/ejecucionMCRouter');
const estadomc = require('../routes/estadoMCRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const TipoDocumentoComplementario = require('./tipoDCRouter')
const tramiteInspector = require('../routes/tramiteInspectorRouter');

router.use('/inspector',tramiteInspector);
router.use('/tipodocumentoidentidad',TipoDocumentoIdentidad);
router.use('/ejecucionmc',ejecucionmc);
router.use('/estadomc',estadomc);
router.use('/medidacomplementaria',medidacomplementaria);
router.use('/documentocomplementario',TipoDocumentoComplementario);

module.exports = router;