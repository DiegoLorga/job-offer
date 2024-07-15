import DefaultLayout from "../layout/DefaultLayout"
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
    const [authResponse,setAuthResponse] =useState("")
    const [sucessMessage,setSuccessMessage] = useState("");
    const auth = useAuth();
    const goTo = useNavigate();
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
                })
            });
            if (response.ok) {
                console.log("El usuario ingresó");
                const json = await response.json() as AuthReponseRegister;
                console.log(json);
                setSuccessMessage(json.body.message);
                setErrorResponse("");
                goTo("/Empleado");
                //goTo("/");
            } else {
                console.log("Algo va mal");
                const json = await response.json() as AuthResponseError;
                setErrorResponse(json.body.error)
            }
        } catch (error) {
            console.log(error);

        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/Empresa" />
    }

    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                {!!sucessMessage && <div className="sucessMessage">{sucessMessage}</div>}
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
                < br />
                <button>  Login  </button>
                <label>
                    <br />
                    <Link to="/Registro"> ¿No tienes cuenta? Registrate aquí </Link>
                </label>
            </form>

        </DefaultLayout>

    );
}