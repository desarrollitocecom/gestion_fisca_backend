const {Router} = require ('express');
const router = Router ();
const {getAllEjecucionMCHandler,getEjecucionMCHandler,createEjecucionMCHandler,
    updateEjecucionMCHandler,deleteEjecucionMCHandler} = require("../handlers/ejecucionMCHandler")

router.get('/',getAllEjecucionMCHandler);
router.get('/:id',getEjecucionMCHandler);
router.post('/',createEjecucionMCHandler);
router.patch('/:id',updateEjecucionMCHandler);
router.delete('/:id',deleteEjecucionMCHandler);

module.exports = router;