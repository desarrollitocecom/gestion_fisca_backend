const {Router} = require('express');
const router = Router();
const {getAllTipoDocumentoComplementariosHandler,getTipoDocumentoComplementarioHandler,
    createTipoDocumentoComplementarioHandler,deleteTipoDocumentoComplementarioHandler,
    updateTipoDocumentoComplementarioHandler
} = require('../handlers/tipoDCHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.get("/",permisoAutorizacion(["all_system_access", "read_dc"]),getAllTipoDocumentoComplementariosHandler);
router.get("/:id",permisoAutorizacion(["all_system_access", "read_dc"]),getTipoDocumentoComplementarioHandler);
router.post("/",permisoAutorizacion(["all_system_access", "create_dc"]),createTipoDocumentoComplementarioHandler);
router.delete("/:id",permisoAutorizacion(["all_system_access", "delete_dc"]),deleteTipoDocumentoComplementarioHandler);
router.patch("/:id",permisoAutorizacion(["all_system_access", "update_dc"]),updateTipoDocumentoComplementarioHandler)

module.exports = router;