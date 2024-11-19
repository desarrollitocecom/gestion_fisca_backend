const {Router}=require ('express');
const router = Router();
const {uploadRG,uploadNone}=require('../middlewares/uploadMiddleware')

const {
    createRGHandler,
    updateRGHandler,
    getRGHandler,
    getAllRGHandler
    
}=require('../handlers/rgHandler');

router.get("/",getAllRGHandler);
router.get('/:id',getRGHandler)
router.post("/",uploadRG,createRGHandler);
router.patch("/:id",uploadRG,updateRGHandler);

module.exports = router;