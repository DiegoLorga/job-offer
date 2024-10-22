import React, { useEffect, useState } from 'react';
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from 'react-router-dom';
import DefaultLayout from "../layout/DefaultLayout";
import Swal from 'sweetalert2';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import EmpresaCard from "../routes/EmpresaCard";
import { Empresa, Notificacion, Oferta1, OfertaCompleta } from '../types/types';
import { API_URL } from "../auth/apis";
import '../index.css';
import '../estilos/estilosOfertas.css';
import Oferta from "./Ofertas";
import '../estilos/OfertaDetalles.css'
import { io } from "socket.io-client";



interface Giro {
    _id: string;
    giro: string;
}

interface Educacion {
    _id: string;
    nivel: string;
}
interface Estado {
    _id: string;
    nombre: string;
    clave: string;
}

interface Ciudad {
    _id: string;
    nombre: string;
    clave: string;
}

export default function Empleados() {
    const [errorResponse] = useState<string>("");
    const [successMessage] = useState<string>("");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [ofertas, setOfertas] = useState<Oferta1[]>([]);
    const [giros, setGiros] = useState<Giro[]>([]);
    const [selectedGiro, setSelectedGiro] = useState<string>("");
    const [educacion, setEducacion] = useState<Educacion[]>([]);
    const [selectedEducacion, setSelectedEducacion] = useState<string>("");
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState<OfertaCompleta | null>(null);
    const [empresaNombre, setEmpresaNombre] = useState<string | null>(null);
    const [estadosEmp, setEstadosEmp] = useState<Estado[]>([]); //para filtrar empresas
    const [ciudadesEmp, setCiudadesEmp] = useState<Ciudad[]>([]);
    const [ciudadEmp, setCiudadEmp] = useState("");
    const [estadoEmp, setEstadoEmp] = useState("");
    const [nombreEstadoEmp, setNombreEstadoEmp] = useState<string>("");
    const [selectedEstadoEmp, setSelectedEstadoEmp] = useState<string>("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [selectedEstado, setSelectedEstado] = useState<string>(""); //para filtrar ofertas
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [ciudad, setCiudad] = useState("");
    const [nombreEstado, setNombreEstado] = useState<string>("");
    const [selectedSueldo, setSelectedSueldo] = useState<string>("1");
    const [selectedModalidad, setSelectedModalidad] = useState<string>("1");
    const [fechaInicio, setFechaInicio] = useState<string>("");
    const [fechaFin, setFechaFin] = useState<string>("");
    const [NotificacionEmpresas, setNotificacionEmpresas] = useState<Notificacion[]>([]);
    const idOferta = localStorage.getItem('id_oferta');


    useEffect(() => {
        const socket = io("http://localhost:3000"); // Conéctate al servidor

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            const empresaId = usuario.id; // ID de la empresa

            socket.emit('joinEmpresa', empresaId); // Únete al room de la empresa

            // Escuchar notificaciones
            socket.on('nuevaPostulacion', (notificacion) => {
                console.log('Nueva notificación recibida:', notificacion);
            });
        }

        return () => {
            socket.off('nuevaPostulacion'); // Limpia el listener al desmontar
            socket.disconnect(); // Desconectar el socket
        };
    }, []);

    const auth = useAuth();
    const socket = io("http://localhost:3000"); // Conéctate al servidor


    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);

        return () => {
            elems.forEach((elem) => {
                const instance = M.FormSelect.getInstance(elem);
                if (instance) instance.destroy();
            });
        };
    }, []);

    useEffect(() => {
        // Inicializa el selector de fechas de Materialize
        const elemsInicio = document.querySelectorAll('.datepicker-inicio');
        const elemsFin = document.querySelectorAll('.datepicker-fin');

        M.Datepicker.init(elemsInicio, {
            format: 'yyyy-mm-dd',
            onSelect: (date) => setFechaInicio(date.toISOString().split('T')[0])
        });

        M.Datepicker.init(elemsFin, {
            format: 'yyyy-mm-dd',
            onSelect: (date) => setFechaFin(date.toISOString().split('T')[0])
        });
    }, []);

    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/usuario/getEstadosOfertas`);
                if (response.ok) {
                    const data = await response.json() as Estado[];
                    setEstados(data);
                    if (data.length > 0) {
                        setSelectedEstado(data[0].clave);
                        setNombreEstado(data[0].nombre); // Guardar el nombre del primer estado
                    }
                } else {
                    console.error('Error al obtener los estados:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        }

        fetchEstados();
    }, []);

    //para filtrar empresas
    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/usuario/getEstadosEmpresas`);
                if (response.ok) {
                    const data = await response.json() as Estado[];
                    setEstadosEmp(data);
                    if (data.length > 0) {
                        setSelectedEstadoEmp(data[0].clave);
                        setNombreEstadoEmp(data[0].nombre); 
                    }
                } else {
                    console.error('Error al obtener los estados:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los estados:', error);
            }
        }

        fetchEstados();
    }, []);

    useEffect(() => {
        async function fetchEstadoNombre() {
            const estado = estados.find(e => e.clave === selectedEstado);
            if (estado) {
                setNombreEstado(estado.nombre);
            }
        }
        fetchEstadoNombre();
    }, [selectedEstado, estados]);


    //para filtrar empresas
    useEffect(() => {
        async function fetchEstadoNombre() {
            const estado = estadosEmp.find(e => e.clave === selectedEstadoEmp);
            if (estado) {
                setNombreEstadoEmp(estado.nombre);
            }
        }
        fetchEstadoNombre();
    }, [selectedEstadoEmp, estadosEmp]);

    // Cargar ciudades al cambiar el estado seleccionado para empleos
    useEffect(() => {
        async function fetchCiudades() {
            try {
                const response = await fetch(`${API_URL}/usuario/getCiudadesOfertas/${selectedEstado}`);
                if (response.ok) {
                    const data = await response.json() as Ciudad[];
                    setCiudades(data);
                    if (data.length > 0) {
                        setCiudad(data[0].nombre);
                    }
                } else {
                    console.error('Error al obtener las ciudades:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        }

        if (selectedEstado) {
            fetchCiudades();
        }
    }, [selectedEstado]);


    // Cargar ciudades al cambiar el estado seleccionado para empresas
    useEffect(() => {
        async function fetchCiudades() {
            try {
                const response = await fetch(`${API_URL}/usuario/getCiudadesEmpresas/${selectedEstadoEmp}`);
                if (response.ok) {
                    const data = await response.json() as Ciudad[];
                    setCiudadesEmp(data);
                    if (data.length > 0) {
                        setCiudadEmp(data[0].nombre);
                    }
                } else {
                    console.error('Error al obtener las ciudades:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        }

        if (selectedEstadoEmp) {
            fetchCiudades();
        }
    }, [selectedEstadoEmp]);

    useEffect(() => {
        async function fetchGiros() {
            try {
                const response = await fetch(`${API_URL}/empresa/getGirosEmpresas`);
                if (response.ok) {
                    const data = await response.json() as Giro[];
                    setGiros(data);
                    console.log("Datos de los giros: ", data);
                    if (data.length > 0) {
                        setSelectedGiro(data[0].giro);
                    }

                } else {
                    console.error('Error al obtener los giros:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los giros:', error);
            }
        }

        fetchGiros();
    }, []);


    useEffect(() => {
        async function fetchEducacion() {
            try {
                const response = await fetch(`${API_URL}/OfertaLaboral/educacion`);
                if (response.ok) {
                    const data = await response.json() as Educacion[];
                    setEducacion(data);
                    console.log("Datos de la educacion: ", data);
                    if (data.length > 0) {
                        setSelectedEducacion(data[0].nivel);
                    }

                } else {
                    console.error('Error al obtener los datos de nivel:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los datos de nivel:', error);
            }
        }

        fetchEducacion();
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

    useEffect(() => {
        // Reinicializar el select después de que los giros se hayan cargado
        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);
    }, [giros, estados, ciudades, estadosEmp, ciudadEmp]);

//función para ver más informacion del guardado 
useEffect(() => {
    console.log("obteniendo el valor del id para ver más " );
    if (idOferta) {
        console.log("obteniendo el valor del id para ver más ", idOferta );
        handleVerDetalles(idOferta);
        // Eliminar el id de la oferta del localStorage
        localStorage.removeItem('id_oferta');
    }
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

    const handleAplicarFiltros = async () => {
        try {
            // Realizar la petición POST al endpoint de filtros
            const response = await fetch(`${API_URL}/empresa/filtros`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: nombreEstadoEmp,
                    ciudad: ciudadEmp,
                    giro: selectedGiro,
                }),
            });

            console.log("estado: ", nombreEstadoEmp);
            console.log("ciudad: ", ciudadEmp);
            console.log("giro: ", selectedGiro);

            if (response.ok) {
                const data = await response.json();
                setEmpresas(data); // Actualizar el estado con las empresas filtradas
                console.log("Datos: ", data);

            } else {
                console.error('Error al aplicar filtros:', response.statusText);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    text: 'No se encontraron coincidencias'
                })
            }
        } catch (error) {
            console.error('Error al aplicar filtros:', error);
        }
    };

    const handleSueldoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSueldo(e.target.value);
    };

    const handleModalidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedModalidad(e.target.value);
    };


    const handleBuscarOfertas = async () => {
        try {
            const response = await fetch(`${API_URL}/OfertaLaboral/buscar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    estado: nombreEstado,
                    ciudad: ciudad,
                    sueldo: parseInt(selectedSueldo, 10),
                    modalidad: parseInt(selectedModalidad, 10),
                    educacion: selectedEducacion,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                }),
            });
            console.log(nombreEstado);
            console.log(ciudad);
            console.log(selectedSueldo);
            console.log(selectedModalidad);
            console.log(selectedEducacion);
            console.log(fechaInicio);
            console.log(fechaFin);


            if (response.ok) {
                const data = await response.json();
                setOfertas(data);
                console.log("Datos de oferta: ", data);

            } else {
                console.error('Error al aplicar filtros:', response.statusText);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    text: 'No se encontraron coincidencias'
                });
            }
        } catch (error) {
            console.error('Error al aplicar filtros:', error);
        }
    };

    const handlePostularme = async (idOferta: string) => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            const idUsuario = usuario.id;
    
            // Verifica si el usuario ya se postuló a esta oferta
            const postulacionesPrevias = usuario.postulaciones || []; // Asegúrate de tener las postulaciones previas en localStorage
            const yaPostulado = postulacionesPrevias.includes(idOferta);
    
            if (yaPostulado) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Ya te has postulado',
                    text: 'Ya te has postulado a esta oferta.',
                    confirmButtonText: 'Aceptar',
                });
                return; // Detiene el proceso si ya está postulado
            }
    
            try {
                const response = await fetch(`${API_URL}/usuario/postularme`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idUsuario,
                        idOferta,
                    }),
                });
    
                if (response.ok) {
                    // Emitir el evento al socket para notificar la postulación
                    socket.emit('nuevaPostulacion', { idOferta, idUsuario });
    
                    // Actualizar las postulaciones del usuario localmente
                    usuario.postulaciones = [...postulacionesPrevias, idOferta];
                    localStorage.setItem('usuario', JSON.stringify(usuario));
    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Postulación exitosa!',
                        text: 'Te has postulado correctamente.',
                        confirmButtonText: 'Aceptar',
                    });
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al postularse',
                        text: errorData.error,
                        confirmButtonText: 'Aceptar',
                    });
                }
            } catch (error) {
                alert('Error de conexión. Por favor intenta más tarde.');
            }
        }
    };
    
    




    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <DefaultLayout showNav={true}>
            <div className="nav-content">
                <ul id="tabs-swipe-demo" className="tabs custom-tabs">
                    <li className="tab col s3" ><a href="#Empleos" className="black-text">Empleos</a></li>
                    <li className="tab col s3"><a href="#Empresas" className="black-text">Empresas</a></li>
                </ul>
            </div>
            <div className="container">
                <br /><br />
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                <div className="row">
                    <div id="Empleos" className="container custom-tabs">
                        <ul className="tabs center">
                            <li className="tab col s6"><a className="active" href="#test1"><i className="material-icons">wb_sunny</i>Para ti</a></li>
                            <li className="tab col s6"><a href="#test2"><i className="material-icons">search</i>Buscar</a></li>
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
                                                            estado={oferta.estado}
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
                                                <button
                                                    className="btn waves-effect postularme-btn"
                                                    type="button"
                                                    onClick={() => handlePostularme(ofertaSeleccionada._id)}
                                                >
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
                            <div className="header-container">
                                <div className="select-container">
                                    <p className='info-title4'>Estado</p>
                                    <select
                                        value={selectedEstado}
                                        onChange={(e) => setSelectedEstado(e.target.value)}
                                    >
                                        {estados.map(estado => (
                                            <option key={estado._id} value={estado.clave}>{estado.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="select-container">
                                    <p className='info-title4'>Ciudad</p>
                                    <select
                                        value={ciudad}
                                        onChange={(e) => setCiudad(e.target.value)}
                                    >
                                        {ciudades.map(ciudad => (
                                            <option key={ciudad._id} value={ciudad.nombre}>{ciudad.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="select-container">
                                    <p className='info-title4'>Sueldo</p>
                                    <select
                                        value={selectedSueldo}
                                        onChange={handleSueldoChange}
                                    >
                                        <option value="1">$1,000 MX - $5,000 MX</option>
                                        <option value="2">$5,000 MX - $10,000 MX</option>
                                        <option value="3">$10,000 MX - $20,000 MX</option>
                                        <option value="4">$20,000 MX O MÁS</option>
                                    </select>
                                </div>
                                <div className="select-container">
                                    <p className='info-title4'>Modalidad</p>
                                    <select
                                        value={selectedModalidad}
                                        onChange={handleModalidadChange}
                                    >
                                        <option value="1">REMOTO</option>
                                        <option value="2">PRESENCIAL</option>
                                        <option value="3">HIBRIDO</option>
                                    </select>
                                </div>

                                <div className="select-container">
                                    <p className='info-title4'>Educación</p>
                                    <select
                                        value={selectedEducacion}
                                        onChange={(e) => setSelectedEducacion(e.target.value)}
                                    >
                                        {educacion.map((educacion) => (
                                            <option key={educacion._id} value={educacion.nivel}>
                                                {educacion.nivel}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="select-container">
                                    <p className='info-title4'>Fecha Inicio</p>
                                    <input
                                        type="text"
                                        className='datepicker datepicker-inicio'
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                    />
                                </div>

                                <div className="select-container">
                                    <p className='info-title4'>Fecha Fin</p>
                                    <input
                                        type="text"
                                        className='datepicker datepicker-fin'
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="button-container">
                                <a
                                    className="waves-effect waves-light btn-small custom-btn2"
                                    onClick={handleBuscarOfertas}
                                >
                                    Aplicar
                                </a>
                            </div>
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
                                                            estado={oferta.estado}
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
                    </div>

                    <div id="Empresas" className="container">
                        <div className="main-container2">
                            <div className="izquierdo-side">
                                <div className="oferta-detalles-container2">
                                    <div className="oferta-header2">
                                        <p className='info-title2'>Filtrar empresas</p>
                                    </div>
                                    <div className="oferta-header3">
                                    <p className='info-title4'>Estado</p>
                                    <select
                                        value={selectedEstadoEmp}
                                        onChange={(e) => setSelectedEstadoEmp(e.target.value)}
                                    >
                                        {estadosEmp.map(estado => (
                                            <option key={estado._id} value={estado.clave}>{estado.nombre}</option>
                                        ))}
                                    </select>
                                    </div>
                                    <div className="oferta-header3">
                                        <p className='info-title3'>Ciudad</p>
                                        <select
                                            value={ciudadEmp}
                                            onChange={(e) => setCiudadEmp(e.target.value)}
                                        >
                                            {ciudadesEmp.map(ciudad => (
                                                <option key={ciudad._id} value={ciudad.nombre}>{ciudad.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="oferta-header3">
                                        <p className='info-title3'>Giro</p>
                                        <select
                                            value={selectedGiro}
                                            onChange={(e) => setSelectedGiro(e.target.value)}
                                        >
                                            {giros.map((giro) => (
                                                <option key={giro._id} value={giro.giro}>
                                                    {giro.giro}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="button-container2">
                                            <a
                                                className="waves-effect waves-light btn-small custom-btn2"
                                                onClick={handleAplicarFiltros}
                                            >
                                                Aplicar
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="derecho-side">
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
        </DefaultLayout>
    );
}
