const { Router } = require('express');
const router = Router();

const { uploadRSG } = require('../../../middlewares/uploadMiddleware');
const { createRSGHandler, getAllRSG3forAR3Handler, getAllRecursoReconsideracionesHandler, createRSGRectificacionHandler, getAllIRSGForSubgerenciaHandler } = require('../handlers/areaResolutiva3Handler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/recursos-reconsideraciones',permisoAutorizacion(["all_system_access", "read_AResolutiva3"]), getAllRecursoReconsideracionesHandler);

router.patch('/newRSG/:id',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadRSG, createRSGHandler);

router.get('/created-RSG2',permisoAutorizacion(["all_system_access"]), getAllIRSGForSubgerenciaHandler);

router.patch("/RSG-rectificacion/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]), uploadRSG, createRSGRectificacionHandler);





router.get("/historialArchivados",permisoAutorizacion(["all_system_access", "read_AResolutiva3"]), getAllRSG3forAR3Handler);

module.exports = router;    