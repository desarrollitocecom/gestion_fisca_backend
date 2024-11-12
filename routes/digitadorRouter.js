const { Router } = require('express');
const router = Router();

const { createNCHandler } = require('../handlers/digitadorHandler');

router.patch('/nuevoNC/:id', createNCHandler);

module.exports = router;