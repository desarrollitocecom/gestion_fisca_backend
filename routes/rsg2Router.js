const {Router}=require ('express');
const router = Router();
const {
    createRSG2Handler,
    updateRSG2Handler,
    updateinIfiHandler
}=require('../handlers/rsg2Handler');


router.post("/",createRSG2Handler);
router.patch("/:id",updateRSG2Handler);
router.post("/modRSG2",updateinIfiHandler);

module.exports = router;