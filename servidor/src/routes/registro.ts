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

        //this.router.get("/correo/:correo",usuariosController.validarCorreo)
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/

    }
}
const registroRoutes = new RegistroRoutes();
export default registroRoutes.router;