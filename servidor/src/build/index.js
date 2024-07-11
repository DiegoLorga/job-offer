"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
//import swaggerDocument from './swagger.json';
const registro_1 = __importDefault(require("./routes/registro"));
const administrador_1 = __importDefault(require("./routes/administrador"));
const empleado_1 = __importDefault(require("./routes/empleado"));
const empresa_1 = __importDefault(require("./routes/empresa"));
const login_1 = __importDefault(require("./routes/login"));
const refresh_token_1 = __importDefault(require("./routes/refresh-token"));
const signout_1 = __importDefault(require("./routes/signout"));
const todos_1 = __importDefault(require("./routes/todos"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        // this.app.use('/documentacion', swagger_ui_express.serve, swagger_ui_express.setup(swaggerDocument));
    }
    config() {
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use((0, morgan_1.default)('dev')); //que ejecutamos y que tiempo
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json()); //permite que utilicemos json
        this.app.use(express_1.default.urlencoded({ extended: false })); //decodifca las url
    }
    routes() {
        this.app.use('/api/registro', registro_1.default);
        this.app.use('/api/administrador', administrador_1.default);
        this.app.use('/api/empleado', empleado_1.default);
        this.app.use('/api/empresa', empresa_1.default);
        this.app.use('/api/login', login_1.default);
        this.app.use('/api/refreshtoken', refresh_token_1.default);
        this.app.use('/api/singout', signout_1.default);
        this.app.use('/api/todos', todos_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor se esta ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();