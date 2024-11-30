const { Router } = require('express');
const router = Router();
const { uploadDocuments }  = require('../middlewares/uploadMiddleware');

const { createTramiteHandler, allTramiteHandler } = require('../handlers/tramiteInspectorHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/nuevoTramiteNC',permisoAutorizacion(["all_system_access", "create_tramite"]), uploadDocuments, createTramiteHandler);
router.get('/misTramites/:id',permisoAutorizacion(["all_system_access", "read_tramite"]), allTramiteHandler);

module.exports = router;    