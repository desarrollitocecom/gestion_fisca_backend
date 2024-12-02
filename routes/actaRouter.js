const { Router } = require('express');
const router = Router();
const {uploadActa}=require('../middlewares/uploadMiddleware')
const {
    createActaHandler
}= require('../handlers/actaHandler');

router.patch('/:id', uploadActa, createActaHandler);

module.exports = router;