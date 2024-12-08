const { Router } = require('express');
const router = Router();
const { uploadDIFI}=require('../middlewares/uploadMiddleware')
const {
    createDescargoHandler,
}= require('../handlers/descargoInformeFinalHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.patch('/:id',permisoAutorizacion(["all_system_access", "create_descargo_ifi"]), uploadDIFI, createDescargoHandler);

module.exports = router;