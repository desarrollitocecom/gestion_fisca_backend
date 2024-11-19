const {Router}=require ('express');
const router = Router();
const {uploadRSGNP,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler

}=require('../handlers/rsgnpHandler');


router.post("/",uploadRSGNP,createRsgnpHandler);
router.patch("/:id",uploadRSGNP, updateRsgnpHandler);
router.post("/modiRSA",uploadNone,updateinRsaHandler);

module.exports = router;