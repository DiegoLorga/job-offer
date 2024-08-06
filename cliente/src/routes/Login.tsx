import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_URL } from "../auth/apis";
import { AuthResponseError, AuthReponseRegister,User } from '../types/types';
//import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'

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
                console.log("El id_rol",json.body.usuario.id_rol);
                setSuccessMessage(json.body.message);
                setErrorResponse("");
                auth.setIsAuthenticated(true); // Establecer el estado de autenticación aquí
                if(json.body.usuario.id_rol === "6690640c24eacbffd867f333"){
                    navigate("/Empleado");
                }else if(json.body.usuario.id_rol === "6690637124eacbffd867f32f"){
                    navigate("/Empresa");
                }else{
                    navigate("/Administrador");
                }
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
        <div className="container">
            <div className="form">
                <form className="col s12" onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                    {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                    
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="correo"
                                type="email"
                                className="validate"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                            <label htmlFor="correo">Correo</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                id="contrasena"
                                type="password"
                                className="validate"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                            />
                            <label htmlFor="contrasena">Contraseña</label>
                        </div>
                    </div>

                    <div className="row">
                        <button className="custom-btn" type="submit">
                            Login
                        </button>
                    </div>

                    <div className="row">
                        <label>
                            <Link to="/RecuperarContrasena">¿Olvidaste tu contraseña?</Link>
                        </label>
                    </div>

                    <div className="row">
                        <label>
                            <Link to="/Registro">¿No tienes cuenta? Regístrate aquí</Link>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
}