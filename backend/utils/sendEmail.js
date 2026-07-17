import nodemailer from 'nodemailer';

// Si no hay credenciales SMTP configuradas en .env, el email no se envía
// de verdad: el link queda impreso en la consola del servidor. Útil para
// desarrollo local. Para enviar emails reales, completar EMAIL_USER y
// EMAIL_PASS (contraseña de aplicación de Gmail) en backend/.env.
const smtpConfigurado = () => process.env.EMAIL_USER && process.env.EMAIL_PASS;

let transporter = null;
if (smtpConfigurado()) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export const enviarEmail = async ({ to, subject, html, text }) => {
    if (!transporter) {
        console.log('\n[EMAIL - modo desarrollo, no se envió de verdad]');
        console.log(`Para: ${to}`);
        console.log(`Asunto: ${subject}`);
        console.log(text || html);
        console.log('[fin email]\n');
        return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
    });
};
