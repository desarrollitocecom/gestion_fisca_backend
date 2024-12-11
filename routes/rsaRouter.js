const {Router}=require ('express');
const router = Router();
const {uploadRSA}=require('../middlewares/uploadMiddleware')

const {
    createRsaHandler,
    
    getRsaHandler,
    getAllRsaHandler,
   
    
}=require('../handlers/rsaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_Analista3", "read_Analista5",  "read_AResolutiva3"]),getAllRsaHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_Analista3", "read_Analista5", "read_AResolutiva3"]),getRsaHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva2"]),uploadRSA,createRsaHandler);


module.exports = router;