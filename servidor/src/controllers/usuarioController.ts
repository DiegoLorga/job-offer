import { Request, Response } from 'express';
import Usuario from '../models/usuario.model';
import Rol from '../models/rol.model';
import bcrypt from 'bcryptjs';
import { jsonResponse } from '../lib/jsonResponse';
import { User, generaAccessToken, generaRefreshToken } from '../auth/generarTokens';
import Token from '../models/tokens.model';
class UsuarioController {
    constructor() { }

    public async createUsuario(req: Request, res: Response): Promise<void> {
        console.log("Creando usuario");
        const { nombre, correo, contrasena, direccion, ciudad, estado, id_rol } = req.body;
        const tipoRol = await Rol.findById(id_rol);

        try {

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            const nuevoUsuario = new Usuario({
                nombre,
                correo,
                contrasena: hashedPassword,
                direccion,
                ciudad,
                estado,
                id_rol: tipoRol
            });

            const UsuarioGuardado = await nuevoUsuario.save();
            res.json({
                nombre: UsuarioGuardado.nombre,
                correo: UsuarioGuardado.correo,
                contrasena: UsuarioGuardado.contrasena,
                direccion: UsuarioGuardado.direccion,
                ciudad: UsuarioGuardado.ciudad,
                estado: UsuarioGuardado.estado
            });
        } catch (error) {
            res.status(400).json(jsonResponse(400, {
                error: "No se pudo crear el usuario"
            }));
        }
    }
}
export function createAccessToken(user: User): string {
    return generaAccessToken(user);
}
async function createRefreshToken(user: User): Promise<string | undefined > {
    const refreshToken = generaRefreshToken(user);

    try{
        await new Token({token: refreshToken}).save()
        return refreshToken;
    }catch(error){
        console.log(error);
        
    }
}


export const usuariosController = new UsuarioController();
