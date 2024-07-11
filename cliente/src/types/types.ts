
export interface AuthResponse{
    body:{
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface AuthResponseError{
    body:{
        error: string;
    };
}

export interface User{
    body:{
        _id: string;
        nombre: string;
        correo: string;
        direccion: string;
        ciudad: string;
        estado: string;
    }
}
export interface AuthReponseRegister{
    body:{
        message:string;
    }
}