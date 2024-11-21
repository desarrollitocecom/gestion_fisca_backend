const { Router } = require('express');
const router = Router();
const {uploadIfi}=require('../middlewares/uploadMiddleware')

const {
    createInformeFinalHandler,
    updateInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
 = require('../handlers/informeFinalHandler');

router.post('/', uploadIfi, createInformeFinalHandler);
router.get('/ifis',getAllInformesFinalesHandler);
router.get('/:id',getInformeFinalHandler);
router.put('/:id',uploadIfi,updateInformeFinalHandler);

module.exports = router;