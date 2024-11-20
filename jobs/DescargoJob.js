const schedule = require('node-schedule');
const { updateNCState } = require('../controllers/ncController');
const { NC } = require('../db_connection');

const jobCounters = {}; // Objeto global para manejar contadores por cada job

const getNextMinute = (date) => {
    date.setMinutes(date.getMinutes() + 1); // Avanza un minuto
    return new Date(date.setSeconds(0, 0)); // Ajusta los segundos y milisegundos a 0
};

const scheduleDescargoJobTest = (ncId, startDate, durationInMinutes = 5) => {
    let currentDate = new Date(startDate); // Clonar la fecha inicial
    jobCounters[ncId] = { counter: 0 }; // Inicializar el contador en el objeto para este NC

    console.log(`Programando el job para NC con ID: ${ncId}`);

    const job = schedule.scheduleJob(`descargo-test-${ncId}`, '*/1 * * * *', async () => {
        try {
            console.log(`Ejecutando el job para NC con ID ${ncId}.`);
            const nc = await NC.findByPk(ncId);

            if (!nc) {
                console.error(`NC con ID ${ncId} no encontrado. Cancelando job.`);
                job.cancel();
                delete jobCounters[ncId]; // Limpiar el contador
                return;
            }

            // Verificar si se ha asociado un descargoNC
            if (nc.id_descargo_NC) {
                console.log(`NC con ID ${ncId} tiene un descargo asociado (ID: ${nc.id_descargo_NC}). Cancelando job.`);
                job.cancel();
                delete jobCounters[ncId]; // Limpiar el contador
                return;
            }

            const day = currentDate.getDay(); // Obtiene el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
            console.log(`Día actual: ${day}, contador actual: ${jobCounters[ncId].counter}`);

            // Incrementa el contador solo en días laborales (lunes a viernes)
            if (day >= 1 && day <= 5) {
                jobCounters[ncId].counter += 1;
                console.log(`Incrementando el contador. Nuevo valor: ${jobCounters[ncId].counter}`);
            } else {
                console.log(`Día no laboral (sábado o domingo). No se incrementa el contador.`);
            }

            // Verificar si el contador ha alcanzado la duración
            if (jobCounters[ncId].counter >= durationInMinutes) {
                console.log(`Duración alcanzada. Intentando actualizar estado del NC.`);
                await updateNCState(ncId, 3); // Cambiar el estado del NC
                console.log(`Estado del NC con ID ${ncId} actualizado.`);
                job.cancel();
                delete jobCounters[ncId]; // Limpiar el contador
                return;
            }

            // Avanzar al siguiente minuto
            currentDate = getNextMinute(currentDate); // Actualizar la fecha
            console.log(`Fecha actualizada a ${currentDate}`);
        } catch (error) {
            console.error(`Error en el job para NC con ID ${ncId}:`, error);
        }
    });

    console.log(`Job de prueba programado para cambiar el estado del NC con ID ${ncId}`);
};

module.exports = { scheduleDescargoJobTest, jobCounters };
