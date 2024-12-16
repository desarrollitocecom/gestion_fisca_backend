const { Router } = require('express');
const router = Router();

const permisoAutorizacion = require("../checkers/roleAuth");

const { getAllIFIforAR1Handler } = require('../handlers/informeFinalHandler');
const {uploadRSG1}=require('../middlewares/uploadMiddleware')
const {createRSG1Handler, getAllRSG1forAR1Handler}=require('../handlers/areaResolutiva1Handler');

router.get('/ifi_for_rsg1',permisoAutorizacion(["all_system_access", "read_AResolutiva1"]), getAllIFIforAR1Handler);

router.patch("/newRSG1/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadRSG1,createRSG1Handler);

router.get("/historialArchivados",permisoAutorizacion(["all_system_access", "read_AResolutiva1"]), getAllRSG1forAR1Handler);


module.exports = router;    