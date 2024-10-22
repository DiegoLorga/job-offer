import { Request, Response } from 'express';
import Empresa from '../models/empresa.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt';
import Rol from '../models/rol.model';
import mongoose from 'mongoose';
import PerfilEmpresa from '../models/perfilEmpresa.model';
import OfertaLaboral from '../models/OfertaLaboral.model';
import fotosEmpresa from '../models/fotosEmpresa.model';
import FotosPerfilEmpresa from '../models/fotosPerfilEmpresa.model';
import Giro from '../models/giro.model';
import Notificacion from '../models/notificacionEmpresa.model';
import { isEmpty } from 'validator';
import Usuario from '../models/usuario.model';

class EmpresaController {

    constructor() {
    }
    public async createEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, correo, contrasena, direccion, ciudad, estado, giro,foto, descripcion, mision, empleos, paginaoficial, redesSociales,fotoEmp } = req.body;
        try {

            const rol = await Rol.findOne({ tipo: "Empresa" }); // Cambia "TipoDeseado" por el tipo que buscas

            if (!rol) {
                res.status(400).json(jsonResponse(400, {
                    error: "Rol no encontrado"
                }));
                return;
            }

            const tipoRol = rol._id; // Obtener el ID del rol encontrado

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const nuevaEmpresa = new Empresa({
                nombre,
                correo,
                contrasena: hashedPassword,
                direccion,
                ciudad,
                estado,
                giro,
                id_rol: tipoRol,
                foto: false
            });
            const EmpresaGuardado = await nuevaEmpresa.save();

            const nuevaFotoEmpresa= new fotosEmpresa({
                id_empresa : EmpresaGuardado._id
            });
            await nuevaFotoEmpresa.save();

            console.log("Empresaaaaa")

            const nuevoPerfilEmpresa = new PerfilEmpresa({
                id_empresa: EmpresaGuardado._id,
                descripcion,
                mision,
                empleos,
                paginaoficial,
                redesSociales,
                fotoEmp:false
            });

            const PerfilGuardado = await nuevoPerfilEmpresa.save();

            const token = await createAccesToken({ id: EmpresaGuardado._id });
            res.cookie('token', token)

            console.log(res.cookie);

            const nuevaFotoPerfil = new FotosPerfilEmpresa({
                id_fotoEm : PerfilGuardado._id
            });
            await nuevaFotoPerfil.save();

            res.cookie('token', token)

            console.log(res.cookie);

            res.json({
                idRol: EmpresaGuardado.id_rol,
                nombre: EmpresaGuardado.nombre,
                correo: EmpresaGuardado.correo,
                direccion: EmpresaGuardado.direccion,
                ciudad: EmpresaGuardado.ciudad,
                estado: EmpresaGuardado.estado,
                giro: EmpresaGuardado.giro,
                foto: EmpresaGuardado.foto,
                descripcion: PerfilGuardado.descripcion,
                mision: PerfilGuardado.mision,
                empleos: PerfilGuardado.empleos,
                paginaoficial: PerfilGuardado.paginaoficial,
                redesSociales: PerfilGuardado.redesSociales,
                FotoEmp: PerfilGuardado.fotoEmp

            });
        } catch (error) {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el empresa"
            }));
        }
    }

    public async list(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando todas las empresas");
            const empresa = await Empresa.find();
            res.json(empresa)
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un problema"
            }));

        }
    }

    public async getGiro(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando todos los giros");
            const giro = await Giro.find();
            res.json(giro)
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un problema"
            }));

        }
    }

    // Controllers/empresaController.ts
