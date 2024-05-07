import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import '../css/loginb.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
  
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
          localStorage.setItem('userType', json.userType);
  
          if (json.statut_validation === 'en attente') {
            window.location.href = '/candidat'; 
          } else {
            window.location.href = '/beneficiary/dashboard'; 
          }
        } else {
          throw new Error('Failed to log in. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('There was a problem with the beneficiary login:', error);
        throw new Error('Failed to log in. Please check your credentials and try again.');
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
          localStorage.setItem('userType', json.userType);
  
          // Redirect based on the 'status_validation'
          if (json.status_validation === 'en attente') {
            window.location.href = '/candidat'; // Redirect to candidate page
          } else {
            window.location.href = '/volunteer/Dashboard'; // Redirect to volunteer dashboard
          }
        } else {
          throw new Error('Failed to log in. Please check your credentials and try again.');
        }
      } catch (error) {
        console.error('There was a problem with the volunteer login:', error);
        throw new Error('Failed to log in. Please check your credentials and try again.');
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
  
      try {
        await handleBeneficiaryLogin();
        await handleVolunteerLogin();
      } catch (error) {
        setError(error.message || 'Failed to log in. Please try again.');
      }
    };
    return (
        <div class='loginbbody'>
            
        
        <div>
            <header>
                <img src={Logo} alt="Your Logo" className="logo" />
            </header>
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
        </div>
    );
}

export default LoginForm;
