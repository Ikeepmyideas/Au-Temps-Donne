import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/admin.css';
import NavMenu from './navMenuVolunteer';
import viewIcon from '../assets/voir_all.png';
import addIcon from '../assets/add.png';
import horlogeIcon from '../assets/horloge.png';
import axios from 'axios';

function Event() {
    const [activities, setActivities] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [events, setEvents] = useState([]);

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
        if (userInfo) {
            fetch(`http://127.0.0.1:8000/api/volunteer/activities/${userInfo.id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erreur réseau');
                    }
                    return response.json();
                })
                .then(data => {
                  setEvents(data);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données:', error);
                });
        }
    }, [userInfo]);

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


    document.addEventListener('DOMContentLoaded', function() {
      fetch('http://127.0.0.1:8000/api/admin/activities/latest') 
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur réseau');
          }
          return response.json();
        })
        .then(activities => {
          const container = document.getElementById('boxContainer');
          container.innerHTML = '';
          activities.forEach(activity => {
            const box = document.createElement('div');
            box.className = 'elm_box';
    
            const date = new Date(activity.date_activite);
            const formattedDate = `${date.getHours()}:${date.getMinutes()} ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    
            box.innerHTML = `
              <div class="infos">
                <div class="info">
                  <img height="180px" src="assets/benevole-img.png" style="border-radius: 25px;">
                  <div class="info-container">
                    <div class="hour">
                      <img height="20px" src="assets/horloge.png" style="padding-top:10px;"><p class="time">${formattedDate}</p>
                    </div>
                  </div>
                </div>
                <div class="info2">
                  <h3>${activity.titre}</h3>
                  <hr>
                  <p class="description">${activity.description}</p>
                  <div class="adresse">
                    <p>${activity.lieu.adresse}</p>
                    <p>${activity.lieu.code_postal} ${activity.lieu.ville}</p>
                  </div>
                </div>
              </div>
              <a id="details_link" href="javascript:void(0);" class="view">Voir plus<img class="voir-all-icon" height="15px" width="17px" src="assets/voir_all.png" alt="Voir tout"></a>
            `;
    
            container.appendChild(box);
          });
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données:', error);
        });
    });
    

    return (
        <>
            <NavMenu />
            <section className="content">
                <div className="lists">
                 
                    <div className="table-header">
                        <h3>A venir :</h3>
                        <Link to="/allEvents" className="view-all">Voir Tout<img className="voir-all-icon" src={viewIcon} alt="Voir tout" /></Link>
                        
                    </div>
                    <div className="box-container">
                        {events.map((event, index) => (
                            <div key={index} className="elm_box">
                                <div className="infos">
                                    <div className="info">
                                        <img height="180px" src={`assets/${event.image}`} style={{ borderRadius: '25px' }} />
                                        <div className="info-container">
                                            <div className="hour">
                                                <img id="img-time" height="20px" src={horlogeIcon} />
                                                <p className="time">{(event.activity.date_activite)}  {event.activity.heure_debut}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info2">
                                        <h3>{event.activity.titre}</h3>
                                        <hr />
                                        <p>{event.activity.description}</p>
                                        <div className="adresse">
                                            <p>{event.activity.lieuA.adresse}</p>
                                            <p>{event.activity.lieuA.code_postal} {event.activity.lieuA.ville}</p>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/DetailsEvenement/${event.activity.ID_Activite}`} className="view">Voir plus<img className="voir-all-icon" height="15px" width="17px" src={viewIcon} alt="Voir tout" /></Link>
                            </div>
                        ))}
                    </div>
                    <div></div>
                    <div className="table-header">
                        <h3>Tous les évènements</h3>
                        <Link to="/AllEvenements" className="view-all">Voir Tout<img className="voir-all-icon" src={viewIcon} alt="Voir tout" /></Link>
                       
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