const { Usuario, Rol, Empleado,Permiso, ControlActa } = require("../db_connection");
const { updateRol, deleteRol } = require("./rol_permisoController");
const argon2 = require('argon2');
const { Sequelize } = require('sequelize');


const createUser = async ({ usuario, contraseña, correo, id_rol, dni /*, id_empleado */ }) => {
    try {
        if(id_rol != 3){
            contraseña = await argon2.hash(contraseña)
        }

        const response = await Usuario.create({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            token: null,
            id_rol: id_rol,
            dni
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

const updateUser = async (id, {usuario, correo, id_rol, dni}) => {
    try {
        const user = await getUserByUUid(id);

        await user.update({usuario, correo, id_rol, dni})

        return user
    } catch (error) {
        console.log(error);
    }
}

const getAllUsers = async () => {
    try {

        const response = await Usuario.findAll({
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'dni',/*, 'id_empleado' */
                [Sequelize.col('rol.nombre'), 'nombre_rol'],
            ], // id_empleado comentado
            where: { state: true },
            include: [
                { model: Rol, as: 'rol', attributes: [] }
                // { model: Empleado, as: 'empleado', attributes: ['nombres', 'apellidos'] } // Comentado porque no se usará
            ],
            order: [['id', 'ASC']],
        });


        return response
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

const getUserByUUid = async (id) => {
    try {        
        const user = await Usuario.findOne({
            where: { id },
            
        });

        return user;
    } catch (error) {
        console.error('Error en obtener el id del usuario');
        return false;
    }
};

const getUserById = async (token) => {
    try {
        const user = await Usuario.findOne({
            where: { token: token },
            attributes: ['id', 'usuario', 'correo', 'state', 'id_rol', 'dni' /*, 'id_empleado' */], // id_empleado comentado
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
const createUserIfNotExists = async (dni, deviceId) => {
    try {
        console.log('dni es: ', dni)
        console.log('dispositivo es: ', deviceId)
      // Buscar usuario por DNI
      let user = await Usuario.findOne({ where: { usuario: dni } });
  
      if (!user) {
        throw new Error("El usuario no existe. Regístrate primero.");
      }
  
      // Si la contraseña está vacía o null, actualizarla con el hash del deviceId
      if (!user.contraseña) {
        await user.update({
          contraseña: await argon2.hash(deviceId),
        });
      } else {
        // Si la contraseña ya existe, validar con el deviceId
        const isValid = await argon2.verify(user.contraseña, deviceId);
        if (!isValid) {
          throw new Error("Usuario no permitido: el dispositivo no está autorizado.");
        }
      }
  
      return user;
    } catch (error) {
      throw new Error("Error al crear o buscar el usuario: " + error.message);
    }
  };
  
  
  // Guardar o actualizar el token
  const saveToken = async (dni, token) => {
    try {
      const user = await Usuario.findOne({ where: { usuario: dni } });
      if (!user) throw new Error('El usuario no existe');
      user.token = token;
      await user.save();
    } catch (error) {
      throw new Error('Error al guardar el token: ' + error.message);
    }
  };
  
  // Obtener el token del usuario
  const getTokenDNI = async (dni) => {
    try {
      const user = await Usuario.findOne({ where: { usuario: dni } });
      return user ? user.token : null;
    } catch (error) {
      throw new Error('Error al obtener el token: ' + error.message);
    }
  };

  const validateUsuario = async (usuario) => {
    try {
        const user = await Usuario.findOne({where: {usuario: usuario}})
        return user
    } catch (error) {
        throw new Error('Error al validar usuario: ' + error.message);
    }
  }

  const validateCorreo = async (correo) => {
    try {
        const user = await Usuario.findOne({where: {correo: correo}})
        return user
    } catch (error) {
        throw new Error('Error al validar correo: ' + error.message);
    }
  }

  const validateUsuarioMovil = async(dni) => {
    try {
        const user = await Usuario.findOne({where: {usuario: dni}})
        return user
    } catch (error) {
        throw new Error('Error al validar dni: ' + error.message);
    }
  }

  const validateDNI = async(dni) => {
    try {
        const user = await Usuario.findOne({where: {dni: dni}})
        return user
    } catch (error) {
        throw new Error('Error al validar dni: ' + error.message);
    }
  }


  
  const getLocalDate = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000; // Offset en milisegundos
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().split('T')[0];
  };

  const getAllUsersforControlActasController = async (id) => {
    try {
        // Obtener fiscalizadores ya seleccionados
        const fiscalizadoresActios = await ControlActa.findAll({
            where: { fecha: getLocalDate() },
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('id_inspector')), 'id_inspector']]
        });

        // Extraer los IDs de los fiscalizadores seleccionados
        const selectedInspectorIds = fiscalizadoresActios.map(item => item.id_inspector);

        // Obtener todos los usuarios con rol de fiscalizador (id_rol: 2)
        const findUsuarios = await Usuario.findAll({
            where: { id_rol: '3' },
            attributes: ['id', 'usuario'],
            order: [['usuario', 'ASC']],
        });

        // Filtrar los usuarios fiscalizadores que no están en la lista de seleccionados
        const unselectedUsers = findUsuarios.filter(usuario => !selectedInspectorIds.includes(usuario.id));

        return unselectedUsers || null;
    } catch (error) {
        console.error({ message: "Error obteniendo todos los Inspectores", data: error });
        return false;
    }
}


module.exports = {
    getAllUsersforControlActasController,
    createUser,
    changePassword,
    getUserByUUid,
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
    deleteRol,
    createUserIfNotExists,
    saveToken,
    getTokenDNI,
    updateUser,
    validateUsuario,
    validateCorreo,
    validateUsuarioMovil,
    validateDNI
};
