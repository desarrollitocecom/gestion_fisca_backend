const { Router } = require('express');
const router = Router();

const { uploadRecursoAdministrativo } = require('../../../middlewares/uploadMiddleware');
const { getAllDataForPlataformaHandler, createRecursoAdministrativoHandler } =  require("../handlers/plataforma2Handler")

router.get('/todo', getAllDataForPlataformaHandler);

router.patch('/:id', uploadRecursoAdministrativo,  createRecursoAdministrativoHandler);


module.exports = router;