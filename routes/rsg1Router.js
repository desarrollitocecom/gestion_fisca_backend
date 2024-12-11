const {Router}=require ('express');
const router = Router();
const {uploadRSG1}=require('../middlewares/uploadMiddleware')
const {createRSG1Handler,
   
    
}=require('../handlers/rsg1Handler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva1"]),uploadRSG1,createRSG1Handler);

module.exports = router;