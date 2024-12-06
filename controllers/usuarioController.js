const { Usuario, Rol, Empleado,Permiso } = require("../db_connection");
const { updateRol, deleteRol } = require("./rol_permisoController");

const createUser = async ({ usuario, contraseña, correo, id_rol /*, id_empleado */ }) => {
    try {
        const response = await Usuario.create({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            token: null,
            id_rol: id_rol,
            // id_empleado: id_empleado // Comentado porque no se usará
        });
        return response || null;
    } catch (error) {
        console.error("error en createUser: ", error);
        return false;
    }
};

const changePassword = async (usuario, contraseña) => {
    try {
        const user = await getUser(usuario);
        if (user) return await user.update({ contraseña: contraseña });
        return null;
    } catch (error) {
        console.error("error en changePassword: ", error.message);
        return false;
    }
};

const getUser = async (username) => {
    if (username)
        try {
            const response = await Usuario.findOne({
                where: {
                    usuario: username
                }
            });
            return response || null;
        } catch (error) {
            console.error("error en getUser: ", error.message);
            return false;
        }
    console.error("Error en getUser: Faltan datos para el getUser");
    return false;
};

const signToken = async (usuario, jwt) => {
    try {
        const user = await getUser(usuario);
        if (user) {
            const updatedUser = await user.update({ token: jwt });
            console.log(usuario, ":", jwt);

            return updatedUser;
        }
        return null;
    } catch (error) {
        console.error("error en signToken: ", error.message);
        return false;
    }
};

const getToken = async (usuario) => {
    try {
        const token = await Usuario.findOne({
            attributes: ['token'],
            where: {
                usuario: usuario
            }
        });
        return token || null;
    } catch (error) {
        console.error("error en getToken: ", error.message);
        return false;
    }
};

const changeUserData = async (usuario, correo, id_rol /*, id_empleado */) => {
    try {
        const user = await getUser(usuario);
        console.log("usuario: ", user);

        if (user) {
            const updatedUser = await user.update({
                correo: correo !== undefined ? correo : user.correo,
                id_rol: id_rol !== undefined ? id_rol : user.id_rol
                // id_empleado: id_empleado !== undefined ? id_empleado : user.id_empleado // Comentado porque no se usará
            });
            return updatedUser;
        }
        return null;
    } catch (error) {
        console.error("error en changeUserData controller: ", error.message);
        return false;
    }
};

const getAllUsers = async (page = 1, pageSize = 20) => {
    try {
        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        
        const response = await Usuario.findAndCountAll({
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol' /*, 'id_empleado' */], // id_empleado comentado
            where: { state: true },
            include: [
                { model: Rol, as: 'rol', attributes: ['nombre'] }
                // { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] } // Comentado porque no se usará
            ],
            limit,
            offset,
            order: [['id', 'ASC']],
        });

        const totalPages = Math.ceil(response.count / pageSize);

        return {
            data: response.rows,
            currentPage: page,
            totalPages: totalPages,
            totalCount: response.count
        };
    } catch (error) {
        console.error("Error en getAllUsers:", error.message);
        return false;
    }
};

const getUserByToken = async (token) => {
    try {
        const user = await Usuario.findOne({
            where: { token: token },
            attributes: ['id']
        });
        return user.id;
    } catch (error) {
        console.error('Error en obtener el id del usuario');
        return false;
    }
};

const getUserById = async (token) => {
    try {
        const user = await Usuario.findOne({
            where: { token: token },
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol' /*, 'id_empleado' */], // id_empleado comentado
            include: [
                {
                    model: Rol,
                    as: 'rol',
                    attributes: ['nombre'],
                    include: [
                        {
                            model: Permiso,
                            as: 'permisos',
                            attributes: ['nombre'],
                            through: { attributes: [] } // Trae el nombre de cada permiso
                        }
                    ]
            
                }
                // { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] } // Comentado porque no se usará
            ]
        });

        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error en getUserById:", error.message);
        return false;
    }
};

const deleteUser = async (usuario) => {
    try {
        const user = await Usuario.findOne({ where: { usuario } });
        if (user) {
            const response = await user.update({ state: false });
            return response;
        }
        return null;
    } catch (error) {
        console.error("Error en deleteUser:", error.message);
        return false;
    }
};

const logoutUser = async (usuario) => {
    try {
        const user = await getUser(usuario);
        if (user) {
            await user.update({ token: null }); // Eliminar el token
            return true;    
        }
        return false;
    } catch (error) {
        console.error("Error en logoutUser:", error.message);
        return false;
    }
};

module.exports = {
    createUser,
    changePassword,
    getUser,
    getToken,
    signToken,
    changeUserData,
    getAllUsers,
    getUserByToken,
    getUserById,
    deleteUser,
    logoutUser,
    updateRol,
    deleteRol
};
