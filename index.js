const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//const expressValidator = require('express-validator');

//importar variables
require('dotenv').config({ path: 'variables.env' })


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

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump; //res.locals.'nombrevariable'->permite crear variables que se pueden usar en los demas archivos
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null; //crea un copia de req.user y lo asigna - caso contrario (undifenied) sera null
    next();
});



app.use('/', routes());

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});