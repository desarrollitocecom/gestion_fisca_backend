const {Router}=require ('express');
const router = Router();
const {getAllMedidasComplementariasHandler,getMedidaComplementariaHandler,
    deleteMedidaComplementariaHandler,updateMedidaComplementariaHandler,createMedidaComplementariaHandler,
}=require('../handlers/medidaComplementariaHandler');
const permisoAutorizacion = require("../../../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_Inspector"]),getAllMedidasComplementariasHandler);
router.get("/:id",permisoAutorizacion(["all_system_access", "read_Inspector"]),getMedidaComplementariaHandler);
router.post("/",permisoAutorizacion(["all_system_access", "create_mc"]),createMedidaComplementariaHandler);
router.delete("/:id",permisoAutorizacion(["all_system_access", "delete_mc"]),deleteMedidaComplementariaHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_mc"]),updateMedidaComplementariaHandler);

module.exports = router;