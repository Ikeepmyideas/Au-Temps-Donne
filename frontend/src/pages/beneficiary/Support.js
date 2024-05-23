import React, { useState, useEffect } from 'react';
import NavMenu from '../navMenuBeneficiary';

function Support() {
  const [titre, setTitre] = useState('');
  const [serviceDemande, setServiceDemande] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [submitting, setSubmitting] = useState(false); 

  const handleSubmitS = async (e) => {
    e.preventDefault();
    setSubmitting(true);   
    try {
      const response = await fetch('http://localhost:8000/api/partenaire/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, type: urgency }),
        credentials: 'include' 
      });
      if (!response.ok) {
        throw new Error('Failed to submit problem');
      }
      setDescription('');
      setUrgency('normal');
      alert('Problem submitted successfully!');
    } catch (error) {
      console.error('Error submitting problem:', error);
      alert('Failed to submit problem. Please try again later.');
    } finally {
      setSubmitting(false); 
    }
  };
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('http://localhost:8000/api/beneficiary/userinfo', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData.beneficiary);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const requestData = {
        id_beneficiaire: userInfo?.id, // Utilisation de l'opérateur de coalescence nulle pour accéder à userInfo.id en toute sécurité
        titre: titre,
        service: serviceDemande,
        message: message
      };

      const response = await fetch('http://localhost:8000/api/beneficiary/sendServiceRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        alert('Demande envoyée avec succès !');
        // Réinitialiser les champs après envoi réussi
        setTitre('');
        setServiceDemande('');
        setMessage('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi de la demande.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande :', error);
      alert('Erreur lors de l\'envoi de la demande : ' + error.message);
    }

    setIsLoading(false);
  };

  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="tables">
       
          <div style={{padding:"30px"}}className="main_table">
          <h2>Faire une demande de service privé</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titre">Titre :</label>
              <input
                type="text"
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Service demandé :</label>
              <select
                id="service"
                value={serviceDemande}
                onChange={(e) => setServiceDemande(e.target.value)}
                required
              >
                <option value="">Sélectionner un service</option>
                <option value="Support Psychologique">Support Psychologique</option>
                <option value="Soutien à l'Emploi">Soutien à l'Emploi</option>
                <option value="Conseil Juridique">Conseil Juridique</option>
                <option value="Services d'Accompagnement Intégral">Services d'Accompagnement Intégral</option>
                <option value="Aide à la Mobilité">Aide à la Mobilité</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message :</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </form>
          </div>
        </section>
      </section>
      <section>
      <div className="problem-form-container">
      <h1 className="problem-form-heading">Repporter un Problème</h1>
      <form className="problem-form" onSubmit={handleSubmitS}>
        <div className="problem-form-group">
          <label htmlFor="description" className="problem-form-label">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="problem-form-textarea"
          />
        </div>
        <div className="problem-form-group">
          <label htmlFor="urgency" className="problem-form-label">Urgency:</label>
          <select
            id="urgency"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="problem-form-select"
          >
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <button
          type="submit"
          className={`problem-form-submit ${submitting ? 'problem-form-submitting' : ''}`}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
      </section>
    </>
  );
}

export default Support;
