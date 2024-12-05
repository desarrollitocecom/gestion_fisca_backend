const { Router } = require('express');
const router = Router();
const {uploadIfi}=require('../middlewares/uploadMiddleware')

const {
    createInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
 = require('../handlers/informeFinalHandler');
 const permisoAutorizacion = require("../checkers/roleAuth");

router.post('/',permisoAutorizacion(["all_system_access", "create_ifi"]), uploadIfi, createInformeFinalHandler);
router.get('/ifis',permisoAutorizacion(["all_system_access", "read_ifi"]),getAllInformesFinalesHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_ifi"]),getInformeFinalHandler);


module.exports = router;