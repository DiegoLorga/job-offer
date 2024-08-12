import { Router } from 'express';
import { OfertaLaboralController } from '../controllers/ofertaLaboalController';

class OfertaLaboralRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/obtenerOfertas/:id',OfertaLaboralController.listOne);
        this.router.get('/listarOfertas', OfertaLaboralController.listOfertas)
        this.router.post('/', OfertaLaboralController.createOfertaLaboral);
        this.router.put('/:id',OfertaLaboralController.actualizarOfertaLaboral);
        this.router.post('/crearCategoria',OfertaLaboralController.createCategoria)
        this.router.get('/categorias', OfertaLaboralController.list)
        this.router.get('/buscar',OfertaLaboralController.buscarOfertas);
        this.router.get('/buscarNombreEmpresa/:id',OfertaLaboralController.ObtenerNombreEmpresa);
    }

    }
const ofertaLaboralRoutes = new OfertaLaboralRoutes();
export default ofertaLaboralRoutes.router;  