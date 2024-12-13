const {Router}=require ('express');
const router = Router();
const {uploadRG}=require('../middlewares/uploadMiddleware')

const {
    createRGHandler,
    getRGHandler,
    getAllRGHandler,
    updateRGHandler
    
}=require('../handlers/rgHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_Analista5"]),getAllRGHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_Analista5"]),getRGHandler)
router.patch("/:id",permisoAutorizacion(["all_system_access", "create_Gerente"]),uploadRG,createRGHandler);

router.patch("/sendAN5_RG/:id",permisoAutorizacion(["all_system_access", "update_rsgnp"]),updateRGHandler);



module.exports = router;