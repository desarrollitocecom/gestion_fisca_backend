const {Router} = require ('express');
const router = Router();
const {getAllEstadosRSGNPHandler,
    getEstadoRSGNPHandler,
    createEstadoRSGNPHandler,
    updateEstadoRSGNPHandler,
    deleteEstadoRSGNPHandler
}= require('../handlers/estadoRSGNPHandler')

router.get('/',getAllEstadosRSGNPHandler);
router.get('/:id',getEstadoRSGNPHandler);
router.post('/',createEstadoRSGNPHandler);
router.delete('/:id',deleteEstadoRSGNPHandler);
router.patch('/:id',updateEstadoRSGNPHandler);

module.exports = router;