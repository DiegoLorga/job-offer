import { Router, Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import { usuariosController } from '../controllers/usuarioController';

class UsuarioRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    
    config(): void {
        this.router.post("/", usuariosController.createUsuario)
        this.router.get("/getEstados", usuariosController.getEstados);
        this.router.get("/getCiudades/:clave", usuariosController.getCiudades);
        this.router.get("/listaUsuarios", usuariosController.listUsuarios);
        this.router.get("/getUsuario/:id", usuariosController.UsuarioEncontrado);
        this.router.delete("/eliminarUsuario/:id", usuariosController.eliminarUsuario);
        this.router.get("/getPerfilUsuario/:id_usuario", usuariosController.getPerfilUsuario);
        this.router.put("/actualizarPerfilUsuario/:id", usuariosController.actualizarPerfilUsuario);
        this.router.post('/restablecerContrasena', usuariosController.restablecerContrasena);
        this.router.get("/getEstado/:clave", usuariosController.getEstado);
        this.router.put("/actualizarUsuario/:id", usuariosController.actualizarUsuario);
        this.router.post("/postularme",usuariosController.postular);
    }
}
const usuaioRoutes = new UsuarioRoutes();
export default usuaioRoutes.router;

