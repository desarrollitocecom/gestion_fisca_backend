const { Router } = require('express');
const router = Router();
const {uploadDRSGNP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRSGNPHandler,
    updateDescargoRSGNPHandler
    
}= require('../handlers/descargoRsgnpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.post('/',permisoAutorizacion(["all_system_access", "create_descargo_rsgnp"]),  uploadDRSGNP,createDescargoRSGNPHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_descargo_rsgnp"]),  uploadDRSGNP, updateDescargoRSGNPHandler)

module.exports = router;