const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler, getAllRecursosApelacionesHandler, createRGRectificacionHandler } = require('../handlers/gerenciaHandler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get('/recursos-apelaciones',permisoAutorizacion(["all_system_access"]), getAllRecursosApelacionesHandler);

router.patch('/newRG/:id',permisoAutorizacion(["all_system_access"]),uploadRG, createRGHandler);

router.patch('/RG-rectificacion/:id/:id',permisoAutorizacion(["all_system_access"]),uploadRG, createRGRectificacionHandler);

router.get("/historialArchivados",permisoAutorizacion(["all_system_access"]), getAllRGforGerenciaHandler);


module.exports = router;    