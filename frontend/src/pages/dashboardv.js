import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavMenu from './navMenuVolunteer';
import viewIcon from '../assets/voir_all.png';
import horlogeIcon from '../assets/horloge_red.png';

function Dashboardv() {
  const [userInfo, setUserInfo] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [profileImagePath, setProfileImagePath] = useState('');
  const [articles, setArticles] = useState([]);

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
          const response = await fetch(`http://127.0.0.1:8000/api/volunteer/activities-all/${userInfo.id}`);
          if (response.ok) {
            const eventData = await response.json();
            setEvents(eventData);
          } else {
            console.error('Failed to fetch events');
          }
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
    }

    fetchEvents();
  }, [userInfo]);

  const upcomingEvent = events.find(event => {
    const eventDate = new Date(event.date_activite);
    return eventDate.toDateString() === currentDate.toDateString();
  });

  return (
    <>
      <NavMenu />
      <section className="content">
        <section className="tables">
          <div className="main_table">
            <div>
              <h3 className="title_dashboard">Dernières notifications</h3>
              {/* Render notification items here */}
            </div>
          </div>
          {/* Additional sections for other tables if needed */}
        </section>
        <div className="table_avenir">
          <h3 >À venir</h3>
          <p >Aujourd'hui : {currentDate.toLocaleDateString()}</p>
          {upcomingEvent ? (
            <>
              <p className='time-board'>{upcomingEvent.heure_debut}</p>
              <h3>{upcomingEvent.titre}</h3>
              <p>{upcomingEvent.description}</p>
              <div className="adresse">
                <p>{upcomingEvent.lieu.adresse}</p>
                <p>{`${upcomingEvent.lieu.code_postal} ${upcomingEvent.lieu.ville}`}</p>
              </div>
              <Link to={`/volunteer/activity-details/${upcomingEvent.ID_Activite}`} className="view">
                Voir plus
                <img className="voir-all-icon" src={viewIcon} alt="Voir tout" />
              </Link>
            </>
          ) : (
            <p>Aucun événement prévu pour aujourd'hui.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboardv;
