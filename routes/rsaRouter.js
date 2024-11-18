const {Router}=require ('express');
const router = Router();
const {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,
    updateinRSAHandler
    
}=require('../handlers/rsaHandler');

router.get("/",getAllRsaHandler);
router.get('/:id',getRsaHandler)
router.post("/",createRsaHandler);
router.patch("/:id",updateRsaHandler);
router.post("/modiIFI",updateinRSAHandler);

module.exports = router;