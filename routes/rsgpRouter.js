const {Router}=require ('express');
const router = Router();
const {uploadRSGP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsgpHandler,
    updateRsgpHandler,
    getRsgpHandler,
    getAllRsgpHandler,
    updateinRsaHandler 
}=require('../handlers/rsgpHandler');


router.post("/",uploadRSGP,createRsgpHandler);
router.patch("/:id",uploadRSGP,updateRsgpHandler);
router.post("/modiRGSP",uploadNone,updateinRsaHandler);

module.exports = router;