"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        (0, database_1.connectDB)();
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.use((0, cookie_parser_1.default)());
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use((0, morgan_1.default)('dev')); //que ejecutamos y que tiempo
        this.app.use((0, cors_1.default)({ origin: " http://localhost:5173", credentials: true }));
        this.app.use(express_1.default.json()); //permite que utilicemos json
        this.app.use(express_1.default.urlencoded({ extended: false })); //decodifca las url
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'img/perfilUsuario')));
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
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor se esta ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
