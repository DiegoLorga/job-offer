"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const usuarioController_1 = require("./controllers/usuarioController");
const correoAcceso = require('./correoAcceso');
class Server {
    constructor() {
        dotenv_1.default.config();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.app.use(express_1.default.static(__dirname + "/imagenes"));
    }
    config() {
        this.app.use(express_1.default.urlencoded({ limit: '50mb', parameterLimit: 100000, extended: false }));
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.set('port', process.env.PORT || 3001);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.post('/enviarCorreoRecuperarContrasena', (req, res) => {
            console.log("Entrando a correo");
            console.log(req.body);
            try {
                correoAcceso(req.body);
                res.sendStatus(200);
            }
            catch (error) {
                console.error("Error:", error);
                res.status(500).json({ message: 'Error al enviar el correo electrónico.' });
            }
        });
        this.app.post('/restablecerContrasena', (req, res) => {
            try {
                usuarioController_1.usuariosController.restablecerContrasena(req, res);
            }
            catch (error) {
                res.status(500).json({ message: 'Error en el servidor' });
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
