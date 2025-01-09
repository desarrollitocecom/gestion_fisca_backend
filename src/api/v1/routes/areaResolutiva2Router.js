const { Router } = require('express');
const router = Router();

const {uploadRSG1, uploadRSA, uploadResoSG}=require('../../../middlewares/uploadMiddleware')
const permisoAutorizacion = require("../../../checkers/roleAuth");

const {createRSG2Handler, getAllRSG2forAR2Handler, getAllIFIforAR2Handler, createRSAHandler}=require('../handlers/areaResolutiva2Handler');

router.get('/ifi_for_ar2',permisoAutorizacion(["all_system_access", "read_AResolutiva2"]), getAllIFIforAR2Handler);









router.patch("/newRSG2/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadResoSG,createRSG2Handler);


router.patch("/newRSA/:id",permisoAutorizacion(["all_system_access", "create_rsa"]),uploadRSA,createRSAHandler);








router.get("/historialArchivados",permisoAutorizacion(["all_system_access", "read_AResolutiva2"]), getAllRSG2forAR2Handler);

module.exports = router;    