import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

var email = require("emailjs/email");

function enviarCorreo(body: any) { 
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
    const token: string = jwt.sign({ email: correo }, process.env.TOKEN_SECRET || 'prueba');  // Aquí corregimos el payload
    console.log(token);

    var message = {
        from: process.env.EMAIL,
        to: `<${body.email}>`,
        bbc: "",
        subject: "Testing!",
        attachment: [
            { data: `Hola, te estoy enviando un correo de prueba`, alternative: true }
        ]
    };

    server.send(message, function(err: any, message: any) {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Email sent successfully!");
        }
    });
}

module.exports = enviarCorreo;
