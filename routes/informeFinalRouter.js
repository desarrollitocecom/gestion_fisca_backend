const { Router } = require('express');
const router = Router();

const {
    createInformeFinalHandler,
    updateInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
 = require('../handlers/informeFinalHandler');

router.post('/nuevoIfi',  createInformeFinalHandler);
router.get('/',getAllInformesFinalesHandler)
router.get('/:id',getInformeFinalHandler)
router.patch('/:id',updateInformeFinalHandler)

module.exports = router;