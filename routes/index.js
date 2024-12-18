const { Router } = require("express");
const router = Router();

//const tramiteInspector = require('./tramiteInspectorRouter');
const digitadorNC = require('./digitadorRouter');
const analista1 = require('./analista1Router');
const informeFinal=require('./informeFinalRouter');
const TipoDocumentoIdentidad = require('../routes/tipoDocumentoIdentidadRouter');
const ejecucionmc=require('../routes/ejecucionMCRouter');
const estadomc = require('../routes/estadoMCRouter');
const estadoifi= require('../routes/estadoIFIRouter');
const estadorsa = require('../routes/estadoRSARouter');
const estadorsgnp = require('../routes/estadoRSGNPRouter');
const medidacomplementaria = require('./medidaComplementariaRouter');
const TipoDocumentoComplementario = require('./tipoDCRouter');
const rsg1=require('./rsg1Router');
const rsg2=require('./rsg2Router');
const rsa=require('./rsaRouter');
const descargoRsa=require('./descargoRsaRouter')
const descargoIFI=require('./descargoInformeFinalRouter')
const descargoRsgnp=require('./descargoRsgnpRouter');
const rsgp=require('./rsgpRouter')
const rsgnp=require('./rsgnpRouter')
const rg=require('./rgRouter');
const usuariosRouter = require("./usuarioRouter");

const rol_permisoRouter = require("./rol_permisoRouter");
const actaRouter=require('./actaRouter');
const docs=require('./documentoRouter');

//router.use('/inspector',tramiteInspector);
router.use('/digitador',digitadorNC);
router.use('/analista1',analista1);
router.use('/tipodocumentoidentidad',TipoDocumentoIdentidad);
router.use('/ejecucionmc',ejecucionmc);
router.use('/estadomc',estadomc);
router.use('/estadoifi',estadoifi);
router.use('/estadorsa',estadorsa);
router.use('/estadorsgnp',estadorsgnp);
router.use('/medidacomplementaria',medidacomplementaria);
router.use('/documentocomplementario',TipoDocumentoComplementario);
//router.use('/inspector', tramiteInspector);
router.use('/users', usuariosRouter);
router.use('/ifi',informeFinal);
router.use('/difi',descargoIFI);
router.use('/drsa',descargoRsa);
router.use('/rsg1',rsg1);
router.use("/rsg2",rsg2);
router.use('/rsa',rsa);
router.use('/rsgp',rsgp);
router.use('/rsgnp',rsgnp);
router.use("/drsgnp",descargoRsgnp);
router.use('/rg',rg);
router.use('/auth',rol_permisoRouter);
router.use('/acta',actaRouter);
router.use('/docs',docs)
module.exports = router;    