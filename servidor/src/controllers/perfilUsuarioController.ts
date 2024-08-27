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
        const habilidades = req.body; // Se espera que sea un array de habilidades
        const { id_usuario } = req.params;
    
        try {
            // Verifica que req.body sea un array
            if (!Array.isArray(habilidades)) {
                res.status(400).json(jsonResponse(400, {
                    Error: "El cuerpo de la solicitud debe ser un array de habilidades"
                }));
                return;
            }
    
            // Verifica que cada habilidad tenga una descripción
            for (const habilidad of habilidades) {
                if (!habilidad.descripcion || typeof habilidad.descripcion !== 'string') {
                    res.status(400).json(jsonResponse(400, {
                        Error: "Cada habilidad debe tener una descripción válida"
                    }));
                    return;
                }
            }
    
            // Añadir el id_usuario a cada habilidad
            const habilidadesConUsuario = habilidades.map(habilidad => ({
                ...habilidad,
                id_usuario
            }));
    
            await PerfilUsuario.findOneAndUpdate({ id_usuario }, { habilidades: true }, { new: true });

            console.log(habilidades);
            console.log(habilidadesConUsuario);
            // Crear las nuevas habilidades
            const nuevasHabilidades = await Habilidad.insertMany(habilidadesConUsuario);
    
            res.status(201).json(jsonResponse(201, nuevasHabilidades));
        } catch (error: any) {
            console.error('Error al crear habilidades:', error); // Para depuración
            res.status(500).json(jsonResponse(500, {
                Error: "Error al crear las habilidades"
            }));
        }
    }

    public async eliminarHabilidad(req: Request, res: Response): Promise<void> {
        const { id_habilidad } = req.params; // _id de la habilidad a eliminar
        const { id_usuario } = req.body; // id_usuario del usuario
    
        try {
            // Elimina la habilidad específica basada en _id
            const habilidadEliminada = await Habilidad.findOneAndDelete({
                _id: id_habilidad,
                id_usuario
            });
    
            if (!habilidadEliminada) {
                res.status(404).json(jsonResponse(404, {
                    Error: "Habilidad no encontrada para el usuario dado"
                }));
                return;
            }
    
            // Si se requiere, puedes realizar otras acciones aquí, como actualizar el campo de habilidades en el perfil
    
            res.status(200).json(jsonResponse(200, {
                Message: "Habilidad eliminada correctamente"
            }));
        } catch (error: any) {
            console.error('Error al eliminar la habilidad:', error.message); // Más detalles del error
            res.status(500).json(jsonResponse(500, {
                Error: "Error al eliminar la habilidad"
            }));
        }
    }
    
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
    
}
export const perfilUsuarioController = new PerfilUsuarioController();