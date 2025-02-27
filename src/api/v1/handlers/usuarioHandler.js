const { guardarFoto, createUser, validateUsuario, getUser, validateUsuarioMovil, validateDNI, changePassword, signToken, getToken, changeUserData, updateUser, getAllUsers, validateCorreo, getUserById, deleteUser, logoutUser, createUserIfNotExists, getUserByUUid, saveToken, getTokenDNI } = require("../controllers/usuarioController");
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { userSockets } = require("../../../sockets");

//const { createHistorial } = require('../controllers/historialController');
const path = require('path');
const usuarioRegex = /^[a-zA-Z0-9._-]{4,20}$/;
const contraseñaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const idRolRegex = /^[1-9]\d*$/;
const SECRET_KEY = process.env.JWT_SECRET;
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp'); // Importar la librería sharp















const verifyPhotoHandler = async (req, res) => {
    const { deviceId } = req.body;
    console.log('este es el deviceId: ', deviceId);

    try {
        console.log('1');
        // Validar si se subió el archivo
        if (!req.files || !req.files['photoInspector']) {
            return res.status(400).json({
                success: false,
                message: "No se recibió ninguna imagen. Por favor, intente nuevamente."
            });
        }
        console.log('2');
        const filePath = req.files['photoInspector'][0].path;

        const imageBuffer = await sharp(filePath)
            .rotate()
            .toBuffer();

        const base64Image = imageBuffer.toString('base64');
        console.log('3');
        const datos = {
            foto: base64Image
        };

        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': '972cbc17838710f8179133d624ed3c4646034b2bcbbea6dfe5da154fd4f046a6'
        };
        console.log('4');
        // Solicitud a la API externa
        const response = await fetch('https://backendtareaje.munisjl.gob.pe/axxon/face', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(datos)
        });
        console.log('5');
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                success: false,
                message: errorData.message || "Error al procesar la imagen en la API externa."
            });
        }
        console.log('6');
        const data = await response.json();
        console.log(data.message);

        const dni = data.data.dni;
        console.log('7');
        const dniValidate = await validateUsuarioMovil(dni);
        if (!dniValidate) {
            return res.status(400).json({
                success: false,
                message: "Este DNI no está registrado."
            });
        }
        console.log('8');
        const user = await createUserIfNotExists({ dni, deviceId });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Este dispositivo no está autorizado."
            });
        }
        console.log('9');
        let token = await getTokenDNI(dni);
        if (!token) {
            token = jwt.sign(
                { dni: user.dni },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
            );

            await saveToken(dni, token);
        }
        console.log('10');
        return res.json({
            success: true,
            message: "Usuario autenticado con éxito.",
            token,
            id_inspector: user.id,
            usuario: user.usuario,
            dni: dni
        });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).json({
            success: false,
            message: "Ocurrió un error interno al procesar la solicitud.",
            error: error.message,
        });
    }
};

































const createUserHandler = async (req, res) => {

    const { usuario, contraseña, correo, id_rol, dni /*, id_empleado*/ } = req.body;
    const token = req.user;
    //console.log({ usuario, contraseña, correo, id_rol, id_empleado });
    const errors = [];

    if (!usuario)
        errors.push("El nombre de usuario es requerido");
    else if (!usuarioRegex.test(usuario))
        errors.push("El nombre de usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones");

    if (usuario) {
        const userValidate = await validateUsuario(usuario)
        if (userValidate) {
            errors.push(`El usuario ${usuario} ya existe`);
        }
    }

    if (!dni) {
        errors.push("El DNI es requerido");
    } else if (!/^\d{8}$/.test(dni)) {
        errors.push("El DNI debe tener exactamente 8 dígitos numéricos");
    }
    if (dni) {
        const dniValidate = await validateDNI(dni)
        if (dniValidate) {
            errors.push(`El DNI ${dni} ya existe`);
        }
    }


    if (!correo)
        errors.push("El correo es requerido");
    else if (!correoRegex.test(correo))
        errors.push("Formato de correo inválido");

    if (correo) {
        const correoValidate = await validateCorreo(correo)
        if (correoValidate) {
            errors.push(`El correo ${correo} ya existe`);
        }
    }




    if (id_rol != 3) {
        if (!contraseña)
            errors.push("La contraseña es requerida");
        else if (!contraseñaRegex.test(contraseña))
            errors.push("La contraseña debe tener al menos 8 caracteres, incluyendo letras y números");
    }

    //console.log(errors);
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {

        const response = await createUser({
            usuario: usuario,
            contraseña: contraseña,
            correo: correo,
            id_rol: id_rol,
            dni: dni
            //id_empleado: id_empleado
        });
        if (!response) return res.status(400).json({ message: "Error al crear el usuario", data: response });

        // const historial = await createHistorial(
        //     'create',
        //     'Usuario',
        //     'usuario, correo, id_rol',//elimine los el id_empleado porque no lo usaremos todavia
        //     null,
        //     `${usuario}, ${correo}, ${id_rol}`,//elimine los el ${id_empleado} porque no lo usaremos todavia
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');

        return res.status(201).json({ message: "Usuario creado correctamente", data: response });

    } catch (error) {
        console.error("Error en createUser: ", error.message);
        return res.status(500).json({ message: "Error en createUserHandler", error: error.message });
    }
};


