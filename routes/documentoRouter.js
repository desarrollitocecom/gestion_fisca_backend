const { Router } = require('express');
const router = Router();

const { 
    getDocumentoHandler
} = require('../handlers/documentoHandler');



router.get('/:id', getDocumentoHandler);


module.exports = router;