import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/apis";
import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import M from 'materialize-css';
//import 'materialize-css/dist/css/materialize.min.css'; // Comentado para evitar conflictos
import '../index.css'; // Importa tus estilos personalizados después

export default function Navigation() {
    const auth = useAuth();

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
            } else {
                console.log("Algo va mal");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // Inicializar sidenav y otras características de Materialize
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
        console.log("Otros inicializados");
    }, []);

    return (
        <>
            <nav className="nav-extended">
                <div className="nav-wrapper">
                    <a href="#" className="brand-logo">Logo</a>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <a className="dropdown-trigger btn" href="#!" data-target="dropdown1">
                                <i className="material-icons">perm_identity</i>
                                <i className="material-icons right">arrow_drop_down</i>
                            </a>
                            <ul id="dropdown1" className="dropdown-content">
                                <li>
                                    <Link
                                        to="/Empresa">Perfil
                                        <i className="tiny material-icons">perm_identity</i>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/Administrador">Guardado
                                        <i className="tiny material-icons">turned_in</i>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#!">Postulaciones
                                        <i className="tiny material-icons">content_paste</i>
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#!" onClick={handleLogout}>Logout
                                        <i className="material-icons">exit_to_app</i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="nav-content">
                    <ul id="tabs-swipe-demo" className="tabs">
                        <li className="tab col s3"><Link to="/Empleado">Empleos</Link></li>
                        <li className="tab col s3"><Link to="/Administrador">Empresas</Link></li>
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><Link to="/Empleado">Empleado</Link></li>
                <li><Link to="/Administrador">Administrador</Link></li>
            </ul>
        </>
    );
}
