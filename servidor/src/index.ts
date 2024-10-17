import express, { Application } from 'express';
import http from 'http'; // Importa el módulo HTTP para crear el servidor
import { Server as SocketIOServer } from 'socket.io'; // Importa Socket.IO
import morgan from 'morgan';
import cors from 'cors';
import administradorRoutes from './routes/administrador';
import empleadoRoutes from './routes/empleado';
import empresaRoutes from './routes/empresa';
import loginRoutes from './routes/login';
import { connectDB } from './database';
import rolRoutes from './routes/rol';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuario';
import PerfilEmpresaRoutes from './routes/perfilEmpresa';
import ofertaLaboralRoutes from './routes/ofertalaboral';
import perfilUsuarioRoutes from './routes/perfilUsuario';

class Server {
    public app: Application;
    public server!: http.Server; // Variable para el servidor HTTP
    public io!: SocketIOServer;  // Variable para el servidor de Socket.IO

    constructor() {
        connectDB();
        this.app = express();
        this.config();
        this.routes();

        // Crear el servidor HTTP y el servidor Socket.IO
        this.server = http.createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "http://localhost:5173", // Asegúrate de que esta URL sea correcta
                methods: ["GET", "POST"],
                credentials: true // Permite el uso de credenciales (cookies, etc.)
            }
        });

        this.sockets(); // Configurar eventos de Socket.IO
    }

    config(): void {
        this.app.use(cookieParser());
        this.app.set('port', process.env.PORT || 3000); // En qué puerto va a ejecutar
        this.app.use(morgan('dev')); // que ejecutamos y que tiempo
        this.app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
        this.app.use(express.json()); // permite que utilicemos json
        this.app.use(express.urlencoded({ extended: false })); // decodifica las ur
    }

    routes(): void {
        this.app.use('/api/usuario', usuarioRoutes);
        this.app.use('/api/administrador', administradorRoutes);
        this.app.use('/api/empleado', empleadoRoutes);
        this.app.use('/api/empresa', empresaRoutes);
        this.app.use('/api/login', loginRoutes);
        this.app.use('/api/rol', rolRoutes);
        this.app.use('/api/perfilEmpresa', PerfilEmpresaRoutes);
        this.app.use('/api/OfertaLaboral', ofertaLaboralRoutes);
        this.app.use('/api/perfilUsuario', perfilUsuarioRoutes);
    }

    sockets(): void {
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
    

    start(): void {
        // Cambiar a this.server.listen para iniciar el servidor HTTP
        this.server.listen(this.app.get('port'), () => {
            console.log('El servidor se está ejecutando en el puerto: ', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();

export default server;

