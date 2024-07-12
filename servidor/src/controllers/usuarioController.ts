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

    private validarCampos(req: Request): { camposError: string | null, contrasenasError: string | null, correoError: string | null, nombreError: string | null } {
        const { nombre, correo, contrasena, verificar, direccion, ciudad, estado, } = req.body;
        let camposError: string | null = null;
        let contrasenasError: string | null = null;
        let correoError: string | null = null;
        let nombreError: string | null = null;


        if (!nombre || !correo || !contrasena || !verificar || !direccion || !ciudad || !estado) {
            camposError = "Todos los campos son requeridos";
        }


        if (contrasena !== verificar) {
            contrasenasError = "Las contraseñas no coinciden";
        } else if (!this.validarContrasena(contrasena)) {
            contrasenasError = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un dígito y un carácter especial";
        }


        if (!this.validarCorreo(correo)) {
            correoError = "Correo no válido";
        }


        if (!this.validarNombre(nombre)) {
            nombreError = "Nombre no válido";
        }
        return { camposError, contrasenasError, correoError, nombreError };
    }

    validarContrasena(contrasena: string): boolean {
        const regex = /^(?=.*[A-ZÀ-ÿ])(?=.*\d)(?=.*[@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-])[A-Za-zÀ-ÿ\d@$!%*?&#+^()_+=\{\}\[\]|:;,.<>~-]{8,}$/;
        return regex.test(contrasena);
    }

    validarCorreo(correo: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(correo);
    }


    validarNombre(nombre: string): boolean {
        const nameRegex = /^[a-zA-ZÀ-ÿ'\s]{1,50}$/;
        return nameRegex.test(nombre);
    }
}


export const usuariosController = new UsuarioController();