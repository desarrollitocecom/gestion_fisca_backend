const { Router } = require('express');
const router = Router();

const { getAllDataHandler } = require('../handlers/excelHandler')

router.get('/data', getAllDataHandler);

module.exports = router;