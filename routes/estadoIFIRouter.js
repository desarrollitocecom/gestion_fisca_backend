const {Router} = require ('express');
const router = Router();
const {getAllEstadosIFIHandler,
    getEstadoIFIHandler,
    createEstadoIFIHandler,
    updateEstadoIFIHandler,
    deleteEstadoIFIHandler
}= require('../handlers/estadoIFIHandler')
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/',permisoAutorizacion(["all_system_access", "read_estdescargoifi"]),getAllEstadosIFIHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_estdescargoifi"]),getEstadoIFIHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_estdescargoifi"]),createEstadoIFIHandler);
router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_estdescargoifi"]),deleteEstadoIFIHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_estdescargoifi"]),updateEstadoIFIHandler);

module.exports = router;