const {Router}=require ('express');
const router = Router();
const {createRSG1Handler,
    updateRSG1Handler,
    updateinIfiHandler,
    
}=require('../handlers/rsg1Handler');


router.post("/",createRSG1Handler);
router.patch("/:id",updateRSG1Handler);
router.post("/modiIFI",updateinIfiHandler);

module.exports = router;