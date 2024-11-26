const {Router} = require ('express');
const router = Router();
const {getAllEstadosRSAHandler,
    getEstadoRSAHandler,
    createEstadoRSAHandler,
    updateEstadoRSAHandler,
    deleteEstadoRSAHandler
}= require('../handlers/estadoRSAHandler')

router.get('/',getAllEstadosRSAHandler);
router.get('/:id',getEstadoRSAHandler);
router.post('/',createEstadoRSAHandler);
router.delete('/:id',deleteEstadoRSAHandler);
router.patch('/:id',updateEstadoRSAHandler);

module.exports = router;