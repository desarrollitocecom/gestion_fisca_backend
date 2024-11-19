const {Router}=require ('express');
const router = Router();
const {uploadRSA,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsaHandler,
    updateRsaHandler,
    getRsaHandler,
    getAllRsaHandler,
    updateinRSAHandler
    
}=require('../handlers/rsaHandler');

router.get("/",getAllRsaHandler);
router.get('/:id',getRsaHandler)
router.post("/",uploadRSA,createRsaHandler);
router.patch("/:id",uploadRSA,updateRsaHandler);
router.post("/modiIFI",uploadNone,updateinRSAHandler);

module.exports = router;