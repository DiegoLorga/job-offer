import { json, Request, Response } from 'express';
import { jsonResponse } from '../lib/jsonResponse';
import Administrador from '../models/administrador.model';
import Rol from '../models/rol.model';
import bcrypt from 'bcryptjs';


class adminController {

    constructor() {
    }
    public async createAdministrador(req: Request, res: Response): Promise<void> {
        console.log("Creado un administrador");
        const { nombre, correo, contrasena, id_rol } = req.body;
        try {

            const rol = await Rol.findOne({ tipo: "Administrador" }); // Cambia "TipoDeseado" por el tipo que buscas

            if (!rol) {
                res.status(400).json(jsonResponse(400, {
                    error: "Rol no encontrado"
                }));
                return;
            }

            const tipoRol = rol._id; // Obtener el ID del rol encontrado

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const nuevoAdministrador = new Administrador({
                nombre,
                correo,
                contrasena: hashedPassword,
                id_rol: tipoRol
            })
            const AdministradorGuardado = await nuevoAdministrador.save();

            res.json({
                nombre: AdministradorGuardado.nombre,
                correo: AdministradorGuardado.correo,
                id_rol: AdministradorGuardado.id_rol
            })
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el administrador"

            })
            )

        }
    }


    public async listAdmins(req: Request, res: Response): Promise<void> {
        console.log("Listando admins");
        try {
            const admin = await Administrador.find();
            res.json(admin);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error al obtener los administradores"
            }))
        }
    }


    public async listOne(req: Request, res: Response): Promise<void> {
        try {
            console.log("Mostrando un administrador");
            const OneAdmin = await Administrador.findById(req.params.id_admin)
            res.json(OneAdmin);
        } catch (error) {
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error"
            }));
        }
    }

    public async eliminarAdmin(req: Request, res: Response): Promise<void> {
        console.log("Borrando un administrador");
    
        try {
            const idAdmin = req.params.id_admin;
    
            const admin = await Administrador.findByIdAndDelete(idAdmin);
    
            if (!admin) {
                console.log("Administrador no encontrado");
                res.status(404).json(jsonResponse(404, {
                    error: "Administrador no encontrado"
                }));
                return;
            }
    
            console.log("Administrador eliminado correctamente");
            res.status(200).json(jsonResponse(200, {
                message: "Administrador eliminado correctamente"
            }));
    
        } catch (error) {
            console.error(error);  // Log the specific error for debugging
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo eliminar al administrador"
            }));
        }
    }
    

    public async actualizarAdministrador(req: Request, res: Response): Promise<void> {
        try {
            console.log("Actualizando un administrador");
            const admin = await Administrador.findByIdAndUpdate(req.params.id_admin, req.body, { new: true })
            res.json(admin)
        } catch (error) {
            res.status(500).json(jsonResponse(400, {
                error: "No se pudo actualizar la información del administrador"
            }));
        }
    }

}
export const AdminController = new adminController();