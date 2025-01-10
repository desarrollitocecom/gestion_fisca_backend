const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC, uploadDIFI } = require('../../../middlewares/uploadMiddleware');
const { getAllNCforPlataformaHandler, createDescargoNCHandler, getAllIFIforPlataformaHandler, createDescargoIFIHandler } = require('../handlers/plataformaHandler');
const { getAllNCIFI } = require('../handlers/resoArchivaReinicia');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/nc-ifi',permisoAutorizacion(["all_system_access"]), getAllNCIFI);
//router.post('/descargo-NC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDocumentsDescargoNC, createDescargoNCHandler);


module.exports = router;    