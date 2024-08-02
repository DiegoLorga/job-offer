import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

const correoAcceso = require('./correoAcceso');

class Server {
    public app: Application;

    constructor() {
        dotenv.config();
        this.app = express();
        this.config();
        this.routes();
        this.app.use(express.static(__dirname + "/imagenes"));
    }

    config(): void {
        this.app.use(express.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.set('port', process.env.PORT || 3001);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.post('/enviarCorreoRecuperarContrasena', (req: Request, res: Response) => {
            console.log("Entrando a correo");
            console.log(req.body);
            try {
                correoAcceso(req.body);
                res.sendStatus(200);
            } catch (error) {
                console.error("Error:", error);
                res.status(500).json({ message: 'Error al enviar el correo electrónico.' });
            }
        });
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
