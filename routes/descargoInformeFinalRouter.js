const { Router } = require('express');
const router = Router();
const { uploadDIFI}=require('../middlewares/uploadMiddleware')
const {
    createDescargoHandler,
    updateDescargoHandler
}= require('../handlers/descargoInformeFinalHandler');
const permisoAutorizacion = require("../checkers/roleAuth");



router.post('/newifi',permisoAutorizacion(["all_system_access", "create_descargo_ifi"]), uploadDIFI, createDescargoHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_descargo_nc"]), uploadDIFI,updateDescargoHandler)

module.exports = router;