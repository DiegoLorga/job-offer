import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../auth/apis";


export default function Empleado() {
    const [errorResponse, setErrorResponse] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const auth = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(`${API_URL}/login/logout`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            if (response.ok) {
                console.log("El usuario cerró sesión");
                setSuccessMessage("Sesión cerrada exitosamente");
                setErrorResponse("");
                auth.setIsAuthenticated(false); // Establecer el estado de autenticación como falso
                navigate("/");
            } else {
                console.log("Algo va mal");
                setErrorResponse("Error al cerrar sesión");
            }
        } catch (error) {
            console.log(error);
            setErrorResponse("Error al cerrar sesión");
        }
    }

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (

        <div>
            <h1>Empleado</h1>
            {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
            {!!successMessage && <div className="successMessage">{successMessage}</div>}
            <button onClick={handleLogout}>Logout</button>
        </div>

    );
}
