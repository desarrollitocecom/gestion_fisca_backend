const { Router } = require('express');
const router = Router();

const { uploadDocumentsDescargoNC } = require('../middlewares/uploadMiddleware');
const { createDescargoNCHandler } = require('../handlers/analistaHandler');

router.patch('/descargoNC/:id', uploadDocumentsDescargoNC, createDescargoNCHandler);

module.exports = router;    