import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Estado from '../models/estado.model';
import Ciudad from '../models/ciudad.model';
import PerfilUsuario from '../models/perfilUsuario.model';
import FotosPerfilUsuario from '../models/fotosPerfilUsuario.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt';
import jwt  from 'jsonwebtoken';

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

            const UsuarioGuardado = await nuevoUsuario.save();

            const nuevoPerfil = new PerfilUsuario({
                id_usuario: UsuarioGuardado._id,
                cv: false,
                experiencia: '',
                especialidad: '',
                habilidades: '',
                educacion: '',
                idiomas: '',
                certificaciones: false,
                repositorio: '',
                status: false,
                foto: false
            });

            const PerfilGuardado = await nuevoPerfil.save();

            const nuevaFotoPerfil = new FotosPerfilUsuario({
                id_fotoUs: PerfilGuardado._id
            });
            await nuevaFotoPerfil.save();


            const token = await createAccesToken({ id: UsuarioGuardado._id })
            res.cookie('token', token)

            console.log(res.cookie);

            res.json({
                idRol: UsuarioGuardado.id_rol,
                nombre: UsuarioGuardado.nombre,
                correo: UsuarioGuardado.correo,
                direccion: UsuarioGuardado.direccion,
                ciudad: UsuarioGuardado.ciudad,
                estado: UsuarioGuardado.estado,
            });
        } catch (error) {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el usuario"
            }));
        }
    }

    public async listUsuarios(req: Request, res: Response): Promise<void> {
        try {
            const usuarios = await Usuario.find();
            const usuariosFormateados = usuarios.map(usuario => ({
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                id_rol: usuario.id_rol
            }));
            res.json(usuariosFormateados);
        } catch (error) {
            res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
        }
    }


    public async UsuarioEncontrado(req: Request, res: Response): Promise<void> {
        try {
            const usuarioEncontrado = await Usuario.findById(req.params.id); // Usando `req.params.id` para obtener el ID del usuario
            if (!usuarioEncontrado) {
                res.status(500).json({ mensaje: "Error al buscar el usuario" });
            } else {
                res.json({
                    id: usuarioEncontrado._id,
                    nombre: usuarioEncontrado.nombre,
                    correo: usuarioEncontrado.correo,
                    id_rol: usuarioEncontrado.id_rol
                });
            }

        } catch (error) {
            res.status(500).json({ mensaje: "Error al buscar el usuario", error });
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
    }

    public async eliminarUsuario(req: Request, res: Response): Promise<void> {
        try {
            const perfilEliminado = await PerfilUsuario.findOneAndDelete({ id_usuario: req.params.id });
            console.log(perfilEliminado);
            if (perfilEliminado) {
                await FotosPerfilUsuario.findOneAndDelete({ id_fotoUs: perfilEliminado._id });
            }

            const usuario = await Usuario.findByIdAndDelete(req.params.id)
            res.json(usuario)
        }
        catch (error) {
            res.status(500).json(jsonResponse(400, {
                error: "No se pudo eliminar el usuario"
            }));
        }
    }

    public async getPerfilUsuario(req: Request, res: Response): Promise<void> {
        try {
            const id_usuario = req.params.id_usuario;
            const perfilEncontrado = await PerfilUsuario.find({ id_usuario: id_usuario });

            if (perfilEncontrado) {
                res.json(perfilEncontrado);
            } else {
                res.status(404).json({ message: "Perfil de usuario no encontrado" });
            }
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async actualizarPerfilUsuario(req: Request, res: Response): Promise<void> {
        try {
            const perfil = await PerfilUsuario.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json(perfil)
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    public async restablecerContrasena(req: Request, res: Response): Promise<void> {
        const { token, password } = req.body;
        try {
            const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || 'prueba');
            const email = decoded.email;

            const hashedPassword = await bcrypt.hash(password, 10);
            await Usuario.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });

            res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar la contraseña' });
        }
    }







}


export const usuariosController = new UsuarioController();