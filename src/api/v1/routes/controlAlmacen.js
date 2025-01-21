const { Router } = require('express');
const router = Router();

const { uploadFotosActas } = require('../../../middlewares/evidenciasMiddleware');
const { generatePaquete, getOrdenanzas, sacarActas, asignarActa, getAllSalidasFromPaquete, devolverActa, getAllPaquetes, seguimientoHandler, actasActuales, getActaActual, getActasRealizadasActual, getActasEntregadasActual, getActasPorRealizarActual } = require('../handlers/paqueteHandler');

router.get('/paquetes', getAllPaquetes);

router.get('/ordenanzas', getOrdenanzas);

router.get('/salidas/:id', getAllSalidasFromPaquete);

router.post('/newPaquete', generatePaquete);

router.patch('/sacarActas', sacarActas);

router.get('/actasActuales', actasActuales);

router.get('/getActaActual/:id', getActaActual);

router.get('/getActasRealizadasActual/:id', getActasRealizadasActual)

router.get('/getActasEntregadasActual/:id', getActasEntregadasActual)

router.get('/getActasPorRealizarActual/:id', getActasPorRealizarActual)

router.post('/asignarActa', asignarActa);

router.post('/devolverActa', uploadFotosActas, devolverActa);

router.get('/seguimiento', seguimientoHandler);

module.exports = router;