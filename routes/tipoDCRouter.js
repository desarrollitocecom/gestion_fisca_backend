const {Router} = require('express');
const router = Router();
const {getAllTipoDocumentoComplementariosHandler,getTipoDocumentoComplementarioHandler,
    createTipoDocumentoComplementarioHandler,deleteTipoDocumentoComplementarioHandler,
    updateTipoDocumentoComplementarioHandler
} = require('../handlers/tipoDCHandler');

router.get("/",getAllTipoDocumentoComplementariosHandler);
router.get("/:id",getTipoDocumentoComplementarioHandler);
router.post("/",createTipoDocumentoComplementarioHandler);
router.delete("/:id",deleteTipoDocumentoComplementarioHandler);
router.patch("/:id",updateTipoDocumentoComplementarioHandler)

module.exports = router;