import React from 'react';
import { Link } from 'react-router-dom';
import { Empresa } from '../types/types'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Asegúrate de tener los estilos personalizados aquí

const EmpresaCard: React.FC<Empresa> = ({ id, nombre, direccion, giro, foto }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ flexShrink: 0, width: '150px', height: '150px', overflow: 'hidden', marginRight: '16px' }}>
                <img 
                    src={foto || "https://www.elfinanciero.com.mx/resizer/iKgpfAJUixbWsAh5wTbC98O2sVA=/1440x810/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/elfinanciero/WEBXETUXNJFRTILA7F3UNAIIXY.jpg"} 
                    alt={`${nombre} perfil`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
            </div>
            <div className="card-content" style={{ flex: 1 }}>
                <span className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{nombre}</span>
                <p>Ubicación: {direccion}</p>
                <p>Giro: {giro}</p>
            </div>
            <div className="card-action">
                <Link to={`/empresa/${id}`}>Ver detalles</Link>
            </div>
        </div>
    );
};

export default EmpresaCard;
