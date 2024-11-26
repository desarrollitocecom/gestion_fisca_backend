const { Router } = require('express');
const router = Router();
const { uploadDIFI}=require('../middlewares/uploadMiddleware')
const {
    createDescargoHandler,
    updateDescargoHandler
}= require('../handlers/descargoInformeFinalHandler');

router.post('/newifi', uploadDIFI, createDescargoHandler);
router.patch('/:id', uploadDIFI,updateDescargoHandler)

module.exports = router;