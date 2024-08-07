import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useLocation } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import EmpresaCard from "../routes/EmpresaCard";
import { Empresa } from '../types/types'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { API_URL } from "../auth/apis";
import '../index.css'; // Asegúrate de tener los estilos personalizados aquí

export default function Empleados() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]); // Usa la interfaz Empresa
    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        console.log("Pestañas inicializadas");
    }, []);

    useEffect(() => {
        async function fetchEmpresas() {
            try {
                const response = await fetch(`${API_URL}/empresa/listarEmpresa`); // Endpoint para obtener la lista de empresas
                const data = await response.json();
                setEmpresas(data);
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
            }
        }

        fetchEmpresas();
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
                            <div id="test1" className="col s12" style={{ display: 'flex' }}>
                                <div className="left-side" style={{ flex: '0 0 30%', paddingRight: '16px' }}>
                                    <h5>Contenido de 30%</h5>
                                    {/* Aquí puedes poner el contenido que quieras mostrar en el 30% */}
                                </div>
                                <div className="right-side" style={{ flex: '1' }}>
                                    <h5>Contenido de 70%</h5>
                                    {/* Aquí puedes agregar el contenido de 70% */}
                                </div>
                            </div>
                            <div id="test2" className="col s12">Contenido Buscar</div>
                        </div>
                        <div id="Empresas" className="col s12">
                            <div className="container">
                                <div className="section">
                                    <div className="cards-container">
                                        {empresas.length > 0 ? (
                                            empresas.map(empresa => (
                                                <div className="card-content" key={empresa.id}>
                                                    <EmpresaCard
                                                        id={empresa.id}
                                                        nombre={empresa.nombre}
                                                        direccion={empresa.direccion}
                                                        giro={empresa.giro}
                                                        foto={empresa.foto}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p>No se encontraron empresas.</p>
                                        )}
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
