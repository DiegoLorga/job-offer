import React, { useEffect, useState } from 'react';
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import DefaultLayout from "../layout/DefaultLayout";
import Swal from 'sweetalert2';
import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { API_URL } from "../auth/apis";
import '../index.css';
import '../estilos/estiloPerfilUsuario.css';
import '../estilos/estiloGuardados.css';
import { Guardado } from '../types/types';

export default function Guardados() {
    const [guardados, setGuardados] = useState<Guardado[]>([]); // Estado para guardar las ofertas
    const [errorResponse, setErrorResponse] = useState<string>(""); // Estado para manejar mensajes de error
    const [noOfertas, setNoOfertas] = useState<boolean>(false); // Estado para controlar si no hay ofertas guardadas
    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        // Obtener usuario del localStorage
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const usuario = JSON.parse(storedUser);

            fetch(`${API_URL}/usuario/getOfertasGuar/${usuario.id}`)
                .then(response => {
                    return response.json();
                })
                .then((data) => {
                    if (data.message === "No existen ofertas guardadas para este usuario.") {
                        setNoOfertas(true); // No hay ofertas guardadas
                    } else {
                        setGuardados(data); // Guardar las ofertas
                        setNoOfertas(false); // Restablecer el estado si hay ofertas
                        console.log('Guardados obtenidos:', data);
                    }
                })
                .catch((error: Error) => {
                    console.error('Error:', error);
                    setErrorResponse('No se pudieron obtener las ofertas guardadas');
                });
        }
    }, []);

    // Función para manejar el clic en "Ver detalles"
    const onClick = (id: string) => {
        console.log("Ver detalles de la oferta con ID:", id);
        // Redirigir a /Empleado
        navigate(`/Empleado`);
    };

    const eliminarGuardado = (id: string) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar esta oferta de tus ofertas guardadas?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Llama a tu API para eliminar el guardado
                fetch(`${API_URL}/usuario/desguardarOferta/${id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        // Actualiza el estado después de eliminar
                        const updatedGuardados = guardados.filter(guardado => guardado.id_guardado !== id);
                        setGuardados(updatedGuardados);
                        
                        // Verifica si guardados está vacío
                        if (updatedGuardados.length === 0) {
                            setNoOfertas(true); // Actualiza el estado para mostrar el mensaje
                        }

                        Swal.fire(
                            'Eliminado!',
                            'La oferta ha sido eliminada.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            'Error!',
                            'No se pudo eliminar la oferta. Intenta de nuevo más tarde.',
                            'error'
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire(
                        'Error!',
                        'Ocurrió un error al intentar eliminar la oferta.',
                        'error'
                    );
                });
            }
        });
    };

    return (
        <DefaultLayout showNav={true}>
            <div id="info" className="containerinfo">
                <h2>Ofertas Guardadas</h2><br />
                {/* Mostrar el mensaje si no hay ofertas guardadas */}
                {noOfertas ? (
                    <div className="center-align">
                        <br /><br /><br /><br /><br /><br /><br /><br />
                        <p>Aún no tienes ofertas guardadas, selecciona las que sean de tu interés desde la página principal.</p>
                    </div>
                ) : (
                    guardados.length > 0 ? (
                        // Mostrar las ofertas guardadas usando tarjetas
                        <div className="row">
                            {guardados.map((guardado) => (
                                <div className="col s12" key={guardado.id_guardado}>
                                    <div
                                        className={`card custom-cardPos`}
                                        style={{
                                            backgroundColor: guardado.status ? 'white' : 'rgba(211, 211, 211, 0.3)', // Gris claro y sutil
                                        }}
                                        title={!guardado.status ? 'Esta oferta laboral ya no se encuentra disponible' : ''} // Tooltip cuando está deshabilitada
                                    >
                                        <div className="card-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div className="card-contentpos" style={{ color: guardado.status ? 'black' : '#6e6e6e' }}> {/* Texto en gris más fuerte si es false */}
                                                <span className="card-title">{guardado.titulo}</span>
                                                <p>Estado: {guardado.estado}</p>
                                                <p>Puesto: {guardado.puesto}</p>
                                                <p>Sueldo: {guardado.sueldo}</p>
                                            </div>
                                            <button
                                                className="btn waves-effect waves-light right btn-pos"
                                                type="button"
                                                disabled={!guardado.status} // Deshabilitar si el status es false
                                            >
                                                Postularme
                                            </button>
                                        </div>
                                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                            <i
                                                className="material-icons"
                                                style={{
                                                    cursor: 'pointer', // Cambiado a pointer siempre
                                                    color: guardado.status ? 'black' : '#6e6e6e', // Icono en gris más fuerte si es false
                                                }}
                                                onClick={() => eliminarGuardado(guardado.id_guardado)} // Llama a la función de eliminar
                                            >
                                                close
                                            </i>
                                        </div>
                                        <div className="card-action" style={{ paddingLeft: '45px' }}>
                                            <a
                                                href="#!"
                                                // onClick={() => guardado.status && onClick(guardado.id_guardado)} // Deshabilitar si el status es false
                                                onClick={() => guardado.status && onClick(guardado.id_guardado)} 
                                                style={{ color: guardado.status ? 'blue' : '#6e6e6e' }} // Enlace en gris más fuerte si es false
                                            >
                                                Ver detalles
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null
                )}
            </div>
        </DefaultLayout>
    );
}
