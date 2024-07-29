import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";

export default function Empleado() {
    const [errorResponse, setErrorResponse] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const auth = useAuth();

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <DefaultLayout showNav={true}>
            <div>
                <h1>Empleado</h1>
                {!!errorResponse && <div className="errorMessage">{errorResponse}</div>}
                {!!successMessage && <div className="successMessage">{successMessage}</div>}
            </div>
        </DefaultLayout>
    );
}
