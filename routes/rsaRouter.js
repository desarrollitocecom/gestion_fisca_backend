const {Router}=require ('express');
const router = Router();
const {uploadRSA,}=require('../middlewares/uploadMiddleware')

const {
    createRsaHandler,
    getAllRSAforAR3Handler,
    getRsaHandler,
    getAllRsaHandler,
    updateRsasendAN5Handler
    
}=require('../handlers/rsaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/ifi_for_AreaResolutiva3",permisoAutorizacion(["all_system_access", "read_rsa"]), getAllRSAforAR3Handler);
router.get("/",permisoAutorizacion(["all_system_access", "read_rsa"]),getAllRsaHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_rsa"]),getRsaHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "create_rsa"]),uploadRSA,createRsaHandler);
router.patch("/sendAN5/:id",permisoAutorizacion(["all_system_access", "update_rsa"]),updateRsasendAN5Handler);



module.exports = router;