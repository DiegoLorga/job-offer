import { Router } from 'express';

class EmpleadoRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.get("/",(req,res)=>{
            res.send("empleado")
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const empleadoRoutes = new EmpleadoRoutes();
export default empleadoRoutes.router;