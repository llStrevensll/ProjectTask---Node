const Sequelize = require('sequelize');


const db = new Sequelize('uptasknode', 'root', 'admin', {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3306',
    define: {
        timestamps: false
    }
});

module.exports = db;