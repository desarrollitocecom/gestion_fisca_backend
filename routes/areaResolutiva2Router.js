const { Router } = require('express');
const router = Router();

const {uploadRSA,}=require('../middlewares/uploadMiddleware')
const {createRSAHandler}=require('../handlers/areaResolutiva2Handler');

const permisoAutorizacion = require("../checkers/roleAuth");
const {uploadRSG1}=require('../middlewares/uploadMiddleware')
const {createRSG2Handler, getAllRSG2forAR2Handler}=require('../handlers/areaResolutiva2Handler');
const { getAllIFIforAR2Handler } = require('../handlers/areaResolutiva2Handler');


router.get('/ifi_for_ar2',permisoAutorizacion(["all_system_access", "read_AResolutiva2"]), getAllIFIforAR2Handler);

router.patch("/newRSG2/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadRSG1,createRSG2Handler);

router.patch("/newRSA/:id",permisoAutorizacion(["all_system_access", "create_rsa"]),uploadRSA,createRSAHandler);

router.get("/historialArchivados",permisoAutorizacion(["all_system_access", "read_AResolutiva2"]), getAllRSG2forAR2Handler);

module.exports = router;    