export interface AuthResponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}


export interface AuthResponseError {
    body: {
        error: string;
        camposError?: string;
        contrasenasError?: string;
        correoError?: string;
        nombreError?: string;
    };
}


export interface User {
    body: {
        _id: string;
        nombre: string;
        correo: string;
        direccion: string;
        ciudad: string;
        estado: string;
        id_rol: string;
    }
}
export interface AuthReponseRegister {
    body: {
        message: string;
        usuario: {
            _id: string;
            nombre: string;
            correo: string;
            direccion: string;
            ciudad: string;
            estado: string;
            id_rol: string;
        };
    }
    token: string; // Aquí se define la propiedad token
}
export interface ProfileResponse {
    body: {
        user: User;
    };
}

export interface ProfileError {
    body: {
        error: string;
    };
}

// src/types.ts

export interface Empresa {
    id: string;
    nombre: string;
    //correo:string;
    direccion: string;
    //ciudad: string;
    //estado: string;
    giro: string;
    foto: string;
  }
  