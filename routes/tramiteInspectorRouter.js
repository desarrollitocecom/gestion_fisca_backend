const { Router } = require('express');
const router = Router();
const { uploadDocuments }  = require('../middlewares/uploadMiddleware');

const { createTramiteHandler, allTramiteHandler, getMyActasHandler, getAllTipoMC } = require('../handlers/tramiteInspectorHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/actas/:id', getMyActasHandler);
router.get('/tipoMC', getAllTipoMC);

router.post('/nuevoTramiteNC', uploadDocuments, createTramiteHandler);
router.get('/misTramites/:id', allTramiteHandler);

module.exports = router;    