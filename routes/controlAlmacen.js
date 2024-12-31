const { Router } = require('express');
const router = Router();

const { generatePaquete, sacarActas, asignarActa, devolverActa } = require('../handlers/paqueteHandler');


router.post('/newPaquete', generatePaquete);

router.patch('/sacarActa', sacarActas);

router.patch('/asignarActa', asignarActa);

router.patch('/devolverActa', devolverActa);

module.exports = router;    