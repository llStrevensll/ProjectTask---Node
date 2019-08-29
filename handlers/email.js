const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //nos permitira agregar estilos lineales 
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

// create reusable transporter object using the default SMTP transport
let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});

//generar HTML
const generarHTML = (archivo, opciones = {}) => { //recibe un archivo (pug) y las opciones (resetUrl)
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html); //agregar a estilos lineales
}

exports.enviar = async(opciones) => { //recibe 'opciones' que contienen las caracteristicas del usuario
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject: opciones.subject, // Subject line
        text, // html body
        html // plain text body
    };

    const enviarEmail = util.promisify(transport.sendMail, transport); //promesa
    return enviarEmail.call(transport, opcionesEmail)
}