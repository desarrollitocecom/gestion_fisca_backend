const { Router } = require("express");
const router = Router();

const tramiteInspector = require('./tramiteInspectorRouter');
const digitadorNC = require('./digitadorRouter');
const informeFinal=require('./informeFinalRouter');
const descargoIFI=require('./descargoInformeFinalRouter')
const TipoDocumentoIdentidad = require('../routes/tipoDocumentoIdentidadRouter');
const ejecucionmc=require('../routes/ejecucionMCRouter');
const estadomc = require('../routes/estadoMCRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const TipoDocumentoComplementario = require('./tipoDCRouter')


router.use('/inspector',tramiteInspector);
router.use('/digitador',digitadorNC);
router.use('/tipodocumentoidentidad',TipoDocumentoIdentidad);
router.use('/ejecucionmc',ejecucionmc);
router.use('/estadomc',estadomc);
router.use('/medidacomplementaria',medidacomplementaria);
router.use('/documentocomplementario',TipoDocumentoComplementario);
router.use('/inspector', tramiteInspector);
router.use('/ifi',informeFinal);
router.use('/descargoIFI',descargoIFI);
module.exports = router;