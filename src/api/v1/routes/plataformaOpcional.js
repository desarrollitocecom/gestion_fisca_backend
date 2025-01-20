const { Router } = require('express');
const router = Router();

const { uploadDocumentoOpcional } = require('../../../middlewares/uploadMiddleware');
const { getAllNCHandler, createOpcionalDocumentHandler } =  require("../handlers/opcionalHandler")

router.get('/all', getAllNCHandler);

router.post('/new-documento-opcional/:id', uploadDocumentoOpcional, createOpcionalDocumentHandler);


module.exports = router;