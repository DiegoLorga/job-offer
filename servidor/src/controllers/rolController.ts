import { Request, Response } from 'express';
import Rol from '../models/rol.model'
import { jsonResponse } from '../lib/jsonResponse';


class RolesController {

    constructor() {
    }
    public async createRol(req: Request, res: Response): Promise<void>{
        console.log("Creado un  rol");
        const {tipo}=req.body;
        try{
            const nuevoRol = new Rol({
                tipo
            }) 
            const RolGuardado = await nuevoRol.save();
            res.json({
                tipo: RolGuardado.tipo
            })
        }catch{
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el rol"

            })
        )

        }   
    }

    public async list(req: Request, res: Response): Promise<void> {
        console.log("Mostrando un rol");
        const role = await Rol.find
        res.json(role)
    }
}
export const rolesController = new RolesController();