import { Router } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import refreshtokenRoutes from './refresh-token';
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
            //autenticar usuario 
            const accessToken = "access_Token";
            const refreshtoken = "refresh_token";
            const user = {
                id: "1",
                nombre: "Gizelle",
                correo: "ramires@gmail.com",
                direccion: "Actlima",
                ciudad: "Huajuapan",
                estado: "Oaxaca"

            }
            //crear usuario en la base de datos
            res.status(200).json(jsonResponse(200, {user, refreshtoken, accessToken }));
        });
        /*this.router.get('/obtenerUsuario/:id',empresaController.listOne);
        this.router.post('/', empresaController.createUsuario);
        this.router.delete('/:id',empresaController.borrarUsuario);
        this.router.put('/:id',empresaController.actualizarUsuario);*/
    }
}
const loginRoutes = new LoginRoutes();
export default loginRoutes.router;