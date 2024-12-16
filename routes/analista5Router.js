const { Router } = require('express');
const router = Router();

const { getAllRSGforAnalista5Handler} = require('../handlers/analista5Handler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/consentimiento_for_analista5',permisoAutorizacion(["all_system_access"]), getAllRSGforAnalista5Handler);

module.exports = router;    