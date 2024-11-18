const { Router } = require('express');
const router = Router();
const multer=require('multer');
const path=require('path');
const uploadDir=path.resolve(__dirname,'../uploads/ifi');
const upload=multer({dest: uploadDir});

const {
    createInformeFinalHandler,
    updateInformeFinalHandler,
    getAllInformesFinalesHandler,
    getInformeFinalHandler
}
 = require('../handlers/informeFinalHandler');

router.post('/', upload.fields([
    {
        name:'documento_ifi',
        maxCount:1
    }
]), createInformeFinalHandler);

router.get('/ifis',getAllInformesFinalesHandler)
router.get('/:id',getInformeFinalHandler)
router.patch('/:id',updateInformeFinalHandler)

module.exports = router;