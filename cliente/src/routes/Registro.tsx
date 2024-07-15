
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import React, { useState } from "react";
import { API_URL } from "../auth/apis";
import { AuthReponseRegister, AuthResponseError } from "../types/types";

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [verificar, setVerificar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [estado, setEstado] = useState("");
    const [errorCampos, setErrorCampos] = useState("");
    const [errorContrasenas, setErrorContrasenas] = useState("");
    const [errorCorreo, setErrorCorreo] = useState("");
    const [errorNombre, setErrorNombre] = useState("");
    const [sucessMessage,setSuccessMessage] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const response = await fetch(`${API_URL}/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    contrasena,
                    verificar,
                    direccion,
                    ciudad,
                    estado
                })
            });


            if (response.ok) {
                const json = await response.json() as AuthReponseRegister;
                console.log(json);
                setSuccessMessage("Usuario creado exitosamente");
                setErrorCampos("");
                setErrorContrasenas("");
                setErrorCorreo("");
                setErrorNombre("");
                setTimeout(() => {
                    goTo("/");
                }, 2000);
            } else {
                const json = await response.json() as AuthResponseError;
                setErrorCampos(json.body.camposError || "");
                setErrorCorreo(json.body.correoError || "");
                setErrorNombre(json.body.nombreError || "");
                setErrorContrasenas(json.body.contrasenasError || "");
                setSuccessMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }


    if (auth.isAuthenticated) {
        return <Navigate to="/Empresa" />;
    }


    return (
        <form className="form" onSubmit={handleSubmit}>
            <h1>Registro</h1>
            {!!errorCampos && <div className="errorMessage">{errorCampos}</div>}
            {!!sucessMessage && <div className="successMessage">{sucessMessage}</div>}
            <br/>
            <label> Nombre </label>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                name="nombre"
                id="nombre"
                className={errorNombre ? 'error' : ''}
            />
            {!!errorNombre && <div className="errorMessage2">{errorNombre}</div>}


            <label> Correo </label>
            <input
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={errorCorreo ? 'error' : ''}
            />
            {!!errorCorreo && <div className="errorMessage2">{errorCorreo}</div>}


            <label> Contraseña </label>
            <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className={errorContrasenas ? 'error' : ''}
            />


            <label> Verificar Contraseña </label>
            <input
                type="password"
                value={verificar}
                onChange={(e) => setVerificar(e.target.value)}
                className={errorContrasenas ? 'error' : ''}
            />
            {!!errorContrasenas && <div className="errorMessage2">{errorContrasenas}</div>}


            <label> Dirección </label>
            <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
            />


            <label> Ciudad </label>
            <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
            />


            <label> Estado </label>
            <input
                type="text"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
            />


            <button type="submit">Registrarse</button>
        </form>
    );
}
