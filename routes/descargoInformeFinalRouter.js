const { Router } = require('express');
const router = Router();

const {
    createDescargoHandler,
    updateDescargoHandler
}= require('../handlers/descargoInformeFinalHandler');

router.post('/newifi',  createDescargoHandler);
router.patch('/:id',updateDescargoHandler)

module.exports = router;