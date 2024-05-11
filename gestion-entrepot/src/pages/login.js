import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';
import logo from '../assets/logo.png';

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

          window.location.href = '/dashboard';
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
      <header>
        <img src={logo} alt="Your Logo" className="logo" />
      </header>
      <div className="form-box" id="benevole">
        <center>
          <h1>Bienvenue à la Gestion d'Entrepôt</h1>
          <h2>Connexion</h2>
        </center>
        <div className="d-flex justify-content-center">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
             
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
              <center><button type="submit" className="submit-btn">Se connecter</button></center>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