const changePasswordHandler = async (req, res) => {

    const { usuario, contraseña, nuevaContraseña } = req.body;
    const token = req.user;

    const errors = [];
    if (!usuario) errors.push("El nombre de usuario es requerido");
    if (!contraseña) errors.push("La contraseña actual es requerida");
    if (!nuevaContraseña) errors.push("La nueva contraseña es requerida");
    else if (!contraseñaRegex.test(nuevaContraseña))
        errors.push("La nueva contraseña debe tener al menos 8 caracteres, incluyendo letras y números");

    if (errors.length > 0) {
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });
    }

    try {

        const user = await getUser(usuario);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const contraseñaCorrecta = await argon2.verify(user.dataValues.contraseña, contraseña);
        if (!contraseñaCorrecta) {
            return res.status(400).json({ message: "La contraseña actual es incorrecta" });
        }

        if (await argon2.verify(user.dataValues.contraseña, nuevaContraseña)) {
            return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior" });
        }

        const response = await changePassword(usuario, nuevaContraseña);
        if (!response) return res.status(500).json({ message: "Error al cambiar la contraseña" });

        // const historial = await createHistorial(
        //     'update',
        //     'Usuario',
        //     'contraseña',
        //     'PRIVADO',
        //     'PRIVADO',
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({ message: "Contraseña cambiada correctamente" });

    } catch (error) {
        console.error("Error en changePasswordHandler: ", error.message);
        return res.status(500).json({ message: "Error en changePasswordHandler", error: error.message });
    }
};


