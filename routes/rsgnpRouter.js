const {Router}=require ('express');
const router = Router();
const {
    createRsgnpHandler,
    updateRsgnpHandler,
    getRsgnpHandler,
    getAllRsgnpHandler,
    updateinRsaHandler

}=require('../handlers/rsgnpHandler');


router.post("/",createRsgnpHandler);
router.patch("/:id", updateRsgnpHandler);
router.post("/modiRSA",updateinRsaHandler);

module.exports = router;