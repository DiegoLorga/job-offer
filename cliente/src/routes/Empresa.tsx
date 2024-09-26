import React, { useEffect, useRef, useState } from 'react';
import M from 'materialize-css';
import DefaultLayout from '../layout/DefaultLayout';
import '../index.css'; // Importa tus estilos personalizados después
import '../estilos/estiloPerfilEmpresas.css';
import { io, Socket } from "socket.io-client";

// Define la interfaz para las notificaciones
interface Notificacion {
    idOferta: string;
    idUsuario: string;
    message: string; // Mensaje de la notificación
    link: string; // Enlace a la oferta (puedes ajustarlo según tu estructura)
}

export default function Empresa() {
    const socketRef = useRef<Socket | null>(null); // `Socket` de `socket.io-client`
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]); // Estado para almacenar las notificaciones

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
                setNotificaciones((prevNotificaciones) => [
                    ...prevNotificaciones,
                    {
                        idOferta: notificacion.idOferta,
                        idUsuario: notificacion.idUsuario,
                        message: 'Un nuevo usuario se postuló a tu oferta',
                        link: `/oferta/${notificacion.idOferta}`, // Ajusta según tu ruta de oferta
                    },
                ]); // Actualiza el estado
            });
        }

        return () => {
            socket.off('nuevaPostulacion'); // Limpia el listener al desmontar
            socket.disconnect(); // Desconectar el socket
        };
    }, []);

    useEffect(() => {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        const tabsElems = document.querySelectorAll('.tabs');

        if (tabsElems.length > 0) {
            const tabsInstance = M.Tabs.init(tabsElems);
            const tabsElement = document.querySelector('.tabs');
            if (tabsElement) {
                const instance = M.Tabs.getInstance(tabsElement);
                if (instance) instance.select('Ofertas');  // Selecciona la pestaña de Ofertas
            }
        }

        const elems = document.querySelectorAll('select');
        M.FormSelect.init(elems);

        return () => {
            tabsElems.forEach((tabsElem) => {
                const instance = M.Tabs.getInstance(tabsElem);
                if (instance) instance.destroy();
            });
            elems.forEach((elem) => {
                const instance = M.FormSelect.getInstance(elem);
                if (instance) instance.destroy();
            });
        };
    }, []);

    return (
        <DefaultLayout showNav={true}>
            <div className="container">
                <div className="nav-content">
                    <ul id="tabs-swipe-demo" className="tabs custom-tabs">
                        <li className="tab col s3"><a href="#Ofertas" className="black-text active">Ofertas</a></li>
                        <li className="tab col s3"><a href="#Empresas" className="black-text">Empresas</a></li>
                    </ul>
                </div>
                <div className="notifications">
                    <ul>
                        {notificaciones.map((notif, index) => (
                            <li key={index}>
                                {notif.message} - <a href={notif.link}>Ver Oferta</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div id="Ofertas" className="container">
                    <h1>Ofertas</h1>
                </div>
                <div id="Empresas" className="container">
                    <h1>Empresas</h1>
                </div>
            </div>
        </DefaultLayout>
    );
}
