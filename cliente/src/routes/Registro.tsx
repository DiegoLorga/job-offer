import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/apis";
import { AuthReponseRegister, AuthResponseError } from "../types/types";
import Swal from 'sweetalert2';

interface Estado {
    _id: string;
    nombre: string;
    clave: string;
}

interface Ciudad {
    _id: string;
    nombre: string;
    clave: string;
}

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [verificar, setVerificar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [errorCampos, setErrorCampos] = useState("");
    const [errorContrasenas, setErrorContrasenas] = useState("");
    const [errorCorreo, setErrorCorreo] = useState("");
    const [errorNombre, setErrorNombre] = useState("");
    const [sucessMessage, setSuccessMessage] = useState("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [selectedEstado, setSelectedEstado] = useState<string>("");
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const auth = useAuth();
    const goTo = useNavigate();

    // Obtener la lista de estados al cargar el componente
    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/usuario/getEstados`);
                if (response.ok) {
                    const data = await response.json() as Estado[];
                    setEstados(data);
                    if (data.length > 0) {
                        setSelectedEstado(data[0].clave);
                    }
                } else {
                    console.error('Error al obtener los estados:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        }

        fetchEstados();
    }, []);

    // Cargar ciudades al cambiar el estado seleccionado
    useEffect(() => {
        async function fetchCiudades() {
            try {
                const response = await fetch(`${API_URL}/usuario/getCiudades/${selectedEstado}`);
                if (response.ok) {
                    const data = await response.json() as Ciudad[];
                    setCiudades(data);
                    if (data.length > 0) {
                        setCiudad(data[0].nombre);
                    }
                } else {
                    console.error('Error al obtener las ciudades:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        }

        if (selectedEstado) {
            fetchCiudades();
        }
    }, [selectedEstado]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/usuario`, {
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
                    estado: selectedEstado
                })
            });

            if (response.ok) {
                const json = await response.json() as AuthReponseRegister;
                Swal.fire({
                    title: "Éxito",
                    text: "Usuario creado exitosamente",
                    icon: "success"
                });
                setErrorCampos("");
                setErrorContrasenas("");
                setErrorCorreo("");
                setErrorNombre("");
                setTimeout(() => {
                    goTo("/");
                }, 2000);
            } else {
                const json = await response.json() as AuthResponseError;
                if (json.body.camposError) {
                    Swal.fire({
                        title: "Error",
                        text: json.body.camposError,
                        icon: "error"
                    });
                }
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
        <div className="container">
            <div className="form">
                <form className="col s12" onSubmit={handleSubmit}>
                    <h1>Registro</h1>

                    <div className="row">
                        <div className={`input-field col s12 ${errorNombre ? 'error' : ''}`}>
                            <input
                                id="nombre"
                                type="text"
                                className={`validate ${errorNombre ? 'error' : ''}`}
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                            <label htmlFor="nombre">Nombre</label>
                            {!!errorNombre && <span className="helper-text red-text">{errorNombre}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className={`input-field col s12 ${errorCorreo ? 'error' : ''}`}>
                            <input
                                id="correo"
                                type="email"
                                className={`validate ${errorCorreo ? 'error' : ''}`}
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                            <label htmlFor="correo">Correo</label>
                            {!!errorCorreo && <span className="helper-text red-text">{errorCorreo}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className={`input-field col s12 ${errorContrasenas ? 'error' : ''}`}>
                            <input
                                id="contrasena"
                                type="password"
                                className={`validate ${errorContrasenas ? 'error' : ''}`}
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                            />
                            <label htmlFor="contrasena">Contraseña</label>
                            {!!errorContrasenas && <span className="helper-text red-text">{errorContrasenas}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className={`input-field col s12 ${errorContrasenas ? 'error' : ''}`}>
                            <input
                                id="verificar"
                                type="password"
                                className={`validate ${errorContrasenas ? 'error' : ''}`}
                                value={verificar}
                                onChange={(e) => setVerificar(e.target.value)}
                            />
                            <label htmlFor="verificar">Verificar Contraseña</label>
                            {!!errorContrasenas && <span className="helper-text red-text">{errorContrasenas}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="direccion"
                                type="text"
                                className="validate"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                            />
                            <label htmlFor="direccion">Dirección</label>
                        </div>
                    </div>

                    <div className="row">
                        <label>Estado</label>
                        <div className="input-field col s12">
                            <select
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                                className="browser-default"
                            >
                                {estados.map(estado => (
                                    <option key={estado._id} value={estado.clave}>{estado.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <label>Ciudad</label>
                        <div className="input-field col s12">
                            <select
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                className="browser-default"
                            >
                                {ciudades.map(ciudad => (
                                    <option key={ciudad._id} value={ciudad._id}>{ciudad.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <button className="custom-btn" type="submit">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
