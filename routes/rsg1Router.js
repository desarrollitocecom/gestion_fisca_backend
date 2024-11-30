const {Router}=require ('express');
const router = Router();
const {uploadRSG1,uploadNone}=require('../middlewares/uploadMiddleware')
const {createRSG1Handler,
    updateRSG1Handler,
    updateinIfiHandler,
    
}=require('../handlers/rsg1Handler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.post("/",permisoAutorizacion(["all_system_access", "create_rsg1"]),uploadRSG1,createRSG1Handler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_rsg1"]),uploadRSG1,updateRSG1Handler);
router.post("/modRSG1",permisoAutorizacion(["all_system_access", "update_rsg1"]), uploadNone, updateinIfiHandler);

module.exports = router;