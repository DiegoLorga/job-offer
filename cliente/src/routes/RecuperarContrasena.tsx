import React, { useState } from 'react';
import { API_URI_CORREOS } from '../auth/apis';
import { AuthResponseError } from '../types/types'; // Asegúrate de importar tu interfaz
import '../index.css'

export default function RecuperarContrasena() {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorResponse, setErrorResponse] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Verificar si el campo de correo está vacío
        if (!email.trim()) {
            setErrorResponse('Por favor ingresa un correo electrónico.');
            setSuccessMessage('');
            return;  // Detener la ejecución si el campo está vacío
        }

        try {
            const response = await fetch(`${API_URI_CORREOS}/enviarCorreoRecuperarContrasena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })  // Aquí aseguramos que sea "email"
            });

            if (response.ok) {
                setSuccessMessage('Se ha enviado un correo electrónico a ' + email + ' con las instrucciones para restablecer tu contraseña.');
                setErrorResponse('');
            } else {
                const json = await response.json() as AuthResponseError;
                setErrorResponse(json.body.error || 'Error al enviar el correo electrónico.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorResponse('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container">
            <div className="form">
                <form className="form" onSubmit={handleSubmit}>
                    <h1>Recuperar contraseña</h1>
                    
                    {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                    {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}
                    
                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Ingresa tu correo para recuperar tu contraseña</label>
                        </div>
                    </div>
                    <div className="row">
                        <button
                            className="custom-btn" type="submit">
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}
