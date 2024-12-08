const {Router} = require ('express');
const router = Router();
const {getAllEstadosRSAHandler,
    getEstadoRSAHandler,
    createEstadoRSAHandler,
    updateEstadoRSAHandler,
    deleteEstadoRSAHandler
}= require('../handlers/estadoRSAHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.get('/',permisoAutorizacion(["all_system_access", "read_estdescargorsa"]),getAllEstadosRSAHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_estdescargorsa"]),getEstadoRSAHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_estdescargorsa"]),createEstadoRSAHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_estdescargorsa"]),deleteEstadoRSAHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_estdescargorsa"]),updateEstadoRSAHandler);

module.exports = router;