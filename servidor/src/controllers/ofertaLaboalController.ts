import { json, Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import OfertaLaboral from '../models/OfertaLaboral.model';


class ofertaLaboralController {

    constructor() {
    }
    public async createOfertaLaboral(req: Request, res: Response): Promise<void> {
        console.log("Creado una red social");
        const { id_empresa, titulo, puesto, sueldo, horario, modalidad, direccion, ciudad, estado, status,
            descripcion, requisitos, telefono, correo, educacion, idioma } = req.body;
        const inicio = 0;
            try {
            const nuevaOfertaLaboral = new OfertaLaboral({
                id_empresa,
                titulo,
                puesto,
                sueldo,
                horario,
                modalidad,
                direccion,
                ciudad,
                estado,
                status: inicio,
                descripcion,
                requisitos,
                telefono,
                correo,
                educacion,
                idioma
            })
            const OfertaLaboralGuardado = await nuevaOfertaLaboral.save();

            res.json({
                id_Oferta: OfertaLaboralGuardado._id,
                id_empresa: OfertaLaboralGuardado.id_empresa,
                titulo: OfertaLaboralGuardado.titulo,
                puesto: OfertaLaboralGuardado.puesto,
                sueldo: OfertaLaboralGuardado.sueldo,
                horario: OfertaLaboralGuardado.horario,
                modalidad: OfertaLaboralGuardado.modalidad,
                direccion: OfertaLaboralGuardado.direccion,
                ciudad: OfertaLaboralGuardado.ciudad,
                estado: OfertaLaboralGuardado.estado,
                status: OfertaLaboralGuardado.status,
                descripcion: OfertaLaboralGuardado.descripcion,
                requisitos: OfertaLaboralGuardado.requisitos,
                telefono: OfertaLaboralGuardado.telefono,
                correo: OfertaLaboralGuardado.correo,
                educacion: OfertaLaboralGuardado.educacion,
                idioma: OfertaLaboralGuardado.id_empresa,
            })
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear la oferta laboral"

            })
            )

        }
    }


    public async listOfertas(req: Request, res: Response): Promise<void> {
        console.log("Listando las redes");
        try {
            const oferta = await OfertaLaboral.find();
            res.json(oferta);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error al obtener las ofertas"
            }))
        }
    }


    public async listOne(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando una oferta");
            const OneOferta = await OfertaLaboral.findById(req.params.id)
            res.json(OneOferta);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error"
            }));
        }
    }

    public async eliminarOferta(req: Request, res: Response): Promise<void> {
        console.log("Borrando una empresa");
    
        try {
            const idOferta = req.params.id;
            
            const oferta = await OfertaLaboral.findByIdAndDelete(idOferta);
    
            if (!oferta) {
                console.log("Perfil no encontrado o ya eliminado");
            }
    
    
        } catch (error) {
            console.error(error);  // Log the specific error for debugging
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo eliminar la oferta"
            }));
        }
    }
    
    public async actualizarOfertaLaboral(req: Request, res: Response): Promise<void> {
        try {
            console.log("Actualizando una oferta");
            const oferta = await OfertaLaboral.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json(oferta)
        } catch (error) {
            res.status(500).json(jsonResponse(400, {
                error: "No se pudo actualizar la información de la oferta"
            }));
        }
    }


}
export const OfertaLaboralController = new ofertaLaboralController();