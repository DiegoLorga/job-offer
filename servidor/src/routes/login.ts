import { Router } from 'express';
import { loginController } from '../controllers/loginController';
import { validarToken } from '../middleware/auth';
class LoginRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post("/",loginController.verificarUsuario )
        this.router.post("/logout",loginController.logout)
        this.router.get('/perfil', validarToken,loginController.perfil);
        this.router.get("/verificar",validarToken);

}
}
const loginRoutes = new LoginRoutes();
export default loginRoutes.router;