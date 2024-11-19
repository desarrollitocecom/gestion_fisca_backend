const {Router}=require ('express');
const router = Router();
const {uploadRSG2,uploadNone}=require('../middlewares/uploadMiddleware')
const {
    createRSG2Handler,
    updateRSG2Handler,
    updateinIfiHandler
}=require('../handlers/rsg2Handler');


router.post("/",uploadRSG2,createRSG2Handler);
router.patch("/:id",uploadRSG2,updateRSG2Handler);
router.post("/modRSG2",uploadNone,updateinIfiHandler);

module.exports = router;