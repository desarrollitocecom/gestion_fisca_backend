const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler } = require('../handlers/motorizadoHandler');

router.get('/ifi', getAllCargoNotificacionForIFIHandler);

// router.patch('/newRG/:id',uploadRG, createRGHandler);

// router.get("/historialArchivados", getAllRGforGerenciaHandler);


module.exports = router;    