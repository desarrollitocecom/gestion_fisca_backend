const { Router } = require('express');
const router = Router();
const {uploadDRG,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRgHandler,
    updateDescargoRgHandler
    
}= require('../handlers/descargoRgHandler');

router.post('/',  uploadDRG,createDescargoRgHandler);
router.patch('/:id',  uploadDRG, updateDescargoRgHandler)

module.exports = router;