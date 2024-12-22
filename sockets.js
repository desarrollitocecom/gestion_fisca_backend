const socketIo = require("socket.io");
const { getNCforInstructiva } = require('../gestion_fisca_backend/controllers/ncController');

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
    let prueba;
    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        io.emit('prueba', prueba);
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

        socket.on("modal", async ({id, type, area}) => {
            
            try {
                console.log(type, area);

                if(area == 'Ainstructiva'){
                    const findNC = await getNCforInstructiva(id);
                    const plainNC = findNC.toJSON();
                    if (type == 'open') {
                        prueba = 'esta abierto';
                        plainNC.disabled = true;
                    } else {
                        prueba = 'esta cerrado';
                        plainNC.disabled = false;
                    }
                    io.emit("sendAI1", { data: [plainNC] });

                    console.log("Datos emitidos con éxito:", plainNC);
                }
                
            } catch (error) {
                console.error("Error en el evento 'modal':", error);
            }
        });
        
        
    });
}

// Exportamos la función para obtener la instancia global de io
function getIo() {
    if (!io) {
        throw new Error("Socket.io no está inicializado. Llama a initializeSocket primero.");
    }
    return io;
}

module.exports = { initializeSocket, userSockets, getIo };
