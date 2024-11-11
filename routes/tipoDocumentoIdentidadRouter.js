const {Router} = require('express');
const router = Router();

const {getAllTiposDocumentoIdentidadHandler,getTipoDocumentoIdentidadHandler,
    deleteTipoDocumentoIdentidadHandler,createTipoDocumentoIdentidadHandler,
updateTipoDocumentoIdentidadHandler}
    = require('../handlers/tipoDocumentoIdentidadHandler');

    router.get("/",getAllTiposDocumentoIdentidadHandler);
    router.get("/:id",getTipoDocumentoIdentidadHandler);
    router.post("/",createTipoDocumentoIdentidadHandler);
    router.delete("/:id",deleteTipoDocumentoIdentidadHandler);
    router.patch("/:id",updateTipoDocumentoIdentidadHandler);

    module.exports = router;

