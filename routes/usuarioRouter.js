const { Router } = require('express');
const router = Router();
const { getAllUsersHandler, getUserByIdHandler, deleteUserHandler, updateUsersHandler } = require('../handlers/usuarioHandler');
const permisoAutorizacion = require("../checkers/roleAuth");

router.patch("/update/:id", permisoAutorizacion(["all_system_access", "read_usuarios"]), updateUsersHandler);

router.get("/", permisoAutorizacion(["all_system_access", "read_usuarios"]), getAllUsersHandler);
router.get("/myuser",  getUserByIdHandler);
router.delete("/:usuario", permisoAutorizacion(["all_system_access", "delete_usuarios"]), deleteUserHandler);


module.exports = router;