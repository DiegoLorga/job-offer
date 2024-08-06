import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
class AdministradorRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post("/", AdminController.createAdministrador)
        this.router.get("/listaAdmins", AdminController.listAdmins);
        this.router.delete("/eliminarAdmin/:id_admin", AdminController.eliminarAdmin);
        this.router.get("/listAdmin/:id_admin", AdminController.listOne);
        this.router.put("/actualizarAdmin/:id_admin", AdminController.actualizarAdministrador);


    }
}
const administradorRoutes = new AdministradorRoutes();
export default administradorRoutes.router;