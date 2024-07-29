import { Router } from 'express';
import { empresaController } from '../controllers/empresaController';
class EmpresaRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/obtenerEmpresa/:id',empresaController.listOne);
        this.router.get('/', empresaController.list)
        this.router.post('/', empresaController.createEmpresa);
        this.router.delete('/:id',empresaController.borrarEmpresa);
        this.router.put('/:id',empresaController.actualizarEmpresa);
    }
}
const empresaRoutes = new EmpresaRoutes();
export default empresaRoutes.router;