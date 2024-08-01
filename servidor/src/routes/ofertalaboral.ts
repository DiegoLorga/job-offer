import { Router } from 'express';
import { OfertaLaboralController } from '../controllers/ofertaLaboalController';

class OfertaLaboralRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get('/obtenerOfertas/:id',OfertaLaboralController.listOne);
        this.router.get('/', OfertaLaboralController.listOfertas)
        this.router.post('/', OfertaLaboralController.createOfertaLaboral);
        this.router.put('/:id',OfertaLaboralController.actualizarOfertaLaboral);
        this.router.get('/buscar',OfertaLaboralController.buscarOfertas);
    }

    }
const ofertaLaboralRoutes = new OfertaLaboralRoutes();
export default ofertaLaboralRoutes.router;  