import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Usuario from '../models/usuario.model';
import Empresa from '../models/empresa.model';
import Administrador from '../models/administrador.model'; // Supongo que tienes un modelo de administrador
import { jsonResponse } from '../lib/jsonResponse';
import { createAccesToken } from '../libs/jwt';

class LoginController {
    constructor() {}

    public async login(req: Request, res: Response): Promise<void> {
        const { correo, contrasena } = req.body;

        try {
            let userType = ''; // Para identificar el tipo de usuario
            let user: any = await Usuario.findOne({ correo });
            if (user) userType = "usuario"
            
            if (!user) {
                user = await Empresa.findOne({ correo });
                if (user) userType = 'empresa';
            }
            
            if (!user) {
                user = await Administrador.findOne({ correo });
                if (user) userType = 'administrador';
            }
            
            if (!user) {
                res.status(404).json(jsonResponse(404, {
                    error: "Credenciales inválidas"
                }));
                return;
            }

            const contrasenaValida = await bcrypt.compare(contrasena, user.contrasena);
            if (!contrasenaValida) {
                res.status(401).json(jsonResponse(401, {
                    error: "Credenciales inválidas"
                }));
                return;
            }

            const token = await createAccesToken({ id: user._id, type: userType });
            res.cookie('token', token);

            res.status(200).json(jsonResponse(200, {
                message: `Login exitoso como ${userType}`,
                usuario: {
                    id: user._id,
                    nombre: user.nombre,
                    correo: user.correo,
                    estado: user.estado,
                    id_rol: user.id_rol || 'usuario' // Si tiene roles, lo asignas aquí
                }
            }));
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Error del servidor"
            }));
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        console.log("Deslogueando");
        res.cookie('token', "", { expires: new Date(0) });
        res.sendStatus(200);
        return;
    }

   
    public async perfil(req: any, res: Response): Promise<void> {
        const userId = req.usuario?.id;
        const userType = req.usuario?.type;

        if (!userId || !userType) {
            res.status(400).json({ mensaje: "Información de usuario no disponible" });
            return;
        }

        try {
            let user: any;

            // Buscar en la base de datos según el tipo de usuario
            if (userType === 'usuario') {
                user = await Usuario.findById(userId);
            } else if (userType === 'empresa') {
                user = await Empresa.findById(userId);
            } else if (userType === 'administrador') {
                user = await Administrador.findById(userId);
            } else {
                res.status(400).json({ mensaje: "Tipo de usuario no válido" });
                return;
            }

            if (!user) {
                res.status(404).json({ mensaje: "Usuario no encontrado" });
                return;
            }

            // Devuelve la información del perfil
            res.json({
                id: user._id,
                nombre: user.nombre,
                correo: user.correo,
                id_rol: user.id_rol,       // Incluye solo si aplica
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        } catch (error) {
            res.status(500).json({ mensaje: "Error del servidor" });
        }
    }
}

export const loginController = new LoginController();
