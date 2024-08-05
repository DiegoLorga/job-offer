"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
var email = require("emailjs/email");
function enviarCorreo(body) {
    var server = email.server.connect({
        user: process.env.EMAIL,
        password: process.env.PASSWORD,
        host: "smtp.gmail.com",
        tls: {
            rejectUnauthorized: false
        }
    });
    // Verificamos que el email esté en el body
    if (!body.email) {
        console.error("Email is missing in request body");
        return;
    }
    // Tokenizamos el correo para poder ponerlo en la liga
    var correo = body.email;
    const token = jsonwebtoken_1.default.sign({ email: correo }, process.env.TOKEN_SECRET || 'prueba'); // Aquí corregimos el payload
    console.log(token);
    const resetPasswordUrl = `http://localhost:5173/RestablecerContrasena?token=${token}`;
    var message = {
        from: process.env.EMAIL,
        to: `<${body.email}>`,
        bbc: "",
        subject: "Testing!",
        attachment: [
            { data: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Restablecimiento de Contraseña</title>
                    </head>
                    <body>
                        <p>Hola,</p>
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                        <p>Para restablecer tu contraseña, por favor haz clic en el siguiente enlace:</p>
                        <p><a href="${resetPasswordUrl}">Restablecer mi contraseña</a></p>
                        <p>Si no solicitaste el restablecimiento de contraseña, por favor ignora este correo.</p>
                        <p>Saludos,<br>El equipo de Devil Software</p>
                    </body>
                    </html>
                `,
                alternative: true
            }
        ]
    };
    server.send(message, function (err, message) {
        if (err) {
            console.error("Error sending email:", err);
        }
        else {
            console.log("Email sent successfully!");
        }
    });
}
module.exports = enviarCorreo;
