const { Router } = require('express');
const router = Router();

const {uploadIfi}=require('../middlewares/uploadMiddleware')
const { getAllNCforInstructivaHandler, createInformeFinalHandler } = require('../handlers/areaInstructivaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/nc_for_instructiva',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getAllNCforInstructivaHandler);

router.post('/newIfi',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadIfi, createInformeFinalHandler);


// router.patch('/descargoNC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDocumentsDescargoNC, createDescargoNCHandler);
// router.patch('/withoutDescargoNC/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), sendWithoutDescargoHandler);

module.exports = router;    