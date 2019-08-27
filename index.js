const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const expressValidator = require('express-validator');


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
require('./models/Usuarios')

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error));

//Crear una app de express
const app = express();


//Cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Sessiones permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto', // firmar cookie
    resave: false,
    saveUninitialized: false // si alguien se quiere autenticar debe mantener la sesion viva
}));

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; //res.locals.'nombrevariable'->permite crear variables que se pueden usar en los demas archivos
    res.locals.mensajes = req.flash();
    next();
});



app.use('/', routes());

app.listen(3000);