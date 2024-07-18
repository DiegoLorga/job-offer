import { Router, Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import { usuariosController } from '../controllers/usuarioController';

class RegistroRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.post("/", usuariosController.createUsuario)
        this.router.get("/getEstados", usuariosController.getEstados);
        this.router.get("/getCiudades/:clave", usuariosController.getCiudades);

    }
}
const registroRoutes = new RegistroRoutes();
export default registroRoutes.router;