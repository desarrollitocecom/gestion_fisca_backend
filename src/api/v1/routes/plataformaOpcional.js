const { Router } = require('express');
const router = Router();

const { uploadDocumentoOpcional } = require('../../../middlewares/uploadMiddleware');
const { getAllNCHandler } =  require("../handlers/opcionalHandler")

router.get('/all', getAllNCHandler);

// router.patch('/:id', uploadDocumentoOpcional,  createRecursoAdministrativoHandler);


module.exports = router;