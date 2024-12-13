const {Router}=require ('express');
const router = Router();
const {uploadRSGNP}=require('../middlewares/uploadMiddleware')

const {
    createRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateRsgnpHandler
}=require('../handlers/rsgnpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_AResolutiva3"]),uploadRSGNP,createRsgnpHandler);
router.get("/",permisoAutorizacion(["all_system_access", "read_Analista4", "read_Gerente", "read_Analista5"]),getAllRsgnpHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_Analista4", "read_Gerente", "read_Analista5"]), getRsgnpHandler)

//Esto se da en el Analista 3 el modifica el RSGNP Agregar permisos
router.patch('/sendAN5_rsgnp/:id',permisoAutorizacion(["all_system_access"]), updateRsgnpHandler)

module.exports = router;