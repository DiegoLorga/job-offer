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
    const [errorResponse, setErrorResponse] = useState("");
    const [successMessage, setSuccessMessage] = useState("");  // Nuevo estado para el mensaje de éxito



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
                console.log("El usuario fue creado correctamnete");
                const json = await response.json() as AuthReponseRegister;
                console.log(json);
                setSuccessMessage(json.body.message)
                setErrorResponse("");
                //goTo("/");
            } else {
                console.log("Algo va mal");
                const json = await response.json() as  AuthResponseError;
                setErrorResponse(json.body.error)
                setSuccessMessage("");  // Limpiar mensaje de éxito si hay un error
            }
        } catch (error) {
            console.log(error);

        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/Empresa" />
    }

    return (
            <form className="form" onSubmit={handleSubmit}>
                <h1>Registro</h1>
                {!!errorResponse  && <div className = "errorMessage">{errorResponse}</div>}
                {!!successMessage  && <div className = "successMessage">{successMessage}</div>}
                <label> Nombre </label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

                <label> Correo </label>
                <input
                    type="text"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />

                <label> Contraseña </label>
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                />

                <label> Verificar Contraseña </label>
                <input
                    type="password"
                    value={verificar}
                    onChange={(e) => setVerificar(e.target.value)}
                />

                <label> Direccion </label>
                <input type="text"
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

                <button type="submit" >Registarse</button>
            </form>

    );
}