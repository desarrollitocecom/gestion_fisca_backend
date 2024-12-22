const { Router } = require('express');
const router = Router();

const { getAllUsersforControlActasHandler, createControlActaHandler, actasActualesHandler, updateControlActaHandler } = require('../handlers/gestorActasRouter');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/inspectores',permisoAutorizacion(["all_system_access"]), getAllUsersforControlActasHandler);
router.post('/creteControlActa',permisoAutorizacion(["all_system_access"]), createControlActaHandler);

router.get('/actasActuales',permisoAutorizacion(["all_system_access"]), actasActualesHandler);
router.patch('/updateControlActa',permisoAutorizacion(["all_system_access"]), updateControlActaHandler);


module.exports = router;