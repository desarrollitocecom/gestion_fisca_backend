const { Router } = require('express');
const router = Router();

const { uploadDRSGNP } = require('../middlewares/uploadMiddleware');
// const { getAllRSAforAnalista3Handler, createDescargoRSAHandler, sendWithoutDescargoRSAHandler } = require('../handlers/analista3Handler');
const { getAllRSAforAnalista4Handler, createDescargoRSGNPHandler } = require('../handlers/analista4Handler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/rsa_for_analista4',permisoAutorizacion(["all_system_access"]), getAllRSAforAnalista4Handler);

router.patch('/descargoRSGNP/:id',permisoAutorizacion(["all_system_access", "create_Analista4"]), uploadDRSGNP, createDescargoRSGNPHandler);

// router.patch('/withoutDescargoRSA/:id',permisoAutorizacion(["all_system_access", "create_Analista3"]), sendWithoutDescargoRSAHandler);

module.exports = router;    