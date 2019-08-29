//AuthController.js
const passport = require('passport');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const Op = Sequelize.Op //Sequelize exposes symbol operators that can be used for to create more complex comparisons -

const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

//Autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', { //'local' es la estrategia de autenticacion 
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

//Función para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }
    //sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesión, redirige al loguin
    })
}

//Genra un token si el usuario es valido
exports.enviarToken = async(req, res) => {
    //verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } });

    //Si no existe el usuario
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
        /*
        res.render('restablecer', {
            nombrePagina: 'Restablecer tu contraseña',
            mensajes: req.flash()
        })*/

    }
    //Usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex'); //generar token
    usuario.expiracion = Date.now() + 3600000; //1hora

    //guardar en la BD
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    // Enviar el Correo con el Token
    await enviarEmail.enviar({ //-> se usa el handler creado: email.js
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerPassword' //restablecerPassword.pug
    });

    //terminar accion
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/restablecer');
    }

    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//Cambia password por uno nuevo
exports.actualizarPassword = async(req, res) => {

    //Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if (!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/restablecer');
    }

    //console.log('tokennnnn: ', usuario.token);

    //Encriptar - password con el hash
    usuario.password = bcrypt.hashSync(req.body.password, 10); //en el front debe estar name="password"

    //Resetear token y expiracion
    usuario.token = null;
    usuario.expiracion = null;

    //guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}