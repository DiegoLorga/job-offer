import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/apis";
import { AuthReponseRegister, AuthResponseError } from "../types/types";

interface Estado {
    _id: string;
    nombre: string;
    clave: string; // Añade clave si no está presente en el modelo de Estado
}

interface Ciudad {
    _id: string;
    nombre: string;
    clave: string; // Añade claveEstado si no está presente en el modelo de Ciudad
}

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [verificar, setVerificar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState(""); // Estado de ciudad
    const [errorCampos, setErrorCampos] = useState("");
    const [errorContrasenas, setErrorContrasenas] = useState("");
    const [errorCorreo, setErrorCorreo] = useState("");
    const [errorNombre, setErrorNombre] = useState("");
    const [sucessMessage, setSuccessMessage] = useState("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [selectedEstado, setSelectedEstado] = useState<string>("");
    const [ciudades, setCiudades] = useState<Ciudad[]>([]); // Estado para almacenar la lista de ciudades filtradas

    const auth = useAuth();
    const goTo = useNavigate();

    // Obtener la lista de estados al cargar el componente
    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/registro/getEstados`);
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
                const response = await fetch(`${API_URL}/registro/getCiudades/${selectedEstado}`);
                if (response.ok) {
                    const data = await response.json() as Ciudad[];
                    setCiudades(data);
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
                    ciudad, // Usar estado de ciudad
                    estado: selectedEstado
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
            <br />
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

            <label> Estado </label>
            <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
            >
                {estados.map(estado => (
                    <option key={estado._id} value={estado.clave}>{estado.nombre}</option>
                ))}
            </select>

            <label> Ciudad </label>
            <select
                value={ciudad} // Usar el estado de ciudad
                onChange={(e) => setCiudad(e.target.value)}
            >
                {ciudades.map(ciudad => (
                    <option key={ciudad._id} value={ciudad._id}>{ciudad.nombre}</option>
                ))}
            </select>

            <button type="submit">Registrarse</button>
        </form>
    );
}