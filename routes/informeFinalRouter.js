const { Router } = require('express');
const router = Router();
const {uploadIfi}=require('../middlewares/uploadMiddleware')

const {
    createInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler,
    getAllNCforInstructivaHandler,
    getAllIFIforAR1Handler,
    getAllIFIforAnalista2Handler,
    getAllIFIforAR2Handler,
    getAllIFIforAR2ofRSAHandler
}
 = require('../handlers/informeFinalHandler');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/ifi_for_rsg2',permisoAutorizacion(["all_system_access", "read_nc"]), getAllIFIforAR2Handler);
router.get('/ifi_for_rsa',permisoAutorizacion(["all_system_access", "read_nc"]), getAllIFIforAR2ofRSAHandler);
router.get('/ifi_for_rsg1',permisoAutorizacion(["all_system_access", "read_nc"]), getAllIFIforAR1Handler);
router.get('/ifi_for_analista2',permisoAutorizacion(["all_system_access", "read_nc"]), getAllIFIforAnalista2Handler);
router.get('/nc_for_instructiva',permisoAutorizacion(["all_system_access", "read_nc"]), getAllNCforInstructivaHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_ifi"]), uploadIfi, createInformeFinalHandler);
router.get('/ifis',permisoAutorizacion(["all_system_access", "read_ifi"]),getAllInformesFinalesHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_ifi"]),getInformeFinalHandler);


module.exports = router;