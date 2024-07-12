import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
//import swaggerDocument from './swagger.json';
import registroRoutes from './routes/registro';
import administradorRoutes from './routes/administrador';
import empleadoRoutes from './routes/empleado';
import empresaRoutes from './routes/empresa';
import loginRoutes from './routes/login';
import refreshtokenRoutes from './routes/refresh-token';
import singoutRoutes from './routes/signout';
import todoRoutes from './routes/todos';
import { connectDB } from './database';
import rolRoutes from './routes/rol';
class Server {
    public app: Application;
    constructor() {
        connectDB();
        this.app = express();
        this.config();
        this.routes();
       // this.app.use('/documentacion', swagger_ui_express.serve, swagger_ui_express.setup(swaggerDocument));
    }


    config(): void {
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use(morgan('dev')); //que ejecutamos y que tiempo
        this.app.use(cors());
        this.app.use(express.json()); //permite que utilicemos json
        this.app.use(express.urlencoded({ extended: false })); //decodifca las url
    }
    routes(): void {
        this.app.use('/api/registro', registroRoutes);
        this.app.use('/api/administrador', administradorRoutes);
        this.app.use('/api/empleado', empleadoRoutes);
        this.app.use('/api/empresa', empresaRoutes);
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/refreshtoken', refreshtokenRoutes);
        this.app.use('/api/singout', singoutRoutes);
        this.app.use('/api/todos', todoRoutes);
        this.app.use('/api/rol',rolRoutes);

    }
    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('El servidor se esta ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
