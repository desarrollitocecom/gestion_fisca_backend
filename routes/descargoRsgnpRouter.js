const { Router } = require('express');
const router = Router();
const {uploadDRSGNP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRSGNPHandler,
    updateDescargoRSGNPHandler
    
}= require('../handlers/descargoRsgnpHandler');

router.post('/',  uploadDRSGNP,createDescargoRSGNPHandler);
router.patch('/:id',  uploadDRSGNP, updateDescargoRSGNPHandler)

module.exports = router;