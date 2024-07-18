import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Estado from '../models/estado.model';
import Ciudad from '../models/ciudad.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt';

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
            } else {
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


        if (camposError || contrasenasError || nombreError || correoError) {
            res.status(400).json(jsonResponse(400, {
                camposError,
                contrasenasError,
                nombreError,
                correoError
            }));
            return;
        }


        try {
            const tipoRol = "6690640c24eacbffd867f333";
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
            //console.log("Hola, antes de Token");

            const UsuarioGuardado = await nuevoUsuario.save();
            console.log("Hola, antes de Token");
            const token = await createAccesToken({ id: UsuarioGuardado._id });

            res.cookie('token', token)

            console.log("Hola, despues de Token");
            
            console.log(res.cookie);

            res.json({
                idRol: UsuarioGuardado.id_rol,
                nombre: UsuarioGuardado.nombre,
                correo: UsuarioGuardado.correo,
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
    public async getEstados(req: Request, res: Response): Promise<void> {

        const estados = await Estado.find();
        res.json(estados);

    }


    public async getCiudades(req: Request, res: Response): Promise<void> {
        const clave = req.params.clave; 
        const ciudades = await Ciudad.find({ clave: clave }); 
        res.json(ciudades)
        console.log("Ciudades encontradas:", ciudades);

    }




}


export const usuariosController = new UsuarioController();
