const { Router } = require('express');
const router = Router();

const { getPdfHandler } = require('../handlers/pdfHandler');

router.get('/verPDF', getPdfHandler);


module.exports = router;    