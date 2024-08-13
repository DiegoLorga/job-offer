import React, { useState } from 'react';
import { Oferta1 } from '../types/types'; 
import '../estilos/estilosOfertas.css'
import M from 'materialize-css'

interface OfertaProps extends Oferta1 {
    onClick: (_id: string) => void;
}

const Oferta: React.FC<OfertaProps> = ({ _id, titulo, direccion, puesto, sueldo, onClick }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        onClick(_id);
        M.toast({ html: 'Guardado', displayLength: 2000 });
    };

    
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
            <div className="top-right">
                <button 
                    className={`btn-custom waves-effect waves-light ${isClicked ? 'clicked' : ''}`}
                    onClick={handleClick}
                >
                    <i className="material-icons">bookmark_border</i>
                </button>
            </div>
        </div>
    );
};

export default Oferta;
