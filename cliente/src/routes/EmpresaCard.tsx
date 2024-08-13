import React, { useEffect, useState } from 'react';
import { Empresa, PerfilEmpresa } from '../types/types';
import 'materialize-css/dist/css/materialize.min.css';
import { API_URL } from '../auth/apis';
import M from 'materialize-css';
import '../index.css';
import '../estilos/estilosEmpresas.css';

const EmpresaCollapsibleItem: React.FC<Empresa> = ({ _id, nombre, direccion, giro, foto, correo, ciudad, estado }) => {
    const [perfil, setPerfil] = useState<PerfilEmpresa | null>(null);

    useEffect(() => {
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
        console.log("Pestañas inicializadas");
    }, []);

    const fetchPerfil = async () => {
        try {
            const response = await fetch(`${API_URL}/empresa/obtenerEmpresa/${_id}`);
            const data = await response.json();
            setPerfil(data.perfil);
            console.log(data.perfil);

        } catch (error) {
            console.error('Error al obtener el perfil de la empresa:', error);
        }
    };

    return (
        <ul className="collapsible">
            <li>
                <div className="collapsible-header" onClick={fetchPerfil}>
                    <div className="profile-picture-container">
                        <img src={foto} alt={`Perfil de ${nombre}`} />
                    </div>
                    <div className="empresa-info">
                        <span className="nombre-empresa">{nombre}</span>
                        <div className="location-email-giro">
                            <div className="info-item">
                                <p className='info-title'><i className="material-icons">location_on</i>Ubicación</p>
                                <span>{direccion}, {ciudad}, {estado}</span>
                            </div>
                            <div className="info-item">
                                <p className='info-title'><i className="material-icons">business</i>Giro</p>
                                <span>{giro}</span>
                            </div>
                            <div className="info-item">
                                <p  className='info-title'><i className="material-icons">mail</i>Correo</p>
                                <span>{correo}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="collapsible-body">
                    {perfil ? (
                        <>
                            <p>Descripción: {perfil.descripcion}</p>
                            <p>Misión: {perfil.mision}</p>
                            <p>Empleos: {perfil.empleos}</p>
                            <p>Página Oficial: <a href={perfil.paginaoficial} target="_blank" rel="noopener noreferrer">{perfil.paginaoficial}</a></p>
                            <p>Redes Sociales: {perfil.redesSociales}</p>
                        </>
                    ) : (
                        <p>Cargando perfil...</p>
                    )}
                </div>
            </li>
        </ul>
    );
};

export default EmpresaCollapsibleItem;
