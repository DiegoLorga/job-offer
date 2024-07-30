import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router-dom";
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';

const Empleado: React.FC = () => {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const auth = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Inicializar Materialize JavaScript
        if (modalRef.current) {
            M.Modal.init(modalRef.current);
        }
    }, []);

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <DefaultLayout showNav={true}>
            <div className="container">
                <h1>Empleado</h1>
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Abrir Modal</a>

                {/* Modal Structure */}
                <div id="modal1" className="modal" ref={modalRef}>
                    <div className="modal-content">
                        <h4>Título del Modal</h4>
                        <p>Contenido del modal.</p>
                    </div>
                    <div className="modal-footer">
                        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Cerrar</a>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Empleado;
