const {Router}=require ('express');
const router = Router();
const {
    createRsgpHandler,
    updateRsgpHandler,
    getRsgpHandler,
    getAllRsgpHandler,
    updateinRsaHandler 
}=require('../handlers/rsgpHandler');


router.post("/",createRsgpHandler);
router.patch("/:id",updateRsgpHandler);
router.post("/modiRGSP",updateinRsaHandler);

module.exports = router;