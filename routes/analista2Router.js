const { Router } = require('express');
const router = Router();

const { uploadDIFI}=require('../middlewares/uploadMiddleware')
const permisoAutorizacion = require("../checkers/roleAuth");
const {createDescargoIFIHandler, sendWithoutDescargoIFIHandler, getAllIFIforAnalista2Handler}= require('../handlers/analista2Handler');

router.get('/ifi_for_analista2',permisoAutorizacion(["all_system_access", "read_Analista2"]), getAllIFIforAnalista2Handler);

router.patch('/descargoIFI/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), uploadDIFI, createDescargoIFIHandler);

router.patch('/withoutDescargoIFI/:id',permisoAutorizacion(["all_system_access", "create_Analista1"]), sendWithoutDescargoIFIHandler);


module.exports = router;    