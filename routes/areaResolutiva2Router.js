const { Router } = require('express');
const router = Router();

const permisoAutorizacion = require("../checkers/roleAuth");
const {uploadRSG1}=require('../middlewares/uploadMiddleware')
const {createRSG1Handler}=require('../handlers/areaResolutiva1Handler');
const { getAllIFIforAR2Handler } = require('../handlers/areaResolutiva2Handler');


router.get('/ifi_for_ar2',permisoAutorizacion(["all_system_access", "read_AResolutiva2"]), getAllIFIforAR2Handler);


router.patch("/newRSG1/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadRSG1,createRSG1Handler);



module.exports = router;    