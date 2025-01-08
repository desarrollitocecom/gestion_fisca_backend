const { Router } = require('express');
const router = Router();

const { uploadRG } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler } = require('../handlers/motorizadoHandler');
const { getAllRSAforPlataformaHandler, getAllRSG2forPlataformaHandler } =  require("../handlers/plataforma2Handler")

router.get('/rsa', getAllRSAforPlataformaHandler);
router.get('/rsg2', getAllRSG2forPlataformaHandler);

module.exports = router;    