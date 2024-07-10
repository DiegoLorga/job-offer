import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import DefaultLayout from "../layout/DefaultLayout";
import { useState } from "react";

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [verificar, setVerificar] = useState("");
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [estado, setEstado] = useState("");

    const auth = useAuth();
    if(auth.isAuthenticated){
        return <Navigate to="/Empresa"/>
    }

    return (
        <DefaultLayout>
            <form className="form">
                <h1>Registro</h1>
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

                <button>Login</button>
            </form>

        </DefaultLayout>

    );
}