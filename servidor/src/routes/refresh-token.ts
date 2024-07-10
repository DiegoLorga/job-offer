import { Router } from 'express';

class RefreshTokenRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get("/",(req,res)=>{
            res.send("Token")
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const refreshtokenRoutes = new RefreshTokenRoutes();
export default refreshtokenRoutes.router;