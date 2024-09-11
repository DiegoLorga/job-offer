import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Estado from '../models/estado.model';
import Ciudad from '../models/ciudad.model';
import Experiencia from '../models/experiencia.model';
import PerfilUsuario from '../models/perfilUsuario.model';
import FotosPerfilUsuario from '../models/fotosPerfilUsuario.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt';
import jwt from 'jsonwebtoken';
import Empresa from '../models/empresa.model';
import EducacionUsuario from '../models/educacionUsuario.model';
import Administrador from '../models/administrador.model';

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

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            correoError = "El correo electrónico ya está en uso"
        }

        /*const estadoName = await Estado.findOne({ clave: estado });
         let estadoNom: string = estado; // Definir la variable con el tipo correcto
 
         if (estadoName) {
             estadoNom = estadoName.nombre;
         } */

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
                experiencia: false,
                habilidades: false,
                educacion: false,
                idiomas: false,
                certificaciones: false,
                status: false,
                foto: false
            });

            const PerfilGuardado = await nuevoPerfil.save();

            const nuevoExp = new Experiencia({
                id_usuario: UsuarioGuardado._id,
                empresa: '',
                puesto: '',
                descripcion: ''
            });

            const ExperienciaGuardado = await nuevoExp.save();

            const nuevaEduUsu = new EducacionUsuario({
                id_usuario: UsuarioGuardado._id,
                nivel: '',
                institucion: '',
                carrera: ''
            });

            await nuevaEduUsu.save();

            const token = await createAccesToken({ id: UsuarioGuardado._id })
            res.cookie('token', token)

            console.log(res.cookie);

            res.json({
                id: UsuarioGuardado._id,
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
                    ciudad: usuarioEncontrado.ciudad,
                    estado: usuarioEncontrado.estado,
                    id_rol: usuarioEncontrado.id_rol,
                    direccion: usuarioEncontrado.direccion
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

    public async getEstado(req: Request, res: Response): Promise<void> {
        try {
            const clave = req.params.clave;

            // Buscar el estado en la colección adecuada
            const estado = await Estado.findOne({ clave: clave });

            if (estado) {
                res.json({ nombre: estado.nombre });
            } else {
                res.status(404).json({ error: "Estado no encontrado" });
            }
        } catch (error) {
            console.error("Error al obtener el estado:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
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


            console.log("Usuario eliminado correctamente");
            res.status(200).json(jsonResponse(200, {
                message: "Uusuario eliminado correctamente"
            }));
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
            const perfilEncontrado = await PerfilUsuario.findOne({ id_usuario: id_usuario });


            if (perfilEncontrado) {
                res.json({
                    id: perfilEncontrado._id,
                    cv: perfilEncontrado.cv,
                    experiencia: perfilEncontrado.experiencia,
                    habilidades: perfilEncontrado.habilidades,
                    educacion: perfilEncontrado.educacion,
                    idiomas: perfilEncontrado.idiomas,
                    certificaciones: perfilEncontrado.certificaciones,
                    status: perfilEncontrado.status,
                    foto: perfilEncontrado.foto

                });
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

    public async actualizarUsuario(req: Request, res: Response): Promise<void> {
        const { nombre, direccion, ciudad, estado, correo } = req.body;

        let nombreError: string | null = null;

        const nameRegex = /^[a-zA-ZÀ-ÿ'\s]{1,50}$/;
        if (!nameRegex.test(nombre)) {
            nombreError = "Nombre no válido";
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(correo)) {
            nombreError = "Correo no válido";
        }
        /*const estadoName = await Estado.findOne({ clave: estado });
        let estadoNom: string = estado;
    
        if (estadoName) {
            estadoNom = estadoName.nombre;
        }*/

        if (nombreError) {
            res.status(400).json(jsonResponse(400, {
                nombreError
            }));
            return;
        }



        try {
            const perfil = await Usuario.findByIdAndUpdate(
                req.params.id,
                { nombre, direccion, ciudad, estado, correo },
                { new: true }
            );
            res.json(perfil);
        } catch (error: any) {
            res.status(500).json(jsonResponse(400, {
                camposError: "Error al actualizar al usuario"
            }));
        }
    }

    public async restablecerContrasena(req: Request, res: Response): Promise<void> {
        const { token, password } = req.body;

        if (!token || !password) {
            res.status(400).json({ message: 'Token y contraseña son requeridos.' });
            return;
        }

        try {
            // Verifica el token y obtiene el correo
            const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET || 'prueba');
            const email = decoded.email;

            // Encuentra el usuario en las tres colecciones posibles
            let user: any = await Usuario.findOne({ correo: email });
            if (!user) {
                user = await Empresa.findOne({ correo: email });
            }
            if (!user) {
                user = await Administrador.findOne({ correo: email });
            }

            // Si no se encontró el usuario en ninguna colección
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado.' });
                return;
            }

            // Hashea la nueva contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Actualiza la contraseña en la colección correspondiente
            if (user instanceof Usuario) {
                await Usuario.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
            } else if (user instanceof Empresa) {
                await Empresa.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
            } else if (user instanceof Administrador) {
                await Administrador.findOneAndUpdate({ correo: email }, { contrasena: hashedPassword });
            }

            res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
        } catch (error) {
            console.error(error); // Imprime el error para depuración
            res.status(400).json({ message: 'Error al actualizar la contraseña.' });
        }
    }
}


export const usuariosController = new UsuarioController();