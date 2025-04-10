const nodemailer = require('nodemailer');

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
    host: 'mail.jsdq.pw',
    port: 26,
    secure: false,
    auth: {
        user: 'noreply@jsdq.pw', // tu correo
        pass: '@x%jV+YwM^!)' // tu contraseña
    }
});



const enviarCorreo = async (to, subject, text, html) => {
    try {
        const correoEnviado = transporter.sendMail({
            from: 'noreply@jsdq.pw',
            to,
            subject,
            text,
            html,
        });
        console.log('Correo enviado con exito.', correoEnviado);
        return {seccuss: true, infoCorreo: correoEnviado}
    } catch (error) {
        console.error('Erro al enviar el correo', error);
        return { succes: false, error}
    }
};




module.exports = {enviarCorreo};
