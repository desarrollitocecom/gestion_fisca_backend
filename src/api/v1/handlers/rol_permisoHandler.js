const { createPermiso, createRol, getAllRols, getRolById, getAllPermisos, getPermisoById, getPermisosByRolId, updateRol, deleteRol, deletePermiso, updatePermiso } = require("../controllers/rol_permisoController");
//const { createHistorial } = require('../controllers/historialController');
const jwt = require("jsonwebtoken");

const createPermisoHandler = async (req, res) => {

    const { action, resource, descripcion } = req.body;
    const token = req.user;

    const errors = [];
    if (!action) errors.push("action es requerida");
    if (!resource) errors.push("resource es requerida");
    if (!descripcion) errors.push("descripcion es requerida");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguiente errores: ", data: errors.join("\n") });

    try {
        const permiso = await createPermiso(action, resource, descripcion);
        if (!permiso) return res.status(400).json({ message: "Error al crear el permiso", data: permiso });

        // Comentado historial
        // const historial = await createHistorial(
        //     'create',
        //     'Permiso',
        //     'action, resource, descripcion',
        //     null,
        //     `${action}, ${resource}, ${descripcion}`,
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(201).json({ message: "Permiso creado correctamente", data: permiso });
        
    } catch (error) {
        console.error("Error en el createPermisoHandler: ", error.message);
        return res.status(500).json({ message: "Error en createPermisoHandler", error: error.message });
    }
};

const getRolPermisosHandler = async (req, res) => {

    const { id } = req.params;
    const { rol, usuario } = jwt.verify(req.user, process.env.JWT_SECRET);
    //console.log(rol, id);
    try {
        const permisos = await getPermisosByRolId(rol);

        if (permisos === null) {
            return res.status(404).json({ message: "Rol no encontrado o sin permisos asociados", data: [] });
        }

        return res.status(200).json({
            message: "Permisos obtenidos correctamente",
            data: permisos
        });
    } catch (error) {
        console.error("Error en getRolPermisosHandler:", error.message);
        return res.status(500).json({ message: "Error en getRolPermisosHandler", error: error.message });
    }
};

const createRolHandler = async (req, res) => {

    const { nombre, descripcion, permisos } = req.body;
    const token = req.user;

    // Validaciones
    const errors = [];
    if (!nombre) errors.push("El nombre del rol es requerido");
    if (!descripcion) errors.push("La descripción del rol es requerida");
    if (!permisos || !Array.isArray(permisos)) errors.push("La lista de permisos es requerida y debe ser un array");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguientes errores:", data: errors.join("\n") });
    }

    try {
        // Crear el rol y asociar los permisos
        const rol = await createRol(nombre, descripcion, permisos);

        if (!rol) return res.status(400).json({ message: "Error al crear el rol", data: rol });

        // Comentado historial
        // const historial = await createHistorial(
        //     'create',
        //     'Permiso',
        //     'nombre, descripcion, permisos',
        //     null,
        //     `${nombre}, ${descripcion}, ${permisos}`,
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');
        
        return res.status(201).json({ message: "Rol creado correctamente", data: rol });

        
    } catch (error) {
        console.error("Error en createRolHandler:", error.message);
        return res.status(500).json({ message: "Error en createRolHandler", error: error.message });
    }
};

const getAllRolsHandler = async (req, res) => {

    try {
        const rols = await getAllRols();

        return res.status(200).json({
            message: "Rols obtenidos correctamente",
            data: rols
        });
    } catch (error) {
        console.error("Error en getAllRols:", error.message);
        return res.status(500).json({ message: "Error en getAllRols", error: error.message });
    }
};

const getRolByIdHandler = async (req, res) => {
    const { id } = req.params;

    try {
        const rol = await getRolById(id);
        if (rol) {
            return res.status(200).json({ message: "Rol obtenido correctamente", data: rol });
        }
        
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en getRolByIdHandler:", error.message);
        return res.status(500).json({ message: "Error en getRolByIdHandler", error: error.message });
    }
};

