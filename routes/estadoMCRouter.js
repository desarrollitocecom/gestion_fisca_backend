const {Router} = require ('express');
const router = Router();
const {getAllEstadosMCHandler,getEstadoMCHandler,createEstadoMCHandler,updateEstadoMCHandler,deleteEstadoMCHandler
}= require('../handlers/estadoMCHandler')

router.get('/',getAllEstadosMCHandler);
router.get('/:id',getEstadoMCHandler);
router.post('/',createEstadoMCHandler);
router.delete('/:id',deleteEstadoMCHandler);
router.patch('/:id',updateEstadoMCHandler);

module.exports = router;