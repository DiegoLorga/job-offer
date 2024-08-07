// src/components/EmpresaCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Empresa } from '../types/types'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const EmpresaCard: React.FC<Empresa> = ({ id, nombre, direccion, giro, foto }) => {
  return (
    <div className="card">
      <div className="card-image">
        <img src={foto || "https://via.placeholder.com/150"} alt={`${nombre} perfil`} />
      </div>
      <div className="card-content">
        <span className="card-title">{nombre}</span>
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
