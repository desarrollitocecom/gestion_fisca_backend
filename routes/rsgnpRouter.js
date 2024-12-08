const {Router}=require ('express');
const router = Router();
const {uploadRSGNP}=require('../middlewares/uploadMiddleware')

const {
    createRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
}=require('../handlers/rsgnpHandler');
const permisoAutorizacion = require("../checkers/roleAuth");


router.patch("/:id",permisoAutorizacion(["all_system_access", "create_rsgnp"]),uploadRSGNP,createRsgnpHandler);
router.get("/",permisoAutorizacion(["all_system_access", "read_rsgnp"]),getAllRsgnpHandler);
router.get('/:id',permisoAutorizacion(["all_system_access", "read_rsgnp"]), getRsgnpHandler)

module.exports = router;