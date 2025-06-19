const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail', // Usa 'gmail' por defecto
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarCorreo = async (to, subject, text, html) => {
    try {
        const correoEnviado = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        console.log('Correo enviado con éxito:', correoEnviado);
        return { success: true, infoCorreo: correoEnviado };
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return { success: false, error };
    }
};

module.exports = { enviarCorreo };
