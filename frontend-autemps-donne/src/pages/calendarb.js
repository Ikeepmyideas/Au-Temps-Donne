import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/calendarb.css';
import logoImage from '../assets/logo.png';
import home from '../assets/home-.png';
import profile from '../assets/profile.png';
import settings from '../assets/settings.png';
import exit from '../assets/exit.png';
import board from '../assets/fatrows.png';
import list from '../assets/1fatrows.png';
import calendar from '../assets/calendar-light.png';
import blog from '../assets/doc.png';
import loop from '../assets/loop.png';
import chat from '../assets/chat_.png';
import notif from '../assets/notif.png';

function Calendarb() {
  const [profileImagePath, setProfileImagePath] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    nom: '',
    prenom: '',
    // Add more fields as needed
  });
  const [activities, setActivities] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());


  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch('http://localhost:8000/api/beneficiary/activites_prives',{       
       method: 'GET',
        credentials: 'include'
      });
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to fetch activities. Please try again later.');
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  // Function to render activities for each day and hour
  function renderActivities(day, hour) {
    // Check if activities is an array
    if (!Array.isArray(activities)) {
      console.error('Activities is not an array');
      return null;
    }
  
    // Find the activity for the specified day and hour
    const activity = activities.find(activity => activity.day === day && activity.hour === hour);
  
    // Return the activity name if found, otherwise return null
    return activity ? activity.name : null;
  }
  
  

  const handleCloseUpdateForm = () => {
    setShowForm(false);
  };

  const handleUpdateUserInfo = async (updatedUserInfo) => {
    // Logic to update user information
    // Send updatedUserInfo to the server to update the user's information
    console.log('Updated user info:', updatedUserInfo);
    // Close the form after updating
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdateUserInfo(updatedUserInfo);
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/beneficiary/logout', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.href = '/loginb';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const profileImageResponse = await fetch('http://localhost:8000/api/beneficiary/protected', {
          method: 'GET',
          credentials: 'include'
        });

        if (!profileImageResponse.ok) {
          throw new Error('Failed to fetch profile image');
        }

        const profileImageData = await profileImageResponse.json();
        const profileImage = profileImageData.profileImagePath;
        setProfileImagePath(profileImage);

        const userInfoResponse = await fetch('http://localhost:8000/api/beneficiary/userinfo', {
          method: 'GET',
          credentials: 'include'
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData = await userInfoResponse.json();
        setUserInfo(userData.beneficiary);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
        window.location.href = '/loginb';
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  // Function to generate a random color in hexadecimal format
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Update the CSS variable with a random color
const tdDivs = document.querySelectorAll('td div');
tdDivs.forEach(div => {
  div.style.setProperty('--random-color', getRandomColor());
});
function obtenirDatePourJourDeSemaine(indexJour) {
  const aujourdHui = new Date();
  const indexJourCourant = (aujourdHui.getDay() + 6) % 7; // 0 pour lundi, 1 pour mardi, ..., 6 pour dimanche
  const difference = indexJour - indexJourCourant;
  const dateCible = new Date(aujourdHui);
  dateCible.setDate(aujourdHui.getDate() + difference);
  return dateCible;
}

const handlePrevWeek = () => {
  const prevWeek = new Date(currentDate);
  prevWeek.setDate(prevWeek.getDate() - 7);
  setCurrentDate(prevWeek);
};

const handleNextWeek = () => {
  const nextWeek = new Date(currentDate);
  nextWeek.setDate(nextWeek.getDate() + 7);
  setCurrentDate(nextWeek);
};

  return (
    <>
    <body class="calendarbbody">
      
    
      <nav className="nav-max">
        <ul className="menu">
          <li>
            <img src={logoImage} alt="Logo" id="logo-menu" />
          </li>
          <hr className="hr1" />
          <li className="menu_title">
            <strong>
              <span>MENU</span>
            </strong>
          </li>
          <li>
            <Link to="/Dashboardb">
              <img className="image" src={home} alt="Dashboard" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/profileb">
              <img className="image" src={profile} alt="Status" />
              <span>Profile</span>
            </Link>
          </li>
          <hr className="hr2" />
          <li className="menu_title">
            <strong>
              <span>SUPPORT</span>
            </strong>
          </li>
          <li>
            <img src={settings} alt="Settings" />
            <span>Paramètres</span>
          </li>
          <li onClick={logout}>
            <img src={exit} alt="Exit"/>
            <span>Déconnexion</span>
          </li>
        </ul>
      </nav>
      <section id="horiz">
        <div className="nav_img">
          <img src={board} alt="Board Icon" />
          <Link className="nav-link" to="/dashboard">
            Board
          </Link>
        </div>
        <div className="nav_img">
          <img src={list} alt="List Icon" />
          <Link className="nav-link" to="/list">
            List
          </Link>
        </div>
        <div className="nav_img">
          <img src={calendar} alt="Calendar Icon" />
          <Link className="nav-link" to="/calendarb">
            Calendar
          </Link>
        </div>
        <div className="nav_img">
          <img src={blog} alt="Blog Icon" />
          <Link className="nav-link" to="/blog">
            Blog
          </Link>
        </div>
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <img height="20px" src={loop} alt="Search Icon" />
        </div>
        <div id="right1">
          <img height="20px" src={chat} alt="Chat Icon" />
        </div>
        <div id="right2">
          <img height="10px" src={notif} alt="Notification Icon" />
        </div>
        <div className="circle_profile">
          <Link to="/profile">
            {profileImagePath ? (
              <img id="picprofile" src={profileImagePath} alt="Profile" />
            ) : (
              <img id="picprofile" src={profile} alt="Profile" />
            )}
          </Link>
        </div>
      </section>
      <section id="bigpieces">
      <div class="weekly-planner">
      <div className="navigation">
            <button onClick={handlePrevWeek}>&lt;</button>
            <span>{currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}</span>
            <button onClick={handleNextWeek}>&gt;</button>
          </div>
      <table>
      <thead>
  <tr>
    <th></th>
    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((jour, index) => (
      <th key={index}>
        {jour}<br />
        {obtenirDatePourJourDeSemaine(index ).toLocaleString('fr-FR', { weekday: 'long' })}<br />
        {obtenirDatePourJourDeSemaine(index ).toLocaleString('fr-FR', { month: 'long', day: 'numeric' })}
      </th>
    ))}
  </tr>
</thead>




        <tbody>
  {Array.from({ length: 13 }, (_, i) => i + 7).map(hour => (
    <tr key={hour}>
      <td>{hour}:00</td>
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
        const activitiesForDayAndHour = activities.activites.filter(activity => {
          const activityDate = new Date(activity.date_activite);
          const activityHour = parseInt(activity.heure_debut.split(':')[0], 10);
          return activityDate.getDay() === index && activityHour === hour;
        });

        return (
          <td key={index}>
            {activitiesForDayAndHour.map(activity => (
              <div key={activity.ID_Activite}>
                {activity.titre}: {activity.description}
              </div>
            ))}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>


      </table>
  </div>
      </section>
    </body>
    </>
  );
}

export default Calendarb;
