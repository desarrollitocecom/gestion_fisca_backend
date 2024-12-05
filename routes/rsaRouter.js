const {Router}=require ('express');
const router = Router();
const {uploadRSA,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,
   
    
}=require('../handlers/rsaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_rsa"]),getAllRsaHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_rsa"]),getRsaHandler)
router.patch("/:id",permisoAutorizacion(["all_system_access", "create_rsa"]),uploadRSA,createRsaHandler);


module.exports = router;