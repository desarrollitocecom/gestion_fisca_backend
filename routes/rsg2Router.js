const {Router}=require ('express');
const router = Router();
const {uploadRSG2,uploadNone}=require('../middlewares/uploadMiddleware')
const {
    createRSG2Handler,
    updateRSG2Handler,
    updateinIfiHandler
}=require('../handlers/rsg2Handler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_rsg2"]),uploadRSG2,createRSG2Handler);


module.exports = router;