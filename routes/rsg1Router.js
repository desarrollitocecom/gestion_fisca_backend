const {Router}=require ('express');
const router = Router();
const {uploadRSG1,uploadNone}=require('../middlewares/uploadMiddleware')
const {createRSG1Handler,
    updateRSG1Handler,
    updateinIfiHandler,
    
}=require('../handlers/rsg1Handler');


router.post("/",uploadRSG1,createRSG1Handler);
router.patch("/:id",uploadRSG1,updateRSG1Handler);
router.post("/modiRGS1",updateinIfiHandler);

module.exports = router;