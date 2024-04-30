import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/admin.css';
import NavMenu from './navMenu';
import viewIcon from '../assets/voir_all.png';
import addIcon from '../assets/add.png';
import horlogeIcon from '../assets/horloge.png';

function Event() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/admin/activities/latest')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau');
                }
                return response.json();
            })
            .then(data => {
                setActivities(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    }, []);

    return (
        <>
            <NavMenu />
            <section className="content">
                <div className="lists">
                    <div className="table-header">
                        <h3>Gestionnaire des événements</h3>
                        <Link to="/allEvents" className="view-all">Ajouter<img className="voir-all-icon" height="15px" width="17px" src={addIcon} alt="Voir tout" /></Link>
                    </div>
                    <div className="table-header">
                        <h3>Tous les évènements</h3>
                        <Link to="/allEvents" className="view-all">Voir Tout<img className="voir-all-icon" src={viewIcon} alt="Voir tout" /></Link>
                    </div>
                    <div className="box-container">
                        {activities.map((activity, index) => (
                            <div key={index} className="elm_box">
                                <div className="infos">
                                    <div className="info">
                                        <img height="180px" src={`assets/${activity.image}`} style={{ borderRadius: '25px' }} />
                                        <div className="info-container">
                                            <div className="hour">
                                                <img id="img-time" height="20px" src={horlogeIcon} />
                                                <p className="time">{(activity.date_activite)}  {activity.heure_debut}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info2">
                                        <h3>{activity.titre}</h3>
                                        <hr />
                                        <p>{activity.description}</p>
                                        <div className="adresse">
                                            <p>{activity.lieu.adresse}</p>
                                            <p>{activity.lieu.code_postal} {activity.lieu.ville}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/activity-details/${activity.id}`} className="view">Voir plus<img className="voir-all-icon" height="15px" width="17px" src={viewIcon} alt="Voir tout" /></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Event;
