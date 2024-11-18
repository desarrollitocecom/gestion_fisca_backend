const {Router}=require ('express');
const router = Router();
const {
    createRGHandler,
    updateRGHandler,
    getRGHandler,
    getAllRGHandler
    
}=require('../handlers/rgHandler');

router.get("/",getAllRGHandler);
router.get('/:id',getRGHandler)
router.post("/",createRGHandler);
router.patch("/:id",updateRGHandler);

module.exports = router;