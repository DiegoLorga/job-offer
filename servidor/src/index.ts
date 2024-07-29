import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import administradorRoutes from './routes/administrador';
import empleadoRoutes from './routes/empleado';
import empresaRoutes from './routes/empresa';
import loginRoutes from './routes/login';
import { connectDB } from './database';
import rolRoutes from './routes/rol';
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuario';
class Server {
    public app: Application;
    constructor() {
        connectDB();
        this.app = express();
        this.config();
        this.routes();
    }


    config(): void {
        this.app.use(cookieParser());
        this.app.set('port', process.env.PORT || 3000); //En que puerto va a ejecutar
        this.app.use(morgan('dev')); //que ejecutamos y que tiempo
        this .app.use(cors({origin:  " http://localhost:5173" , credentials:  true })); 
        this.app.use(express.json()); //permite que utilicemos json
        this.app.use(express.urlencoded({ extended: false })); //decodifca las url
    }
    routes(): void {
        this.app.use('/api/usuario', usuarioRoutes);
        this.app.use('/api/administrador', administradorRoutes);
        this.app.use('/api/empleado', empleadoRoutes);
        this.app.use('/api/empresa', empresaRoutes);
        this.app.use('/api/login', loginRoutes);
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
