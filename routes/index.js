const { Router } = require("express");
const router = Router();

const tramiteInspector = require('./tramiteInspectorRouter');
const informeFinal=require('./informeFinalRouter');
const descargoIFI=require('./descargoInformeFinalRouter')

router.use('/inspector', tramiteInspector);
router.use('/ifi',informeFinal);


/*
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');

// Usa prefijos para organizar las rutas

router.use('/funciones', funcionRutas);
router.use('/sexos', sexoRutas);
*/



module.exports = router;