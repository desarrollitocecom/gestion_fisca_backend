const {Router} = require ('express');
const router = Router();
const {getAllEstadosIFIHandler,
    getEstadoIFIHandler,
    createEstadoIFIHandler,
    updateEstadoIFIHandler,
    deleteEstadoIFIHandler
}= require('../handlers/estadoIFIHandler')

router.get('/',getAllEstadosIFIHandler);
router.get('/:id',getEstadoIFIHandler);
router.post('/',createEstadoIFIHandler);
router.delete('/:id',deleteEstadoIFIHandler);
router.patch('/:id',updateEstadoIFIHandler);

module.exports = router;