import React from 'react';
import { Link } from 'react-router-dom';
import { Empresa } from '../types/types'; // Ajusta la ruta según tu estructura de carpetas
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css'; // Asegúrate de tener los estilos personalizados aquí

const EmpresaCard: React.FC<Empresa> = ({ _id, nombre, direccion, giro, foto }) => {
    return (
        <div className="card horizontal oferta-card">
            <div className="card-image circle-image-container">
                <img 
                    src={foto || "https://www.elfinanciero.com.mx/resizer/iKgpfAJUixbWsAh5wTbC98O2sVA=/1440x810/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/elfinanciero/WEBXETUXNJFRTILA7F3UNAIIXY.jpg"} 
                    alt={`${nombre} logo`} 
                    className="circle-image"
                />
            </div>
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{nombre}</span>
                    <p>Ubicación: {direccion}</p>
                    <p>Giro: {giro}</p>
                </div>
                <div className="card-action">
                    <Link to={`/empresa/${_id}`}>Ver detalles</Link>
                </div>
            </div>
        </div>
    );
};

export default EmpresaCard;
