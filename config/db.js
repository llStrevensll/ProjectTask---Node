const Sequelize = require('sequelize');

//Extraer valores de variables.env -> variables de entorno
require('dotenv').config({ path: 'variables.env' })

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, { //nombre bd, user, pass
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    define: {
        timestamps: false
    }
});

module.exports = db;