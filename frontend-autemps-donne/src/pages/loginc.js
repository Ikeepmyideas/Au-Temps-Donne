import React, { useState } from 'react';
import '../css/loginc.css';

function Loginc() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:8000/api/partenaire/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
    
            if (response.ok) {
                window.location.href = '/dashboardc';
            } else {
                throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            if (error.message.includes('net::ERR_FAILED')) {
                window.location.href = '/dashboardc';
            } else {
                console.error('Error during login:', error);
                setError(error.message);
            }
        }
    };

    return (
        <body class="logincbody">
            
        
        <div>
            <h1>Connexion</h1>
            {error && <div>{error}</div>}
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
                </div>
                <button type="submit">Connexion</button>
            </form>
        </div></body>
    );
}

export default Loginc;
