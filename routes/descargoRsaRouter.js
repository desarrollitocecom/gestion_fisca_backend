const { Router } = require('express');
const router = Router();
const {uploadDRSA,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRsaHandler,
   updateDescargoRsaHandler
}= require('../handlers/descargoRsaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.post('/',permisoAutorizacion(["all_system_access", "create_descargo_rsa"]),  uploadDRSA,createDescargoRsaHandler);
router.patch('/:id',permisoAutorizacion(["all_system_access", "update_descargo_rsa"]), uploadDRSA,  updateDescargoRsaHandler)

module.exports = router;