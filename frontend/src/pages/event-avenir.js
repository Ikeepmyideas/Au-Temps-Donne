import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavMenu from './navMenuVolunteer';
import viewIcon from '../assets/voir_all.png';
import horlogeIcon from '../assets/horloge.png';
import retour from '../assets/retour.png';

function Event() {
    const [events, setEvents] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('http://localhost:8000/api/volunteer/userinfo', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUserInfo(userData.volunteer);
                } else {
                    console.error('Failed to fetch user info');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }

        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchEvents() {
            if (userInfo) {
                try {
                    let response;

                    if (filter === 'Activités') {
                        response = await axios.get(`http://127.0.0.1:8000/api/volunteer/activities/${userInfo.id}`);
                    } else if (filter === 'ActivitésP') {
                        response = await axios.get(`http://127.0.0.1:8000/api/volunteer/activities-prv/${userInfo.id}`);
                    } else if (filter === 'all') {
                        response = await axios.get(`http://127.0.0.1:8000/api/volunteer/activities-all/${userInfo.id}`);
                    }

                    if (response && response.status === 200) {
                        setEvents(response.data);
                    } else {
                        console.error('Failed to fetch events');
                    }
                } catch (error) {
                    console.error('Error fetching events:', error);
                }
            }
        }

        fetchEvents();
    }, [userInfo, filter]);

    const renderTableRows = () => {
        return events.map((event, index) => (
            <div key={index} className="elm_box">
                <div className="infos">
                    <div className="info">
                        <img height="180px" src={`assets/${event.image}`} style={{ borderRadius: '25px' }} alt="Event" />
                        <div className="info-container">
                            <div className="hour">
                                <img id="img-time" height="20px" src={horlogeIcon} alt="Horloge" />
                                <p className="time">{event.activity && event.activity.date_activite ? event.activity.date_activite : event.date_activite} {event.activity && event.activity.heure_debut ? event.activity.heure_debut : event.heure_debut}</p>
                            </div>
                        </div>
                    </div>
                    <div className="info2">
                        <h3>{event.activity && event.activity.titre ? event.activity.titre : event.titre}</h3>
                        <hr />
                        <p>{event.activity && event.activity.description  ? event.activity.description : event.description}</p>
                        <div className="adresse">
                            <p>{event.activity && event.activity.lieuA && event.activity.lieuA.adresse ? event.activity.lieuA.adresse : event.lieu.adresse}</p>
                            <p>{event.activity && event.activity.lieuA && event.activity.lieuA.code_postal  ? event.activity.lieuA.code_postal : event.lieu.code_postal} {event.activity && event.activity.lieuA && event.activity.lieuA.ville  ? event.activity.lieuA.ville : event.lieu.ville}</p>
                        </div>
                    </div>
                </div>
                <Link to={`/volunteer/activity-details/${event.activity && event.activity.ID_Activite  ? event.activity.ID_Activite : event.ID_Activite}`} className="view">
                    Voir plus
                    <img className="voir-all-icon" height="15px" width="17px" src={viewIcon} alt="Voir tout" />
                </Link>
               
            </div>
        ));
    };

    const buttonStyle = (buttonFilter) => ({
        color: filter === buttonFilter ? '#D23939' : 'inherit'
    });

    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter);
    };
    

    return (
        <>
            <NavMenu />
            <section className="content">
                <div className="lists">
                    
                    <div className="container_search">
                    <div className="table-header">
                    <div className="header">
                        <Link to="/volunteer/evenements"> 
                            <img id="retour" height="20px" width="20px" src={retour} alt="Retour" /> 
                        </Link>
                        <h3 className='title_event'>Mes evenements a venir :</h3>

                    </div>
                    </div>
                    <form className="search" >
                            <input
                                type="text"
                                id="searchField"
                                placeholder="Search ..."
                                
                            />
                        </form>
                        </div>

                    <div className="filters">
                        <button style={buttonStyle('all')} onClick={() => handleFilterChange('all')}>Tous</button>
                        <button style={buttonStyle('Activités')} onClick={() => handleFilterChange('Activités')}>Activités</button>
                        <button style={buttonStyle('ActivitésP')} onClick={() => handleFilterChange('ActivitésP')}>Activités privé</button>
                    </div>
                    <div className="box-container">
                        {events.length > 0 ? (
                            renderTableRows()
                        ) : (
                            <p>Aucun événement à afficher.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Event;
