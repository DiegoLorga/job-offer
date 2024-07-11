import { Router } from 'express';
import { jsonResponse } from '../lib/jsonResponse';

class RegistroRoutes {
    public router: Router = Router();
    constructor() {
        this.config();
    }
    config(): void {
        this.router.post("/", (req, res) => {
            const { nombre, correo, contrasena, verificar, direccion, ciudad, estado } = req.body;
            if (!!!nombre || !!!correo || !!!contrasena || !!!verificar || !!!direccion || !!!ciudad || !!!estado) {
                return res.status(400).json(jsonResponse(400, {
                    error: "Al menos un campo está vacío"

                })
            );
            }
            //crear usuario en la base de datos
            res.status(200).json(jsonResponse(200,{messege: "Usuario creado correctamente"}));
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const registroRoutes = new RegistroRoutes();
export default registroRoutes.router;