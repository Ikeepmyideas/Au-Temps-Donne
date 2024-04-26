import React, { useState } from 'react';
import '../css/signupb.css';  
import logo from '../assets/logo.png'
import mail from '../assets/ins_img.png'
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Inter:wght@300', 'Roboto:wght@300']
  }
});

function Signup() {
  const [isBeneficiary, setIsBeneficiary] = useState(true);

  function toggleSwitch() {
    setIsBeneficiary(!isBeneficiary);
  }

  function showPage(pageNumber) {
    document.getElementById("page1").style.display = pageNumber === 1 ? "block" : "none";
    document.getElementById("page2").style.display = pageNumber === 2 ? "block" : "none";
    document.getElementById("page3").style.display = pageNumber === 3 ? "block" : "none";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = {
        nom: formData.get('lastName'), 
        prenom: formData.get('firstName'),
        date_de_naissance: formData.get('annee') + '-' + formData.get('mois') + '-' + formData.get('jour'), 
        email: formData.get('email'),
        mot_de_passe: formData.get('password'), 
        telephone: formData.get('phoneNumber'), 
        adresse: formData.get('address'),
        ville: formData.get('city'),
        code_postal: formData.get('postalCode'), 
        date_adhesion: getCurrentDate(), 
        genre: formData.get('genre'),
        besoin: formData.get('needs')
    };

    // Make POST request to backend API
    fetch('https://au-temps-donne-api.onrender.com/api/beneficiary/registerBeneficiary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Signup successful:', data);
        showPage(3);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', handleSubmit);
});


    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    
    function evaluatePasswordStrength(password) {
      let score = 0;
  
      if (password.length >= 8) {
        score += 20;
      }
  
      if (/\d/.test(password)) {
        score += 20;
      }
  
      if (/[A-Z]/.test(password)) {
        score += 20;
      }
  
      if (/[\W_]/.test(password)) {
        score += 20;
      }
  
      if (/[a-z]/.test(password)) {
        score += 20;
      }
  
      return score;
    }
  
    function updateProgressBar(password) {
      const strength = evaluatePasswordStrength(password);
      const progressBar = document.getElementById("passwordStrength");
  
      if (progressBar) {
        progressBar.style.width = strength + "%";
  
        if (strength < 40) {
          progressBar.style.backgroundColor = "#FF5050"; // Red
        } else if (strength < 70) {
          progressBar.style.backgroundColor = "#FFD700"; // Yellow
        } else {
          progressBar.style.backgroundColor = "#4CAF50"; // Green
        }
      }
    }
  
    function handlePasswordChange(event) {
      const newPassword = event.target.value;
      setPassword(newPassword);
      updateProgressBar(newPassword);
    }
  
    function handleConfirmPasswordChange(event) {
      const newConfirmPassword = event.target.value;
      setConfirmPassword(newConfirmPassword);
  
      if (newConfirmPassword !== password) {
        setPasswordMatchMessage("Les mots de passe ne correspondent pas.");
      } else {
        setPasswordMatchMessage("Les mots de passe correspondent.");
      }
    }

  return (
    <>
    <body class="signupbbody">
        <header>
            <img src={logo} alt="Your Logo" class="logo"/>
        </header>
        <form id="registrationForm" onSubmit={handleSubmit}>
            {/* Page 1 */}
            <div id="page1">
            <center><div class="breadcrumb">
                <div class="dot"></div>
                <div class="line"></div>
                <div class="dot"></div>
                <div class="line"></div>
                <div class="dot"></div>
            </div></center>
            
            <center> <h1>Inscription</h1></center>
                <center> <p><strong>Déjà un compte chez nous ? <a href="/loginb">Connectez-vous</a></strong></p></center>

                <center>
                    <label class="switch">
                        <input type="checkbox" checked={isBeneficiary} onChange={toggleSwitch} />
                        <span class="slider"></span>
                    </label>
                    <span id="valueDisplay">{isBeneficiary ? "Bénéficiaire" : "Bénévole"}</span>
                </center>
                 
                  
            <div class="form-group">
                <div class="input-group email">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required/>
                </div>
            </div>
            <div class="form-group">
                <div class="input-group">
                    <label for="firstName">Prénom:</label>
                    <input type="text" id="firstName" name="firstName" required/>
                </div>
                <div class="input-group">
                    <label for="lastName">Nom:</label>
                    <input type="text" id="lastName" name="lastName" required/>
                </div>
            </div>
            <div class="form-group">
          <div class="input-group">
            <label for="password">Mot de passe:*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <div class="password-strength">
              <div id="passwordStrength"></div>
            </div>
          </div>
        </div>

        {/* Confirm password input */}
        <div class="form-group">
          <div class="input-group">
            <label for="confirmPassword">Confirmation de mot de passe:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <small id="passwordMatchMessage">{passwordMatchMessage}</small>
          </div>
        </div>
            
            
           
        <center> <button onClick={() => showPage(2)}>Suivant</button></center>
        <label id="endo">*(Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial)</label>
        </div>

        {/* Page 2 (initially hidden) */}
        <div id="page2" style={{ display: "none" }}>
            {/* Your new form content for page 2 */}
            <center><div class="breadcrumb">
                    <div class="dot"></div>
                    <div class="line first"></div>
                    <div class="dot second"></div>
                    <div class="line second"></div>
                    <div class="dot"></div>
            </div></center>
            
            <center> <h1>Inscription</h1></center>
                <center> <p><strong>Déjà un compte chez nous ? <a href="">Connectez-vous</a></strong></p></center>
                <div class="form-group">
                    <div class="input-group">
                        <label for="dob"><strong>Date de naissance:</strong></label>
                        <div class="dob-group">
                            <div class="inpu-group">
                                <label for="jour">Jour:</label>
                                <input type="number" id="jour" name="jour" min="1" max="31" required/>
                            </div>
                            <div class="inpu-group">
                                <label for="mois">Mois:</label>
                                <select id="mois" name="mois" required>
                                    <option></option>
                                    <option value="1">Janvier</option>
                                    <option value="2">Février</option>
                                    <option value="3">Mars</option>
                                    <option value="4">Avril</option>
                                    <option value="5">Mai</option>
                                    <option value="6">Juin</option>
                                    <option value="7">Juillet</option>
                                    <option value="8">Août</option>
                                    <option value="9">Septembre</option>
                                    <option value="10">Octobre</option>
                                    <option value="11">Novembre</option>
                                    <option value="12">Décembre</option>
                                </select>
                            </div>
                            <div class="inpu-group">
                                <label for="annee">Année:</label>
                                <input type="number" id="annee" name="annee" min="1900" max="2024" required/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <label for="genre">Genre:</label>
                        <select id="genre" name="genre" required>
                            <option value="homme">Homme</option>
                            <option value="femme">Femme</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="phoneNumber">Numéro de téléphone:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" pattern="[0-9]{10}" required/>
                    </div>
                </div>
            <div class="form-group">
                <div class="input-group">
                    <label for="address">Adresse:</label>
                    <input type="text" id="address" name="address" required/>
                </div>
            </div>
                {/* Side-by-side layout for postal code and city */}
                <div class="form-group">
                    <div class="input-group">
                        <label for="postalCode">Code Postal:</label>
                        <input type="text" id="postalCode" name="postalCode" required/>
                    </div>
                    <div class="input-group">
                        <label for="city">Ville:</label>
                        <input type="text" id="city" name="city" required/>
                    </div>
                </div>
                <div class="form-group">
                    <div class="input-group">
                        <label for="needs">Catégorie de besoin:</label>
                        <select id="needs" name="needs" required>
                            <option value="Aide alimentaire">Aide alimentaire</option>
                            <option value="Soutien scolaire">Soutien scolaire</option>
                            <option value="Aide médicale">Aide médicale</option>
                            <option value="Activités sociales et récréatives">Activités sociales et récréatives</option>
                            <option value="Assistance sociale">Assistance sociale</option>
                            <option value="Transport et déplacement">Transport et déplacement</option>
                            <option value="other">Autres besoins spécifiques</option>
                        </select>
                    </div>
                </div>

            <center> <button onClick={() => showPage(1)}>Retour</button>
            <button type="submit">Finaliser</button>
            </center>
        </div>

    <div id="page3" style={{ display: "none" }}>
        <center><div class="breadcrumb">
            <div class="dot"></div>
            <div class="line first"></div>
            <div class="dot second"></div>
            <div class="line secon"></div>
            <div class="dot last"></div>
    </div></center>

    <center> <h1>Inscription</h1></center>
    <center><img src={mail} id="mailimage"  alt=""/></center>
        <center><h2 style={{ color: '#EB5454', fontSize: '20px' }}>Vérifiez Votre E-mail pour Activer Votre Compte</h2><br /></center>
        <center><p style={{ color: '#7A7777', fontSize: '20' }}>Un e-mail de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception pour activer votre compte.</p></center>
    </div>
    </form>

    </body>
    </>
  );
}

export default Signup;
