import { Router } from 'express';
import { empresaController } from '../controllers/empresaController';
class EmpresaRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/obtenerEmpresa/:id',empresaController.listOne);
        this.router.get('/listarEmpresa', empresaController.list)
        this.router.post('/', empresaController.createEmpresa);
        this.router.delete('/:id',empresaController.borrarEmpresa);
        this.router.put('/:id',empresaController.actualizarEmpresa);
        this.router.put('/actualizar/:id',empresaController.actualizarPerfilEmpresa);
        this.router.delete('/eliminarEmpresa/:id', empresaController.borrarEmpresa);
    }
}
const empresaRoutes = new EmpresaRoutes();
export default empresaRoutes.router;