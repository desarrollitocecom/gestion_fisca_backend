const {Router}=require ('express');
const router = Router();
const {uploadRSGP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsgpHandler,
    updateRsgpHandler,
    getRsgpHandler,
    getAllRsgpHandler,
    updateinRsaHandler 
}=require('../handlers/rsgpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.post("/",permisoAutorizacion(["all_system_access", "create_rsgp"]),uploadRSGP,createRsgpHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_rsgp"]),uploadRSGP,updateRsgpHandler);
router.post("/modiRGSP",permisoAutorizacion(["all_system_access", "update_rsgp"]),uploadNone,updateinRsaHandler);

module.exports = router;