const { Router } = require('express');
const router = Router();

const { uploadRSG } = require('../middlewares/uploadMiddleware');
const { getAllRSAforAR3Handler, createRSGHandler, getAllRSG3forAR3Handler } = require('../handlers/areaResolutiva3Handler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/rsa_for_ar3',permisoAutorizacion(["all_system_access", "read_AResolutiva3"]), getAllRSAforAR3Handler);

router.patch('/newRSG/:id',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadRSG, createRSGHandler);

router.get("/historialArchivados",permisoAutorizacion(["all_system_access", "read_AResolutiva3"]), getAllRSG3forAR3Handler);

module.exports = router;    