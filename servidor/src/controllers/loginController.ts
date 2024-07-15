import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcryptjs';
import Login from '../models/login.model';
import Usuario from '../models/usuario.model';
import { jsonResponse } from '../lib/jsonResponse';


class LoginController {

    constructor() {
    }
    public async verificarUsuario(req: Request, res: Response): Promise<void> {
        const { correo, contrasena } = req.body;

        try {
            const usuario = await Usuario.findOne({ correo });

            if (!usuario) {
                res.status(404).json(jsonResponse(404, {
                    error: "El usuario no existe"
                }));
                return;
            }

            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!contrasenaValida) {
                res.status(401).json(jsonResponse(401, {
                    error: "La contraseña es incorrecta"
                }));
                return;
            }

            res.status(200).json(jsonResponse(200, {
                message: "El usuario y la contraseña son correctos",
                usuario: {
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    direccion: usuario.direccion,
                    ciudad: usuario.ciudad,
                    estado: usuario.estado,
                    id_rol: usuario.id_rol
                }
            }));
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Error del servidor"
            }));
        }
    }
    

}

export const loginController = new LoginController();