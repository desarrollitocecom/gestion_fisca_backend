const {Router}= require('express');
const router = Router();

const {
    getEstadoDescargoNCByIdHandler,
    getAllEstadoDescargoNCHandler,
    createEstadoDescargoNCHandler,
    deleteEstadoDescargoNCHandler,
    updateEstadoDescargoNCHandler,
  } = require('../handlers/EstadoDescargoNCHandler');
  const permisoAutorizacion = require("../checkers/roleAuth");

  router.get('/:id',permisoAutorizacion(["all_system_access", "read_estdescargonc"]), getEstadoDescargoNCByIdHandler); 
  router.get('/',permisoAutorizacion(["all_system_access", "read_estdescargonc"]), getAllEstadoDescargoNCHandler); 
  router.post('/',permisoAutorizacion(["all_system_access", "create_estdescargonc"]), createEstadoDescargoNCHandler); 
  router.delete('/:id',permisoAutorizacion(["all_system_access", "delete_estdescargonc"]), deleteEstadoDescargoNCHandler);
  router.patch('/:id',permisoAutorizacion(["all_system_access", "update_estdescargonc"]), updateEstadoDescargoNCHandler); 
  
  module.exports = router;