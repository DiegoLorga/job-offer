import React, { useEffect } from 'react';
import M from 'materialize-css';

export default function Empresa() {
    useEffect(() => {
        // Inicializa el modal cuando el componente se monta
        M.Modal.init(document.querySelectorAll('.modal'));
    }, []);

    console.log("Ingreso a empresas");
    
    return (
        <div className="container">
            <h1>Empresa</h1>
            <a className="waves-effect waves-light btn modal-trigger" href="#modal1">Abrir Modal</a>

            {/* Modal Structure */}
            <div id="modal1" className="modal">
                <div className="modal-content">
                    <h4>Modal Header</h4>
                    <p>Contenido del modal</p>
                </div>
                <div className="modal-footer">
                    <a href="#!" className="modal-close waves-effect waves-green btn-flat">Cerrar</a>
                </div>
            </div>
        </div>
    );
}
