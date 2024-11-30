const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC } = require('../middlewares/uploadMiddleware');
const { createDescargoNCHandler } = require('../handlers/analistaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.patch('/descargoNC/:id',permisoAutorizacion(["all_system_access", "create_descargo_nc"]), uploadDocumentsDescargoNC, createDescargoNCHandler);

module.exports = router;    