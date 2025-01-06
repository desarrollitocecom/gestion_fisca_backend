const { sequelize } = require("../config/db_connection");

sequelize.sync({ force: true })
    .then(() => {
        console.log('Base de datos reseteada y todas las tablas fueron recreadas.');
    })
    .catch(error => {
        console.error('Hubo un error al resetear la base de datos:', error);
    });