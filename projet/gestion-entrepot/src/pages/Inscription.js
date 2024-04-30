import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';
import logo from '../assets/logo.png';

function InscriptionPage() {
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const mot_de_passe = document.getElementById('motDePasse').value;

    try {
      const response = await fetch('http://localhost:3001/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          mot_de_passe: mot_de_passe,
        }),
      });

      if (response.ok) {
        const data = await response.text(); 
        console.log(data); 
        navigate('/Dashboard'); 
      } else {
        console.error('Échec de la connexion');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
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
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email :</label>
                <input type="email" className="form-control" id="email" required />
              </div>
              <div className="mb-3">
                <label htmlFor="motDePasse" className="form-label">Mot de passe :</label>
                <input type="password" className="form-control" id="motDePasse" required />
              </div>

              <center><button type="submit" className="submit-btn">Se connecter</button></center>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InscriptionPage;
