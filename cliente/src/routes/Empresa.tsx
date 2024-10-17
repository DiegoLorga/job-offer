import React, { useEffect, useRef, useState } from 'react';
import M from 'materialize-css';
import DefaultLayout from '../layout/DefaultLayout';
import '../index.css'; // Importa tus estilos personalizados después
import '../estilos/estiloPerfilEmpresas.css';
import { io, Socket } from "socket.io-client";

// Define la interfaz para las notificaciones

export default function Empresa() {
   

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
