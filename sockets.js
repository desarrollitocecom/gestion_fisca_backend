const socketIo = require("socket.io");
const { getAllNCforInstructiva, getNCforInstructiva } = require('../gestion_fisca_backend/controllers/ncController');
const {responseSocket} = require('../gestion_fisca_backend/utils/socketUtils')
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

// Mapa para almacenar los sockets de los usuarios
const userSockets = new Map();

let io; // Declaramos io como variable global en este módulo

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*", // Cambia "*" por tu dominio permitido, por ejemplo, "http://localhost:3000"
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        // Evento de registro: asociamos el socket con el usuario
        socket.on("register", (userName) => {
            console.log("registro:", userName);
            userSockets.set(userName, socket); // Asocia el ID de usuario con el socket
        });

        // Desconexión: eliminamos el socket del mapa
        socket.on("disconnect", () => {
            userSockets.forEach((value, key) => {
                if (value.id === socket.id) {
                    userSockets.delete(key); // Elimina el socket asociado al userName
                }
            });
            console.log(`Cliente desconectado: ${socket.id}`);
        });

        socket.on("modal", async ({ id, type, area, doc, idUser }) => {
            try {
                console.log(`Evento modal recibido: type=${type}, area=${area}, id=${id}, doc=${doc}, idUser=${idUser}`);
                let cacheKey = `${area}:${id}:${idUser}`;
    
                if (area === 'Ainstructiva') {
                    const findNC = await getNCforInstructiva(id);
                    const plainNC = findNC.toJSON();
    
                    if (type === 'open') {
                        plainNC.disabled = true;
    
                        // console.log('este es el doc', doc);
                        
                        cache.set(cacheKey, { id, type, area, idUser }); // aqui quiero agregar el id del socket que se le pone a cada per
                        // console.log(`Estado almacenado en caché: ${cacheKey} ->`, { id, type, area, idUser });
                    } 
                    
                    if ( type === 'close') {
                        plainNC.disabled = false;
    
                        cache.del(cacheKey);
                        // console.log(`Estado eliminado del caché: ${cacheKey}`);
                    } 

                    // if ( type === 'close2'){
                    //     cacheKey = `${area}:${doc}:${idUser}`;
                    //     cache.del(cacheKey);

                    //     // io.emit("atv", true);
            






                    //     // const dataResult = await getNCforInstructiva(id);
    
                    //     // const plainResult = dataResult.toJSON();

                    //     // plainResult.disabled = false;
                    //     // plainResult.user = idUser;
                    
                    //     // io.emit('sendAI1', { data: [plainResult] });

                    //     // console.log('con fe', plainResult);
                        
                    // }
    
                    io.emit("sendAI1", { data: [plainNC] });
                }
            } catch (error) {
                console.error("Error en el evento 'modal':", error);
            }
        });
        
        
    });



}


// Función para obtener las claves con un prefijo específico
function getKeysByPrefix(prefix) {
    const keys = cache.keys(); // Obtener todas las claves del caché
    return keys.filter((key) => key.startsWith(prefix)); // Filtrar por prefijo
}

// Función para obtener los valores de las claves con un prefijo específico
function getValuesByPrefix(prefix) {
    const keys = getKeysByPrefix(prefix); // Obtener las claves con el prefijo
    return keys.map((key) => ({
        key,
        value: cache.get(key), // Obtener el valor asociado a la clave
    }));
}



// Exportamos la función para obtener la instancia global de io
function getIo() {
    if (!io) {
        throw new Error("Socket.io no está inicializado. Llama a initializeSocket primero.");
    }
    return io;
}

module.exports = { initializeSocket, userSockets, getIo, getKeysByPrefix, getValuesByPrefix, cache };
