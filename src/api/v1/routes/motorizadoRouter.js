const { Router } = require('express');
const router = Router();

const { uploadRG, uploadCargo1, uploadCargo2 } = require('../../../middlewares/uploadMiddleware');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler,
    getAllCargoNotificacionForRSGHandler, getAllHistoryCargoNotificacionForRSGHandler,
    getAllCargoNotificacionForRSAHandler, getAllHistoryCargoNotificacionForRSAHandler, getAllCargoNotificacionForRSG2Handler,
    getAllHistoryCargoNotificacionForRSG2Handler, updateCargoNotificacion1ForIFIHandler, updateCargoNotificacion2ForIFIHandler,
    updateCargoNotificacion1ForResoSubgHandler, updateCargoNotificacion2ForResoSubgHandler, updateCargoNotificacion1ForResoSancHandler, updateCargoNotificacion2ForResoSancHandler,
    updateCargoNotificacion1ForRSG2Handler, updateCargoNotificacion2ForRSG2Handler,
    getAllCargoNotificacionForRGHandler, updateCargoNotificacion1ForRGHandler, updateCargoNotificacion2ForRGHandler, getAllHistoryCargoNotificacionForRGHandler
} = require('../handlers/motorizadoHandler');

router.get('/ifi', getAllCargoNotificacionForIFIHandler);

router.patch('/cargoIfi1/:id', uploadCargo1, updateCargoNotificacion1ForIFIHandler);
router.patch('/cargoIfi2/:id', uploadCargo2, updateCargoNotificacion2ForIFIHandler);

router.get('/ifi/history', getAllHistoryCargoNotificacionForIFIHandler);


router.get('/rsg', getAllCargoNotificacionForRSGHandler);

router.patch('/cargoResoSub1/:id', uploadCargo1, updateCargoNotificacion1ForResoSubgHandler);
router.patch('/cargoResoSub2/:id', uploadCargo2, updateCargoNotificacion2ForResoSubgHandler);

router.get('/rsg/history', getAllHistoryCargoNotificacionForRSGHandler);




router.get('/rsa', getAllCargoNotificacionForRSAHandler);

router.patch('/cargoResoSan1/:id', uploadCargo1, updateCargoNotificacion1ForResoSancHandler);
router.patch('/cargoResoSan2/:id', uploadCargo2, updateCargoNotificacion2ForResoSancHandler);

router.get('/rsa/history', getAllHistoryCargoNotificacionForRSAHandler);


router.get('/rsg2', getAllCargoNotificacionForRSG2Handler);

router.patch('/cargoReso2Sub1/:id', uploadCargo1, updateCargoNotificacion1ForRSG2Handler);
router.patch('/cargoReso2Sub2/:id', uploadCargo2, updateCargoNotificacion2ForRSG2Handler);

router.get('/rsg2/history', getAllHistoryCargoNotificacionForRSG2Handler);






router.get('/rg', getAllCargoNotificacionForRGHandler);

router.patch('/cargoRG1/:id', uploadCargo1, updateCargoNotificacion1ForRGHandler);
router.patch('/cargoRG2/:id', uploadCargo2, updateCargoNotificacion2ForRGHandler);

router.get('/rg/history', getAllHistoryCargoNotificacionForRGHandler);




module.exports = router;    