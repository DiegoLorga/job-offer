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

    }
}
const administradorRoutes = new perfilUsuarioRoutes();
export default administradorRoutes.router;