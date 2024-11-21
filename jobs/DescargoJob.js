const schedule = require('node-schedule');
const { NC, RSA, RSGNP, IFI } = require('../db_connection'); // Modelos para cada tipo de documento

const jobCounters = {}; // Objeto global para manejar contadores por cada job

// Función para obtener los minutos de duración según el tipo de documento
const getDurationByDocumentType = (documentType) => {
    switch (documentType) {
        case 'nc':
            return 5;  // 5 minutos para NC
        case 'rsa':
            return 15; // 15 minutos para RSA
        case 'rsgnp':
            return 15; // 15 minutos para RSGNP (Recursos de Apelación Sancionadora No Procedente)
        case 'ifi':
            return 5;  // 5 minutos para IFI
        default:
            throw new Error(`Tipo de documento desconocido: ${documentType}`);
    }
};

// Función para obtener el modelo correspondiente según el tipo de documento
const getModelForDocumentType = (documentType) => {
    switch (documentType) {
        case 'nc':
            return NC;
        case 'rsa':
            return RSA;
        case 'rsgnp':
            return RSGNP;
        case 'ifi':
            return IFI;
        default:
            throw new Error(`Tipo de documento desconocido: ${documentType}`);
    }
};

// Función que programa el job para contar minutos
const scheduleDocumentJob = (documentId, startDate, documentType) => {
    let currentDate = new Date(startDate); // Clonamos la fecha inicial
    const durationInMinutes = getDurationByDocumentType(documentType); // Obtiene la duración en minutos según el tipo de documento
    jobCounters[documentId] = { counter: 0 }; // Inicializamos el contador para este documento

    console.log(`Programando el job para ${documentType.toUpperCase()} con ID: ${documentId}`);

    const job = schedule.scheduleJob(`${documentType}-job-${documentId}`, '*/1 * * * *', async () => {
        try {
            console.log(`Ejecutando el job para ${documentType.toUpperCase()} con ID ${documentId}.`);
            const Model = getModelForDocumentType(documentType); // Obtener el modelo correspondiente
            const document = await Model.findByPk(documentId);

            if (!document) {
                console.error(`${documentType.toUpperCase()} con ID ${documentId} no encontrado. Cancelando job.`);
                job.cancel();
                delete jobCounters[documentId]; // Limpiar el contador
                return;
            }

            // Verificar si ya tiene un descargo asociado
            let descargoField = '';
            switch (documentType) {
                case 'nc':
                    descargoField = 'id_descargo_NC';
                    break;
                case 'ifi':
                    descargoField = 'id_descargo_ifi';
                    break;
                case 'rsa':
                    descargoField = 'id_descargo_RSA';
                    break;
                case 'rsgnp':
                    descargoField = 'id_descargo_RG';
                    break;
                default:
                    throw new Error(`Tipo de documento desconocido: ${documentType}`);
            }

            // Verificar si ya tiene un descargo asociado
            if (document[descargoField]) {
                console.log(`${documentType.toUpperCase()} con ID ${documentId} tiene un descargo asociado. Cancelando job.`);
                await updateDocumentState(documentId, 3, documentType); // Cambiar el estado a "resuelto" o el que corresponda
                job.cancel(); // Detener el job
                delete jobCounters[documentId]; // Limpiar el contador
                return;
            }

            console.log(`Contador actual de minutos: ${jobCounters[documentId].counter}`);

            // Incrementar el contador por cada minuto (se ejecuta cada minuto)
            jobCounters[documentId].counter += 1;

            // Verificar si el contador ha alcanzado la duración en minutos
            if (jobCounters[documentId].counter >= durationInMinutes) {
                console.log(`Duración alcanzada. Intentando actualizar estado del ${documentType.toUpperCase()}.`);
                await updateDocumentState(documentId, 3, documentType); // Cambiar el estado del documento a "finalizado" (por ejemplo, estado 3)
                console.log(`${documentType.toUpperCase()} con ID ${documentId} actualizado.`);
                job.cancel(); // Detener el job
                delete jobCounters[documentId]; // Limpiar el contador
                return;
            }

            // Avanzar al siguiente minuto
            currentDate = new Date(currentDate.setMinutes(currentDate.getMinutes() + 1)); // Actualizar la fecha
            console.log(`Fecha actualizada a ${currentDate}`);
        } catch (error) {
            console.error(`Error en el job para ${documentType.toUpperCase()} con ID ${documentId}:`, error);
        }
    });

    console.log(`Job programado para cambiar el estado del ${documentType.toUpperCase()} con ID ${documentId}`);
};

// Función para iniciar el job para cualquier tipo de documento
const startJobForDocument = (documentId, startDate, documentType) => {
    scheduleDocumentJob(documentId, startDate, documentType); // Programar el job con la fecha de inicio
};

// Exporta la función
module.exports = { startJobForDocument, jobCounters };

// Función para actualizar el estado de un documento (por ejemplo, 3 para "resuelto")
const updateDocumentState = async (documentId, newState, documentType) => {
    try {
        let model;
        let stateField;  // Variable para almacenar el nombre del campo de estado

        // Asignar el modelo y el campo de estado según el tipo de documento
        switch (documentType) {
            case 'nc':
                model = NC;
                stateField = 'id_estado_NC';  // Para NC, el campo es 'id_estado_NC'
                break;
            case 'rsa':
                model = RSA;
                stateField = 'id_estado_RSA'; // Para RSA, el campo es 'id_estado_RSA'
                break;
            case 'rsgnp':
                model = RSGNP;
                stateField = 'id_estado_RSGNP'; // Para RSGNP, el campo es 'id_estado_RSGNP'
                break;
            case 'ifi':
                model = IFI;
                stateField = 'id_estado_ifi'; // Para IFI, el campo es 'id_estado_IFI'
                break;
            default:
                throw new Error(`Tipo de documento desconocido: ${documentType}`);
        }

        // Buscar el documento por su ID
        const document = await model.findByPk(documentId);

        if (!document) {
            throw new Error(`${documentType.toUpperCase()} con ID ${documentId} no encontrado.`);
        }

        // Asignar el nuevo estado al campo correspondiente
        document[stateField] = newState; // Asignamos el nuevo estado al campo correcto
        await document.save(); // Guardamos los cambios en la base de datos

        console.log(`${documentType.toUpperCase()} con ID ${documentId} ha sido actualizado al estado ${newState}.`);
    } catch (error) {
        console.error(`Error al actualizar el estado del documento con ID ${documentId}:`, error);
    }
};
