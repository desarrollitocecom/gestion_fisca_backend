const {Router}=require ('express');
const router = Router();
const {uploadRSGNP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler

}=require('../handlers/rsgnpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.post("/",permisoAutorizacion(["all_system_access", "create_rsgnp"]),uploadRSGNP,createRsgnpHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_rsgnp"]),uploadRSGNP, updateRsgnpHandler);
router.post("/modiRSA",permisoAutorizacion(["all_system_access", "update_rsgnp"]),uploadNone,updateinRsaHandler);

module.exports = router;