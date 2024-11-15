const { Router } = require("express");
const router = Router();

const tramiteInspector = require('./tramiteInspectorRouter');
const informeFinal=require('./informeFinalRouter');
const descargoIFI=require('./descargoInformeFinalRouter')
const TipoDocumentoIdentidad = require('../routes/tipoDocumentoIdentidadRouter');
const ejecucionmc=require('../routes/ejecucionMCRouter');
const estadomc = require('../routes/estadoMCRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const TipoDocumentoComplementario = require('./tipoDCRouter');
const rsg1=require('./rsg1Router');
const rsg2=require('./rsg2Router');
const rsa=require('./rsaRouter');
const descargoRsa=require('./descargoRsaRouter')

router.use('/tipodocumentoidentidad',TipoDocumentoIdentidad);
router.use('/ejecucionmc',ejecucionmc);
router.use('/estadomc',estadomc);
router.use('/medidacomplementaria',medidacomplementaria);
router.use('/documentocomplementario',TipoDocumentoComplementario);
router.use('/inspector', tramiteInspector);
router.use('/ifi',informeFinal);
router.use('/descargoIFI',descargoIFI);
router.use('/rsg1',rsg1);
router.use("/rsg2",rsg2);
router.use('/rsa',rsa);
router.use('/drsa',descargoRsa);

module.exports = router;