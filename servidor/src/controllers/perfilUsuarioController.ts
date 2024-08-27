import { Request, Response } from 'express';
import Experiencia from '../models/experiencia.model';
import { jsonResponse } from '../lib/jsonResponse';
import PerfilUsuario from '../models/perfilUsuario.model';
import Habilidad from '../models/habilidades.model';
import EducacionUsuario from '../models/educacionUsuario.model';


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
                res.status(404).json(jsonResponse(404, {
                    Error: "No se encontró la experiencia para el usuario dado"
                }));
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
                res.status(400).json(jsonResponse(400, {
                    Error: "No hay habilidades para mostrar"
                }));
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
                res.status(404).json(jsonResponse(404, {
                    Error: "Una o más habilidades no se encontraron para el usuario dado"
                }));
                return;
            }

            res.json(jsonResponse(200, habilidadesActualizadas));
        } catch (error: any) {
            res.status(500).json(jsonResponse(500, {
                Error: "Error al actualizar las habilidades"
            }));
        }
    }

    public async buscarHabilidades(req: Request, res: Response): Promise<void> {
        const { id_usuario } = req.params;

        try {
            const habilidades = await Habilidad.find({ id_usuario });

            if (!habilidades || habilidades.length === 0) {
                res.status(404).json(jsonResponse(404, {
                    Error: "No se encontraron habilidades para el usuario dado"
                }));
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
    


    public async eliminarHabilidad(req: Request, res: Response): Promise<void> {
        try {
            const habilidadId = req.params.id_habilidad;

            // Verifica si es un UUID o ObjectId
            const resultado = await Habilidad.findByIdAndDelete(habilidadId);

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


}
export const perfilUsuarioController = new PerfilUsuarioController();