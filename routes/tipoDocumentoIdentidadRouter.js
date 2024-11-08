const {Router} = require('express');
const router = Router();

const {getAllTiposDocumentoIdentidadHandler,getTipoDocumentoIdentidadHandler,
    deleteTipoDocumentoIdentidadHandler,createTipoDocumentoIdentidadHandler,
updateTipoDocumentoIdentidadHandler}
    =require('../handlers/tipoDocumentoIdentidadHandler')