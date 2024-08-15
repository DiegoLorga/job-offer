import { Router } from 'express';
import { redesSocialesController } from '../controllers/redesSocilesController';
import { empresaController } from '../controllers/empresaController';

class perfilEmpresaRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        
        this.router.post('/', redesSocialesController.createRedSocial);
        this.router.get('/',redesSocialesController.listRedesSociales);
        this.router.get('/obtener_red/:id',redesSocialesController.listOne);
        this.router.post('/crearEnlace',redesSocialesController.createEnlaceRed);
        this.router.put('/actualizar/:id',empresaController.actualizarPerfilEmpresa);
        this.router.delete('/eliminarEmpresa/:id', empresaController.borrarEmpresa);
        this.router.get('/perfil/:id', empresaController.obtenerPerfilEmpresa);
    }
}
const PerfilEmpresaRoutes = new perfilEmpresaRoutes();
export default PerfilEmpresaRoutes.router;