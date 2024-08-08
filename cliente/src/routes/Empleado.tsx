import React, { useEffect, useState } from 'react';
import { useAuth } from "../auth/AuthProvider";
import { Navigate, useLocation } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import EmpresaCard from "../routes/EmpresaCard";
import { Empresa, Oferta1, OfertaCompleta } from '../types/types';
import { API_URL } from "../auth/apis";
import '../index.css';
import Oferta from "./Ofertas";

export default function Empleados() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ofertas, setOfertas] = useState<Oferta1[]>([]);
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaCompleta | null>(null);
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
                const response = await fetch(`${API_URL}/empresa/listarEmpresa`);
                const data = await response.json();
                setEmpresas(data);
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
            }
        }

        fetchEmpresas();
    }, []);

    useEffect(() => {
        async function fetchOfertas() {
            try {
                const response = await fetch(`${API_URL}/OfertaLaboral/listarOfertas`);
                const data = await response.json();
                setOfertas(data);

            } catch (error) {
                console.error('Error al obtener ofertas:', error);
            }
        }

        fetchOfertas();
    }, []);

    const handleVerDetalles = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/ofertaLaboral/obtenerOfertas/${id}`);
            const data = await response.json();
            setOfertaSeleccionada(data);
        } catch (error) {
            console.error('Error al obtener detalles de la oferta:', error);
        }
    };

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
            <div className="container">
                <br /><br />
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                <div className="row">
                    <div className="card-container">
                        <div id="Empleos" className="card-container">
                            <ul className="tabs center">
                                <li className="tab col s6"><a className="active" href="#test1">Para ti</a></li>
                                <li className="tab col s6"><a href="#test2">Buscar</a></li>
                            </ul>
                            <div id="test1" className="card-container">
                                <div className="main-container">
                                    <div className="left-side">
                                        <div className="left-side-content">
                                            {/* Agrega el nuevo contenedor aquí */}
                                            <div className="additional-container">
                                                <h4>Contenido Adicional</h4>
                                                {/* Aquí puedes agregar más contenido según lo necesites */}
                                            </div>
                                        </div>
                                        <div className="section">
                                            <div className="cards-container">
                                                {ofertas.length > 0 ? (
                                                    ofertas.map(oferta => (
                                                        <div className="col s12" key={oferta._id}>
                                                            <Oferta
                                                                _id={oferta._id}
                                                                titulo={oferta.titulo}
                                                                direccion={oferta.direccion}
                                                                puesto={oferta.puesto}
                                                                sueldo={oferta.sueldo}
                                                                onClick={() => handleVerDetalles(oferta._id)}
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No se encontraron ofertas.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-side">
                                        {ofertaSeleccionada ? (
                                            <div>
                                                <h5>{ofertaSeleccionada.titulo}</h5>
                                                <p><strong>Puesto:</strong> {ofertaSeleccionada.puesto}</p>
                                                <p><strong>Sueldo:</strong> {ofertaSeleccionada.sueldo}</p>
                                                <p><strong>Horario:</strong> {ofertaSeleccionada.horario}</p>
                                                <p><strong>Modalidad:</strong> {ofertaSeleccionada.modalidad}</p>
                                                <p><strong>Dirección:</strong> {ofertaSeleccionada.direccion}</p>
                                                <p><strong>Ciudad:</strong> {ofertaSeleccionada.ciudad}</p>
                                                <p><strong>Estado:</strong> {ofertaSeleccionada.estado}</p>
                                                <p><strong>Descripción:</strong> {ofertaSeleccionada.descripcion}</p>
                                                <p><strong>Requisitos:</strong> {ofertaSeleccionada.requisitos}</p>
                                                <p><strong>Teléfono:</strong> {ofertaSeleccionada.telefono}</p>
                                                <p><strong>Correo:</strong> {ofertaSeleccionada.correo}</p>
                                                <p><strong>Educación:</strong> {ofertaSeleccionada.educacion}</p>
                                                <p><strong>Idioma:</strong> {ofertaSeleccionada.idioma}</p>
                                                <p><strong>Experiencia Laboral:</strong> {ofertaSeleccionada.experienciaLaboral}</p>
                                                <p><strong>Categoría:</strong> {ofertaSeleccionada.categoria}</p>
                                            </div>
                                        ) : (
                                            <p>Seleccione una oferta para ver los detalles.</p>
                                        )}
                                    </div>
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
                                                <div className="card-content" key={empresa._id}>
                                                    <EmpresaCard
                                                        _id={empresa._id}
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
