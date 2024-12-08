const { Router } = require('express');
const router = Router();
const {uploadDRSGNP}=require('../middlewares/uploadMiddleware')

const {
    createDescargoRSGNPHandler, 
}= require('../handlers/descargoRsgnpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch('/:id',permisoAutorizacion(["all_system_access", "create_descargo_rsgnp"]),  uploadDRSGNP,createDescargoRSGNPHandler);

module.exports = router;