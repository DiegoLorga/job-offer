import DefaultLayout from "../layout/DefaultLayout"
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const auth = useAuth();

    if (auth.isAuthenticated) {
        return <Navigate to="/Empresa" />
    }

    return (
        <DefaultLayout>
            <form className="form">
                <h1>Login</h1>
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

                <button>Login</button>
            </form>

        </DefaultLayout>

    );
}