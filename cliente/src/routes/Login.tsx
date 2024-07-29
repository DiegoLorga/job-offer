import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_URL } from "../auth/apis";
import { AuthResponseError, AuthReponseRegister } from '../types/types';

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const auth = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    correo,
                    contrasena,
                }),
                credentials: 'include'  // Incluir las cookies en la solicitud
            });

            if (response.ok) {
                console.log("El usuario ingresó");
                const json = await response.json() as AuthReponseRegister;
                console.log(json);
                setSuccessMessage(json.body.message);
                setErrorResponse("");
                auth.setIsAuthenticated(true); // Establecer el estado de autenticación aquí
                navigate("/Empleado");
            } else {
                console.log("Algo va mal");
                const json = await response.json() as AuthResponseError;
                setErrorResponse(json.body.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/Empleado" />;
    }

    return (

        <form className="form" onSubmit={handleSubmit}>
            <h1>Login</h1>
            {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
            {!!successMessage && <div className="successMessage">{successMessage}</div>}
            <label>Correo</label>
            <input
                type="text"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
            />

            <label>Contraseña</label>
            <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
            />
            <br />
            <button>Login</button>
            <label>
                <Link to="/RecuperarContrasena">¿Olvidaste tu contraseña? </Link>
            </label>
            <label>
                <br />
                <Link to="/Registro">¿No tienes cuenta? Regístrate aquí</Link>
            </label>
        </form>

    );
}
