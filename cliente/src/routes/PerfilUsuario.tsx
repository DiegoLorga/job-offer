import { useState, useEffect } from "react";
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from "../auth/AuthProvider";
import DefaultLayout from "../layout/DefaultLayout";
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Asegúrate de tener los estilos personalizados aquí
import { API_URL, API_URI_IMAGENES } from "../auth/apis";

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

export default function PerfilUsuarios() {
    const [errorResponse, setErrorResponse] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [nombre, setNombre] = useState("Gizelle de Lorga");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("");
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>("");
    const [contrasena, setContrasena] = useState("");
    const [verificarContrasena, setVerificarContrasena] = useState("");
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const auth = useAuth();

    useEffect(() => {
        async function fetchEstados() {
            try {
                const response = await fetch(`${API_URL}/usuario/getEstados`);
                if (response.ok) {
                    const data = await response.json() as Estado[];
                    setEstados(data);
                    if (data.length > 0) {
                        setEstadoSeleccionado(data[0].clave);
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
        async function fetchCiudades() {
            try {
                const response = await fetch(`${API_URL}/usuario/getCiudades/${estadoSeleccionado}`);
                if (response.ok) {
                    const data = await response.json() as Ciudad[];
                    setCiudades(data);
                    if (data.length > 0) {
                        setCiudadSeleccionada(data[0].clave);
                    }
                } else {
                    console.error('Error al obtener las ciudades:', response.statusText);
                }
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        }

        if (estadoSeleccionado) {
            fetchCiudades();
        }
    }, [estadoSeleccionado]);

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        console.log("Pestañas inicializadas");
    }, []);

    if (!auth.isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <DefaultLayout showNav={true}>
            <div className="nav-content">
                <ul id="tabs-swipe-demo" className="tabs">
                <li className="tab col s6"><a className="active" href="#perfil">Perfil</a></li>
                <li className="tab col s6"><a href="#info">Información</a></li>
                </ul>
            </div>
            <div id="perfil" className="container" >
                <br /><br />

                <div className="profile-container">
                    <div className="profile-picture-container">
                        <img
                            src={`${API_URI_IMAGENES}/img/auxiliares/perfil.png`} // Reemplaza esto con la URL de la imagen del perfil
                            alt="Foto de perfil"
                            className="profile-picture"
                        />
                        <div className="overlay">
                            <i className="material-icons">edit</i>
                            <span>Cambiar foto</span>
                        </div>
                    </div>
                </div>
                {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}

                <div className="nombre-contenedor">
                    <h1 className="nombre-titulo">{nombre}</h1>
                </div>

                <form className="form-horizontal">
                    <label htmlFor="correo">Correo</label>
                    <div className="input-field1">
                        <input type="email" id="correo" name="correo" value="ejemplo@dominio.com" readOnly />
                    </div>
                    <label htmlFor="contraseña">Contraseña</label>
                    <div className="input-field1">
                        <input type="password" id="contraseña" name="contraseña" value="********" readOnly />
                    </div>
                    <label htmlFor="direccion">Dirección</label>
                    <div className="input-field1">
                        <input type="text" id="direccion" name="direccion" value="Dirección Ejemplo" readOnly />
                    </div>
                    <label htmlFor="estado">Estado</label>
                    <div className="input-field1">
                        <input type="text" id="estado" name="estado" value="estado Ejemplo" readOnly />
                    </div>
                    <label htmlFor="ciudad">Ciudad</label>
                    <div className="input-field1">
                        <input type="text" id="ciudad" name="ciudad" value="ciudad Ejemplo" readOnly />
                    </div>

                    <div className="button-container1">
                        <button type="button" className="btn">Actualizar</button>
                    </div>
                </form>
            </div>

            <div id="info" className="container">
                <h2>Información Adicional</h2>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Experiencia</span>
                        <p>Aquí va la información sobre experiencia.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Especialidad</span>
                        <p>Aquí va la información sobre especialidad.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Habilidades</span>
                        <p>Aquí va la información sobre habilidades.</p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">Educación</span>
                        <p>Aquí va la información sobre educación.</p>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
