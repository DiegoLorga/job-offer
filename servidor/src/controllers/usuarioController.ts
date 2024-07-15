import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Rol from '../models/rol.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';

class UsuarioController {

    public async createUsuario(req: Request, res: Response): Promise<void> {
        
        const { nombre, correo, contrasena, direccion, ciudad, estado, id_rol, verificar } = req.body;
        
        let camposError: string | null = null;
        let contrasenasError: string | null = null;
        let nombreError: string | null = null;
        let correoError: string | null = null;

        if (!nombre || !correo || !contrasena || !verificar || !direccion || !ciudad || !estado) {
            camposError = "Todos los campos son requeridos";
        } else {
            if (contrasena !== verificar) {
                contrasenasError = "Las contraseñas no coinciden";
            }else{
                const contrasenaregex = /^(?=.*[A-ZÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-])[A-Za-zÀ-ÿ\d@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-]{8,}$/;
                if (!contrasenaregex.test(contrasena)) {
                    contrasenasError = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial";
                }
            }
            const nameRegex = /^[a-zA-ZÀ-ÿ'\s]{1,50}$/;
            if (!nameRegex.test(nombre)) {
                nombreError = "Nombre no válido";
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(correo)) {
                correoError = "Correo no válido";
            }

       
        }

        if (camposError || contrasenasError || nombreError) {
            res.status(400).json(jsonResponse(400, {
                camposError,
                contrasenasError,
                nombreError,
                correoError
            }));
            return;
        }

        try {
            const tipoRol = await Rol.findById(id_rol);
            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const nuevoUsuario = new Usuario({
                nombre,
                correo,
                contrasena: hashedPassword,
                direccion,
                ciudad,
                estado,
                id_rol: tipoRol
            });

            const UsuarioGuardado = await nuevoUsuario.save();
            res.json({
                nombre: UsuarioGuardado.nombre,
                correo: UsuarioGuardado.correo,
                contrasena: UsuarioGuardado.contrasena,
                direccion: UsuarioGuardado.direccion,
                ciudad: UsuarioGuardado.ciudad,
                estado: UsuarioGuardado.estado
            });
        } catch (error) {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el usuario"
            }));
        }
    }


}

export const usuariosController = new UsuarioController();
