"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http")); // Importa el módulo HTTP para crear el servidor
const socket_io_1 = require("socket.io"); // Importa Socket.IO
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const administrador_1 = __importDefault(require("./routes/administrador"));
const empleado_1 = __importDefault(require("./routes/empleado"));
const empresa_1 = __importDefault(require("./routes/empresa"));
const login_1 = __importDefault(require("./routes/login"));
const database_1 = require("./database");
const rol_1 = __importDefault(require("./routes/rol"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const perfilEmpresa_1 = __importDefault(require("./routes/perfilEmpresa"));
const ofertalaboral_1 = __importDefault(require("./routes/ofertalaboral"));
const perfilUsuario_1 = __importDefault(require("./routes/perfilUsuario"));
class Server {
    constructor() {
        (0, database_1.connectDB)();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        // Crear el servidor HTTP y el servidor Socket.IO
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "http://localhost:5173", // Asegúrate de que esta URL sea correcta
                methods: ["GET", "POST"],
                credentials: true // Permite el uso de credenciales (cookies, etc.)
            }
        });
        this.sockets(); // Configurar eventos de Socket.IO
    }
    config() {
        this.app.use((0, cookie_parser_1.default)());
        this.app.set('port', process.env.PORT || 3000); // En qué puerto va a ejecutar
        this.app.use((0, morgan_1.default)('dev')); // que ejecutamos y que tiempo
        this.app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
        this.app.use(express_1.default.json()); // permite que utilicemos json
        this.app.use(express_1.default.urlencoded({ extended: false })); // decodifica las ur
    }
    routes() {
        this.app.use('/api/usuario', usuario_1.default);
        this.app.use('/api/administrador', administrador_1.default);
        this.app.use('/api/empleado', empleado_1.default);
        this.app.use('/api/empresa', empresa_1.default);
        this.app.use('/api/login', login_1.default);
        this.app.use('/api/rol', rol_1.default);
        this.app.use('/api/perfilEmpresa', perfilEmpresa_1.default);
        this.app.use('/api/OfertaLaboral', ofertalaboral_1.default);
        this.app.use('/api/perfilUsuario', perfilUsuario_1.default);
    }
    sockets() {
        // Evento de conexión
        this.io.on('connection', (socket) => {
            console.log(`Cliente conectado: ${socket.id}`);
            // Evento para unirse a la sala de la empresa
            socket.on('joinEmpresa', (empresaId) => {
                socket.join(`empresa_${empresaId}`);
                console.log(`Empresa ${empresaId} se ha unido al room empresa_${empresaId}`);
            });
            // Evento cuando se crea una nueva postulación
            socket.on('nuevaPostulacion', (data) => {
                const { idOferta, idUsuario, idEmpresa } = data; // Se incluye idEmpresa
                // El room de la empresa está basado en idEmpresa, no en idUsuario
                const empresaRoom = `empresa_${idEmpresa}`; // El room ahora se basa en idEmpresa
                // Emitir el evento al room de la empresa
                this.io.to(empresaRoom).emit('nuevaPostulacion', { idOferta, idUsuario });
                console.log(`Notificación enviada al room ${empresaRoom}`);
            });
        });
    }
    start() {
        // Cambiar a this.server.listen para iniciar el servidor HTTP
        this.server.listen(this.app.get('port'), () => {
            console.log('El servidor se está ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
exports.default = server;
