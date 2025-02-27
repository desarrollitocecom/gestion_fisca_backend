const { Router } = require('express');
const router = Router();

const {uploadIfi}=require('../../../middlewares/uploadMiddleware')
const { getAllNCforInstructivaHandler, createInformeFinalHandler, getAllIFISForInstructivaHandler } = require('../handlers/areaInstructivaHandler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/nc-for-instructiva',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getAllNCforInstructivaHandler);

router.get('/created-ifis',permisoAutorizacion(["all_system_access"]), getAllIFISForInstructivaHandler);

router.post('/newIfi',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadIfi, createInformeFinalHandler);

module.exports = router;    