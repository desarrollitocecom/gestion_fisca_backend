const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler, createCargoNotificacionForIFIHandler } = require('../handlers/motorizadoHandler');

router.get('/ifi', getAllCargoNotificacionForIFIHandler);
router.get('/cargoNotificacion/:id', createCargoNotificacionForIFIHandler);
router.get('/ifi/history', getAllHistoryCargoNotificacionForIFIHandler);

module.exports = router;    