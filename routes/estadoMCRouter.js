const {Router} = require ('express');
const router = Router();
const {getAllEstadosMCHandler,getEstadoMCHandler,createEstadoMCHandler,updateEstadoMCHandler,deleteEstadoMCHandler
}= require('../handlers/estadoMCHandler')
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/',permisoAutorizacion(["all_system_access", "read_estadomc"]),getAllEstadosMCHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_estadomc"]),getEstadoMCHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_estadomc"]),createEstadoMCHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_estadomc"]),deleteEstadoMCHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_estadomc"]),updateEstadoMCHandler);

module.exports = router;