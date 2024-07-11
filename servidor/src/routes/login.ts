import { Router } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
class LoginRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post("/", (req, res) => {
            const { correo, contrasena } = req.body;
            if (!!!correo || !!!contrasena) {
                return res.status(400).json(jsonResponse(400, {
                    error: "Al menos un campo está vacío"

                })
            );
            }
            //crear usuario en la base de datos
            res.status(200).json(jsonResponse(200,{message: "Ingreso Correcto"}));
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const loginRoutes = new LoginRoutes();
export default loginRoutes.router;