import { Request, Response } from 'express';
import Experiencia from '../models/experiencia.model';
import { jsonResponse } from '../lib/jsonResponse';
import PerfilUsuario from '../models/perfilUsuario.model';
import Habilidad from '../models/habilidades.model';
import EducacionUsuario from '../models/educacionUsuario.model';
import Idioma from '../models/idioma.model';
import idiomaNivel from '../models/idiomaNivel.model';
import UsuarioIdioma from '../models/idiomaUsuario.model';
import Certificado from '../models/certificado.model';
import validator from 'validator';
import { Types } from 'mongoose';

class PerfilUsuarioController {

    public async actualizarExperiencia(req: Request, res: Response): Promise<void> {
        const { empresa, puesto, descripcion } = req.body;
        const { id_usuario } = req.params;

        try {
            const experiencia = await Experiencia.findOneAndUpdate(
                { id_usuario },
                { empresa, puesto, descripcion },
                { new: true, runValidators: true }
            );

            if (!experiencia) {
                res.status(404).json(jsonResponse(404, {
                    Error: "No se encontró la experiencia para el usuario dado"
                }));
                return;
            }

            const perfil = await PerfilUsuario.findOneAndUpdate({ id_usuario }, { experiencia: true }, { new: true });

            // Devuelve la experiencia actualizada
            res.json(jsonResponse(200, experiencia));
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al actualizar la experiencia"
            }));
        }
    }

    public async buscarExperiencia(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const experiencia = await Experiencia.findOne({ id_usuario });

            if (!experiencia) {
                return;
            }

            // Devuelve la experiencia encontrada
            res.json({
                id: experiencia._id,
                empresa: experiencia.empresa,
                puesto: experiencia.puesto,
                descripcion: experiencia.descripcion

            });
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al buscar la experiencia"
            }));
        }
    }

    public async actualizarHabilidades(req: Request, res: Response): Promise<void> {
        const habilidades = req.body; // Se espera que sea un array de habilidades
        const { id_usuario } = req.params;

        try {
            if (!Array.isArray(habilidades)) {
                return;
            }

            const actualizaciones = habilidades.map((habilidad) =>
                Habilidad.findOneAndUpdate(
                    { id_usuario, _id: habilidad._id },
                    { descripcion: habilidad.descripcion },
                    { new: true, runValidators: true }
                )
            );

            const habilidadesActualizadas = await Promise.all(actualizaciones);

            if (habilidadesActualizadas.includes(null)) {
                return;
            }

            res.json(jsonResponse(200, habilidadesActualizadas));
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al actualizar las habilidades"
            }));
        }
    }

    public async crearHabilidades(req: Request, res: Response): Promise<void> {
        const habilidades = req.body; // Array de habilidades a agregar
        const { id_usuario } = req.params;

        try {
            if (!Array.isArray(habilidades)) {
                res.status(400).json(jsonResponse(400, {
                    Error: "El cuerpo de la solicitud debe ser un array de habilidades"
                }));
                return;
            }

            // Verifica que cada habilidad tenga una descripción válida
            for (const habilidad of habilidades) {
                if (!habilidad.descripcion || typeof habilidad.descripcion !== 'string') {
                    res.status(400).json(jsonResponse(400, {
                        Error: "Cada habilidad debe tener una descripción válida"
                    }));
                    return;
                }
            }

            // Filtra las habilidades que ya existen en la base de datos
            const habilidadesExistentes = await Habilidad.find({
                id_usuario,
                descripcion: { $in: habilidades.map(h => h.descripcion) }
            }).exec();

            const descripcionesExistentes = habilidadesExistentes.map(h => h.descripcion);

            // Filtra las habilidades nuevas que no están en la base de datos
            const habilidadesNuevas = habilidades.filter(h => !descripcionesExistentes.includes(h.descripcion));

            if (habilidadesNuevas.length > 0) {
                // Crear nuevas habilidades
                const nuevasHabilidades = await Habilidad.insertMany(
                    habilidadesNuevas.map(habilidad => ({
                        ...habilidad,
                        id_usuario
                    }))
                );

                // Actualizar el perfil del usuario con los IDs de las nuevas habilidades
                await PerfilUsuario.findOneAndUpdate(
                    { id_usuario },
                    { $addToSet: { habilidades_ids: { $each: nuevasHabilidades.map(h => h._id) } } } // Usa $addToSet para agregar solo los nuevos IDs
                );

                res.status(201).json(jsonResponse(201, nuevasHabilidades));
            } else {
                res.status(200).json(jsonResponse(200, { Message: "No hay nuevas habilidades para agregar" }));
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al crear habilidades:', error.message);
                res.status(500).json(jsonResponse(500, {
                    Error: "Error al crear las habilidades"
                }));
            } else {
                console.error('Error desconocido:', error);
                res.status(500).json(jsonResponse(500, {
                    Error: "Error desconocido al crear las habilidades"
                }));
            }
        }
    }


    public async buscarHabilidades(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const habilidades = await Habilidad.find({ id_usuario });

            if (!habilidades || habilidades.length === 0) {
                return;
            }

            //console.log(habilidades)
            const habilidadesFormateadas = habilidades.map(habilidad => ({
                _id: habilidad._id.toString(),
                descripcion: habilidad.descripcion,
                id_usuario: habilidad.id_usuario.toString()
            }));
            console.log(habilidadesFormateadas)

            res.status(200).json(habilidadesFormateadas);

        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al buscar las habilidades"
            }));
        }
    }


    public async eliminarHabilidad(req: Request, res: Response): Promise<void> {
        try {
            const habilidadId = req.params.id_habilidad;

            // Verifica si es un UUID o ObjectId
            const resultado = await Habilidad.findByIdAndDelete(habilidadId);
            
            const id_usuario = resultado?.id_usuario;
            
            const habilidades = await Habilidad.find({ id_usuario });
            if (!habilidades || habilidades.length === 0) {
                await PerfilUsuario.findOneAndUpdate({ id_usuario }, { habilidades: false }, { new: true });
            }

            if (!resultado) {
                res.status(404).json({ message: 'Habilidad no encontrada' });
            }

            res.status(200).json({ message: 'Habilidad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar habilidad:', error);
            res.status(500).json({ message: 'Error al eliminar habilidad' });
        }
    };


    public async actualizarEducacion(req: Request, res: Response): Promise<void> {
        const { nivel, institucion, carrera } = req.body;
        const { id_usuario } = req.params;

        try {
            const educacionUsuario = await EducacionUsuario.findOneAndUpdate(
                { id_usuario },
                { nivel, institucion, carrera },
                { new: true, runValidators: true }
            );

            if (!educacionUsuario) {
                res.status(404).json(jsonResponse(404, {
                    Error: "No se encontró la educación para el usuario dado"
                }));
                return;
            }

            const perfil = await PerfilUsuario.findOneAndUpdate({ id_usuario }, { educacion: true }, { new: true });

            // Devuelve la experiencia actualizada
            res.json(jsonResponse(200, educacionUsuario));
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al actualizar educacion"
            }));
        }
    }

    public async buscarEduUsu(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const eduUsu = await EducacionUsuario.findOne({ id_usuario });

            if (!eduUsu) {
                res.status(404).json(jsonResponse(404, {
                    Error: "No se encontró educacionUsuario para el usuario dado"
                }));
                return;
            }

            // Devuelve la experiencia encontrada
            res.json({
                id: eduUsu._id,
                nivel: eduUsu.nivel,
                institucion: eduUsu.institucion,
                carrera: eduUsu.carrera

            });
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al buscar la experiencia"
            }));
        }
    }

    public async createIdioma(req: Request, res: Response): Promise<void> {
        console.log("Creado un idioma");
        const { idioma } = req.body;
        try {
            const nuevoIdioma = new Idioma({
                idioma
            })
            const IdiomaGuardado = await nuevoIdioma.save();

            res.json({
                nombre: IdiomaGuardado.idioma
            })
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear la red social"

            })
            )

        }
    }

    public async listIdiomas(req: Request, res: Response): Promise<void> {
        console.log("Listando idiomas");
        try {
            const idiomas = await Idioma.find();
            res.json(idiomas);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error al obtener los idiomas"
            }))
        }
    }

    public async createNivelIdioma(req: Request, res: Response): Promise<void> {
        console.log("Creando un enlace a una red social");
        const { nivel } = req.body;
        try {
            const nuevoNivelIdioma = new idiomaNivel({
                nivel
            });
            const NivelIdiomaGuardado = await nuevoNivelIdioma.save();
            res.json({
                nivel: NivelIdiomaGuardado.nivel,
            });
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el enlace"
            }));
        }
    }

    public async listNivelIdiomas(req: Request, res: Response): Promise<void> {
        console.log("Listando niveles de idioma");
        try {
            const niveles = await idiomaNivel.find();
            res.json(niveles);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error al obtener los niveles de idioma"
            }))
        }
    }

    public async agregarIdiomasNiveles(req: Request, res: Response): Promise<void> {
        const idiomasNiveles = req.body; // Array de idiomas con niveles a agregar
        const { id_usuario } = req.params; // ID del usuario
    
        console.log('IdiomasNiveles recibidos:', idiomasNiveles);
        console.log('ID de usuario recibido:', id_usuario);

        try {
            if (!Array.isArray(idiomasNiveles)) {
                res.status(400).json({ message: "El cuerpo de la solicitud debe ser un array de idiomas y niveles" });
                return;
            }
    
            // Validar que id_usuario sea un ObjectId válido
            if (!Types.ObjectId.isValid(id_usuario)) {
                res.status(400).json({ message: "El id_usuario no es un ObjectId válido" });
                return;
            }
    
            // Verificar que cada entrada tenga un idioma y nivel válido
            for (const item of idiomasNiveles) {
                if (!item.id_idioma || !item.id_nivel) {
                    res.status(400).json({ message: "Cada entrada debe tener un id_idioma y un id_nivel válidos" });
                    return;
                }
    
                // Validar que id_idioma y id_nivel sean ObjectId válidos
                if (!Types.ObjectId.isValid(item.id_idioma) || !Types.ObjectId.isValid(item.id_nivel)) {
                    res.status(400).json({ message: "Cada id_idioma y id_nivel deben ser ObjectIds válidos" });
                    return;
                }
            }
    
            // Filtrar las combinaciones de idioma y nivel que ya existen para el usuario
            const combinacionesExistentes = await UsuarioIdioma.find({
                id_usuario,
                id_idioma: { $in: idiomasNiveles.map((item) => item.id_idioma) }
            }).exec();
    
            const combinacionesExistentesIds = combinacionesExistentes.map(item => item.id_idioma.toString() + item.id_nivel.toString());
    
            // Filtrar las nuevas combinaciones que no están en la base de datos
            const nuevasCombinaciones = idiomasNiveles.filter(item => 
                !combinacionesExistentesIds.includes(item.id_idioma.toString() + item.id_nivel.toString())
            );
    
            if (nuevasCombinaciones.length > 0) {
                // Crear nuevas combinaciones
                const nuevasRelaciones = await UsuarioIdioma.insertMany(
                    nuevasCombinaciones.map(item => ({
                        id_usuario,
                        id_idioma: item.id_idioma,
                        id_nivel: item.id_nivel
                    }))
                );
    
                // Actualizar el campo "idioma" en el modelo de usuario
                await PerfilUsuario.findByIdAndUpdate(id_usuario, { idioma: true });
    
                res.status(201).json({ message: "Idiomas y niveles agregados exitosamente", datos: nuevasRelaciones });
            } else {
                res.status(200).json({ message: "No hay nuevos idiomas o niveles para agregar" });
            }
        } catch (error) {
            console.error('Error al agregar idiomas y niveles:', error);
            res.status(500).json({ message: "Error al agregar idiomas y niveles", error });
        }
    }

    public async eliminarUsuarioIdioma(req: Request, res: Response): Promise<void> {
        try {
            const usuarioIdiomaId = req.params._id;
            console.log("id a eliminar: ", usuarioIdiomaId);
            
    
            // Busca y elimina el idioma en la base de datos
            const resultado = await UsuarioIdioma.findByIdAndDelete(usuarioIdiomaId);
    
            if (!resultado) {
                res.status(404).json({ message: 'Idioma no encontrado' });
                return;
            }
    
            res.status(200).json({ message: 'Idioma eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar idioma:', error);
            res.status(500).json({ message: 'Error al eliminar idioma' });
        }
    };

    public async obtenerIdiomasDelUsuario(req: Request, res: Response): Promise<void>{
        const { id_usuario } = req.params;
    
        try {
            // Buscar todos los idiomas del usuario
            const idiomasDelUsuario = await UsuarioIdioma.find({ id_usuario }).exec();
    
            // Enviar los datos encontrados como respuesta
            res.status(200).json(idiomasDelUsuario);
        } catch (error) {
            console.error('Error al obtener idiomas del usuario:', error);
            res.status(500).json({ message: 'Error al obtener idiomas del usuario', error });
        }
    };



    
    public async agregarCertificacion(req: Request, res: Response): Promise<void> {
        const { nombre, enlace, descripcion } = req.body;
        const { id_usuario } = req.params;
    
        try {
            // Verificar si el enlace es una URL válida
            if (!validator.isURL(enlace, { protocols: ['http', 'https'], require_protocol: true })) {
                res.status(404).json(jsonResponse(404, {
                    Error: "Enlace no válido"
                }));
                return;
            }
    
            const certificado = new Certificado({
                id_usuario: id_usuario,
                nombre: nombre,
                descripcion: descripcion,
                enlace: enlace
            });
    
            const CertificadoGuardado = await certificado.save();
            await PerfilUsuario.findOneAndUpdate({ id_usuario }, { certificaciones: true }, { new: true });
    
            res.json({
                id: CertificadoGuardado._id,
                nombre: CertificadoGuardado.nombre,
                descripcion: CertificadoGuardado.descripcion,
                enlace: CertificadoGuardado.enlace
            });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el certificado" });
        }
    }

    public async eliminarCertificado(req: Request, res: Response): Promise<Response> {
        try {
            const certificadoId = req.params.id_certificado;
            // Buscar y eliminar el certificado por su ID
            const resultado = await Certificado.findByIdAndDelete(certificadoId);
    
            if (!resultado) {
                return res.status(404).json({ message: 'Certificado no encontrado' });
            }else{
                const id_usuario = resultado?.id_usuario
                const certificaciones = await Certificado.find({ id_usuario });
                if (!certificaciones || certificaciones.length === 0) {
                    await PerfilUsuario.findOneAndUpdate({ id_usuario }, { certificaciones: false }, { new: true });
                }
            }

            return res.status(200).json({ message: 'Certificado eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar certificado:', error);
            return res.status(500).json({ message: 'Error al eliminar certificado' });
        }
    }

    public async buscarCertificaciones(req: Request, res: Response): Promise<Response> {
        const { id_usuario } = req.params;
    
        try {
            const certificaciones = await Certificado.find({ id_usuario });
    
            const certificacionesFormateadas = certificaciones.map(certificado => ({
                _id: certificado._id.toString(),
                nombre: certificado.nombre,
                descripcion: certificado.descripcion,
                enlace: certificado.enlace,
            }));
            console.log(certificacionesFormateadas);
    
            return res.status(200).json(certificacionesFormateadas);
    
        } catch (error: any) {
            return res.status(500).json({
                Error: "Error al buscar las certificaciones"
            });
        }
    }

    public async actualizarCertificado(req: Request, res: Response): Promise<void> {
        const { nombre, descripcion, enlace, _id } = req.body;
    
        try {
            const certificado = await Certificado.findByIdAndUpdate(
                _id,
                { nombre, descripcion, enlace },
                { new: true, runValidators: true }
            );
    
            if (!certificado) {
                res.status(404).json({ Error: "No se encontró la certificación con el ID proporcionado" });
                return;
            }
    
            res.json({ mensaje: "Certificación actualizada correctamente", certificado });
        } catch (error: any) {
            res.status(500).json({ Error: "Error al actualizar la certificación" });
        }
    }
    

    public async buscarCertificacion(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const certificado = await Certificado.findOne({ id_usuario });

            if (!certificado) {
                return;
            }

            // Devuelve la experiencia encontrada
            res.json({
                id: certificado._id,
                nombre: certificado.nombre,
                descripcion: certificado.descripcion,
                enlace: certificado.enlace

            });
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al buscar la experiencia"
            }));
        }
    }
}
export const perfilUsuarioController = new PerfilUsuarioController();