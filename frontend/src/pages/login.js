import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAdminLogin = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include' 
            });

        if (response.ok) {
            const json = await response.json();
            localStorage.setItem('accessToken', json.accessToken);
            localStorage.setItem('userType', json.userType);

            window.location.href = '/admin/dashboard';
            return;
        } else {
            throw new Error('Failed to log in. Please check your credentials and try again.');
        }
        } catch (error) {
            console.error('There was a problem with the beneficiary login:', error);
            setError('Failed to log in. Please check your credentials and try again.');
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        handleAdminLogin();
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <h1>Connexion</h1>
                <p><strong>Vous n'avez pas de compte ? <a href="/signupb">Inscrivez-vous</a></strong></p>
                <div className="form-group">
                    <div className="input-group email">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <label htmlFor="password">Mot de passe:</label>
                        <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Suivant</button>
            </form>
        </div>
    );
};

export default Login;
