import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link, useLocation } from 'react-router-dom';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Importa tus estilos personalizados después

export default function Navigation() {
    const auth = useAuth();
    const location = useLocation();

    async function handleLogout() {

    }

    useEffect(() => {
        const sidenavElems = document.querySelectorAll('.sidenav');
        const tabsElems = document.querySelectorAll('.tabs');
        const dropdownElems = document.querySelectorAll('.dropdown-trigger');

        M.Sidenav.init(sidenavElems);
        M.Tabs.init(tabsElems);
        M.Dropdown.init(dropdownElems);

        return () => {
            M.Sidenav.getInstance(sidenavElems[0])?.destroy();
            M.Tabs.getInstance(tabsElems[0])?.destroy();
            M.Dropdown.getInstance(dropdownElems[0])?.destroy();
        };
    }, []);

    const isPerfilUsuario = location.pathname.includes('/Empleado/PerfilUsuario');

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
                                    <Link to="/Empleado/PerfilUsuario">Mi cuenta
                                        <i className="tiny material-icons">perm_identity</i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Administrador">Guardado
                                        <i className="tiny material-icons">turned_in</i>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#!">Postulaciones
                                        <i className="tiny material-icons">content_paste</i>
                                    </Link>
                                </li>
                                <li>
                                    <a href="#!" onClick={handleLogout}>Logout
                                        <i className="material-icons">exit_to_app</i>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="nav-content">
                    <ul id="tabs-swipe-demo" className="tabs">
                        <li className="tab col s3"><Link to="/Empleado">{isPerfilUsuario ? 'perfil' : 'Empleos'}</Link></li>
                        <li className="tab col s3"><Link to="/Empleado">{isPerfilUsuario ? 'información' : 'Empresas'}</Link></li>
                    </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><Link to="/Empleado">{isPerfilUsuario ? 'Mi cuenta' : 'Empleos'}</Link></li>
                <li><Link to="http://localhost:5173/Administrador">Administrador</Link></li>
            </ul>
        </>
    );
}
