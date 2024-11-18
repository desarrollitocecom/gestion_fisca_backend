const { Router } = require('express');
const router = Router();

const {
    createDescargoRgHandler,
    updateDescargoRgHandler
    
}= require('../handlers/descargoRgHandler');

router.post('/',  createDescargoRgHandler);
router.patch('/:id',   updateDescargoRgHandler)

module.exports = router;