const Sequelize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

//Definir modelo
const Proyectos = db.define('proyectos', { //nombre
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING
}, {
    hooks: { //Mirar documentacion Sequelize->  son funciones que se llaman antes y después de que se ejecuten las llamadas en secuencia
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase(); //Crear url con el nombre del proyecto

            proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;