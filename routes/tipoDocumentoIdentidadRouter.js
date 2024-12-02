const {Router} = require('express');
const router = Router();

const {getAllTiposDocumentoIdentidadHandler,getTipoDocumentoIdentidadHandler,
    deleteTipoDocumentoIdentidadHandler,createTipoDocumentoIdentidadHandler,
updateTipoDocumentoIdentidadHandler}
    = require('../handlers/tipoDocumentoIdentidadHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

    router.get("/",permisoAutorizacion(["all_system_access", "read_di"]),getAllTiposDocumentoIdentidadHandler);
    router.get("/:id",permisoAutorizacion(["all_system_access", "read_di"]),getTipoDocumentoIdentidadHandler);
    router.post("/",permisoAutorizacion(["all_system_access", "create_di"]),createTipoDocumentoIdentidadHandler);
    router.delete("/:id",permisoAutorizacion(["all_system_access", "delete_di"]),deleteTipoDocumentoIdentidadHandler);
    router.patch("/:id",permisoAutorizacion(["all_system_access", "update_di"]),updateTipoDocumentoIdentidadHandler);

    module.exports = router;

