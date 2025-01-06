// const { Router } = require('express');
// const router = Router();
// const {uploadActa}=require('../../../middlewares/uploadMiddleware')
// const {
//     createActainRSAHandler,
//     createActainRsgnpHandler,
//     createActainRGHandler,
//     getAllRsaRgRsgnp

// }= require('../handlers/actaHandler');
// const permisoAutorizacion = require("../../../../../checkers/roleAuth");

// router.patch('/inRSA/:id',permisoAutorizacion(["all_system_access", "create_Analista5"]) ,uploadActa, createActainRSAHandler);
// router.patch('/inRSGNP/:id',permisoAutorizacion(["all_system_access", "create_Analista5"]), uploadActa, createActainRsgnpHandler);
// router.patch('/inRG/:id', permisoAutorizacion(["all_system_access", "create_Analista5"]),uploadActa, createActainRGHandler);
// router.get('/actasT',permisoAutorizacion(["all_system_access", "read_Analista5"]),getAllRsaRgRsgnp);
// module.exports = router;