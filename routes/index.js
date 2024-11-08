const { Router } = require("express");
const router = Router();

const tramiteInspector = require('../routes/tramiteInspectorRouter');

router.use('/inspector', tramiteInspector);


/*
const funcionRutas = require("./funcionRutas");
const sexoRutas = require('./sexoRutas');

// Usa prefijos para organizar las rutas

router.use('/funciones', funcionRutas);
router.use('/sexos', sexoRutas);
*/



module.exports = router;