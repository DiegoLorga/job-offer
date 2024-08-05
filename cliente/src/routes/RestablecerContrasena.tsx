import React, { useState, useEffect } from 'react';
import { API_URI_CORREOS, API_URL } from '../auth/apis';
import { AuthResponseError } from '../types/types';
import '../index.css';

export default function RestablecerContrasena() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorResponse, setErrorResponse] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        setToken(token || '');
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        if (!password.trim() || !confirmPassword.trim()) {
            setErrorResponse('Por favor ingresa y confirma la nueva contraseña.');
            setSuccessMessage('');
            return;
        }
    
        if (password !== confirmPassword) {
            setErrorResponse('Las contraseñas no coinciden.');
            setSuccessMessage('');
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/usuario/restablecerContrasena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
            });
    
            if (response.ok) {
                setSuccessMessage('Contraseña restablecida con éxito.');
                setErrorResponse('');
            } else {
                const json = await response.json();
                setErrorResponse(json.message || 'Error al restablecer la contraseña.');
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
                    <h1>Restablecer Contraseña</h1>

                    {!!errorResponse && <div className="card-panel red lighten-2 white-text">{errorResponse}</div>}
                    {!!successMessage && <div className="card-panel green lighten-2 white-text">{successMessage}</div>}

                    <div className="row">
                        <div className="input-field col s12">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Nueva Contraseña</label>
                        </div>
                        <div className="input-field col s12">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        </div>
                    </div>
                    <div className="row">
                        <button className="custom-btn" type="submit">
                            Restablecer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
