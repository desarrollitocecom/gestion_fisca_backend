const {Router}=require ('express');
const router = Router();
const {getAllMedidasComplementariasHandler,getMedidaComplementariaHandler,
    deleteMedidaComplementariaHandler,updateMedidaComplementariaHandler,createMedidaComplementariaHandler,
}=require('../handlers/medidaComplementariaHandler');

router.get("/",getAllMedidasComplementariasHandler);
router.get("/:id",getMedidaComplementariaHandler);
router.post("/",createMedidaComplementariaHandler);
router.delete("/:id",deleteMedidaComplementariaHandler);
router.patch("/:id",updateMedidaComplementariaHandler);

module.exports = router;