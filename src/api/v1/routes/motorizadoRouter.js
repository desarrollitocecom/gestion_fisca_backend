const { Router } = require('express');
const router = Router();

const { uploadRG, uploadCargo1, uploadCargo2 } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler,
    getAllCargoNotificacionForRSGHandler, getAllHistoryCargoNotificacionForRSGHandler,
    getAllCargoNotificacionForRSAHandler, getAllHistoryCargoNotificacionForRSAHandler, getAllCargoNotificacionForRSG2Handler,
    getAllHistoryCargoNotificacionForRSG2Handler, updateCargoNotificacion1ForIFIHandler, updateCargoNotificacion2ForIFIHandler,
    updateCargoNotificacion1ForResoSubgHandler, updateCargoNotificacion2ForResoSubgHandler
} = require('../handlers/motorizadoHandler');

router.get('/ifi', getAllCargoNotificacionForIFIHandler);
router.patch('/cargoIfi1/:id', uploadCargo1, updateCargoNotificacion1ForIFIHandler);
router.patch('/cargoIfi2/:id', uploadCargo2, updateCargoNotificacion2ForIFIHandler);

//router.get('/cargoNotificacion/:id', createCargoNotificacionForIFIHandler);
router.get('/ifi/history', getAllHistoryCargoNotificacionForIFIHandler);

router.get('/rsg', getAllCargoNotificacionForRSGHandler);
router.get('/rsg/history', getAllHistoryCargoNotificacionForRSGHandler);
router.patch('/cargoResoSub1/:id', uploadCargo1, updateCargoNotificacion1ForResoSubgHandler);
router.patch('/cargoResoSub2/:id', uploadCargo2, updateCargoNotificacion2ForResoSubgHandler);

router.get('/rsa', getAllCargoNotificacionForRSAHandler);
router.get('/rsa/history', getAllHistoryCargoNotificacionForRSAHandler);

router.get('/rsg2', getAllCargoNotificacionForRSG2Handler);
router.get('/rsg2/history', getAllHistoryCargoNotificacionForRSG2Handler);

module.exports = router;    