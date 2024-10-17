import { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { API_URL, API_URI_IMAGENES } from "../auth/apis";
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Importa tus estilos personalizados despuéss';
const imageSrc = `${API_URI_IMAGENES}/img/auxiliares/SUNEO.jpg`;
import '../index.css'; // Importa tus estilos personalizados después
import { io, Socket } from "socket.io-client";

interface Notificacion {
    idOferta: string;
    idUsuario: string;
    message: string; // Mensaje de la notificación
    link: string; // Enlace a la oferta (puedes ajustarlo según tu estructura)
}

export default function Navigation() {
    const auth = useAuth();
    const navigate = useNavigate();
    const [idRol, setIdRol] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null); // `Socket` de `socket.io-client`
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]); // Estado para almacenar las notificaciones
    const [tieneNotificaciones, setTieneNotificaciones] = useState(false);



    useEffect(() => {
        const socket = io("http://localhost:3000"); // Conéctate al servidor
        socketRef.current = socket; // Guarda la referencia del socket

        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            const empresaId = usuario.id; // ID de la empresa

            socket.emit('joinEmpresa', empresaId); // Únete al room de la empresa

            // Escuchar notificaciones
            socket.on('nuevaPostulacion', (notificacion) => {
                console.log('Nueva notificación recibida:', notificacion);
                setNotificaciones((prevNotificaciones) => {
                    const nuevasNotificaciones = [
                        ...prevNotificaciones,
                        {
                            idOferta: notificacion.idOferta,
                            idUsuario: notificacion.idUsuario,
                            message: 'Un nuevo usuario se postuló a tu oferta',
                            link: `/Empresa/Postulantes/`,
                        },
                    ];
                    // Actualiza el estado de notificaciones
                    setTieneNotificaciones(nuevasNotificaciones.length > 0);
                    return nuevasNotificaciones;
                });
            });
        }

        return () => {
            socket.off('nuevaPostulacion'); // Limpia el listener al desmontar
            socket.disconnect(); // Desconectar el socket
        };
    }, []);

    useEffect(() => {
        // Obtener el id_rol del usuario almacenado en localStorage
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            setIdRol(usuario.id_rol); // Almacenar id_rol en el estado
        }
    }, []);

    useEffect(() => {
        const sidenavElems = document.querySelectorAll('.sidenav');
        const tabsElems = document.querySelectorAll('.tabs');
        const dropdownElems = document.querySelectorAll('.dropdown-trigger');

        // Verificar que los elementos existen antes de inicializarlos
        if (sidenavElems.length) {
            M.Sidenav.init(sidenavElems);
        }
        if (tabsElems.length) {
            M.Tabs.init(tabsElems);
        }
        if (dropdownElems.length) {
            M.Dropdown.init(dropdownElems);
        }

        return () => {
            // Destruir instancias solo si existen
            sidenavElems.forEach(elem => {
                const instance = M.Sidenav.getInstance(elem);
                if (instance) instance.destroy();
            });
            tabsElems.forEach(elem => {
                const instance = M.Tabs.getInstance(elem);
                if (instance) instance.destroy();
            });
            dropdownElems.forEach(elem => {
                const instance = M.Dropdown.getInstance(elem);
                if (instance) instance.destroy();
            });
        };
    }, []); // Asegúrate de que el array de dependencias esté vacío

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
                auth.setIsAuthenticated(false);
                localStorage.removeItem('usuario'); // Eliminar información del usuario de localStorage
                navigate("/"); // Navegar a la página de login u otra página adecuada
            } else {
                console.log("Algo va mal");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <nav className="nav-extended custom-nav">
                <div className="nav-wrapper">
                    <Link to="/Empleado" className="brand-logo">

                        <img
                            src={imageSrc}
                            alt="Logo"
                            style={{ height: 'auto', width: '180px' }}
                        />
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <a className="dropdown-trigger btn grey-btn" href="#!" data-target="dropdown2">
                                <i className="material-icons">notifications</i>
                                {tieneNotificaciones && <span className="notification-dot"></span>} {/* Punto rojo */}
                                <i className="material-icons right">arrow_drop_down</i>
                            </a>
                            <ul id="dropdown2" className="dropdown-content black-options">
                                {notificaciones.length > 0 ? (
                                    notificaciones.map((notif, index) => (
                                        <li key={index}>
                                            <Link to={notif.link}>{notif.message}</Link>
                                        </li>
                                    ))
                                ) : (
                                    <li><span>No hay notificaciones</span></li>
                                )}
                            </ul>
                        </li>
                        <li>
                            <a className="dropdown-trigger btn grey-btn" href="#!" data-target="dropdown1">
                                <i className="material-icons">perm_identity</i>
                                <i className="material-icons right">arrow_drop_down</i>
                            </a>
                            <ul id="dropdown1" className="dropdown-content black-options">
                                {idRol === "6690640c24eacbffd867f333" ? (
                                    <li>
                                        <Link to="/Empleado/PerfilUsuario">Mi cuenta
                                            <i className="tiny material-icons">perm_identity</i>
                                        </Link>
                                    </li>
                                ) : idRol === "6690637124eacbffd867f32f" ? (
                                    <li>
                                        <Link to="/Empresa/PerfilEmpresa">Mi cuenta
                                            <i className="tiny material-icons">perm_identity</i>
                                        </Link>
                                    </li>
                                ) : null}
                                {idRol === "6690640c24eacbffd867f333" ? (
                                    <li>
                                        <Link to="/Empleado/Guardado">Guardado
                                        <i className="tiny material-icons">turned_in</i>
                                    </Link>
                                    </li>
                                ) : null}
                                {idRol === "6690640c24eacbffd867f333" ? (
                                    <li>
                                        <Link to="/Empresa">Postulaciones
                                            <i className="tiny material-icons">content_paste</i>
                                        </Link>
                                    </li>
                                ) : idRol === "6690637124eacbffd867f32f" ? (
                                    <li>
                                        <Link to="/Empresa/Postulantes">Postulantes
                                            <i className="tiny material-icons">content_paste</i>
                                        </Link>
                                    </li>
                                ) : null}
                                <li>
                                    <a href="#!" onClick={handleLogout}>Logout
                                        <i className="material-icons">exit_to_app</i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><Link to="/Empleado">Empleos</Link></li>
                <li><Link to="http://localhost:5173/Administrador">Administrador</Link></li>
            </ul>
        </>
    );
}
