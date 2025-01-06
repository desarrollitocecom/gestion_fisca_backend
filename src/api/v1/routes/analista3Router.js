const { Router } = require('express');
const router = Router();

const { uploadDRSA } = require('../../../middlewares/uploadMiddleware');
const { getAllRSAforAnalista3Handler, createDescargoRSAHandler, sendWithoutDescargoRSAHandler } = require('../handlers/analista3Handler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/rsa_for_analista3',permisoAutorizacion(["all_system_access"]), getAllRSAforAnalista3Handler);

router.patch('/descargoRSA/:id',permisoAutorizacion(["all_system_access", "create_Analista3"]), uploadDRSA, createDescargoRSAHandler);

router.patch('/withoutDescargoRSA/:id',permisoAutorizacion(["all_system_access", "create_Analista3"]), sendWithoutDescargoRSAHandler);

module.exports = router;    