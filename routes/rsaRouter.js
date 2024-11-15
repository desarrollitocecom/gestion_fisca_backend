const {Router}=require ('express');
const router = Router();
const {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,
    updateinIfiHandler
    
}=require('../handlers/rsaHandler');

router.get("/",getAllRsaHandler);
router.get('/:id',getRsaHandler)
router.post("/",createRsaHandler);
router.patch("/:id",updateRsaHandler);
router.post("/modiIFI",updateinIfiHandler);

module.exports = router;