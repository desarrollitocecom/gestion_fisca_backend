const { Router } = require('express');
const router = Router();

const { updateNCHandler, allNCHandler } = require('../handlers/digitadorHandler');

router.get('/allNC', allNCHandler);
router.patch('/digitarNC/:id', updateNCHandler);

module.exports = router;