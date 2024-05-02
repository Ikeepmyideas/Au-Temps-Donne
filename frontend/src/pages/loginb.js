import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import '../css/loginb.css';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleBeneficiaryLogin = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/beneficiary/login", {
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
            window.location.href = '/Dashboardb';
            return;
        } else {
            throw new Error('Failed to log in. Please check your credentials and try again.');
        }
        } catch (error) {
            console.error('There was a problem with the beneficiary login:', error);
            setError('Failed to log in. Please check your credentials and try again.');
        }
    };

    const handleVolunteerLogin = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/volunteer/login", {
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
            window.location.href = '/Dashboardv';
            return;

            } else {
                throw new Error('Failed to log in. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('There was a problem with the volunteer login:', error);
            setError('Failed to log in. Please check your credentials and try again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        handleBeneficiaryLogin();
        handleVolunteerLogin();
    };
    return (
        <body class='loginbbody'>
            
        
        <div>
            <header>
                <img src={Logo} alt="Your Logo" className="logo" />
            </header>
            <form onSubmit={handleSubmit}>
                <div className="breadcrumb">
                    <div className="dot"></div>
                    <div className="line"></div>
                    <div className="dot"></div>
                </div>
                
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
        </div></body>
    );
}

export default LoginForm;
