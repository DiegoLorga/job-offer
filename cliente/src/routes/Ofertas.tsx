import React, { useState } from 'react';
import { Oferta1 } from '../types/types'; 
import '../estilos/estilosOfertas.css'
import M from 'materialize-css'
import { API_URL } from "../auth/apis";

interface OfertaProps extends Oferta1 {
    onClick: (_id: string) => void;
}

const Oferta: React.FC<OfertaProps> = ({ _id, titulo, estado, puesto, sueldo, onClick }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = async () => {
        setIsClicked(true);
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);
        try {
            const response = await fetch(`${API_URL}/usuario/guardarOferta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_oferta: _id,  
                    id_usuario: usuario.id
                })
            });

            if (response.ok) {
                M.toast({ html: 'Oferta guardada', displayLength: 2000 });
            } else {
                M.toast({ html: 'Error al guardar la oferta', displayLength: 2000 });
            }
        } catch (error) {
            console.error('Error al guardar la oferta:', error);
            M.toast({ html: 'Error en el servidor', displayLength: 2000 });
        }
        }

        onClick(_id);  // Esta línea permanece igual
    };
    
    return (
        <div className="card horizontal oferta-card">
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title">{titulo}</span>
                    <p>Estado: {estado}</p>
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
