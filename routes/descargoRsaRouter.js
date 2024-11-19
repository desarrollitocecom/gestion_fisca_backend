const { Router } = require('express');
const router = Router();
const {uploadDRSA,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRsaHandler,
   updateDescargoRsaHandler
}= require('../handlers/descargoRsaHandler');

router.post('/',  uploadDRSA,createDescargoRsaHandler);
router.patch('/:id', uploadDRSA,  updateDescargoRsaHandler)

module.exports = router;