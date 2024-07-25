
import { Request, Response } from 'express';
import bcrypt, { hash } from 'bcryptjs';
import Usuario from '../models/usuario.model';
import { jsonResponse } from '../lib/jsonResponse';
import { createAccesToken } from '../libs/jwt';


class LoginController {

    constructor() {
    }
    public async login(req: Request, res: Response): Promise<void> {
        const { correo, contrasena } = req.body;

        try {
            const usuario = await Usuario.findOne({ correo });
            if (!usuario) {
                res.status(404).json(jsonResponse(404, {
                    error: "Usuario inválido"
                }));
                return;
            }

            const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

            if (!contrasenaValida) {
                res.status(401).json(jsonResponse(401, {
                    error: "Usuario inválido"
                }));
                return;
            }
            const token = await createAccesToken({ id: usuario._id });
            console.log(usuario._id);
           res.cookie('token', token);
           
            res.status(200).json(jsonResponse(200, {
                message: "El usuario y la contraseña son correctos",
                usuario: {
                    id_usuario: usuario._id,
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
    public async logout(req: Request, res: Response): Promise<void> {
        console.log("deslogueando");
        res.cookie('token', "", { expires: new Date(0) });
        res.sendStatus(200)
        return;
    }

    public async perfil(req: any, res: Response): Promise<void> {
        const usuarioEncontrado = await Usuario.findById(req.usuario.id)
        if (!usuarioEncontrado)
            res.status(400).json({ mensaje: "Usuario no encontrado" })
        res.json({
            id: usuarioEncontrado?._id,
            nombre: usuarioEncontrado?.nombre,
            correo: usuarioEncontrado?.correo,
            createdAt: usuarioEncontrado?.createdAt,
            updatedAt: usuarioEncontrado?.updatedAt
        })
    }
    
}




export const loginController = new LoginController();

