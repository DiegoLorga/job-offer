import { useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import { API_URL } from "../auth/apis";
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Importa tus estilos personalizados después

export default function Navigation() {
    const auth = useAuth();
    const navigate = useNavigate();

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
                    <a href="#" className="brand-logo">
                        <img src="https://i.ytimg.com/vi/wKUEGzKXYWM/maxresdefault.jpg" alt="Logo" style={{ height: 'auto', width: '200px' }} />
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li>
                            <a className="dropdown-trigger btn grey-btn" href="#!" data-target="dropdown1">
                                <i className="material-icons">perm_identity</i>
                                <i className="material-icons right">arrow_drop_down</i>
                            </a>
                            <ul id="dropdown1" className="dropdown-content black-options">
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
                                    <Link to="/Empresa">Postulaciones
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
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><Link to="/Empleado">Empleos</Link></li>
                <li><Link to="http://localhost:5173/Administrador">Administrador</Link></li>
            </ul>
        </>
    );
}
