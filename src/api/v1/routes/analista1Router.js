const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC } = require('../../../middlewares/uploadMiddleware');
const { createDescargoNCHandler, getAllNCforAnalistaHandler, sendWithoutDescargoHandler } = require('../handlers/analista1Handler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/nc_for_analista1',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getAllNCforAnalistaHandler);
router.patch('/descargoNC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDocumentsDescargoNC, createDescargoNCHandler);
router.patch('/withoutDescargoNC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), sendWithoutDescargoHandler);

module.exports = router;    