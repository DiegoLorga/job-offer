import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useLocation } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

export default function Empleados() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [empresa, setEmpresa] = useState<any>(null); // Estado para la empresa
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        console.log("Pestañas inicializadas");
    }, []);

    useEffect(() => {
        // Simular carga de datos de la empresa
        async function fetchEmpresa() {
            try {
                const response = await fetch('/api/empresa-perfil'); // Endpoint para obtener el perfil de la empresa
                const data = await response.json();
                setEmpresa(data);
            } catch (error) {
                console.error('Error al obtener la empresa:', error);
            }
        }

        fetchEmpresa();
    }, []);

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    const isPerfilUsuario = location.pathname.includes('/Empleado/PerfilUsuario');

    return (
        <DefaultLayout showNav={true}>
            <div className="nav-content">
                <ul id="tabs-swipe-demo" className="tabs">
                    <li className="tab col s3"><a href="#Empleos">Empleos</a></li>
                    <li className="tab col s3"><a href="#Empresas">Empresas</a></li>
                </ul>
            </div>
            <div className="container"> <br /><br />
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                <div className="row">
                    <div className="col s12">
                        <div id="Empleos" className="col s12">
                            <ul className="tabs center">
                                <li className="tab col s6"><a className="active" href="#test1">Para ti</a></li>
                                <li className="tab col s6"><a href="#test2">Buscar</a></li>
                            </ul>
                            <div id="test1" className="col s12">Contenido Para ti</div>
                            <div id="test2" className="col s12">Contenido Buscar</div>
                        </div>
                        <div id="Empresas" className="col s12">
                            <div className="container">
                                <div className="section">
                                    <div className="row">
                                        <div className="col s12">
                                            <div className="card">
                                                <div className="card-image">
                                                    <img src="https://via.placeholder.com/1500x400" alt="Empresa banner" />
                                                    <span className="card-title">Nombre de la Empresa</span>
                                                </div>
                                                <div className="card-content">
                                                    <h5>Descripción</h5>
                                                    <p>
                                                        Aquí va la descripción de la empresa. Puede incluir información sobre la misión,
                                                        visión, historia, y más.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col s12">
                                            <ul className="tabs">
                                                <li className="tab col s3"><a href="#overview" className="active">Resumen</a></li>
                                                <li className="tab col s3"><a href="#reviews">Reseñas</a></li>
                                                <li className="tab col s3"><a href="#jobs">Empleos</a></li>
                                                <li className="tab col s3"><a href="#salary">Salarios</a></li>
                                            </ul>
                                        </div>
                                        <div id="overview" className="col s12">
                                            <h5>Resumen</h5>
                                            <p>Información general de la empresa, cultura, valores, etc.</p>
                                        </div>
                                        <div id="reviews" className="col s12">
                                            <h5>Reseñas</h5>
                                            <p>Aquí se muestran las reseñas de los empleados.</p>
                                        </div>
                                        <div id="jobs" className="col s12">
                                            <h5>Empleos</h5>
                                            <p>Lista de empleos actuales en la empresa.</p>
                                        </div>
                                        <div id="salary" className="col s12">
                                            <h5>Salarios</h5>
                                            <p>Información sobre los salarios de los empleados.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
