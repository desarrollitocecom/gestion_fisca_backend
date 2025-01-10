const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC, uploadDIFI } = require('../../../middlewares/uploadMiddleware');
const { getAllNCforPlataformaHandler, createDescargoNCHandler, getAllIFIforPlataformaHandler, createDescargoIFIHandler } = require('../handlers/plataformaHandler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/nc-for-plataforma',permisoAutorizacion(["all_system_access"]), getAllNCforPlataformaHandler);
router.post('/descargo-NC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDocumentsDescargoNC, createDescargoNCHandler);

router.get('/ifi-for-plataforma',permisoAutorizacion(["all_system_access", "read_Analista2"]), getAllIFIforPlataformaHandler);
router.post('/descargo-IFI/:id',permisoAutorizacion(["all_system_access"]), uploadDIFI, createDescargoIFIHandler);

module.exports = router;    