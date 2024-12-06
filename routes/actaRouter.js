const { Router } = require('express');
const router = Router();
const {uploadActa}=require('../middlewares/uploadMiddleware')
const {
    createActainRSAHandler,
    createActainRsgnpHandler,
    createActainRGHandler
}= require('../handlers/actaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.patch('/inRSA/:id',permisoAutorizacion(["all_system_access", "create_ARSA"]) ,uploadActa, createActainRSAHandler);
router.patch('/inRSGNP/:id',permisoAutorizacion(["all_system_access", "create_ARSGNP"]), uploadActa, createActainRsgnpHandler);
router.patch('/inRG/:id', permisoAutorizacion(["all_system_access", "create_ARG"]),uploadActa, createActainRGHandler);
module.exports = router;