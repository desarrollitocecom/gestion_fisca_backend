const { Router } = require('express');
const router = Router();
const {uploadIfi}=require('../middlewares/uploadMiddleware')

const {
    createInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler,
    getAllNCforInstructivaHandler
}
 = require('../handlers/informeFinalHandler');

const permisoAutorizacion = require("../checkers/roleAuth");

router.get('/nc_for_instructiva',permisoAutorizacion(["all_system_access", "read_Digitador","read_Analista1"]), getAllNCforInstructivaHandler);
router.post('/',permisoAutorizacion(["all_system_access", "create_AInstructiva"]), uploadIfi, createInformeFinalHandler);
router.get('/ifis',permisoAutorizacion(["all_system_access", "read_AResolutiva1", "read_Analista2", "read_AResolutiva2"]),getAllInformesFinalesHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_AResolutiva1", "read_Analista2", "read_AResolutiva2"]),getInformeFinalHandler);


module.exports = router;