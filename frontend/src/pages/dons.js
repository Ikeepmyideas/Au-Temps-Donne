import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import './navHome';
import '../css/dons.css';

function DonsPage() {
    const [campagnes, setCampagnes] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/campagne/campagnes')
            .then(response => response.json())
            .then(data => setCampagnes(data))
            .catch(error => console.error('Erreur lors de la récupération des campagnes :', error));
    }, []);

    return (
        <section className="section donate" id="donate">
            <div className="container">
                <ul className="donate-list">
                    {campagnes.map(campagne => (
                        <li key={campagne.ID_Campagne}>
                            <div className="donate-card">
                                <figure className="card-banner">
                                    <img src={campagne.image} width="520" height="325" loading="lazy" alt="Campagne" className="img-cover" />
                                </figure>
                                <div className="card-content">
                                    <div className="progress-wrapper">
                                        <p className="progress-text">
                                            <span>Collecté</span>
                                            <data value={campagne.montant_actuel}>{campagne.montant_actuel}€</data>
                                        </p>
                                        <data className="progress-value" value={(campagne.montant_actuel / campagne.montant_cible) * 100}>
                                            {((campagne.montant_actuel / campagne.montant_cible) * 100).toFixed(2)}%
                                        </data>
                                    </div>
                                    <div className="progress-box">
                                        <div className="progress" style={{ width: `${(campagne.montant_actuel / campagne.montant_cible) * 100}%` }}></div>
                                    </div>
                                    <h3 className="h3 card-title">{campagne.titre}</h3>
                                    <div className="card-wrapper">
                                        <p className="card-wrapper-text">
                                            <span>Objectif</span>
                                            <data className="green" value={campagne.montant_cible}>{campagne.montant_cible}€</data>
                                        </p>
                                        <p className="card-wrapper-text">
                                            <span>Restant</span>
                                            <data className="yellow" value={campagne.montant_cible - campagne.montant_actuel}>
                                                {campagne.montant_cible - campagne.montant_actuel}€
                                            </data>
                                        </p>
                                        <Link to={`/donner/${campagne.ID_Campagne}`} className="btn btn-secondary">
                                            <span>Donner</span>
                                            <ion-icon name="heart-outline" aria-hidden="true"></ion-icon>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default DonsPage;
