const { Router } = require('express');
const router = Router();

const { createTramiteHandler } = require('../handlers/tramiteInspectorHandler');

router.post('/nuevoTramiteNC', createTramiteHandler);


module.exports = router;