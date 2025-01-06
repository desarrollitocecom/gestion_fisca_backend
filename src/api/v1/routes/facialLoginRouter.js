const { Router } = require('express');
const router = Router();
const { facialLoginHandler } = require('../handlers/usuarioHandler');

router.post('/registro', facialLoginHandler);


module.exports = router;