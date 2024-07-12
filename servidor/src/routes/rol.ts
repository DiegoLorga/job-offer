import { Router } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import { rolesController } from '../controllers/rolController';

class RolRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post('/',rolesController.createRol);
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const rolRoutes = new RolRoutes();
export default rolRoutes.router;