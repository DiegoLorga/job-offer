import { Request, Response } from 'express';
import { connectDB } from '../database'; //acceso a la base de datos
import Usuario from '../models/usuario.model'
import Rol from '../models/rol.model';
import { jsonResponse } from '../lib/jsonResponse';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

class UsuarioController {

    constructor() {
    }
    public async createUsuario(req: Request, res: Response): Promise<void> {
        console.log("Creado un  usuario");
        const { nombre, correo, contrasena, direccion, ciudad, estado, id_rol } = req.body;
        const tipoRol = await Rol.findById(id_rol)
        try {
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const nuevoUsuario = new Usuario({
                nombre,
                correo,
                contrasena: hashedPassword,
                direccion,
                ciudad,
                estado,
                id_rol: tipoRol
            })
            const UsuarioGuardado = await nuevoUsuario.save();
            res.json({
                nombre: UsuarioGuardado.nombre,
                correo: UsuarioGuardado.correo,
                contrasena: UsuarioGuardado.contrasena,
                direccion: UsuarioGuardado.direccion,
                ciudad: UsuarioGuardado.ciudad,
                estado: UsuarioGuardado.estado
            })
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el rol"

            })
            )

        }
    }

    public async validarCorreo(req: Request, res: Response): Promise<void> {
        const {correo} = req.params;

        
    }

    /*public async validarCorreo(req: Request, res: Response): Promise<void> {
        const { correo } = req.params;

        if (!validator.isEmail(correo)) {
            res.status(400).json(jsonResponse(400, {
                error: "El correo no es válido"
            }));
            return;
        }

        res.status(200).json(jsonResponse(200, {
            message: "El correo es válido"
        }));
    }*/

}
export const usuariosController = new UsuarioController();