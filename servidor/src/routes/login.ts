import { Router } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import refreshtokenRoutes from './refresh-token';
import { loginController } from '../controllers/loginController';
class LoginRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post("/",loginController.verificarUsuario )
}
}
const loginRoutes = new LoginRoutes();
export default loginRoutes.router;