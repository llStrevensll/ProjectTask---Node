const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.crearCuenta = async(req, res) => {
    //Leer datos
    console.log(req.body);
    const { email, password } = req.body;

    //Try Catch para evitar errores
    try {
        //Crear usuario
        await Usuarios.create({
            email,
            password
        });
        res.redirect('/iniciar-sesion')

    } catch (error) { //error.errors es de sequelize
        req.flash('error', error.errors.map(error => error.message)); //map agrupa los errores en 'error'
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}