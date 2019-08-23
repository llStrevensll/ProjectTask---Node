const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear la conexión a la BD
const db = require('./config/db');

/*db.authenticate() //Conectarse
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error));*/


//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error));

//Crear una app de express
const app = express();

//Cargar los archivos estaticos
app.use(express.static('public'));


//Habilitar Pug
app.set('view engine', 'pug');


//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; //res.locals.'nombrevariable'->permite crear variables que se pueden usar en los demas archivos
    next();
});


//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes());

app.listen(3000);