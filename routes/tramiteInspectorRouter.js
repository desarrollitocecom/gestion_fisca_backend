const { Router } = require('express');
const router = Router();

const { createTramiteHandler } = require('../handler/tramiteInspectorHandler');

router.post('/nuevoTramiteNC', createTramiteHandler);


module.exports = router;