const { Router } = require('express');
const router = Router();

const {getDocumentoHandler, getDocumentoOpcionalHandler} = require('../handlers/documentoHandler');

const permisoAutorizacion = require("../../../checkers/roleAuth");


router.get('/:id', permisoAutorizacion(["all_system_access", "read_documentos"]), getDocumentoHandler);

router.get('/opcional/:id', permisoAutorizacion(["all_system_access", "read_documentos"]), getDocumentoOpcionalHandler);

module.exports = router;