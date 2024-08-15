import { Request, Response } from 'express';
import Experiencia from '../models/experiencia.model';
import { jsonResponse } from '../lib/jsonResponse';
import PerfilUsuario from '../models/perfilUsuario.model';

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
}
export const perfilUsuarioController = new PerfilUsuarioController();