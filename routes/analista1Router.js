const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC } = require('../middlewares/uploadMiddleware');
const { createDescargoNCHandler, getAllNCforAnalistaHandler } = require('../handlers/analistaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/nc_for_analista1',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getAllNCforAnalistaHandler);
router.patch('/descargoNC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDocumentsDescargoNC, createDescargoNCHandler);

module.exports = router;    