const loginHandler = async (req, res) => {

    const { usuario, contraseña } = req.body;
    const errors = [];

    if (!usuario)
        errors.push("El nombre de usuario es requerido");
    else if (!usuarioRegex.test(usuario))
        errors.push("El nombre de usuario debe tener entre 4 y 20 caracteres, y puede incluir letras, números, puntos, guiones bajos o guiones");

    if (!contraseña)
        errors.push("La contraseña es requerida");
    else if (!contraseñaRegex.test(contraseña))
        errors.push("La contraseña debe tener al menos 8 caracteres, incluyendo letras y números");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {

        const user = await getUser(usuario);

        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado", data: false });

        const contraseñaValida = await argon2.verify(user.contraseña, contraseña);

        if (!contraseñaValida)
            return res.status(400).json({ message: "Contraseña incorrecta", data: false });

        const token = jwt.sign({ usuario: usuario, rol: user.id_rol }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Verificar si el usuario ya está conectado y forzar logout en otros dispositivos
        const previousSocket = userSockets.get(usuario);
        //console.log("ususario; ",usuario);
        //console.log("previousSocket: ",previousSocket);
        if (previousSocket) {
            previousSocket.emit("forceLogout", { message: "Sesión cerrada en otro dispositivo", data: { usuario: usuario } });
        }

        const sesion = await signToken(usuario, token);
        if (!sesion.token) return res.status(400).json({ message: "Error al iniciar la sesión", data: false });

        // const historial = await createHistorial(
        //     'read',
        //     'Usuario',
        //     'Login',
        //     null,
        //     null,
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({ message: "Sesion iniciada", token, rol: user.id_rol, data: true });

    } catch (error) {
        console.error("error en login: ", error);
        return res.status(500).json({ message: "Error en loginHandler: ", error: error.message });
    }
};

const changeUserDataHandler = async (req, res) => {

    const { usuario, correo, id_rol } = req.body;
    const token = req.user;
    const errors = [];

    if (!usuario)
        errors.push("El nombre de usuario es requerido");
    if (!correo)
        errors.push("El correo es requerido");
    if (!correoRegex.test(correo))
        errors.push("Formato de correo inválido");
    if (!id_rol)
        errors.push("El id de rol es requerido");
    if (!idRolRegex.test(id_rol))
        errors.push("El id de rol debe ser un número entero positivo");
    if (errors.length > 0)
        return res.status(400).json({ message: "Se encontraron los siguientes errores", data: errors });

    try {
        const previo = getUserById(token);
        const response = changeUserData(usuario, correo, id_rol);
        if (!response) return res.status(400).json({ message: "Error al actualizar los datos", data: false });

        const anterior = [previo.correo, previo.id_rol];
        const nuevo = [correo, id_rol];
        const campos = ['correo', 'id_rol'];
        let historial;

        for (let i = 0; i < anterior.length; i++) {
            if (anterior[i] !== nuevo[i]) {
                historial = await createHistorial(
                    'update',
                    'Usuario',
                    campos[i],
                    anterior[i],
                    nuevo[i],
                    token
                );
                if (!historial) console.warn('No se agregó al historial...');
            }
        }

        return res.status(200).json({ message: "Datos actualizados correctamente", data: response });

    } catch (error) {
        console.error("Error en el changeUserDataHandler", error.message);
        return res.status(500).json({ message: "Error en el changeUserDataHandler", error: error.message });
    }

};

const getTokenHandler = async (req, res) => {

    const { usuario } = req.params;

    try {
        const response = await getToken(usuario);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error en getTokenHandler: ", error.message);
        return res.status(500).json({ message: "error en getTokenHandler", error: error.message });
    }

};

const getAllUsersHandler = async (req, res) => {

    try {
        const users = await getAllUsers();

        return res.status(200).json({
            message: "Usuarios obtenidos correctamente",
            data: users
        });

    } catch (error) {
        console.error("Error en getAllUsersHandler:", error.message);
        return res.status(500).json({
            message: "Error en getAllUsersHandler",
            data: error.message
        });
    }
};

const getUserByIdHandler = async (req, res) => {

    //const { token } = req.body;
    const token = req.headers.authorization.split("___")[1];

    try {
        const user = await getUserById(token);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado", data: false });

        // const historial = await createHistorial(
        //     'read',
        //     'Usuario',
        //     'Read User Id',  
        //     null,
        //     null,
        //     token
        // );
        // if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({ message: "Usuario encontrado", data: user });
    }
    catch (error) {
        console.error("Error en getUserByIdHandler: ", error.message);
        return res.status(500).json({ message: "Error en getUserByIdHandler", data: error.message });
    }
};

const deleteUserHandler = async (req, res) => {

    const { usuario } = req.params;
    const token = req.user;

    try {
        const user = await deleteUser(usuario);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado", data: false });

        const historial = await createHistorial(
            'delete',
            'Usuario',
            'usuario, correo, id_rol',//Elimine el id_empleado porque repito no lo usaremos
            `${user.usuario}, ${user.correo}, ${user.id_rol}`,//Elimino el , ${user.id_empleado} porque no lo usaremos
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        // const response = await user.update({ state: false });
        return res.status(200).json({ message: "Usuario eliminado correctamente", data: response });

    } catch (error) {
        console.error("Error en deleteUserHandler: ", error.message);
        return res.status(500).json({ message: "Error en deleteUserHandler", data: error.message });
    }
};


const logoutHandler = async (req, res) => {

    const { usuario } = req.body;
    const token = req.user;

    if (!usuario) {
        return res.status(400).json({ message: "El nombre de usuario es requerido para cerrar sesión" });
    }

    try {
        const result = await logoutUser(usuario);

        if (!result) return res.status(404).json({ message: "Usuario no encontrado" });

        // Emitir evento de logout si el usuario está conectado
        const socket = userSockets.get(usuario);
        if (socket) {
            socket.emit("logout", { message: "Sesión cerrada", usuario: usuario });
            userSockets.delete(usuario);
        }

        const historial = await createHistorial(
            'read',
            'Usuario',
            'Logout',
            null,
            null,
            token
        );
        if (!historial) console.warn('No se agregó al historial...');

        return res.status(200).json({ message: "Sesión cerrada correctamente" });

    } catch (error) {
        console.error("Error en logoutHandler:", error.message);
        return res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};
const facialLoginHandler = async (req, res) => {
    const { dni, deviceId } = req.body;

    if (!dni || !/^\d{8}$/.test(dni)) {
        return res.status(400).json({
            success: false,
            message: "DNI inválido. Debe contener exactamente 8 caracteres numéricos.",
        });
    }

    try {
        const dniValidate = await validateUsuarioMovil(dni);
        if (dniValidate) {
            const user = await createUserIfNotExists({ dni, deviceId });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Este dispositivo no esta autorizado",
                });
            }

            let token = await getTokenDNI(dni);
            if (!token) {
                token = jwt.sign(
                    { dni: user.dni },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
                );

                await saveToken(dni, token);
            }

            return res.json({
                success: true,
                token,
                uuid: user.id,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Este DNI no esta registrado",
            });
        }

    } catch (error) {
        console.error("Error en facialLoginHandler:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
};


const updateUsersHandler = async (req, res) => {
    const { id } = req.params;
    const { usuario, correo, id_rol, dni } = req.body;

    try {
        const response = await updateUser(id, { usuario, correo, id_rol, dni });

        return res.status(200).json({ success: true, message: "Usuario actualizado correctamente", data: response });
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    createUserHandler,
    changePasswordHandler,
    loginHandler,
    getTokenHandler,
    changeUserDataHandler,
    getAllUsersHandler,
    getUserByIdHandler,
    deleteUserHandler,
    logoutHandler,
    facialLoginHandler,
    updateUsersHandler,
    verifyPhotoHandler
};