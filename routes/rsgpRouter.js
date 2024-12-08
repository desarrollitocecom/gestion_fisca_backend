const {Router}=require ('express');
const router = Router();
const {uploadRSGP}=require('../middlewares/uploadMiddleware')

const {
    createRsgpHandler,
}=require('../handlers/rsgpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_rsgp"]),uploadRSGP,createRsgpHandler);


module.exports = router;