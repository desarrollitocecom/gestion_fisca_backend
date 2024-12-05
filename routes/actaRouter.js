const { Router } = require('express');
const router = Router();
const {uploadActa}=require('../middlewares/uploadMiddleware')
const {
    createActainRSAHandler,
    createActainRsgnpHandler,
    createActainRGHandler
}= require('../handlers/actaHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.patch('/inRSA/:id', uploadActa, createActainRSAHandler);
router.patch('/inRSGNP/:id', uploadActa, createActainRsgnpHandler);
router.patch('/inRG/:id', uploadActa, createActainRGHandler);
module.exports = router;