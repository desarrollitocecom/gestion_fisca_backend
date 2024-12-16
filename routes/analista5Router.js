const { Router } = require('express');
const router = Router();

const { getAllRSAforAnalista5Handler, getAllRSGforAnalista5Handler, getAllRGforAnalista5Handler, createActaHandler} = require('../handlers/analista5Handler');
const permisoAutorizacion = require("../checkers/roleAuth");
const { uploadActa } = require('../middlewares/uploadMiddleware');

router.get('/consentimiento_from_rsa',permisoAutorizacion(["all_system_access"]), getAllRSAforAnalista5Handler);

router.get('/consentimiento_from_rsg',permisoAutorizacion(["all_system_access"]), getAllRSGforAnalista5Handler);

router.get('/consentimiento_from_rg',permisoAutorizacion(["all_system_access"]), getAllRGforAnalista5Handler);

router.patch('/newActa/:id',permisoAutorizacion(["all_system_access"]), uploadActa, createActaHandler);

module.exports = router;    