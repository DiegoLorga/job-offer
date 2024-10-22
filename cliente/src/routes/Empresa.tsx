import { useEffect, useState } from 'react';
import M from 'materialize-css';
import DefaultLayout from '../layout/DefaultLayout';
import '../index.css';
import '../estilos/estiloPerfilEmpresas.css';
import '../estilos/estilosEmpresas.css';
import { API_URL } from '../auth/apis';
import '../types/types';

interface Notificacion {
    _id: string;
    recipientNombre: string;
    senderNombre: string;
    message: string;
    link: string;
}

export default function Empresa() {
    const [postulaciones, setPostulaciones] = useState<Notificacion[]>([]);

    // Inicializar Materialize components
    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Tabs.init(document.querySelectorAll('.tabs'));
        M.FormSelect.init(document.querySelectorAll('select'));

        return () => {
            document.querySelectorAll('.tabs').forEach((tabsElem) => {
                const instance = M.Tabs.getInstance(tabsElem);
                if (instance) instance.destroy();
            });
        };
    }, []);

    // Obtener notificaciones
    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
            const idUsuario = usuario.id;

            // Cambia esta parte del frontend si decides no modificar el backend
            const fetchPostulaciones = async () => {
                try {
                    const response = await fetch(`${API_URL}/empresa/postulaciones/${idUsuario}`);
                    const data = await response.json();

                    // Asumiendo que ahora data es un array
                    if (Array.isArray(data)) {
                        setPostulaciones(data);  // Establece el estado con el array directamente
                        console.log("Notificación",data);
                        
                    } else {
                        console.warn('La respuesta no es un array:', data);
                        setPostulaciones([]); // Establece un array vacío
                    }
                } catch (error) {
                    console.error('Error al obtener las postulaciones:', error);
                }
            }


            fetchPostulaciones();
        }
    }, []);

    // Tarjeta de notificación
    const NotificacionCard = ({ _id, recipientNombre, senderNombre, message, link }: Notificacion) => (
        <div className="card horizontal oferta-card">
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">Notificación</span>
                    <p><strong>De:</strong> {senderNombre}</p>  {/* Mostrar nombre del remitente */}
                    <p><strong>Para:</strong> {recipientNombre}</p>  {/* Mostrar nombre del destinatario */}
                    <p><strong>Mensaje:</strong> {message}</p>
                    <p><strong>Enlace:</strong> <a href={link}>{link}</a></p>
                </div>
            </div>
        </div>
    );

    return (
        <DefaultLayout showNav={true}>
            <div className="container">
                <div className="nav-content">
                    <ul id="tabs-swipe-demo" className="tabs custom-tabs">
                        <li className="tab col s3"><a href="#Ofertas" className="black-text active">Ofertas</a></li>
                        <li className="tab col s3"><a href="#Postulantes" className="black-text">Notificaciones</a></li>
                    </ul>
                </div>

                <div id="Ofertas" className="container">
                    <h1>Ofertas</h1>
                </div>

                <div id="Postulantes" className="container">
                    <div className="cards-container">
                        {postulaciones && postulaciones.length > 0 ? (
                            postulaciones.map((notificacion) => (
                                <div className="col s12" key={notificacion._id}>
                                    <NotificacionCard
                                        _id={notificacion._id}
                                        recipientNombre={notificacion.recipientNombre}
                                        senderNombre={notificacion.senderNombre}
                                        message={notificacion.message}
                                        link={notificacion.link}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron notificaciones.</p>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
