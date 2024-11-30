const schedule = require('node-schedule');
const { NC, RSA, RSGNP, IFI } = require('../db_connection'); 

const jobCounters = {}; 

const getBusinessDaysByDocumentType = (documentType) => {
    switch (documentType) {
        case 'nc':
            return 5;  // 5 días hábiles para NC
        case 'rsa':
            return 15; // 15 días hábiles para RSA
        case 'rsgnp':
            return 15; // 15 días hábiles para RSGNP 
        case 'ifi':
            return 5;  // 5 días hábiles para IFI
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

// Función para obtener el siguiente día hábil
const getNextWeekday = (currentDate) => {
    let day = currentDate.getDay(); 
    if (day === 6) {
        currentDate.setDate(currentDate.getDate() + 2); // Sábado + 2 días (Lunes)
    } else if (day === 0) {
        currentDate.setDate(currentDate.getDate() + 1); // Domingo + 1 día (Lunes)
    } else {
        currentDate.setDate(currentDate.getDate() + 1); // Avanza al siguiente día hábil
    }
    return currentDate;
};

// Función que programa el job para contar días hábiles (lunes a viernes)
const scheduleDocumentJob = (documentId, startDate, documentType) => {
    let currentDate = new Date(startDate); 
    const businessDays = getBusinessDaysByDocumentType(documentType); 
    jobCounters[documentId] = { counter: 0 }; 

    console.log(`Programando el job para ${documentType.toUpperCase()} con ID: ${documentId}`);
    console.log(`El contador comenzará a las 12:00 a.m. del día siguiente.`);

    // Avanzamos al siguiente día hábil si el documento se crea un lunes
    currentDate = getNextWeekday(currentDate); 

    const job = schedule.scheduleJob(`${documentType}-job-${documentId}`, '0 0 * * *', async () => {
        try {
            console.log(`Ejecutando el job para ${documentType.toUpperCase()} con ID ${documentId}.`);
            const Model = getModelForDocumentType(documentType);
            const document = await Model.findByPk(documentId);

            if (!document) {
                console.error(`${documentType.toUpperCase()} con ID ${documentId} no encontrado. Cancelando job.`);
                job.cancel();
                delete jobCounters[documentId]; 
                return;
            }

            // Verificar si ya tiene un descargo asociado
            let descargoField = '';
            switch (documentType) {
                case 'nc':
                    descargoField = 'id_descargo_NC';
                    break;
                case 'ifi':
                    descargoField = 'id_descargo_IFI';
                    break;
                case 'rsa':
                    descargoField = 'id_descargo_RSA';
                    break;
                case 'rsgnp':
                    descargoField = 'id_descargo_RSGNP';
                    break;
                default:
                    throw new Error(`Tipo de documento desconocido: ${documentType}`);
            }

            if (document[descargoField]) {
                console.log(`${documentType.toUpperCase()} con ID ${documentId} tiene un descargo asociado. Cancelando job.`);
                await updateDocumentState(documentId, 3, documentType); 
                job.cancel(); 
                delete jobCounters[documentId];
                return;
            }

            console.log(`Contador actual de días hábiles: ${jobCounters[documentId].counter}`);

            // Incrementar el contador solo por días hábiles
            jobCounters[documentId].counter += 1;

            if (jobCounters[documentId].counter >= businessDays) {
                console.log(`Duración alcanzada. Intentando actualizar estado del ${documentType.toUpperCase()}.`);
                await updateDocumentState(documentId, 3, documentType); 
                console.log(`${documentType.toUpperCase()} con ID ${documentId} actualizado.`);
                job.cancel();
                delete jobCounters[documentId];
            }

            currentDate = getNextWeekday(new Date(currentDate.setDate(currentDate.getDate() + 1))); 
            console.log(`Fecha actualizada a ${currentDate}`);
        } catch (error) {
            console.error(`Error en el job para ${documentType.toUpperCase()} con ID ${documentId}:`, error);
        }
    });

    console.log(`Job programado para cambiar el estado del ${documentType.toUpperCase()} con ID ${documentId}`);
};

// Función para iniciar el job para cualquier tipo de documento
const startJobForDocument = (documentId, startDate, documentType) => {
    scheduleDocumentJob(documentId, startDate, documentType); 
};

module.exports = { startJobForDocument, jobCounters };

// Función para actualizar el estado de un documento (por ejemplo, 3 para "resuelto")
const updateDocumentState = async (documentId, newState, documentType) => {
    try {
        let model;
        let stateField; 

        switch (documentType) {
            case 'nc':
                model = NC;
                stateField = 'id_estado_NC';
                break;
            case 'rsa':
                model = RSA;
                stateField = 'id_estado_RSA';
                break;
            case 'rsgnp':
                model = RSGNP;
                stateField = 'id_estado_RSGNP';
                break;
            case 'ifi':
                model = IFI;
                stateField = 'id_estado_IFI';
                break;
            default:
                throw new Error(`Tipo de documento desconocido: ${documentType}`);
        }

        const document = await model.findByPk(documentId);

        if (!document) {
            throw new Error(`${documentType.toUpperCase()} con ID ${documentId} no encontrado.`);
        }

        document[stateField] = newState;
        await document.save();

        console.log(`${documentType.toUpperCase()} con ID ${documentId} ha sido actualizado al estado ${newState}.`);
    } catch (error) {
        console.error(`Error al actualizar el estado del documento con ID ${documentId}:`, error);
    }
};
