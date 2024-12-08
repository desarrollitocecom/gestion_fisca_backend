const { Router } = require('express');
const router = Router();

const { updateNCHandler, allNCHandler } = require('../handlers/digitadorHandler');
const { uploadDocumentsDigitador } = require('../middlewares/uploadMiddleware');
const permisoAutorizacion = require("../checkers/roleAuth");


router.get('/allNC',permisoAutorizacion(["all_system_access", "read_nc"]), allNCHandler);
router.patch('/digitarNC/:id',permisoAutorizacion(["all_system_access", "update_nc"]), uploadDocumentsDigitador, updateNCHandler);

module.exports = router;