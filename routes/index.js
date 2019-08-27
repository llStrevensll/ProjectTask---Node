const express = require('express');
const router = express.Router();

//Importar express validator
const { body } = require('express-validator');

//Importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');

module.exports = function() {
    //Ruta para el home
    //Cuando se usa .use ->cualquier request corre el codigo
    router.get('/', proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto);
    //body('nombre)-> nombre del campo   ------  .not()_>negar -isEmpty->revisar que no este vacia la cadena -------- trim()->elimnar espacios al inicio y final
    router.post('/nuevo-proyecto', body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto);

    //Listar Proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    //Actualiza el Proyecto
    router.get('/proyecto/editar/:id', proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id', body('nombre').not().isEmpty().trim().escape(), proyectosController.actualizarProyecto);

    //Eliminar Proyecto
    router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

    //Agregar Tarea
    router.post('/proyectos/:url', tareasController.agregarTarea);


    //Actualizar tarea->patch solo una parte
    router.patch('/tareas/:id', tareasController.cambiarEstadoTarea);

    //Eliminar Tarea
    router.delete('/tareas/:id', tareasController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);

    return router;

}