const getAllPermisosHandler = async (req, res) => {

    try {
        const permisos = await getAllPermisos();


        return res.status(200).json({
            message: "Permisos obtenidos correctamente",
            data: permisos
        });
    } catch (error) {
        console.error("Error en getAllPermisosHandler:", error.message);
        return res.status(500).json({ message: "Error en getAllPermisosHandler", error: error.message });
    }
};

const updatePermisoHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const token = req.user;

    try {
        const previo = await getPermisoById(id);
        const permiso = await updatePermiso(id, nombre, descripcion);
        if (permiso) {
            // Comentado historial
            // const historial = await createHistorial(
            //     'update',
            //     'Permiso',
            //     'nombre, descripcion',
            //     `${previo.nombre}, ${previo.descripcion}`,
            //     `${nombre}, ${descripcion}`,
            //     token
            // );
            // if (!historial) console.warn('No se agregó al historial...');
            return res.status(200).json({ message: "Permiso actualizado correctamente", data: permiso });
        }
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en updatePermisoHandler:", error.message);
        return res.status(500).json({ message: "Error en updatePermisoHandler", error: error.message });
    }
};

const deletePermisoHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const success = await deletePermiso(id);
        if (success) {
            // Comentado historial
            // const historial = await createHistorial(
            //     'delete',
            //     'Permiso',
            //     'nombre, descripcion',
            //     `${success.nombre}, ${success.descripcion}`,
            //     'null',
            //     token
            // );
            // if (!historial) console.warn('No se agregó al historial...');
            return res.status(200).json({ message: "Permiso eliminado correctamente" });
        }
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en deletePermisoHandler:", error.message);
        return res.status(500).json({ message: "Error en deletePermisoHandler", error: error.message });
    }
};
const updateRolHandler = async (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion, permisos } = req.body;
    const token = req.user;

    try {
        const previo = await getRolById(id);
        const rol = await updateRol(id, nombre, descripcion, permisos);
        if (rol) {
            // const historial = await createHistorial(
            //     'update',
            //     'Rol',
            //     'nombre, descripcion, permisos',
            //     `${previo.nombre}, ${previo.descripcion}, ${previo.permisos}`,
            //     `${nombre}, ${descripcion}, ${permisos}`,
            //     token
            // );
            // if (!historial) console.warn('No se agregó al historial...');
            return res.status(200).json({ message: "Rol actualizado correctamente", data: rol });
        }
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en updateRolHandler:", error.message);
        return res.status(500).json({ message: "Error en updateRolHandler", error: error.message });
    }
};
const deleteRolHandler = async (req, res) => {

    const { id } = req.params;
    const token = req.user;

    try {
        const success = await deleteRol(id);
        if (success) {
            // const historial = await createHistorial(
            //     'delete',
            //     'Rol',
            //     'nombre, descripcion',
            //     `${success.nombre}, ${success.descripcion}, ${success.permisos}`,
            //     'null',
            //     token
            // );
            // if (!historial) console.warn('No se agregó al historial...');
            return res.status(200).json({ message: "Rol eliminado correctamente", data: true });
        }
        return res.status(404).json({ message: "Rol no encontrado", data: null });
    } catch (error) {
        console.error("Error en deleteRolHandler:", error.message);
        return res.status(500).json({ message: "Error en deleteRolHandler", error: error.message });
    }


};
const getPermisoByIdHandler = async (req, res) => {

    const { id } = req.params;

    try {
        const permiso = await getPermisoById(id);
        if (permiso)
            return res.status(200).json({ message: "Permiso obtenido correctamente", data: permiso });
        return res.status(404).json({ message: "Permiso no encontrado", data: null });
    } catch (error) {
        console.error("Error en getPermisoByIdHandler:", error.message);
        return res.status(500).json({ message: "Error en getPermisoByIdHandler", error: error.message });
    }

};


module.exports = {
    createPermisoHandler,
    getRolPermisosHandler,
    createRolHandler,
    getAllRolsHandler,
    getRolByIdHandler,
    getAllPermisosHandler,
    updatePermisoHandler,
    deletePermisoHandler,
    deleteRolHandler,
    updateRolHandler,
    getPermisoByIdHandler
};
