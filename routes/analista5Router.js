const { Router } = require('express');
const router = Router();

const { getAllRSAforAnalista5Handler, getAllRSGforAnalista5Handler, getAllRGforAnalista5Handler} = require('../handlers/analista5Handler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/consentimiento_from_rsa',permisoAutorizacion(["all_system_access"]), getAllRSAforAnalista5Handler);

router.get('/consentimiento_from_rsg',permisoAutorizacion(["all_system_access"]), getAllRSGforAnalista5Handler);

router.get('/consentimiento_from_rg',permisoAutorizacion(["all_system_access"]), getAllRGforAnalista5Handler);

module.exports = router;    