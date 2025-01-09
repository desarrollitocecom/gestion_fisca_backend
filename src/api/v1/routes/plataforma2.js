const { Router } = require('express');
const router = Router();

const { uploadRG, uploadRecursoAdministrativo } = require('../../../middlewares/uploadMiddleware');
const { getAllRSGforGerenciaHandler, createRGHandler, getAllRGforGerenciaHandler } = require('../handlers/gerenciaHandler');
const { getAllCargoNotificacionForIFIHandler, getAllHistoryCargoNotificacionForIFIHandler } = require('../handlers/motorizadoHandler');
const { getAllRSAforPlataformaHandler, getAllRSG2forPlataformaHandler, getAllDataForPlataformaHandler, createRecursoAdministrativoHandler, getAllRSGforPlataformaHandler } =  require("../handlers/plataforma2Handler")

router.get('/todo', getAllDataForPlataformaHandler);

router.patch('/:id', uploadRecursoAdministrativo,  createRecursoAdministrativoHandler);


module.exports = router;