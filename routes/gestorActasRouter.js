const { Router } = require('express');
const router = Router();

const { getAllUsersforControlActasHandler, createControlActaHandler } = require('../handlers/gestorActasRouter');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/inspectores',permisoAutorizacion(["all_system_access"]), getAllUsersforControlActasHandler);
router.post('/creteControlActa',permisoAutorizacion(["all_system_access"]), createControlActaHandler);

module.exports = router;