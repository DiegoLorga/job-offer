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
    _id: string;
    nombre: string;
    correo:string;
    direccion: string;
    ciudad: string;
    estado: string;
    giro: string;
    foto: boolean;
}

export interface PerfilEmpresa {
    _id:string;
    id_empresa: string;
    descripcion: string;
    mision:string;
    empleos:string
    paginaoficial: string;
    redesSociales: string
}

export interface Oferta1{
    _id: string;
    titulo: string;
    puesto: string;
    direccion: string;
    sueldo: number;
}

export interface OfertaCompleta{
    id_empresa: string;
    titulo:string;
    puesto: string;
    sueldo: number;
    horario: string;
    modalidad:string;
    direccion:string;
    ciudad: string;
    estado:string;
    status:number;
    descripcion: string;
    requisitos:string;
    telefono:number;
    correo: string;
    educacion:string;
    idioma:string;
    experienciaLaboral:string;
    categoria: string
}
export interface Estado {
    _id: string;
    nombre: string;
    clave: string;
}
export interface Ciudad {
    _id: string;
    nombre: string;
    clave: string;
}
export interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
    direccion: string;
    estado: string;
    ciudad: string;
}
export interface perfilUsuario {
    _id: string;
    cv: false,
    experiencia: false,
    habilidades: boolean,
    educacion: false,
    idiomas: false,
    certificaciones: false,
    status: false,
    foto: false
}

export interface Experiencia {
    _id: string;
    empresa: string,
    puesto: string,
    descripcion: string
}

export interface Educacion {
    _id: string;
    nivel: string;
}

export interface Habilidad {
    
    _id: string;
    descripcion: string;
    id_usuario: string;
}

