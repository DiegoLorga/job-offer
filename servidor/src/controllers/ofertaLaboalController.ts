import { json, Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import OfertaLaboral from '../models/OfertaLaboral.model';
import Categoria from '../models/categoria.model';

class ofertaLaboralController {

    constructor() {
    }
    public async createOfertaLaboral(req: Request, res: Response): Promise<void> {
        console.log("Creado una red social");
        const { id_empresa, titulo, puesto, sueldo, horario, modalidad, direccion, ciudad, estado, status,
            descripcion, requisitos, telefono, correo, educacion, idioma, experienciaLaboral, categoria } = req.body;
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
                idioma,
                experienciaLaboral,
                categoria
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
                experienciaLaboral: OfertaLaboralGuardado.experienciaLaboral,
                categoria: OfertaLaboralGuardado.categoria
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

    public async createCategoria(req: Request, res: Response): Promise<void>{
        console.log("Creado un  rol");
        const {nombre}=req.body;
        try{
            const nuevaCategoria= new Categoria({
                nombre
            }) 
            const CategoriaGuardado = await nuevaCategoria.save();
            res.json({
                tipo: CategoriaGuardado.nombre
            })
        }catch{
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear la categoria"

            })
        )

        }   
    }

    public async list(req: Request, res: Response): Promise<void> {
        console.log("Mostrando categorias");
        const categoria = await Categoria.find();
        res.json(categoria)
    }

    public async buscarOfertas(req: Request, res: Response): Promise<void> {
        try {
            // Extracción de parámetros de búsqueda desde la consulta de la URL
            const { estado, ciudad, sueldo, modalidad, educacion, fechacreacion } = req.body;
            
            // Construcción dinámica del filtro de búsqueda
            const filtros: any = {};

            if (estado) filtros.estado = estado;
            if (ciudad) filtros.ciudad = ciudad;
            if (sueldo) filtros.sueldo = { $gte: Number(sueldo) }; // Sueldo mayor o igual
            if (modalidad) filtros.modalidad = modalidad;
            if (educacion) filtros.educacion = educacion;
            if (fechacreacion) filtros.createdAt = { $gte: new Date(fechacreacion as string) }; // Ofertas creadas después de la fecha

            // Consulta a la base de datos usando los filtros
            const ofertas = await OfertaLaboral.find(filtros);

            res.json(ofertas);
        } catch (error) {
            console.error("Error al buscar ofertas:", error);
            res.status(500).json({
                error: "Hubo un error al buscar las ofertas laborales"
            });
        }
    }

}
export const OfertaLaboralController = new ofertaLaboralController();