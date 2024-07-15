import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();  // Cargar variables de entorno del archivo .env


export interface User {
    nombre: string
    correo: string,
    ciudad: string,
    estado: string,
}

// Función para firmar el token
export function sign(payload: any, isAccessToken: boolean): string {

    const secret = isAccessToken ? process.env.ACCES_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;

    if (!secret) {
        throw new Error('El token no esta definido en el archivo .env');
    }

    return jwt.sign(payload, secret,
        {
            algorithm: "HS256",
            expiresIn: 3600
        }
    );
}

// Función para generar el access token
export function generaAccessToken(user: User): string {
    return sign(user, true);
}

// Función para generar el refresh token
export function generaRefreshToken(user: User): string {
    return sign(user, false);
}


