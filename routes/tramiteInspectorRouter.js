const { Router } = require('express');
const router = Router();
const { uploadDocuments }  = require('../middlewares/uploadMiddleware');

const { createTramiteHandler, allTramiteHandler } = require('../handlers/tramiteInspectorHandler');

router.post('/nuevoTramiteNC', uploadDocuments, createTramiteHandler);
router.get('/misTramites/:id', allTramiteHandler);

module.exports = router;    