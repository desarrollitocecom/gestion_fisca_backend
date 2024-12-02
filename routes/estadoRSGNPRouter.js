const {Router} = require ('express');
const router = Router();
const {getAllEstadosRSGNPHandler,
    getEstadoRSGNPHandler,
    createEstadoRSGNPHandler,
    updateEstadoRSGNPHandler,
    deleteEstadoRSGNPHandler
}= require('../handlers/estadoRSGNPHandler')
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/',permisoAutorizacion(["all_system_access", "read_estdescargorsgnp"]),getAllEstadosRSGNPHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_estdescargorsgnp"]),getEstadoRSGNPHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_estdescargorsgnp"]),createEstadoRSGNPHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_estdescargorsgnp"]),deleteEstadoRSGNPHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_estdescargorsgnp"]),updateEstadoRSGNPHandler);
    
module.exports = router;