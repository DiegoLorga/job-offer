import React, { useState } from 'react';
import { API_URI_CORREOS } from '../auth/apis';
import '../index.css'
export default function Empresa() {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URI_CORREOS}/enviarCorreoRecuperarContrasena`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })  // Aquí aseguramos que sea "email"
            });
            console.log(email);

            if (response.ok) {
                setMensaje('Se ha enviado un correo electrónico a ' + email + ' con las instrucciones para restablecer tu contraseña.');
            } else {
                setMensaje('Error al enviar el correo electrónico.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
        }
    };


    return (
        <div className="container">
            <div className="form">
                <form className="col s12" onSubmit={handleSubmit}>
                    <h1>Recuperar contraseña</h1>
                    <div className="row">
                        <div className="input-field col s10">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Ingresa un correo para recuperar tu contraseña</label>
                        </div>
                    </div>
                    <div className="row">
                        <button
                            className="custom-btn" type="submit">
                            Enviar
                        </button>
                        {mensaje && <p>{mensaje}</p>}
                    </div>
                </form>
            </div>
        </div >
    );
}
