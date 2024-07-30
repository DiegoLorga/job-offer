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

    public async listOne(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando una empresa");
            const OneEmpresa = await Empresa.findById(req.params.id)
            res.json(OneEmpresa);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error"
            }));
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

}
export const empresaController = new EmpresaController();