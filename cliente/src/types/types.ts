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
    }
}
export interface AuthReponseRegister {
    body: {
        message: string;
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

