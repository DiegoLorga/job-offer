import { Router } from 'express';
import { perfilUsuarioController } from '../controllers/perfilUsuarioController';


class perfilUsuarioRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.put("/actualizarExperiencia/:id_usuario", perfilUsuarioController.actualizarExperiencia);
        this.router.get("/buscarExperiencia/:id_usuario", perfilUsuarioController.buscarExperiencia);
        this.router.put("/actualizarHabilidades/:id_usuario", perfilUsuarioController.actualizarHabilidades);
        this.router.get("/buscarHabilidades/:id_usuario", perfilUsuarioController.buscarHabilidades);
        this.router.post("/crearHabilidades/:id_usuario", perfilUsuarioController.crearHabilidades);
        this.router.delete('/eliminarHabilidad/:id_habilidad', perfilUsuarioController.eliminarHabilidad);
        this.router.put("/actualizarEducacion/:id_usuario", perfilUsuarioController.actualizarEducacion);
        this.router.get("/buscarEducacionUsuario/:id_usuario", perfilUsuarioController.buscarEduUsu);
    }
}
const administradorRoutes = new perfilUsuarioRoutes();
export default administradorRoutes.router;