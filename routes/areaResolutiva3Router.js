const { Router } = require('express');
const router = Router();

const {uploadRSA,}=require('../middlewares/uploadMiddleware')
const {createRSAHandler}=require('../handlers/areaResolutiva2Handler');

const { uploadRSG } = require('../middlewares/uploadMiddleware');
const { getAllRSAforAR3Handler, createRSGHandler } = require('../handlers/areaResolutiva3Handler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/rsa_for_ar3',permisoAutorizacion(["all_system_access", "read_AResolutiva3"]), getAllRSAforAR3Handler);

router.patch('/newRSG/:id',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadRSG, createRSGHandler);

// router.patch("/newRSG2/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadRSG1,createRSG2Handler);

// router.patch("/newRSA/:id",permisoAutorizacion(["all_system_access", "create_rsa"]),uploadRSA,createRSAHandler);


module.exports = router;    