import { Request, Response } from 'express';
import Empresa from '../models/empresa.model';
import { jsonResponse } from '../lib/jsonResponse';
import bcrypt from 'bcryptjs';
import { createAccesToken } from '../libs/jwt';
import Rol from '../models/rol.model';

class EmpresaController {

    constructor() {
    }
    public async createEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, correo, contrasena, direccion, ciudad, estado, giro } = req.body;

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
                id_rol: tipoRol
            });

            const EmpresaGuardado = await nuevaEmpresa.save();

            const token = await createAccesToken({ id: EmpresaGuardado._id });

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
            });
        } catch (error) {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el empresa"
            }));
        }
    }

    public async list(req: Request, res: Response): Promise<void> {
        console.log("Mostrando todas las empresas");
        const empresa = await Empresa.find
        res.json(empresa)
    }

    public async listOne(req: Request, res: Response): Promise<void> {
        console.log("Mostrando un empresa");
        const OneEmpresa = await Empresa.findById(req.params.id)
        res.json(OneEmpresa);
    }

    public async borrarEmpresa(req: Request, res: Response): Promise<void> {
        console.log("Borrando una empresa");

        try {
            const idEmpresa = req.params.id;

            // Eliminar documentos relacionados primero
            //await Proyecto.deleteMany({ id_empresa: idEmpresa });

            // Luego eliminar la empresa
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
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo eliminar la empresa"
            }));
        }
    }


    public async actualizarEmpresa(req: Request, res: Response): Promise<void> {
        console.log("Actualizando un empresa");
        const empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(empresa)
    }
}
export const empresaController = new EmpresaController();