const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler } = require('../handlers/gerenciaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/rsg_for_gerencia',permisoAutorizacion(["all_system_access"]), getAllRSGforGerenciaHandler);

router.patch('/newRG/:id',permisoAutorizacion(["all_system_access", "create_AInstructiva"]),uploadRG, createRGHandler);



module.exports = router;    