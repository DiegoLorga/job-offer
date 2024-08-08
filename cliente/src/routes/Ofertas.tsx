import React from 'react';
import { Link } from 'react-router-dom';
import { Oferta1 } from '../types/types'; 
import 'materialize-css/dist/css/materialize.min.css';
import '../index.css';

interface OfertaProps extends Oferta1 {
    onClick: (_id: string) => void;
}

const Oferta: React.FC<OfertaProps> = ({ _id, titulo, direccion, puesto, sueldo, onClick }) => {
    return (
        <div className="card horizontal oferta-card">
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{titulo}</span>
                    <p>Dirección: {direccion}</p>
                    <p>Puesto: {puesto}</p>
                    <p>Sueldo: {sueldo}</p>
                </div>
                <div className="card-action">
                    <a href="#!" onClick={() => onClick(_id)}>Ver detalles</a>
                </div>
            </div>
        </div>
    );
};

export default Oferta;
