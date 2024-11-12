const { Router } = require('express');
const router = Router();

const { createTramiteHandler, usuarioPruebaHandler, allTramiteHandler } = require('../handlers/tramiteInspectorHandler');

router.post('/nuevoTramiteNC', createTramiteHandler);
router.get('/allTramitesNC', allTramiteHandler);
router.get('/usuarioPrueba', usuarioPruebaHandler);


module.exports = router;