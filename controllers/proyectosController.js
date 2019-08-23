const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async(req, res) => {
    const proyectos = await Proyectos.findAll(); //selecionar todos los proyectos
    res.render('index', { //parametro: nombre de la vista
        nombrePagina: 'Proyectos',
        proyectos
    });

}

exports.formularioProyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    // Enviar a la consola lo que el usuario escriba
    console.log(req.body);

    //Validar que tenga contenido el input
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //Insertar en la BD
        /*const url = slug(nombre).toLowerCase();//Crear url con el nombre del proyecto
        const proyecto = await Proyectos.create({ nombre, url });Se presenta problemas con el duplicado de url*/


        await Proyectos.create({ nombre });
        res.redirect('/');

    }

}

exports.proyectoPorUrl = async(req, res, next) => {
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url
        }
    });
    //Array destructuring
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del Proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        } //,
        /*include: [ //sirve como 'JOIN'
            { model: Proyectos } //especifica que modelo incluir
        ] */
    });

    if (!proyecto) return next();

    // render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })

}

exports.formularioEditar = async(req, res) => {
    console.log(req.params.id);
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id
        }
    });
    //Array destructuring
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async(req, res) => {
    const proyectos = await Proyectos.findAll();
    // Enviar a la consola lo que el usuario escriba
    console.log(req.body);

    //Validar que tenga contenido el input
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' })
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //Insertar en la BD
        /*const url = slug(nombre).toLowerCase();//Crear url con el nombre del proyecto
        const proyecto = await Proyectos.create({ nombre, url });Se presenta problemas con el duplicado de url*/


        await Proyectos.update({ nombre: nombre }, {
            where: {
                id: req.params.id
            }
        });
        res.redirect('/');

    }

}

exports.eliminarProyecto = async(req, res, next) => {
    //req, query o params
    //console.log(req.query);

    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }
    res.status(200).send('Proyecto eiminado correctamente');

}