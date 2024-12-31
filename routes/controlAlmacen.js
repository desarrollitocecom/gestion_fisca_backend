const { Router } = require('express');
const router = Router();

const { generatePaquete, sacarActas, asignarActa, devolverActa, getAllPaquetes, seguimientoHandler } = require('../handlers/paqueteHandler');

router.get('/paquetes', getAllPaquetes);
router.post('/newPaquete', generatePaquete);

router.patch('/sacarActas', sacarActas);

router.patch('/asignarActa', asignarActa);

router.patch('/devolverActa', devolverActa);

router.patch('/devolverActa', devolverActa);

router.get('/seguimiento', seguimientoHandler);

module.exports = router;    