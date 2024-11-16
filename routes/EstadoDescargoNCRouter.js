const {Router}= require('express');
const router = Router();

const {
    getEstadoDescargoNCByIdHandler,
    getAllEstadoDescargoNCHandler,
    createEstadoDescargoNCHandler,
    deleteEstadoDescargoNCHandler,
    updateEstadoDescargoNCHandler,
  } = require('../handlers/EstadoDescargoNCHandler');
  
  router.get('/:id', getEstadoDescargoNCByIdHandler); 
  router.get('/', getAllEstadoDescargoNCHandler); 
  router.post('/', createEstadoDescargoNCHandler); 
  router.delete('/:id', deleteEstadoDescargoNCHandler);
  router.patch('/:id', updateEstadoDescargoNCHandler); 
  
  module.exports = router;