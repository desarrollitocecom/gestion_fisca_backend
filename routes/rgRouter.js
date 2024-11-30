const {Router}=require ('express');
const router = Router();
const {uploadRG,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRGHandler,
    updateRGHandler,
    getRGHandler,
    getAllRGHandler
    
}=require('../handlers/rgHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_rg"]),getAllRGHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_rg"]),getRGHandler)
router.post("/",permisoAutorizacion(["all_system_access", "create_rg"]),uploadRG,createRGHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_rg"]),uploadRG,updateRGHandler);

module.exports = router;