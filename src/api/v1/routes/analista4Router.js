const { Router } = require('express');
const router = Router();

const { uploadDRSGNP } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforAnalista4Handler, createDescargoRSGNPHandler, sendWithoutDescargoRSGNPHandler } = require('../handlers/analista4Handler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/rsg_for_analista4',permisoAutorizacion(["all_system_access"]), getAllRSGforAnalista4Handler);

router.patch('/descargoRSGNP/:id',permisoAutorizacion(["all_system_access", "create_Analista4"]), uploadDRSGNP, createDescargoRSGNPHandler);

router.patch('/withoutDescargoRSGNP/:id',permisoAutorizacion(["all_system_access", "create_Analista4"]), sendWithoutDescargoRSGNPHandler);

module.exports = router;    