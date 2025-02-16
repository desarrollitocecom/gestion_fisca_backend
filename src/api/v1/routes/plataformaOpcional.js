const { Router } = require('express');
const router = Router();

const { uploadDocumentoOpcional } = require('../../../middlewares/uploadMiddleware');
const { getAllNCHandler, createOpcionalDocumentHandler } =  require("../handlers/opcionalHandler")
const { getDocumentoOpcionalHandler } = require('../handlers/documentoHandler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/all', getAllNCHandler);

router.post('/new-documento-opcional/:id', uploadDocumentoOpcional, createOpcionalDocumentHandler);

router.get('/opcional/:id', permisoAutorizacion(["all_system_access", "read_documentos"]), getDocumentoOpcionalHandler);


module.exports = router;