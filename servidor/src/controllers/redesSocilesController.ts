import { json, Request, Response } from 'express';
import NombreRedes from '../models/NombreRedes.model'
import EnlaceRedes from '../models/EnlaceRedes.model';
import { jsonResponse } from '../lib/jsonResponse';


class RedesSocilesController {

    constructor() {
    }
    public async createRedSocial(req: Request, res: Response): Promise<void>{
        console.log("Creado una red social");
        const {nombre}=req.body;
        try{
            const neuvared = new NombreRedes({
                nombre
            }) 
            const RedGuardado = await neuvared.save();

            res.json({
                nombre: RedGuardado.nombre
            })
        }catch{
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear la red social"

            })
        )

        }   
    }
    public async createEnlaceRed(req: Request, res: Response): Promise<void> {
        console.log("Creando un enlace a una red social");
        const { id_empresa, link, id_redes } = req.body;
        try {
            const nuevoEnlace = new EnlaceRedes({
                id_empresa,
                link,
                id_redes
            });
            const enlaceGuardado = await nuevoEnlace.save();
            res.json({
                id_empresa: enlaceGuardado.id_empresa,
                link: enlaceGuardado.link,
                id_redes: enlaceGuardado.id_redes
            });
        } catch {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el enlace"
            }));
        }
    }
    

    public async listRedesSociales(req:Request, res:Response): Promise<void>{
        console.log("Listando las redes");
        try{
        const redes = await NombreRedes.find();
        res.json(redes);
        }catch(error){
            res.status(500).json(jsonResponse(500,{
                error:"Hubo un error al obtener las redes sociales"
            }))
        }
    }

    
    public async listOne(req: Request, res: Response): Promise<void> {
        try {
        console.log("Mostrando una red");
        const OneRedSocial = await NombreRedes.findById(req.params.id)
        res.json(OneRedSocial);
        }catch(error){
            res.status(500).json(jsonResponse(500, {
                error: "Hubo un error"
            }));
        }
    }


}
export const redesSocialesController = new RedesSocilesController();