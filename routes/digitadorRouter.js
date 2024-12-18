const { Router } = require('express');
const router = Router();

const { updateNCHandler, allNCHandler, getCodigos, sendDetalle } = require('../handlers/digitadorHandler');
const { uploadDocumentsDigitador } = require('../middlewares/uploadMiddleware');
const permisoAutorizacion = require("../checkers/roleAuth");


router.get('/allNC',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), allNCHandler);
router.patch('/digitarNC/:id',permisoAutorizacion(["all_system_access", "create_Digitador", "create_Analista1"]), uploadDocumentsDigitador, updateNCHandler);

router.get('/cuis',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getCodigos);
router.get('/cuis',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), sendDetalle);

module.exports = router;