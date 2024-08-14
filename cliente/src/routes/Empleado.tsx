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
import '../estilos/estilosOfertas.css';
import Oferta from "./Ofertas";
import '../estilos/OfertaDetalles.css'

interface Giro {
    _id: string;
    giro: string;
}

export default function Empleados() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ofertas, setOfertas] = useState<Oferta1[]>([]);
    const [giros, setGiros] = useState<Giro[]>([]);
    const [selectedGiro, setSelectedGiro] = useState<string>("");
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaCompleta | null>(null);
    const [empresaNombre, setEmpresaNombre] = useState<string | null>(null);

    const auth = useAuth();
    const location = useLocation();

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        console.log("Pestañas inicializadas");
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);


        return () => {
            M.FormSelect.getInstance(elems[0])?.destroy();
        };

    }, []);

    async function fetchGiros() {
        try {
            const response = await fetch(`${API_URL}/empresa/getGiros`);
            if (response.ok) {
                const data = await response.json() as Giro[];
                console.log('Datos de giros:', data); // Verifica la estructura aquí
                setGiros(data);
            } else {
                console.error('Error al obtener los giros:', response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener los giros:', error);
        }
    }
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
            // Cargar detalles de la oferta seleccionada
            const response = await fetch(`${API_URL}/ofertaLaboral/obtenerOfertas/${id}`);
            const data = await response.json();
            setOfertaSeleccionada(data);

            // Cargar nombre de la empresa de la oferta seleccionada
            const empresaResponse = await fetch(`${API_URL}/ofertaLaboral/buscarNombreEmpresa/${id}`);
            const empresaData = await empresaResponse.json();
            setEmpresaNombre(empresaData.nombre);

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
                    <div id="Empleos" className="container">
                        <ul className="tabs center">
                            <li className="tab col s6"><a className="active" href="#test1">Para ti</a></li>
                            <li className="tab col s6"><a href="#test2">Buscar</a></li>
                        </ul>
                        <div id="test1" className="card-container">
                            <div className="main-container">
                                <div className="left-side">
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
                                        <div className="oferta-detalles-container">
                                            {/* Primer Contenedor: Título, Nombre de la Empresa y Botón */}
                                            <div className="oferta-header">
                                                <h5 className="titulo-oferta">{ofertaSeleccionada.titulo}</h5>
                                                <p className="empresa-nombre">{empresaNombre}</p>
                                                <button className="btn waves-effect waves-light postularme-btn" type="button">
                                                    Postularme
                                                </button>
                                            </div>

                                            {/* Segundo Contenedor: Horario, Modalidad, Sueldo, Educación, Dirección */}
                                            <div className="oferta-info-grid">
                                                <div className="oferta-info-item">
                                                    <p className="info-title"><i className="material-icons">access_time</i> Horario</p>
                                                    <p>{ofertaSeleccionada.horario}</p>
                                                    <p>{ofertaSeleccionada.modalidad}</p>
                                                </div>
                                                <div className="oferta-info-item">
                                                    <p className="info-title"><i className="material-icons">attach_money</i> Sueldo</p>
                                                    <p>{ofertaSeleccionada.sueldo}</p>
                                                </div>
                                                <div className="oferta-info-item">
                                                    <p className="info-title"><i className="material-icons">school</i> Educación</p>
                                                    <p>{ofertaSeleccionada.educacion}</p>
                                                </div>
                                                <div className="oferta-info-item">
                                                    <p className="info-title"><i className="material-icons">location_on</i> Dirección</p>
                                                    <p><strong>Calle:</strong> {ofertaSeleccionada.direccion}</p>

                                                    <div className="ciudad-estado-container">
                                                        <p><strong>Ciudad:</strong> {ofertaSeleccionada.ciudad}</p>
                                                        <p><strong>Estado:</strong> {ofertaSeleccionada.estado}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tercer Contenedor: Información restante */}
                                            <div className="oferta-detalles-resto">
                                                <p className='info-title'><i className="material-icons">description</i> Descrpción</p>
                                                <p> {ofertaSeleccionada.descripcion}</p>
                                                <p className='info-title'><i className="material-icons">contacts</i> Contacto</p>
                                                <p><strong>Teléfono:</strong> {ofertaSeleccionada.telefono}</p>
                                                <p><strong>Correo:</strong> {ofertaSeleccionada.correo}</p>
                                                <p className='info-title'><i className="material-icons">check</i> Requisitos</p>
                                                <p>{ofertaSeleccionada.requisitos}</p>
                                                <p><strong>Idioma:</strong> {ofertaSeleccionada.idioma}</p>
                                                <p><strong>Experiencia Laboral:</strong> {ofertaSeleccionada.experienciaLaboral}</p>
                                                <p className='info-title'><i className="material-icons">work</i> Categoria</p>
                                                <p> {ofertaSeleccionada.categoria}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p>Seleccione una oferta para ver detalles.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div id="test2">
                            {/* Aquí puedes agregar componentes o lógica para la búsqueda de ofertas */}
                        </div>
                    </div>

                    <div id="Empresas" className="container">
                        <div className="main-container2">
                            <div className="izquierdo-side">
                                <div className="oferta-detalles-container2">
                                    <div className="oferta-header2">
                                        <p className='info-title2'>Filtrar empresas</p>
                                    </div>
                                    <div className="oferta-header3">
                                        <p className='info-title3'>Ciudad</p>
                                    </div>
                                    <div className="oferta-header3">
                                        <p className='info-title3'>Estado</p>

                                    </div>
                                    <div className="oferta-header3">
                                        <p className='info-title3'>Giro</p>
                                        <select onFocus={fetchGiros} onChange={(e) => setSelectedGiro(e.target.value)} value={selectedGiro}>
                                            <option value="" disabled>Seleccionar Giro</option>
                                            {giros.map(giro => (
                                                <option key={giro._id} value={giro._id}>{giro.giro}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="derecho-side">
                                <div className="row">
                                    {empresas.length > 0 ? (
                                        empresas.map((empresa) => (
                                            <div className="container" key={empresa._id}>
                                                <EmpresaCard
                                                    _id={empresa._id}
                                                    nombre={empresa.nombre}
                                                    direccion={empresa.direccion}
                                                    giro={empresa.giro}
                                                    foto={empresa.foto}
                                                    correo={empresa.correo}
                                                    ciudad={empresa.ciudad}
                                                    estado={empresa.estado}
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
        </DefaultLayout>
    );
}
