const { Router } = require('express');
const router = Router();

const { 
    getDocumentoHandler
} = require('../handlers/documentoHandler');

const permisoAutorizacion = require("../checkers/roleAuth");


router.get('/:id', permisoAutorizacion(["all_system_access", "read_documentos"]), getDocumentoHandler);


module.exports = router;