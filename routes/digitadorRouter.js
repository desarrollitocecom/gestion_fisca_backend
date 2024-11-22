const { Router } = require('express');
const router = Router();

const { updateNCHandler, allNCHandler } = require('../handlers/digitadorHandler');
const { uploadDocumentsDigitador } = require('../middlewares/uploadMiddleware');

router.get('/allNC', allNCHandler);
router.patch('/digitarNC/:id', uploadDocumentsDigitador, updateNCHandler);

module.exports = router;