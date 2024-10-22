import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Estado from '../models/estado.model';
import Ciudad from '../models/ciudad.model';
import Guardado from '../models/guardado.model';
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
import OfertaLaboral from '../models/OfertaLaboral.model';
import notificacionEmpresa from '../models/notificacionEmpresa.model';
import server from '../index';
import Oferta from '../models/OfertaLaboral.model';
import { log } from 'node:console';

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

    public async getEstadosOfertas(req: Request, res: Response): Promise<void> {
        try {
            const estadosUnicos = await OfertaLaboral.distinct('estado');

            console.log('Estados únicos:', estadosUnicos);

            if (estadosUnicos.length === 0) {
                res.json([]);
                return
            }

            const estadosDetalles = await Estado.find({
                nombre: { $in: estadosUnicos.map(estado => estado.toUpperCase()) }
            });

            console.log('Detalles de los estados:', estadosDetalles);

            const resultados = estadosDetalles.map(estado => ({
                _id: estado._id,
                clave: estado.clave,
                nombre: estado.nombre,
            }));

            res.json(resultados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los detalles de los estados' });
        }
    }

    public async getEstadosEmpresas(req: Request, res: Response): Promise<void> {
        try {
            const estadosUnicos = await Empresa.distinct('estado');

            console.log('Estados únicos:', estadosUnicos);

            if (estadosUnicos.length === 0) {
                res.json([]);
                return
            }

            const estadosDetalles = await Estado.find({
                nombre: { $in: estadosUnicos.map(estado => estado.toUpperCase()) }
            });

            console.log('Detalles de los estados:', estadosDetalles);

            const resultados = estadosDetalles.map(estado => ({
                _id: estado._id,
                clave: estado.clave,
                nombre: estado.nombre,
            }));

            res.json(resultados);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener los detalles de los estados' });
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

    public async getCiudadesEmpresas(req: Request, res: Response): Promise<void> {
        try {
            const clave = req.params.clave;
    
            const ciudades = await Ciudad.find({ clave: clave });
            //console.log(ciudades)
            if (ciudades.length === 0) {
                res.json([]);
                return
            }
    
            const ciudadesFiltradas = [];
            for (const ciudad of ciudades) {
                const existeEnEmpresa = await Empresa.exists({ 'ciudad': ciudad.nombre });
                if (existeEnEmpresa) {
                    ciudadesFiltradas.push(ciudad); 
                }
            }

            console.log(ciudadesFiltradas)
    
            res.json(ciudadesFiltradas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al filtrar las ciudades' });
        }
    }

    public async getCiudadesOfertas(req: Request, res: Response): Promise<void> {
        try {
            const clave = req.params.clave;
    
            const ciudades = await Ciudad.find({ clave: clave });
            //console.log(ciudades)
            if (ciudades.length === 0) {
                res.json([]);
                return
            }
    
            const ciudadesFiltradas = [];
            for (const ciudad of ciudades) {
                const existeEnOferta = await OfertaLaboral.exists({ 'ciudad': ciudad.nombre });
                if (existeEnOferta) {
                    ciudadesFiltradas.push(ciudad); 
                }
            }

            console.log(ciudadesFiltradas)
    
            res.json(ciudadesFiltradas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al filtrar las ciudades' });
        }
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

    public async postular(req: Request, res: Response): Promise<void> {
        const { idUsuario, idOferta } = req.body;
    

        try {
            // Verificar si el usuario ya se ha postulado a esta oferta
            const postulacionExistente = await notificacionEmpresa.findOne({ idUsuario, idOferta });
    
            if (postulacionExistente) {
                res.status(400).json({
                    status: 400,
                    message: 'Ya te has postulado a esta oferta'
                });
                return;
            }
    
            // Obtener la oferta laboral y la empresa relacionada
            const oferta = await OfertaLaboral.findById(idOferta).populate('id_empresa');
    

            if (!oferta || !oferta.id_empresa) {
                res.status(404).json({
                    status: 404,
                    message: 'Oferta o empresa no encontrada'
                });
                return;
            }
    

            const empresa = oferta.id_empresa as any; // Asegúrate de que esto contiene la referencia a la empresa
    
            // Obtener el usuario por ID para obtener su nombre
            const usuario = await Usuario.findById(idUsuario); // Asegúrate de que 'Usuario' es el modelo correcto
    
            if (!usuario) {
                res.status(404).json({
                    status: 404,
                    message: 'Usuario no encontrado'
                });
                return;
            }
    
            // Crear la notificación con el nombre del usuario

            const nuevaNotificacion = new notificacionEmpresa({
                recipientId: empresa._id, // Cambiar a empresa._id
                senderId: usuario._id, // Almacena el ID del usuario para referencia
                message: `El usuario ${usuario.nombre} se ha postulado para la oferta: ${oferta.titulo}`,
                link: `/Empresa/Postulantes/`,
                isRead: false
            });
    

            await nuevaNotificacion.save();
    

            // Emitir el evento al room de la empresa usando su ID
            server.io.to(`empresa_${empresa._id.toString()}`).emit('nuevaPostulacion', nuevaNotificacion);
            console.log(empresa._id);
    


            res.status(200).json({
                status: 200,
                message: 'Postulación enviada y notificación creada',
                notificacion: nuevaNotificacion
            });
        } catch (error: any) {
            res.status(500).json({
                status: 500,
                message: 'Error al guardar la notificación',
                error: error.message
            });
        }
    }
    
    
    
    





    public async createGuardado(req: Request, res: Response): Promise<void> {
        const { id_oferta, id_usuario } = req.body;

        try {
            const guardadoExistente = await Guardado.findOne({
                id_oferta,
                id_usuario
            });

            if (guardadoExistente) {
                res.status(200).json({ message: 'Oferta guardada exitosamente.' });
            } else {
                const nuevoGuardado = new Guardado({
                    id_oferta,
                    id_usuario
                });

                const newGuardado = await nuevoGuardado.save();

                res.json({
                    id: newGuardado._id,
                    id_oferta: newGuardado.id_oferta,
                    id_usuario: newGuardado.id_usuario
                });
            }

        } catch (error) {
            res.status(400).json({
                error: "No se pudo guardar la oferta."
            });
        }
    }

    public async deleteGuardado(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            const guardadoExistente = await Guardado.findByIdAndDelete(id);

            res.json({
                message: "Oferta eliminada exitosamente."
            });

        } catch (error) {
            res.status(400).json({
                error: "No se pudo eliminar la oferta."
            });
        }
    }



    public async getAllGuardados(req: Request, res: Response): Promise<void> {
        const id_usuario = req.params.id;

        try {
            const guardados = await Guardado.find({ id_usuario });
            if (guardados.length > 0) {
                const guardadosConOfertas = [];
                for (const guardado of guardados) {
                    const oferta = await Oferta.findById(guardado.id_oferta, 'titulo puesto estado sueldo status');
                    if (oferta) {
                        guardadosConOfertas.push({
                            id_guardado: guardado._id,
                            id_oferta: oferta._id,
                            titulo: oferta.titulo,
                            puesto: oferta.puesto,
                            estado: oferta.estado,
                            sueldo: oferta.sueldo,
                            status: oferta.status
                        });
                    }
                }
                res.json(guardadosConOfertas);
            }
            else {
                res.status(200).json({ message: 'No existen ofertas guardadas para este usuario.' });
            }

        } catch (error) {
            console.error("Error al obtener las ofertas guardadas:", error);
            res.status(500).json({
                error: "No se pudo obtener la lista de ofertas guardadas."
            });
        }
    }




}


export const usuariosController = new UsuarioController();