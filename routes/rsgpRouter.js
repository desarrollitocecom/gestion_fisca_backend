const {Router}=require ('express');
const router = Router();
const {uploadRSG}=require('../middlewares/uploadMiddleware')

const {
    createRsgpHandler,
}=require('../handlers/rsgpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva3"]),uploadRSG,createRsgpHandler);


module.exports = router;