public async listOne(req: Request, res: Response): Promise<void> {
    try {
        console.log("Mostrando una empresa");
        const empresa = await Empresa.findById(req.params.id);
        if (!empresa) {
            res.status(404).json(jsonResponse(404, { error: "Empresa no encontrada" }));
            return;
        }

        // Obtener el perfil de la empresa
        const perfil = await PerfilEmpresa.findOne({ id_empresa: empresa._id });

        res.json({
            empresa,
            perfil
        });
        console.log("Empresa: ",empresa);
        console.log("Perfil: ",perfil);
        
        
    } catch (error) {
        res.status(500).json(jsonResponse(500, { error: "Hubo un error" }));
    }
}


    public async borrarEmpresa(req: Request, res: Response): Promise<void> {
        console.log("Borrando una empresa");
    
        try {
            const idEmpresa = req.params.id;
    
            // Buscar y eliminar el perfil de la empresa usando el ID de la empresa
            const perfil = await PerfilEmpresa.findOneAndDelete({ id_empresa: idEmpresa });
    
            if (!perfil) {
                console.log("Perfil no encontrado o ya eliminado");
            }

            const oferta = await OfertaLaboral.findOneAndDelete({ id_empresa: idEmpresa });
    
            if (!oferta) {
                console.log("Oferta no encontrada o ya eliminada");
            }
    
            // Eliminar la empresa
            const empresa = await Empresa.findByIdAndDelete(idEmpresa);
    
            if (!empresa) {
                res.status(404).json(jsonResponse(404, {
                    error: "Empresa no encontrada"
                }));
                return;
            }
    
            res.json({
                message: "Empresa y documentos relacionados eliminados correctamente",
                empresa
            });
        } catch (error) {
            console.error(error);  // Log the specific error for debugging
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo eliminar la empresa"
            }));
        }
    }
    
    public async actualizarEmpresa(req: Request, res: Response): Promise<void> {
        try {
            console.log("Actualizando un empresa");
            const empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json(empresa)
        } catch (error) {
            res.status(500).json(jsonResponse(400, {
                error: "No se pudo actualizar la información de la empresa"
            }));
        }
    }

    public async actualizarPerfilEmpresa(req: Request, res: Response): Promise<void> {
        try {
            console.log("Actualizando un empresa");
            const perfil = await PerfilEmpresa.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json(perfil)
        } catch (error) {
            res.status(500).json(jsonResponse(400, {
                error: "No se pudo actualizar la información del perfil"
            }));
        }
    }

    public async  obtenerPerfilEmpresa (req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const perfil = await PerfilEmpresa.findOne({ id_empresa: id });
            if (perfil) {
                res.json(perfil);
            } else {
                res.status(404).json({ message: 'Perfil de empresa no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el perfil de la empresa', error });
        }
    };

    public async buscarEmpresas(req: Request, res: Response): Promise<void> {
        try {
            console.log("Filtrando las empresas");
            
            // Extracción de parámetros de búsqueda desde la consulta de la URL
            const { ciudad, estado, giro } = req.body;
            
            // Construcción dinámica del filtro de búsqueda
            const filtros: any = {};
    
            if (estado) filtros.estado = estado;
            if (ciudad) filtros.ciudad = ciudad;
            if (giro) filtros.giro = giro;
    
            // Consulta a la base de datos usando los filtros
            const empresas = await Empresa.find(filtros);
    
            // Verificar si se encontraron empresas
            if (empresas.length === 0) {
                console.log("No hay coincidencias");
                
                res.status(404).json({
                    message: "No se encontraron coincidencias"
                });
                return;
            }
    
            res.json(empresas);
    
        } catch (error) {
            console.error("Error al buscar empresas:", error);
            res.status(500).json({
                error: "Hubo un error al buscar las empresas"
            });
        }
    }

    public async filtrarPostulaciones(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando las postulaciones por empresa");
            const empresa = await Empresa.findById(req.params.id);
            if (!empresa) {
                res.status(404).json(jsonResponse(404, { error: "Empresa no encontrada" }));
                return;
            }
    
            // Obtener las notificaciones para la empresa
            const notificaciones = await Notificacion.find({ recipientId: empresa._id });
    
            // Si no hay notificaciones
            if (!notificaciones.length) {
                res.status(404).json({ message: 'No se encontraron notificaciones para esta empresa' });
                return;
            }
    
            // Transformar las notificaciones para mostrar nombres en lugar de IDs
            const notificacionesConNombres = await Promise.all(notificaciones.map(async (noti) => {
                let senderNombre = '';
                let recipientNombre = '';
    
                // Obtener el nombre del remitente (senderId) que puede ser un usuario
                const sender = await Usuario.findById(noti.senderId);
                if (sender) {
                    senderNombre = sender.nombre;
                    console.log(senderNombre);
                    
                } else {
                    const senderEmpresa = await Empresa.findById(noti.senderId);
                    if (senderEmpresa) {
                        senderNombre = senderEmpresa.nombre;
                    } else {
                        senderNombre = 'Remitente no encontrado';
                    }
                }
    
                // Obtener el nombre del destinatario (recipientId) que es la empresa
                const recipientEmpresa = await Empresa.findById(noti.recipientId);
                if (recipientEmpresa) {
                    recipientNombre = recipientEmpresa.nombre;
                } else {
                    recipientNombre = 'Destinatario no encontrado';
                }
    
                // Retornar los datos con nombres en lugar de IDs
                return {
                    ...noti.toObject(),
                    senderNombre,
                    recipientNombre
                };
            }));
    
            res.json(notificacionesConNombres);
    
            console.log("Empresa: ", empresa);
            console.log("Notificaciones: ", notificacionesConNombres);
        } catch (error) {
            res.status(500).json(jsonResponse(500, { error: "Hubo un error" }));
        }
    }
    
    public async obtenerNotificaciones (req: Request, res: Response) : Promise<void> {
        try {
            console.log("Mostrando las postulaciones por empresa");
            const empresa = await Empresa.findById(req.params.id);
            if (!empresa) {
                res.status(404).json(jsonResponse(404, { error: "Empresa no encontrada" }));
                return;
            }
    
            // Obtener las notificaciones para la empresa
            const notificaciones = await Notificacion.find({ recipientId: empresa._id });
    
            res.status(200).json({ notificaciones });
        } catch (error) {
            res.status(500).json(jsonResponse(500, { error: "Hubo un error" }));
        }
    };
    

}
export const empresaController = new EmpresaController();