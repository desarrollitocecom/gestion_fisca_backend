const { Router } = require('express');
const router = Router();
const {uploadDRSA}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRsaHandler,
}= require('../handlers/descargoRsaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch('/:id',permisoAutorizacion(["all_system_access", "create_Analista3"]),  uploadDRSA,createDescargoRsaHandler);


module.exports = router;