const {Router} = require ('express');
const router = Router ();
const {getAllEjecucionMCHandler,getEjecucionMCHandler,createEjecucionMCHandler,
    updateEjecucionMCHandler,deleteEjecucionMCHandler} = require("../handlers/ejecucionMCHandler");

const permisoAutorizacion = require("../checkers/roleAuth");


router.get('/',permisoAutorizacion(["all_system_access", "read_ejecucionmc"]),getAllEjecucionMCHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_ejecucionmc"]),getEjecucionMCHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_ejecucionmc"]),createEjecucionMCHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_ejecucionmc"]),updateEjecucionMCHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_ejecucionmc"]),deleteEjecucionMCHandler);

module.exports = router;