import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcryptjs';
import Login from '../models/login.model';
import Usuario from '../models/usuario.model';
import { jsonResponse } from '../lib/jsonResponse';
import { usuariosController } from './usuarioController';


class LoginController {

    constructor() {
    }
    public async verificarUsuario(req: Request, res: Response): Promise<void> {
        const { correo, contrasena } = req.body;

        try {
            const usuario = await Usuario.findOne({ correo });

            if (!usuario) {
                res.status(404).json(jsonResponse(404, {
                    error: "Datos inválidos"
                }));
                return;
            }

            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!contrasenaValida) {
                res.status(401).json(jsonResponse(401, {
                    error: "Datos inválidos"
                }));
                return;
            }
            const accessToken = usuariosController;
            const refreshToken = usuariosController;

            res.status(200).json(jsonResponse(200, {correo,accessToken,refreshToken}));
        
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Error del servidor"
            }));
        }
    }
    

}

export const loginController = new LoginController();