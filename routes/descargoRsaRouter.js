const { Router } = require('express');
const router = Router();

const {
    createDescargoRsaHandler,
   updateDescargoRsaHandler
}= require('../handlers/descargoRsaHandler');

router.post('/',  createDescargoRsaHandler);
router.patch('/:id',   updateDescargoRsaHandler)

module.exports = router;