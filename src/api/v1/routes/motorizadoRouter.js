const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler, 
    createCargoNotificacionForIFIHandler, getAllCargoNotificacionForRSGHandler, getAllHistoryCargoNotificacionForRSGHandler,
    getAllCargoNotificacionForRSAHandler, getAllHistoryCargoNotificacionForRSAHandler, getAllCargoNotificacionForRSG2Handler, getAllHistoryCargoNotificacionForRSG2Handler } = require('../handlers/motorizadoHandler');

router.get('/ifi', getAllCargoNotificacionForIFIHandler);

router.get('/cargoNotificacion/:id', createCargoNotificacionForIFIHandler);
router.get('/ifi/history', getAllHistoryCargoNotificacionForIFIHandler);

router.get('/rsg', getAllCargoNotificacionForRSGHandler);
router.get('/rsg/history', getAllHistoryCargoNotificacionForRSGHandler);

router.get('/rsa', getAllCargoNotificacionForRSAHandler);
router.get('/rsa/history', getAllHistoryCargoNotificacionForRSAHandler);

router.get('/rsg2', getAllCargoNotificacionForRSG2Handler);
router.get('/rsg2/history', getAllHistoryCargoNotificacionForRSG2Handler);

module.exports = router;    